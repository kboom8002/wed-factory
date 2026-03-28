'use client';

import Link from 'next/link';
import { useState } from 'react';
import { trackEvent } from '@/app/actions/telemetryActions';
import { useVibe } from '@/core/design-system/VibeProvider';

export interface HubAnswerCardData {
  brand_id?: string;
  answer_id?: string;
  question: string;
  short_answer: string;
  brand_slug: string;
  vertical_type: string;
  brand_name: string;
  updated_at: string;
  reviewer_name: string;
  visibility_level: string;
  boundary_note?: string;
  _meta?: {
    is_locked?: boolean;
    original_visibility?: string;
  };
}

export function AnswerCardProjection({ data }: { data: HubAnswerCardData }) {
  const [isOpen, setIsOpen] = useState(false);
  const vibe = useVibe();

  // Stale 데이터 검사 (60일 초과)
  const isStale = (new Date().getTime() - new Date(data.updated_at).getTime()) > 60 * 24 * 60 * 60 * 1000;

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState && data.brand_id && data.answer_id) {
      trackEvent('answer_open', {
        brandId: data.brand_id,
        targetId: data.answer_id,
        metadata: { question: data.question, context: 'questions_hub' }
      }).catch(err => console.error(err));
    }
  };

  const handleCorrection = async () => {
    if (!data.answer_id) return;
    const isConfirm = window.confirm("정보 내용이 사실과 다른가요? (어뷰징 방지를 위해 로그인된 회원만 신고 가능합니다)");
    if (!isConfirm) return;

    try {
      const { submitCorrection } = await import('@/app/actions/submitCorrection');
      const res = await submitCorrection(data.answer_id, 'user_report_global');
      alert(res.message);
    } catch (e) {
      alert("액션 실행에 실패했습니다.");
    }
  };

  return (
    <article className="bg-white border border-gray-200 shadow-sm rounded-[1rem] transition-all hover:shadow-md hover:border-blue-200 overflow-hidden relative">
      {/* Evidence Badge (Absolute) */}
      <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-600 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-bl-[1rem] flex items-center gap-1">
        <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
        {vibe.hooks.trust_tone}
      </div>

      {/* Header Info */}
      <div className="flex justify-between items-center px-6 pt-7 pb-2 cursor-pointer" onClick={handleToggle}>
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 bg-blue-50 px-2.5 py-1 rounded">
          {data.vertical_type}
        </span>
        <div className="flex items-center gap-2">
          {isStale && (
             <span className="text-[10px] font-bold bg-amber-100 text-amber-700 px-2 py-0.5 rounded">
               ⚠️ 갱신 필요 (60일 경과)
             </span>
          )}
          <span className="text-xs text-gray-500 font-medium whitespace-nowrap">{data.updated_at}</span>
        </div>
      </div>
      
      {/* Question Row (Clickable) */}
      <button 
        onClick={handleToggle}
        className="w-full text-left px-6 pb-6 outline-none flex justify-between items-start gap-4 group"
      >
        <h3 className="text-lg font-bold text-gray-900 leading-snug tracking-tight group-hover:text-blue-600 transition-colors">
          <span className="text-blue-500 mr-1.5">Q.</span> {data.question}
        </h3>
        <span className={`text-slate-400 text-xl transition-transform duration-300 mt-0.5 ${isOpen ? 'rotate-180 text-blue-500' : ''}`}>
          ▼
        </span>
      </button>
      
      {/* Expanded Answer Body */}
      <div className={`transition-[max-height,opacity,padding] duration-400 ease-in-out border-t border-gray-50 bg-slate-50/50 relative ${isOpen ? 'max-h-[1200px] opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden py-0 px-6'}`}>
        
        {/* L1 Disclosure Masking Overlay */}
        {data._meta?.is_locked && (
          <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] p-6">
            <span className="text-3xl mb-2 drop-shadow-md">🔒</span>
            <p className="text-sm font-black text-slate-800 text-center mb-3">
              해당 정책 및 파격 단가 팩트체크 원본은<br/>회원(L1)에게만 공개됩니다.
            </p>
            <Link href="/login" className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-black transition-colors shadow-xl">
              로그인하고 원본 보기
            </Link>
          </div>
        )}

        <p className={`text-gray-700 leading-relaxed font-medium whitespace-pre-wrap text-[15px] ${data._meta?.is_locked ? 'blur-sm select-none opacity-40' : ''}`}>
          <span className="text-blue-600 font-black mr-2">A.</span>{data.short_answer}
        </p>

        {/* Boundary Note (예외 한계 조항) */}
        {data.boundary_note && (
          <div className="mt-4 p-4 bg-amber-50/50 border border-amber-200/50 rounded-xl flex gap-3 items-start">
             <span className="text-amber-500 text-lg">💡</span>
             <div>
               <h4 className="text-[11px] font-bold text-amber-800 uppercase tracking-widest mb-1">적용 예외 조항 (Boundary Note)</h4>
               <p className="text-sm text-amber-900/80 font-medium leading-relaxed">{data.boundary_note}</p>
             </div>
          </div>
        )}
        
        {/* Footer Meta & CTAs */}
        <div className="mt-6 pt-5 border-t border-gray-200/50 flex flex-col gap-4">
          <div className="flex justify-between items-end w-full">
            <div className="flex flex-col gap-2">
              <span className="bg-white border border-gray-200 px-2.5 py-1 rounded-md flex w-fit items-center gap-1 text-[11px] font-bold shadow-sm text-gray-500">
                팩트체커: {data.reviewer_name}
              </span>
              <button 
                onClick={handleCorrection}
                className="text-[11px] font-semibold text-rose-500/70 hover:text-rose-600 underline underline-offset-2 flex items-center gap-1 text-left w-fit"
              >
                🚨 정보 내용이 사실과 다른가요? 신고하기
              </button>
            </div>
            
            <div className="flex items-center gap-3">
               <Link 
                 href={`/${data.vertical_type}/${data.brand_slug}`}
                 className="text-gray-600 bg-white border border-gray-200 hover:bg-gray-50 px-4 py-2.5 rounded-xl font-bold transition-all shadow-sm text-xs tracking-wider"
               >
                 브랜드 홈
               </Link>
               <Link 
                 href={`/${data.vertical_type}/${data.brand_slug}/brief/new`}
                 className="text-white bg-blue-600 hover:bg-blue-700 px-5 py-2.5 rounded-xl font-bold transition-all shadow-md text-xs tracking-wider flex items-center gap-1.5"
               >
                 👍 {vibe.hooks.cta_tone}
               </Link>
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
