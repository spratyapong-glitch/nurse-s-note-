"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'login' | 'guide'>('login');
  
  // Login State
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!username || !password) {
      alert('กรุณากรอกรหัสประจำตัวและรหัสผ่านให้ครบถ้วน');
      return;
    }

    setIsLoading(true);
    
    // จำลองการโหลดและตรวจสอบข้อมูล (Mock Login)
    setTimeout(() => {
      // บันทึกชื่อผู้ใช้ลง LocalStorage เพื่อนำไปแสดงเป็น "ชื่อผู้ประเมิน" ในหน้าฟอร์ม
      localStorage.setItem('currentUser', username);
      router.push('/evaluation');
    }, 800);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 relative overflow-hidden font-sans">
      
      {/* Background Animated Blobs */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
      <div className="absolute -bottom-8 left-20 w-96 h-96 bg-pink-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>

      <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-8 md:p-10 rounded-[2rem] shadow-[0_8px_32px_0_rgba(107,33,168,0.05)] max-w-4xl w-full z-10 flex flex-col md:flex-row gap-10">
        
        {/* Left Side: Logo & Branding */}
        <div className="flex-1 flex flex-col justify-center items-center md:items-start text-center md:text-left">
          <div className="bg-white p-4 rounded-3xl shadow-sm border border-gray-100 mb-8 overflow-hidden hover:scale-105 transition-transform duration-300">
            <img src="/logo.png" alt="โลโก้โรงพยาบาล" className="h-24 w-auto object-contain" />
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold text-slate-800 mb-4 tracking-tight leading-tight">
            ระบบประเมินคุณภาพ <br/>
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-600 to-purple-600">
              บันทึกทางการพยาบาล
            </span>
          </h1>
          <p className="text-slate-500 text-lg mb-8 max-w-md">
            (Nurse's Note Evaluation System) <br/>
            โรงพยาบาลสิรินธร สังกัดสำนักการแพทย์ กรุงเทพมหานคร
          </p>
          
          <div className="flex items-center space-x-4 bg-primary-50 px-4 py-3 rounded-2xl border border-primary-100">
            <svg className="w-8 h-8 text-primary-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8V7a4 4 0 00-8 0v4h8z"></path></svg>
            <div className="text-sm text-primary-700 font-medium">
              เข้าสู่ระบบด้วยรหัสประจำตัวที่ได้รับจากหัวหน้าหอผู้ป่วย
            </div>
          </div>
        </div>

        {/* Right Side: Interactive Panel (Login / Guide) */}
        <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col">
          
          {/* Tabs */}
          <div className="flex border-b border-slate-100">
            <button 
              onClick={() => setActiveTab('login')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'login' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              เข้าสู่ระบบ
            </button>
            <button 
              onClick={() => setActiveTab('guide')}
              className={`flex-1 py-4 text-sm font-bold transition-colors ${activeTab === 'guide' ? 'text-primary-600 border-b-2 border-primary-600 bg-primary-50/50' : 'text-slate-400 hover:text-slate-600 hover:bg-slate-50'}`}
            >
              คู่มือการใช้งาน
            </button>
          </div>

          <div className="p-8 flex-1">
            {activeTab === 'login' ? (
              // Login Form
              <form onSubmit={handleLogin} className="flex flex-col h-full justify-center space-y-5 animate-in fade-in slide-in-from-right-4 duration-500">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">รหัสประจำตัว (Username)</label>
                  <input 
                    type="text" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                    placeholder="กรอกชื่อหรือรหัสประจำตัว" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">รหัสผ่าน (Password)</label>
                  <input 
                    type="password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                    placeholder="••••••••" 
                  />
                </div>
                <div className="pt-4">
                  <button 
                    type="submit" 
                    disabled={isLoading}
                    className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all flex justify-center items-center gap-2"
                  >
                    {isLoading ? (
                      <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <>เข้าสู่ระบบ</>
                    )}
                  </button>
                </div>
                <div className="text-center mt-4">
                  <Link href="/dashboard" className="text-sm font-medium text-slate-400 hover:text-primary-600 transition-colors">
                    เข้าสู่หน้า Dashboard (สำหรับผู้บริหาร)
                  </Link>
                </div>
              </form>
            ) : (
              // Guide View
              <div className="flex flex-col h-full animate-in fade-in slide-in-from-left-4 duration-500">
                <h3 className="text-lg font-bold text-slate-800 mb-4">ขั้นตอนการประเมินแฟ้ม</h3>
                <div className="space-y-6">
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0">1</div>
                    <div>
                      <h4 className="font-bold text-slate-700">เข้าสู่ระบบ</h4>
                      <p className="text-sm text-slate-500 mt-1">ใช้รหัสที่ได้รับจากหัวหน้า เพื่อเข้าถึงแบบฟอร์มประเมินและติดตามสถิติของตนเอง</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0">2</div>
                    <div>
                      <h4 className="font-bold text-slate-700">กรอกข้อมูลผู้ป่วย & ประเมิน</h4>
                      <p className="text-sm text-slate-500 mt-1">ระบุ HN, AN และเลือกหอผู้ป่วย จากนั้นทำแบบประเมินคุณภาพทั้ง 3 หมวด (รวม 21 ข้อ)</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <div className="w-10 h-10 rounded-full bg-primary-100 text-primary-600 font-bold flex items-center justify-center shrink-0">3</div>
                    <div>
                      <h4 className="font-bold text-slate-700">ดูรายงานสรุปผล</h4>
                      <p className="text-sm text-slate-500 mt-1">กดบันทึกเพื่อบันทึกลงระบบ และสามารถดูสรุปคะแนนเฉลี่ยรายเดือน/รายหอผู้ป่วยได้ในหน้า Dashboard</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
          
        </div>

      </div>
    </div>
  );
}
