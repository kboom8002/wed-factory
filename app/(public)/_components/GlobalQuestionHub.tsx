'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { trackEvent } from '@/app/actions/telemetryActions';

export interface ProjectedAnswerCard {
  answer_id: string;
  question: string;
  short_answer: string;
  brand_id: string;
  brand_slug: string;
  vertical_type: string;
  brand_name: string;
  updated_at: string;
  reviewer_name: string;
  visibility_level: string;
}

export function GlobalQuestionHub({ allAnswers }: { allAnswers: ProjectedAnswerCard[] }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // 실시간 SPA 검색
  const filtered = useMemo(() => {
    if (!searchTerm.trim()) return allAnswers;
    const q = searchTerm.toLowerCase();
    return allAnswers.filter(a => 
      a.question.toLowerCase().includes(q) || 
      a.short_answer.toLowerCase().includes(q) ||
      (a.brand_name && a.brand_name.toLowerCase().includes(q))
    );
  }, [allAnswers, searchTerm]);

  // 카테고리별 최대 10개 추출
  const studios = filtered.filter(a => a.vertical_type === 'studio').slice(0, 10);
  const dresses = filtered.filter(a => a.vertical_type === 'dress').slice(0, 10);

  const toggleAccordion = (id: string, brand?: string) => {
    setExpandedId(prev => {
      const isExpanding = prev !== id;
      if (isExpanding) {
        trackEvent('answer_open', {
          targetId: id,
          metadata: { is_global_hub: true, brand_name: brand }
        });
      }
      return isExpanding ? id : null;
    });
  };

  const renderCardList = (cards: ProjectedAnswerCard[]) => {
    return (
      <div className="space-y-4">
        {cards.map(card => {
          const isStale = (new Date().getTime() - new Date(card.updated_at).getTime()) > 60 * 24 * 60 * 60 * 1000;
          const isExpanded = expandedId === card.answer_id;
          
          return (
            <div key={card.answer_id} className="bg-zinc-900 border border-zinc-800 rounded-[1rem] overflow-hidden hover:border-zinc-700 transition-colors relative">
              {/* Evidence Badge */}
              <div className="absolute top-0 right-0 bg-emerald-500/10 text-emerald-500 px-3 py-1 text-[10px] font-black tracking-widest uppercase rounded-bl-[1rem] flex items-center gap-1 z-10">
                <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                교차 검증 완료
              </div>

              <button
                className="w-full px-6 pt-6 pb-5 flex items-start justify-between text-left group gap-4 outline-none"
                onClick={() => toggleAccordion(card.answer_id, card.brand_name)}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded">
                      통과 완료
                    </span>
                    {isStale && (
                      <span className="text-[10px] font-bold bg-amber-500/10 text-amber-500 px-2 py-0.5 rounded">
                        ⚠️ 갱신 필요 (60일 경과)
                      </span>
                    )}
                    <span className="text-xs text-zinc-500 font-medium">
                      {card.brand_name || '무명브랜드'}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-zinc-200 group-hover:text-blue-400 transition-colors leading-snug">
                    <span className="text-blue-500 font-black mr-2">Q.</span>
                    {card.question}
                  </h3>
                </div>
                <div className="mt-1 w-8 h-8 rounded-full bg-zinc-800 flex items-center justify-center shrink-0 group-hover:bg-zinc-700 transition-colors">
                  <svg 
                    className={`w-4 h-4 text-zinc-400 transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} 
                    fill="none" viewBox="0 0 24 24" stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </button>
              
              <div 
                className={`grid transition-[grid-template-rows,opacity,padding] duration-400 ease-in-out ${isExpanded ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'}`}
              >
                <div className="overflow-hidden">
                  <div className="px-6 pb-6 pt-2">
                    <div className="bg-zinc-950 p-5 rounded-xl border border-zinc-800">
                       <p className="text-zinc-300 mb-4 font-medium leading-relaxed whitespace-pre-wrap text-[15px]">
                          <span className="text-emerald-500 font-black mr-2">A.</span>
                          {card.short_answer}
                       </p>

                       {/* Boundary Note */}
                       {(card as any).boundary_note && (
                         <div className="mt-4 p-4 bg-amber-500/5 border border-amber-500/20 rounded-xl flex gap-3 items-start">
                            <span className="text-amber-500 text-lg">💡</span>
                            <div>
                              <h4 className="text-[11px] font-bold text-amber-500/80 uppercase tracking-widest mb-1">적용 예외 조항 (Boundary Note)</h4>
                              <p className="text-sm text-zinc-400 font-medium leading-relaxed">{(card as any).boundary_note}</p>
                            </div>
                         </div>
                       )}

                       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-end gap-5 pt-5 border-t border-zinc-800 mt-5 w-full">
                          <div className="flex flex-col gap-2">
                            <span className="bg-zinc-900 border border-zinc-800 px-2.5 py-1 rounded w-fit flex items-center gap-1 text-[11px] font-bold text-zinc-500">
                              팩트체커: {card.reviewer_name}
                            </span>
                            <button 
                              onClick={async () => {
                                const isConfirm = window.confirm("정보 내용이 사실과 다른가요? (어뷰징 방지를 위해 로그인된 회원만 신고 가능합니다)");
                                if (!isConfirm) return;
                                try {
                                  const { submitCorrection } = await import('@/app/actions/submitCorrection');
                                  const res = await submitCorrection(card.answer_id, 'user_report_global');
                                  alert(res.message);
                                } catch (e) {
                                  alert("오류가 발생했습니다.");
                                }
                              }}
                              className="text-[11px] font-semibold text-rose-500/70 hover:text-rose-500 underline underline-offset-2 flex items-center gap-1 w-fit text-left"
                            >
                              🚨 정보 내용이 사실과 다른가요? 신고하기
                            </button>
                          </div>
                          
                          <div className="flex gap-3">
                             <Link 
                               href={`/${card.vertical_type}/${card.brand_slug}`}
                               className="text-xs font-bold text-white bg-zinc-800 hover:bg-zinc-700 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap text-center shadow-sm"
                             >
                                브랜드 홈 방문
                             </Link>
                             <Link 
                               href={`/${card.vertical_type}/${card.brand_slug}/brief/new`}
                               className="text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 px-4 py-2.5 rounded-xl transition-colors whitespace-nowrap text-center shadow-md flex items-center gap-1.5"
                             >
                                👍 이 정책으로 견적 의뢰
                             </Link>
                          </div>
                       </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <section className="w-full max-w-5xl mx-auto px-6 py-20">
      
      {/* 1. Global Search Bar */}
      <div className="text-center mb-16 fade-in">
        <h1 className="text-4xl md:text-5xl font-black text-white tracking-tighter mb-6 leading-tight">
          웨딩의 불안을 검색하세요. <br className="hidden md:block"/>
          거짓 없는 <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">팩트체크</span> 통과 답변만.
        </h1>
        <p className="text-zinc-400 mb-10 text-lg">빙산 아래 숨겨진 위약금, 야간촬영/피팅비 등 진짜 정책을 파헤칩니다.</p>
        
        <div className="relative max-w-2xl mx-auto group z-10">
          <input 
            type="text" 
            placeholder="검색어 예: 야간씬 부대비용, 실크 드레스..." 
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full bg-zinc-900 border-2 border-zinc-800 text-white placeholder-zinc-500 rounded-2xl py-5 px-8 text-lg md:text-xl focus:outline-none focus:border-blue-500 transition-colors shadow-[0_0_40px_rgba(0,0,0,0.5)]"
          />
          <svg className="absolute right-6 top-6 w-7 h-7 text-zinc-600 group-focus-within:text-blue-500 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor">
             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {/* 2. Zero Result Fallback */}
      {filtered.length === 0 && searchTerm && (
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-10 text-center fade-in">
           <h3 className="text-2xl font-bold text-white mb-3">검색 결과가 없습니다</h3>
           <p className="text-zinc-400 mb-8">아직 팩토리의 검증을 거친 플랫폼 공식 답변이 없습니다.<br/>웨딩 전문가 컨시어지에게 직접 의뢰해 남김없이 비교하고 분석된 제안을 받아보세요.</p>
           {/* Global Brief doesn't explicitly link to a brand, so just hypothetical /brief/new or a modal */}
           <button className="px-8 py-4 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl shadow-lg transition-colors">
              💬 무료 핏 브리프 의뢰하기 (블라인드 매칭)
           </button>
        </div>
      )}

      {/* 3. Category Results (SPA UI) */}
      {filtered.length > 0 && (
        <div className="space-y-12">
          
          {/* Studio 카테고리 */}
          {studios.length > 0 && (
            <div className="fade-in">
               <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 tracking-tight">
                 <span className="text-2xl">📸</span> 스튜디오 핵심 정책 & QnA
               </h2>
               {renderCardList(studios)}
            </div>
          )}

          {/* Dress 카테고리 */}
          {dresses.length > 0 && (
            <div className="fade-in">
               <h2 className="text-2xl font-black text-white mb-6 flex items-center gap-3 tracking-tight">
                 <span className="text-2xl">👗</span> 드레스 위약금 & 피팅비
               </h2>
               {renderCardList(dresses)}
            </div>
          )}
          
        </div>
      )}

    </section>
  );
}
