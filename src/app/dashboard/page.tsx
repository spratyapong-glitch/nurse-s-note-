import React from 'react';
import Link from 'next/link';
import { PrismaClient } from '@prisma/client';
import FilterControls from './FilterControls';
import { getSession } from '@/lib/auth';
import DashboardHeaderActions from './DashboardHeaderActions';

const prisma = new PrismaClient();

export default async function DashboardPage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
  const session = await getSession();
  const isAdmin = session?.role === 'ADMIN';

  const resolvedParams = await searchParams;
  const year = typeof resolvedParams.year === 'string' ? resolvedParams.year : 'all';
  const ward = typeof resolvedParams.ward === 'string' ? resolvedParams.ward : 'all';

  let whereClause: any = {};
  if (year !== 'all') whereClause.fiscalYear = year;
  if (ward !== 'all') whereClause.ward = { name: ward };

  // ดึงข้อมูลจริงจาก Database แบบมี Filter
  const evaluations = await prisma.evaluation.findMany({
    where: whereClause,
    include: {
      ward: true,
    }
  });

  const totalCharts = evaluations.length;
  let averageScore = 0;
  let topWards: { rank: number; name: string; count: number; avg: string }[] = [];

  if (totalCharts > 0) {
    // 1. คำนวณคะแนนเฉลี่ยรวม
    const totalSum = evaluations.reduce((sum, ev) => sum + ev.totalScore, 0);
    averageScore = Number((totalSum / totalCharts).toFixed(1));

    // 2. จัดอันดับรายหอผู้ป่วย
    const wardStats = new Map<string, { count: number; sum: number }>();
    evaluations.forEach(ev => {
      if (!wardStats.has(ev.ward.name)) {
        wardStats.set(ev.ward.name, { count: 0, sum: 0 });
      }
      const stat = wardStats.get(ev.ward.name)!;
      stat.count += 1;
      stat.sum += ev.totalScore;
    });

    const sortedWards = Array.from(wardStats.entries())
      .map(([name, stat]) => ({
        name,
        count: stat.count,
        avg: (stat.sum / stat.count).toFixed(2)
      }))
      .sort((a, b) => parseFloat(b.avg) - parseFloat(a.avg))
      .slice(0, 5);

    topWards = sortedWards.map((w, index) => ({ ...w, rank: index + 1 }));
  }

  // ข้อมูลจำลองสำหรับกราฟแท่ง (เนื่องจากข้อมูลจริงอาจจะยังมีไม่ครบทุกเดือน)
  const monthlyData = [
    { month: 'ต.ค.', score: 85 },
    { month: 'พ.ย.', score: 88 },
    { month: 'ธ.ค.', score: 90 },
    { month: 'ม.ค.', score: 86 },
    { month: 'ก.พ.', score: 92 },
    { month: 'มี.ค.', score: 94 },
    { month: 'เม.ย.', score: 89 },
    { month: 'พ.ค.', score: 91 },
    { month: 'มิ.ย.', score: 95 },
    { month: 'ก.ค.', score: 93 },
    { month: 'ส.ค.', score: 96 },
    { month: 'ก.ย.', score: averageScore > 0 ? averageScore : 0 }, // เดือนปัจจุบันใช้คะแนนจริงคร่าวๆ
  ];

  return (
    <div className="min-h-screen bg-slate-50 relative flex flex-col font-sans">
      
      {/* Background Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm py-4 px-6 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="bg-white p-2 rounded-xl h-12 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden hover:scale-105 transition-transform">
               <img src="/logo.png" alt="โลโก้" className="h-full w-auto object-contain" />
            </Link>
            <h1 className="text-xl md:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary-700 to-purple-600 hidden sm:block">
              รายงานสรุปผลการประเมิน (Dashboard)
            </h1>
          </div>
          <DashboardHeaderActions isAdmin={isAdmin} />
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 lg:p-8 flex flex-col space-y-6">
        
        {/* Filters Component */}
        <FilterControls />

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white/80 backdrop-blur-lg border border-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-500 font-semibold mb-1 text-sm">คะแนนเฉลี่ยรวมภาพองค์กร</h3>
            <div className="text-4xl font-extrabold text-primary-600">
              {averageScore > 0 ? averageScore : '-'} <span className="text-lg text-slate-400">/100</span>
            </div>
            {totalCharts > 0 && (
              <div className="mt-2 text-sm text-emerald-500 font-medium flex items-center">
                <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                อัปเดตจากข้อมูลจริง
              </div>
            )}
          </div>
          <div className="bg-white/80 backdrop-blur-lg border border-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow">
            <h3 className="text-slate-500 font-semibold mb-1 text-sm">จำนวนแฟ้มที่ประเมินแล้ว</h3>
            <div className="text-4xl font-extrabold text-slate-700">
              {totalCharts.toLocaleString()} <span className="text-lg text-slate-400">แฟ้ม</span>
            </div>
            <div className="mt-2 text-sm text-slate-500 font-medium">
              จากเป้าหมาย 1,500 แฟ้ม
            </div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg border border-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow opacity-60">
            <h3 className="text-slate-500 font-semibold mb-1 text-sm">หมวดที่ได้คะแนนสูงสุด</h3>
            <div className="text-xl font-extrabold text-slate-700 mt-2">กำลังคำนวณ...</div>
          </div>
          <div className="bg-white/80 backdrop-blur-lg border border-white p-6 rounded-3xl shadow-sm hover:shadow-md transition-shadow opacity-60">
            <h3 className="text-slate-500 font-semibold mb-1 text-sm">หมวดที่ต้องพัฒนาเร่งด่วน</h3>
            <div className="text-xl font-extrabold text-slate-700 mt-2">กำลังคำนวณ...</div>
          </div>
        </div>

        {/* Charts & Tables Area */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Bar Chart */}
          <div className="lg:col-span-2 bg-white/80 backdrop-blur-lg border border-white p-6 md:p-8 rounded-3xl shadow-sm">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-xl font-bold text-slate-800">แนวโน้มคะแนนเฉลี่ยรายเดือน</h3>
            </div>
            
            <div className="h-64 flex items-end justify-between space-x-2">
              {monthlyData.map((item, index) => (
                <div key={index} className="flex flex-col items-center flex-1 group">
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity text-xs font-bold bg-slate-800 text-white py-1 px-2 rounded mb-2 whitespace-nowrap">
                    {item.score}
                  </div>
                  <div className="w-full max-w-[2rem] bg-primary-100 rounded-t-lg relative overflow-hidden flex flex-col justify-end transition-all group-hover:bg-primary-200" style={{ height: '200px' }}>
                    <div 
                      className="w-full bg-gradient-to-t from-primary-600 to-primary-400 rounded-t-lg transition-all duration-1000 ease-out"
                      style={{ height: `${item.score}%` }}
                    ></div>
                  </div>
                  <span className="text-xs font-medium text-slate-500 mt-3">{item.month}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Section Progress (Mock for now) */}
          <div className="bg-white/80 backdrop-blur-lg border border-white p-6 md:p-8 rounded-3xl shadow-sm flex flex-col">
            <h3 className="text-xl font-bold text-slate-800 mb-8">คะแนนเฉลี่ยแยกตามหมวดหมู่</h3>
            
            <div className="space-y-6 flex-1 justify-center flex flex-col opacity-60">
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">1. การประเมินแรกรับ</span>
                  <span className="text-primary-600">82%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-pink-500 to-rose-400 h-3 rounded-full" style={{ width: '82%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">2. การเขียนบันทึกพยาบาล</span>
                  <span className="text-primary-600">95%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-emerald-500 to-teal-400 h-3 rounded-full" style={{ width: '95%' }}></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span className="text-slate-700">3. คุณภาพของการบันทึก</span>
                  <span className="text-primary-600">88%</span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-3">
                  <div className="bg-gradient-to-r from-blue-500 to-indigo-400 h-3 rounded-full" style={{ width: '88%' }}></div>
                </div>
              </div>

            </div>
          </div>

        </div>

        {/* Data Table (Real Data from DB) */}
        <div className="bg-white/80 backdrop-blur-lg border border-white p-6 rounded-3xl shadow-sm">
          <h3 className="text-xl font-bold text-slate-800 mb-6">คะแนนเฉลี่ยรายหอผู้ป่วย (ข้อมูลจริง)</h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-600">
              <thead className="text-xs uppercase bg-slate-50/50 text-slate-500">
                <tr>
                  <th className="px-6 py-4 font-bold rounded-l-xl">อันดับ</th>
                  <th className="px-6 py-4 font-bold">หน่วยงาน / หอผู้ป่วย</th>
                  <th className="px-6 py-4 font-bold">จำนวนแฟ้มประเมิน</th>
                  <th className="px-6 py-4 font-bold text-right rounded-r-xl">คะแนนเฉลี่ยรวม</th>
                </tr>
              </thead>
              <tbody>
                {topWards.length > 0 ? topWards.map((ward) => (
                  <tr key={ward.name} className="border-b border-slate-50 hover:bg-white/50 transition-colors">
                    <td className={`px-6 py-4 font-bold ${ward.rank === 1 ? 'text-amber-500' : ward.rank === 2 ? 'text-slate-400' : ward.rank === 3 ? 'text-amber-700' : 'text-slate-400'}`}>
                      {ward.rank}
                    </td>
                    <td className="px-6 py-4 font-medium text-slate-800">{ward.name}</td>
                    <td className="px-6 py-4">{ward.count}</td>
                    <td className="px-6 py-4 text-right font-bold text-primary-600">{ward.avg}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-slate-400">ยังไม่มีข้อมูลการประเมินในระบบ</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  );
}
