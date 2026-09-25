"use client";

import { useRouter, useSearchParams } from 'next/navigation';

export default function FilterControls() {
  const router = useRouter();
  const searchParams = useSearchParams();
  
  const currentYear = searchParams.get('year') || 'all';
  const currentWard = searchParams.get('ward') || 'all';

  const updateFilters = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set(key, value);
    router.push(`/dashboard?${params.toString()}`);
  };

  const handleDownload = () => {
    window.location.href = `/api/export?year=${currentYear}&ward=${currentWard}`;
  };

  const wardsList = [
    "หอผู้ป่วยโรคอุบัติใหม่", "หอผู้ป่วยโรคหลอดเลือดสมอง", "หอผู้ป่วยพิเศษ9/1", "หอผู้ป่วยพิเศษ9/2",
    "หอผู้ป่วยสูตินรีเวชกรรม", "หอผู้ป่วยประคับประคอง", "หอผู้ป่วยสามัญรวม", "หอผู้ป่วยกุมารเวชกรรม",
    "หอผู้ป่วยศัลยกรรมชาย2", "หอผู้ป่วยศัลยกรรมชาย1", "หอผู้ป่วยศัลยกรรมหญิง", "หอผู้ป่วยพิเศษ6/1",
    "หอผู้ป่วยพิเศษ6/2", "หอผู้ป่วยอายุรกรรมหญิง1", "หอผู้ป่วยอายุรกรรมหญิง2", "หอผู้ป่วยพิเศษ5/2",
    "หอผู้ป่วยอายุรกรรมชาย1", "หอผู้ป่วยอายุรกรรมชาย2", "หออภิบาลผู้ป่วยหนักอายุรกรรม",
    "หออภิบาลผู้ป่วยหนักศัลยกรรม", "หออภิบาลผู้ป่วยหนักทารกแรกเกิด", "หอผู้ป่วยทารกแรกเกิดป่วย",
    "ห้องคลอด", "หอผู้ป่วยสูติกรรม2"
  ];

  return (
    <div className="flex flex-col md:flex-row justify-between items-center bg-white/60 backdrop-blur-md p-4 rounded-2xl border border-white/50 shadow-sm gap-4">
      <div className="flex space-x-4 w-full md:w-auto">
        <select 
          value={currentYear} 
          onChange={(e) => updateFilters('year', e.target.value)}
          className="flex-1 md:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-700 font-medium shadow-sm"
        >
          <option value="all">ทุกปีงบประมาณ</option>
          <option value="2569">ปีงบประมาณ 2569</option>
          <option value="2570">ปีงบประมาณ 2570</option>
          <option value="2571">ปีงบประมาณ 2571</option>
          <option value="2572">ปีงบประมาณ 2572</option>
        </select>
        <select 
          value={currentWard} 
          onChange={(e) => updateFilters('ward', e.target.value)}
          className="flex-1 md:w-48 px-4 py-2.5 bg-white border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none text-slate-700 font-medium shadow-sm"
        >
          <option value="all">ทุกหน่วยงาน</option>
          {wardsList.map(w => <option key={w} value={w}>{w}</option>)}
        </select>
      </div>
      <button 
        onClick={handleDownload}
        className="w-full md:w-auto px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-teal-600 text-white font-bold rounded-xl hover:from-emerald-600 hover:to-teal-700 transition-colors shadow-md flex items-center gap-2 justify-center"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
        ดาวน์โหลดรายงาน (Excel)
      </button>
    </div>
  );
}
