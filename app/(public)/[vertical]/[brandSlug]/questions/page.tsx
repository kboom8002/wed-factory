import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/core/utils/supabase/server';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { AnswerCardProjection } from '@/hub/projections/AnswerCardProjection';
import Link from 'next/link';

import { maskAnswerCard } from '@/core/engines/disclosure-engine/masking';

export default async function BrandQuestionsHub({
  params,
}: {
  params: Promise<{ vertical: string; brandSlug: string }>
}) {
  const { vertical, brandSlug } = await params;
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);

  if (!context) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // Fetch verified Answers for this brand
  // Phase 11: L0, L1 포함 Fetch 및 Masking 처리
  const { data: rawAnswers, error } = await supabase
    .from('answer_card')
    .select(`
      card_id, question, short_answer, visibility_level, updated_at, boundary_note, reviewer_id
    `)
    .eq('brand_id', context.id)
    .in('visibility_level', ['L0', 'L1'])
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Questions Hub Fetch Error:', error);
  }

  // Projection Mapping & Security Masking
  let l0Answers: any[] = [];
  if (rawAnswers && rawAnswers.length > 0) {
    l0Answers = rawAnswers.map((r) => {
      // 1. Raw DTO 조립
      const rawData = {
         question: r.question,
         short_answer: r.short_answer,
         brand_id: context.id,
         answer_id: r.card_id,
         brand_slug: context.brand_slug,
         vertical_type: context.vertical_type,
         brand_name: context.brand_name,
         updated_at: r.updated_at.split('T')[0],
         reviewer_name: r.reviewer_id || 'Factory_System',
         visibility_level: r.visibility_level,
         boundary_note: r.boundary_note,
         _meta: {}
      };

      // 2. 마스킹 모듈 통과 (보안 처리)
      const maskedData = maskAnswerCard(rawData, isAuthenticated);

      return {
        answer_id: r.card_id,
        data: maskedData
      };
    });
  }

  // 🤖 AEO JSON-LD Generation
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: l0Answers.map(item => ({
      '@type': 'Question',
      name: item.data.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.data.short_answer
      }
    }))
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <main className="w-full max-w-4xl mx-auto py-12 px-6 fade-in leading-relaxed">
      
      {/* Header */}
      <header className="mb-12">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold uppercase tracking-widest mb-4">
          <span>FAQ & AEO Hub</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[var(--brand-text-main)] tracking-tight mb-4">
          묻기도 전에, <br className="hidden md:block"/>모든 답을 투명하게.
        </h1>
        <p className="text-[var(--brand-text-secondary)] font-medium text-lg leading-relaxed max-w-2xl">
          숨겨진 추가금부터 정책까지, 고객이 가장 궁금해 하는 질문들을 백로그 스크래핑을 통해 모았습니다. 
          어떤 질문이든 검색하고 팩트체크된 답변을 확인하세요.
        </p>

        {/* Fake Search Input (UI Only) */}
        <div className="mt-8 relative max-w-xl">
           <input 
             type="text" 
             placeholder="예: 드레스 추가금, 피팅 횟수, 헬퍼 비용..." 
             className="w-full h-14 pl-12 pr-4 bg-white border-2 border-slate-200 rounded-2xl shadow-sm font-medium text-slate-800 focus:outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all text-sm"
           />
           <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 text-xl">🔍</span>
           <button className="absolute right-2 top-1/2 -translate-y-1/2 px-4 h-10 bg-slate-900 text-white font-bold text-sm rounded-xl hover:bg-black transition-colors">
             검색
           </button>
        </div>
      </header>

      {/* Recommended Tags */}
      <div className="flex flex-wrap gap-2 mb-10 pb-6 border-b border-gray-200">
         <span className="text-xs font-bold text-slate-400 uppercase tracking-widest py-1.5 mr-2">Top Tags</span>
         {['#추가금방어', '#야간촬영', '#드레스피팅', '#원본데이터', '#아이폰스냅', '#셀렉일정'].map(tag => (
            <span key={tag} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-600 text-xs font-bold hover:bg-slate-200 cursor-pointer transition-colors border border-slate-200">
               {tag}
            </span>
         ))}
      </div>

      {/* Answer Cards Grid */}
      <section>
        {l0Answers.length > 0 ? (
          <div className="space-y-6">
            {l0Answers.map((answer) => (
              <AnswerCardProjection 
                key={answer.answer_id} 
                data={answer.data} 
              />
            ))}
          </div>

        ) : (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-300">
            <span className="text-4xl mb-4 block opacity-50">📭</span>
            <p className="text-gray-500 font-bold mb-2 text-lg">아직 답변된 질문이 없습니다.</p>
            <p className="text-gray-400 text-sm mb-6">스튜디오가 검수 중이거나 승인 대기 중입니다.</p>
            <Link 
              href={`/${vertical}/${brandSlug}/brief/new`} 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white border border-gray-200 shadow-sm rounded-xl font-bold text-sm text-[var(--brand-primary)] hover:border-[var(--brand-primary)] transition-colors"
            >
               ✉️ 담당자에게 직접 질문 남기기
            </Link>
          </div>
        )}
      </section>
      
      {/* Fallback CTA (Zero Result) */}
      <div className="mt-16 p-8 bg-[var(--brand-primary)]/5 border border-[var(--brand-primary)]/20 rounded-3xl text-center">
         <h3 className="font-bold text-lg text-[var(--brand-text-main)] mb-2">원하시는 답변을 못 찾으셨나요?</h3>
         <p className="text-sm text-[var(--brand-text-secondary)] mb-6">고객님의 핏(Fit)에 맞는 견적서 봉투를 팩토리로 밀어 넣으시면, 컨시어지가 즉각 회신합니다.</p>
         <Link 
           href={`/${vertical}/${brandSlug}/brief/new`} 
           className="px-6 py-3 rounded-xl bg-[var(--brand-primary)] text-white font-bold text-sm shadow-md hover:opacity-90 transition-opacity"
         >
           무료 핏 브리프 의뢰하기
         </Link>
      </div>

    </main>
    </>
  );
}
