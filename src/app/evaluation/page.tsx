"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { evaluationCriteria } from '@/data/evaluationCriteria';

export default function EvaluationForm() {
  const [currentStep, setCurrentStep] = useState(1);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  // Form State
  const [wardName, setWardName] = useState('');
  const [fiscalYear, setFiscalYear] = useState('2569'); // Default to 2569 initially
  const [date, setDate] = useState('');
  const [hn, setHn] = useState('');
  const [an, setAn] = useState('');
  const [evaluatorName, setEvaluatorName] = useState('');

  // Initial load
  useEffect(() => {
    setDate(new Date().toISOString().split('T')[0]);
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setEvaluatorName(storedUser);
    }
  }, []);

  const wardsList = [
    "หอผู้ป่วยโรคอุบัติใหม่", "หอผู้ป่วยโรคหลอดเลือดสมอง", "หอผู้ป่วยพิเศษ9/1", "หอผู้ป่วยพิเศษ9/2",
    "หอผู้ป่วยสูตินรีเวชกรรม", "หอผู้ป่วยประคับประคอง", "หอผู้ป่วยสามัญรวม", "หอผู้ป่วยกุมารเวชกรรม",
    "หอผู้ป่วยศัลยกรรมชาย2", "หอผู้ป่วยศัลยกรรมชาย1", "หอผู้ป่วยศัลยกรรมหญิง", "หอผู้ป่วยพิเศษ6/1",
    "หอผู้ป่วยพิเศษ6/2", "หอผู้ป่วยอายุรกรรมหญิง1", "หอผู้ป่วยอายุรกรรมหญิง2", "หอผู้ป่วยพิเศษ5/2",
    "หอผู้ป่วยอายุรกรรมชาย1", "หอผู้ป่วยอายุรกรรมชาย2", "หออภิบาลผู้ป่วยหนักอายุรกรรม",
    "หออภิบาลผู้ป่วยหนักศัลยกรรม", "หออภิบาลผู้ป่วยหนักทารกแรกเกิด", "หอผู้ป่วยทารกแรกเกิดป่วย",
    "ห้องคลอด", "หอผู้ป่วยสูติกรรม2"
  ];

  const steps = [
    { id: 1, title: 'ข้อมูลทั่วไป' },
    { id: 2, title: 'ประเมินแรกรับ' },
    { id: 3, title: 'การเขียนบันทึก' },
    { id: 4, title: 'คุณภาพ' }
  ];

  const handleScoreSelect = (topicId: string, score: number) => {
    setScores(prev => ({ ...prev, [topicId]: score }));
  };

  const handleNext = () => setCurrentStep(prev => Math.min(prev + 1, steps.length));
  const handlePrev = () => setCurrentStep(prev => Math.max(prev - 1, 1));
  
  // คำนวณคะแนนรวม
  const totalScore = Object.values(scores).reduce((sum, score) => sum + score, 0);

  const handleSubmit = async () => {
    if (!wardName || !date || !fiscalYear) {
      alert("กรุณาระบุหน่วยงาน ปีงบประมาณ และวันที่ประเมินให้ครบถ้วน");
      setCurrentStep(1); // กลับไปหน้าแรกให้กรอก
      return;
    }

    setIsSaving(true);
    try {
      const response = await fetch('/api/evaluations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          wardName,
          fiscalYear,
          date,
          hn,
          an,
          evaluatorName,
          scores,
          totalScore
        })
      });

      if (response.ok) {
        setIsSubmitted(true);
      } else {
        alert("เกิดข้อผิดพลาดในการบันทึกข้อมูล กรุณาลองใหม่อีกครั้ง");
      }
    } catch (error) {
      console.error(error);
      alert("ไม่สามารถติดต่อเซิร์ฟเวอร์ได้");
    } finally {
      setIsSaving(false);
    }
  };

  const handleReset = () => {
    setScores({});
    setHn('');
    setAn('');
    setCurrentStep(1);
    setIsSubmitted(false);
    // Ward, FiscalYear, Date, EvaluatorName ถูกเก็บไว้เพื่อความรวดเร็วในการประเมินแฟ้มต่อไป
  };

  const currentCriteria = evaluationCriteria.filter(c => c.step === currentStep);

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6 font-sans relative overflow-hidden">
        {/* Background */}
        <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-4 w-96 h-96 bg-green-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

        <div className="bg-white/80 backdrop-blur-2xl border border-white p-10 rounded-[2rem] shadow-2xl max-w-md w-full text-center relative z-10">
          <div className="w-24 h-24 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
            <svg className="w-12 h-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-slate-800 mb-2">บันทึกสำเร็จ!</h2>
          <p className="text-slate-500 mb-6">ข้อมูลการประเมินถูกจัดเก็บลงฐานข้อมูลเรียบร้อยแล้ว<br/>(คะแนนที่ได้: <span className="font-bold text-primary-600">{totalScore}/100</span>)</p>
          
          <div className="space-y-3">
            <button 
              onClick={handleReset}
              className="w-full bg-gradient-to-r from-primary-600 to-purple-600 hover:from-primary-500 hover:to-purple-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-primary-500/30 transition-all"
            >
              ประเมินแฟ้มต่อไป
            </button>
            <Link 
              href="/dashboard"
              className="w-full block bg-white text-primary-700 border border-primary-200 hover:bg-primary-50 font-bold py-3.5 rounded-xl shadow-sm transition-all"
            >
              ดูรายงานสรุปผล (Dashboard)
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 relative overflow-x-hidden flex flex-col font-sans">
      
      {/* Background */}
      <div className="absolute top-0 -left-4 w-96 h-96 bg-primary-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob"></div>
      <div className="absolute top-0 -right-4 w-96 h-96 bg-purple-300 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>

      {/* Header */}
      <header className="relative z-10 bg-white/70 backdrop-blur-xl border-b border-white/40 shadow-sm py-4 px-6 sticky top-0">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="bg-white p-2 rounded-xl h-12 shadow-sm border border-gray-100 flex items-center justify-center overflow-hidden">
               <img src="/logo.png" alt="โลโก้" className="h-full w-auto object-contain" />
            </div>
            <h1 className="text-lg md:text-xl font-bold text-slate-800 hidden sm:block">ระบบประเมินบันทึกทางการพยาบาล</h1>
          </div>
          <Link href="/" className="text-sm font-medium text-slate-500 hover:text-primary-600 transition-colors">
            ออกจากระบบ
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-1 max-w-5xl mx-auto w-full p-4 md:p-8 flex flex-col">
        
        {/* Stepper */}
        <div className="mb-8">
          <div className="flex items-center justify-between relative">
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 w-full h-1 bg-gray-200 -z-10 rounded-full"></div>
            <div className="absolute left-0 top-1/2 transform -translate-y-1/2 h-1 bg-primary-500 -z-10 rounded-full transition-all duration-300" style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}></div>
            
            {steps.map((step) => (
              <div key={step.id} className="flex flex-col items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm border-4 transition-colors duration-300 ${currentStep >= step.id ? 'bg-primary-600 border-primary-100 text-white shadow-md' : 'bg-white border-gray-200 text-gray-400'}`}>
                  {step.id}
                </div>
                <span className={`mt-2 text-xs font-semibold hidden sm:block ${currentStep >= step.id ? 'text-primary-700' : 'text-gray-400'}`}>
                  {step.title}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Score Summary Sticky Bar */}
        {currentStep > 1 && (
          <div className="bg-white/80 backdrop-blur-md p-4 rounded-xl shadow-sm border border-primary-100 mb-6 flex justify-between items-center sticky top-24 z-20">
            <span className="font-bold text-slate-700">คะแนนรวมขณะนี้:</span>
            <span className="text-2xl font-extrabold text-primary-600">{totalScore} <span className="text-sm text-slate-500 font-medium">/ 100</span></span>
          </div>
        )}

        {/* Form Container */}
        <div className="bg-white/70 backdrop-blur-2xl border border-white/50 p-6 md:p-8 rounded-[2rem] shadow-[0_8px_32px_0_rgba(107,33,168,0.05)] flex-1 flex flex-col mb-10">
          
          <div className="flex-1">
            {/* Step 1: ข้อมูลทั่วไป */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-6">1. ข้อมูลแฟ้มผู้ป่วย (Chart Info)</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ปีงบประมาณ <span className="text-red-500">*</span></label>
                    <select 
                      value={fiscalYear}
                      onChange={(e) => setFiscalYear(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    >
                      <option value="2569">2569</option>
                      <option value="2570">2570</option>
                      <option value="2571">2571</option>
                      <option value="2572">2572</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">หน่วยงาน / หอผู้ป่วย <span className="text-red-500">*</span></label>
                    <select 
                      value={wardName}
                      onChange={(e) => setWardName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all"
                    >
                      <option value="">-- เลือกหน่วยงาน --</option>
                      {wardsList.map(w => (
                        <option key={w} value={w}>{w}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">วันที่ประเมิน <span className="text-red-500">*</span></label>
                    <input 
                      type="date" 
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">HN</label>
                    <input 
                      type="text" 
                      value={hn}
                      onChange={(e) => setHn(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                      placeholder="ระบุเลข HN" 
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-slate-700 mb-2">AN</label>
                    <input 
                      type="text" 
                      value={an}
                      onChange={(e) => setAn(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                      placeholder="ระบุเลข AN" 
                    />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-semibold text-slate-700 mb-2">ชื่อผู้ประเมิน (ผู้ตรวจ)</label>
                    <input 
                      type="text" 
                      value={evaluatorName}
                      onChange={(e) => setEvaluatorName(e.target.value)}
                      className="w-full px-4 py-3 bg-white/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 outline-none transition-all" 
                      placeholder="ระบุชื่อผู้ตรวจประเมิน" 
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Steps 2, 3, 4: ประเมิน */}
            {currentStep > 1 && (
              <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <h2 className="text-2xl font-bold text-slate-800 mb-2">{steps[currentStep - 1].title}</h2>
                <p className="text-slate-500 mb-6">กรุณาเลือกคะแนนตามความครบถ้วนของบันทึกทางการพยาบาล</p>
                
                <div className="space-y-4">
                  {currentCriteria.map((criterion) => (
                    <div key={criterion.id} className="bg-white/60 p-4 rounded-2xl border border-slate-100 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex-1">
                        <h4 className="font-semibold text-slate-700 leading-tight">
                          <span className="text-primary-600 mr-2">{criterion.id}</span> 
                          {criterion.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">คะแนนเต็ม {criterion.maxScore}</p>
                      </div>
                      
                      <div className="flex flex-wrap items-center gap-2 bg-slate-50/50 p-1.5 rounded-xl border border-slate-100">
                        {criterion.options.map((score) => {
                          const isSelected = scores[criterion.id] === score;
                          return (
                            <button 
                              key={score} 
                              onClick={() => handleScoreSelect(criterion.id, score)}
                              className={`px-4 py-2 rounded-lg text-sm font-bold shadow-sm transition-all ${
                                isSelected 
                                  ? 'bg-primary-600 text-white shadow-primary-500/30 scale-105' 
                                  : 'bg-white text-slate-600 hover:bg-primary-50 hover:text-primary-600'
                              }`}
                            >
                              {score}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Navigation Buttons */}
          <div className="mt-8 flex items-center justify-between pt-6 border-t border-slate-100/50">
            <button 
              onClick={handlePrev}
              disabled={currentStep === 1 || isSaving}
              className={`px-6 py-3 rounded-xl font-bold transition-all ${currentStep === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50 shadow-sm'}`}
            >
              ย้อนกลับ
            </button>
            
            {currentStep < steps.length ? (
              <button 
                onClick={handleNext}
                className="px-8 py-3 rounded-xl font-bold bg-gradient-to-r from-primary-600 to-purple-600 text-white shadow-lg shadow-primary-500/30 hover:shadow-primary-500/50 hover:-translate-y-0.5 transition-all flex items-center gap-2"
              >
                <span>ถัดไป</span>
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ) : (
              <button 
                onClick={handleSubmit}
                disabled={isSaving}
                className={`px-8 py-3 rounded-xl font-bold text-white shadow-lg flex items-center gap-2 transition-all ${
                  isSaving 
                  ? 'bg-emerald-400 cursor-not-allowed' 
                  : 'bg-gradient-to-r from-green-500 to-emerald-600 shadow-green-500/30 hover:shadow-green-500/50 hover:-translate-y-0.5'
                }`}
              >
                {isSaving ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    <span>กำลังบันทึก...</span>
                  </>
                ) : (
                  <>
                    <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                    </svg>
                    <span>บันทึกผลการประเมิน</span>
                  </>
                )}
              </button>
            )}
          </div>
          
        </div>
      </main>
    </div>
  );
}
