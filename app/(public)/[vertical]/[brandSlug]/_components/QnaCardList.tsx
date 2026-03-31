'use client';

import React, { useState } from 'react';
import { trackEvent } from '@/app/actions/telemetryActions';
import { useVibe } from '@/core/design-system/VibeProvider';
import { TrustMetaTag } from './TrustMetaTag';

// DTO from ProjectionEngine
interface ProjectedCard {
  id: string;
  question: string;
  answer: string;
  updated_at: string;
  evidence?: {
    masked_summary: string | null;
    status: string;
  };
  _meta?: {
    trust_status?: string;
    is_locked?: boolean;
    original_visibility?: string;
  }
}

export function QnaCardList({ cards, brandId }: { cards: ProjectedCard[], brandId: string }) {
  const [openStates, setOpenStates] = useState<Record<string, boolean>>({});
  const vibe = useVibe();

  if (!cards || cards.length === 0) {
    return (
      <section>
        <h2 className="text-2xl font-bold mb-6 text-[var(--brand-text-main)]">자주 묻는 질문 (AEO 답변)</h2>
        <div className="p-6 bg-[var(--brand-surface)]/50 rounded-xl border border-dashed border-gray-200 text-center text-[var(--brand-text-muted)]">
          아직 대답이 등록된 질문이 없습니다.
        </div>
      </section>
    );
  }

  const handleToggle = (cardId: string, question: string) => {
    const isCurrentlyOpen = openStates[cardId];
    
    // Toggle state
    setOpenStates(prev => ({ ...prev, [cardId]: !isCurrentlyOpen }));

    // Logging only when opening
    if (!isCurrentlyOpen) {
      trackEvent('answer_open', {
        brandId,
        targetId: cardId,
        metadata: { question }
      }).catch(err => console.error(err));
    }
  };

  const handleTrustHover = (cardId: string) => {
     // 마우스 오버로 증빙 내역을 확인한 경우
     trackEvent('trust_expand', { brandId, targetId: cardId }).catch(() => {});
  };

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6 text-[var(--brand-text-main)] transition-colors">자주 묻는 질문 (AEO 답변)</h2>
      <div className="space-y-4">
        {cards.map(card => {
          const isOpen = openStates[card.id] || false;

          return (
            <div key={card.id} className="bg-[var(--brand-surface)] shadow-sm rounded-[var(--brand-radius)] border border-gray-100 hover:border-[var(--brand-secondary)] transition-all overflow-hidden group">
              {/* Accordion Header (Question) */}
              <button 
                onClick={() => handleToggle(card.id, card.question)}
                className="w-full text-left p-6 outline-none focus:bg-slate-50 flex justify-between items-center"
              >
                <h3 className="font-bold text-lg text-[var(--brand-text-main)] group-hover:text-[var(--brand-accent)] transition-colors">
                  <span className="text-[var(--brand-primary)] mr-2">Q.</span> {card.question}
                </h3>
                <span className={`text-[var(--brand-primary)] text-xl transition-transform duration-300 ${isOpen ? 'rotate-180' : ''}`}>
                  ▼
                </span>
              </button>

              {/* Accordion Body (Answer) */}
              <div 
                className={`transition-all duration-300 ease-in-out border-t border-gray-50 bg-slate-50/30 relative ${isOpen ? 'max-h-[1000px] opacity-100 p-6' : 'max-h-0 opacity-0 overflow-hidden py-0 px-6'}`}
              >
                {/* L1 Disclosure Masking Overlay */}
                {card._meta?.is_locked && (
                  <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-white/40 backdrop-blur-[2px] p-6">
                    <span className="text-3xl mb-2 drop-shadow-md">🔒</span>
                    <p className="text-sm font-black text-slate-800 text-center mb-3">
                      해당 정책 및 파격 단가 팩트체크 원본은<br/>회원(L1)에게만 공개됩니다.
                    </p>
                    <a href={`/login?redirect=`} className="px-5 py-2.5 bg-slate-900 text-white font-bold rounded-lg text-xs hover:bg-black transition-colors shadow-xl">
                      로그인하고 원본 보기
                    </a>
                  </div>
                )}

                <p className={`text-[var(--brand-text-main)] whitespace-pre-wrap leading-relaxed ${card._meta?.is_locked ? 'blur-sm select-none opacity-40' : ''}`}>
                  <span className="text-[var(--brand-primary)] font-bold mr-2">A.</span>{card.answer}
                </p>
                <TrustMetaTag 
                   lastVerifiedAt={new Date(card.updated_at).toLocaleDateString()} 
                   verifier={card._meta?.trust_status === 'verified' ? '전담 팀' : '시스템'} 
                   visibilityRule={card._meta?.original_visibility === 'L1' ? 'L1 조건부공개' : 'L0 전체공개'}
                   hasProof={!!card.evidence?.masked_summary}
                />
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
