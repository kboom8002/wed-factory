'use client';

import React, { useState } from 'react';
import { VibeSpec, VIBE_DICTIONARY } from '@/core/design-system/vibe-registry';
import { VibeProvider } from '@/core/design-system/VibeProvider';
import { ContrastReport } from './ContrastReport';
import { saveCustomVibeSpec } from '@/app/actions/vibeActions';
import { QnaCardList } from '@/app/[locale]/(public)/[vertical]/[brandSlug]/_components/QnaCardList';
import { TrustStrip } from '@/app/[locale]/(public)/[vertical]/[brandSlug]/_components/TrustStrip';
import { VibeGalleryCarousel } from './VibeGalleryCarousel';

export function SandboxClient() {
  const [spec, setSpec] = useState<VibeSpec>(JSON.parse(JSON.stringify(VIBE_DICTIONARY['default-vibe-target'])));
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState<{ text: string, type: 'success' | 'error' } | null>(null);

  const handleColorChange = (key: keyof VibeSpec['colors'], value: string) => {
    setSpec(prev => ({
      ...prev,
      colors: {
        ...prev.colors,
        [key]: value
      }
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setMessage(null);
    try {
       // 강제로 custom 템플릿의 ID를 수정하여 배포용으로 세팅
       const saveSpec = { ...spec, id: 'custom-sandbox-preset', name: 'Sandbox Override' };
       const result = await saveCustomVibeSpec(saveSpec);
       if (result.success) {
         setMessage({ text: '✅ Sandbox 테마가 DB(레지스트리)에 성공적으로 저장되었습니다!', type: 'success' });
       } else {
         setMessage({ text: '저장 실패: ' + result.error, type: 'error' });
       }
    } catch(err) {
       console.error(err);
       setMessage({ text: '알 수 없는 에러가 발생했습니다.', type: 'error' });
    }
    setIsSaving(false);
  };

  const sampleQna = [
    {
      id: 'mock1',
      question: '원본 제공되나요?',
      answer: '네, 원본은 기본 패키지에 포함되어 있습니다.',
      updated_at: new Date().toISOString(),
      evidence: { masked_summary: '원본 10,000장 제공 계약서 확인', status: 'verified' },
      _meta: { is_locked: false }
    },
    {
       id: 'mock2',
       question: '야간 씬 추가금이 있습니까?',
       answer: '야간 씬은 전구 세팅비 명목으로 11만원이 발생합니다. (필수 아님)',
       updated_at: new Date().toISOString(),
       _meta: { trust_status: 'verified', original_visibility: 'L1', is_locked: true }
    }
  ];

  return (
    <div className="flex flex-col gap-4 w-full max-w-[1600px] mx-auto p-4 md:p-8 min-h-screen">
      
      {/* 0. Top Gallery Carousel */}
      <VibeGalleryCarousel 
        currentVibeId={spec.id} 
        onSelect={(newSpec) => setSpec(JSON.parse(JSON.stringify(newSpec)))} 
      />

      <div className="flex flex-col lg:flex-row gap-8 w-full">
        {/* 1. Left Control Panel */}
        <div className="w-full lg:w-1/3 flex flex-col gap-6">
          <div>
            <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">Vibe Sandbox</h1>
            <p className="text-sm font-bold text-slate-500">테넌트의 색상 컨텍스트 오버라이딩과 가독성(WCAG) 검증을 실시간으로 테스트합니다.</p>
          </div>

          {message && (
            <div className={`p-4 rounded-xl text-sm font-bold border animate-fade-in ${message.type === 'success' ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {message.text}
            </div>
          )}

          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-sm flex flex-col gap-5">
             <h2 className="font-bold border-b pb-3 mb-2 flex items-center justify-between">
                🎨 상세 컬러 미세 제어
             </h2>

           {Object.keys(spec.colors).map((key) => {
             const colorKey = key as keyof VibeSpec['colors'];
             return (
               <div key={key} className="flex flex-col gap-1.5">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest">{key}</label>
                 <div className="flex gap-3 items-center">
                   <input 
                     type="color" 
                     value={spec.colors[colorKey]} 
                     onChange={(e) => handleColorChange(colorKey, e.target.value)}
                     className="w-10 h-10 rounded cursor-pointer border-0 bg-transparent p-0"
                   />
                   <input 
                     type="text" 
                     value={spec.colors[colorKey]} 
                     onChange={(e) => handleColorChange(colorKey, e.target.value)}
                     className="flex-1 px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-mono focus:ring-2 focus:ring-blue-500 focus:outline-none"
                   />
                 </div>
               </div>
             )
           })}

           <button 
             onClick={handleSave}
             disabled={isSaving}
             className="mt-6 w-full py-3.5 bg-black text-white font-bold rounded-xl shadow-[0_4px_20px_rgba(0,0,0,0.15)] hover:bg-slate-800 transition active:scale-95 disabled:opacity-50"
           >
             {isSaving ? '저장 중...' : '💾 로컬 JSON 레지스트리에 저장 (템플릿 적용)'}
           </button>
        </div>
        
        <ContrastReport spec={spec} />

      </div>

      {/* 2. Right Live Preview */}
      <div className="w-full lg:w-2/3">
         <div className="bg-slate-100 rounded-[2rem] p-4 md:p-8 h-full min-h-[800px] border border-slate-300 shadow-inner overflow-hidden flex flex-col items-center">
           <h3 className="text-sm font-bold text-slate-400 mb-6 tracking-widest uppercase flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span> Live Output Preview
           </h3>
           
           <div className="w-full max-w-2xl mx-auto rounded-3xl overflow-hidden shadow-2xl relative border border-white border-opacity-10 scale-95 origin-top hover:scale-100 transition-transform duration-500">
               {/* Vibe Provider Injection! */}
               <VibeProvider vibeId="sandbox-tester" initialSpec={spec}>
                 <div className="w-full pb-20">
                     {/* Hero Dummy */}
                     <section className="w-full h-[300px] flex flex-col justify-center items-center px-4 text-center transition-colors duration-500 ease-in-out bg-[var(--brand-primary)] text-[var(--brand-surface)] relative">
                        <div className="relative z-10 w-full flex flex-col items-center">
                          <h1 className="text-4xl md:text-5xl font-bold mb-4">MOCK STUDIO</h1>
                          <p className="text-xl md:text-2xl text-[var(--brand-surface)]/80">웨딩 팩토리 샌드박스 테넌트</p>
                        </div>
                     </section>
                     
                     <TrustStrip />

                     <div className="px-6 mt-16 w-full flex flex-col gap-10">
                        {/* QNA Module */}
                        <div className="bg-[var(--brand-surface)] p-6 md:p-10 rounded-3xl border border-[var(--brand-text-muted)]/10 shadow-lg shadow-[var(--brand-primary)]/5">
                           <QnaCardList cards={sampleQna} brandId="mock-123" />
                        </div>

                        {/* Inference / Entry CTA */}
                        <section className="bg-[var(--brand-text-main)] rounded-[3rem] p-10 text-center shadow-2xl relative overflow-hidden flex flex-col items-center border border-[var(--brand-primary)]/30">
                           <div className="relative z-10 max-w-2xl">
                              <span className="inline-block px-4 py-1.5 bg-[var(--brand-bg)]/20 rounded-full text-[10px] font-black text-[var(--brand-bg)] tracking-[0.2em] uppercase mb-8 border border-[var(--brand-bg)]/30 shadow-sm">
                                 Step 1. Enquiry
                              </span>
                              <h2 className="text-3xl font-black text-[var(--brand-bg)] mb-6 leading-tight uppercase tracking-tighter">
                                 샌드박스 라이브 브리프
                              </h2>
                              <button className="inline-block px-10 py-5 bg-[var(--brand-primary)] text-[var(--brand-surface)] text-lg font-black rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.2)] hover:scale-105 transition-transform">
                                 맞춤 핏 브리프(Fit Brief) 작성 →
                              </button>
                           </div>
                        </section>
                     </div>
                 </div>
               </VibeProvider>
           </div>

         </div>
      </div>
      </div>
    </div>
  );
}
