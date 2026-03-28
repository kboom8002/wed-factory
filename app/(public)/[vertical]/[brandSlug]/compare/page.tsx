import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/core/utils/supabase/server';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { CombinationTypeProjection } from '@/hub/projections/CombinationTypeProjection';
import Link from 'next/link';

export default async function BrandCompareHub({
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

  const { data: rawCombinations, error } = await supabase
    .from('combination_type')
    .select('*')
    .eq('brand_id', context.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Compare Hub Fetch Error:', error);
  }

  // Filter ONLY L0 Combinations for the Public Compare Hub
  let l0Combinations: any[] = [];
  if (rawCombinations && rawCombinations.length > 0) {
    l0Combinations = rawCombinations
      .map((r) => ({
        id: r.combination_id,
        data: {
          id: r.combination_id,
          brand_name: context.brand_name,
          title: r.title,
          studio_summary: r.studio_type_summary || '스튜디오 공식 제안 조합',
          dress_summary: r.dress_type_summary || undefined,
          makeup_summary: r.makeup_type_summary || '지정 메이크업',
          regret_risks: r.regret_risks || undefined,
          visibility_level: 'L0',
        }
      }));
  }

  return (
    <main className="w-full max-w-6xl mx-auto py-12 px-6 fade-in leading-relaxed">
      
      {/* Header */}
      <header className="mb-16 max-w-3xl">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-xs font-bold uppercase tracking-widest mb-4">
          <span>Combination Compare Hub</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[var(--brand-text-main)] tracking-tight mb-4">
          조합 유형 (Combination) 비교
        </h1>
        <p className="text-[var(--brand-text-secondary)] font-medium text-lg leading-relaxed max-w-2xl border-l-[3px] border-[var(--brand-primary)] pl-5 py-1">
          실명 업체를 먼저 보면 피로도가 큽니다. <strong className="text-[var(--brand-text-main)]">{context.brand_name}</strong>이(가) 가장 잘 하는 패키지 조합 유형을 보고, 
          어떤 사람에게 적합하고 어떤 리스크가 있는지 (Best For / Not Fit)부터 비교해 보세요.
        </p>

        {/* Feature Strip */}
        <div className="flex gap-4 mt-8 flex-wrap">
           <span className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-sm text-slate-600 font-bold">
              <span className="text-indigo-500">✓</span> 안티셀링 핏 검증
           </span>
           <span className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded text-sm text-slate-600 font-bold">
              <span className="text-indigo-500">✓</span> 연관 QnA 및 포트폴리오
           </span>
        </div>
      </header>

      {/* Grid */}
      <section>
         {l0Combinations.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
               {l0Combinations.map(combo => (
                  <CombinationTypeProjection 
                     key={combo.id} 
                     data={combo.data} 
                  />
               ))}
            </div>
         ) : (
            <div className="flex flex-col items-center justify-center p-20 bg-gray-50 rounded-3xl border border-dashed border-gray-300 min-h-[400px]">
               <span className="text-5xl opcaity-20 mb-6 grayscale">⚖️</span>
               <h3 className="font-bold text-xl text-gray-800 mb-2">현재 공개된 조합(Combination) 패키지가 없습니다.</h3>
               <p className="text-gray-500 font-medium mb-6">스튜디오가 새로운 L0 팩트체크를 진행 중입니다.</p>
               <Link 
                 href={`/${vertical}/${brandSlug}/portfolio`} 
                 className="px-6 py-3 rounded-xl bg-white text-[var(--brand-primary)] border border-gray-200 font-bold shadow-sm hover:shadow-md transition-shadow"
               >
                 먼저 포트폴리오 구경하기
               </Link>
            </div>
         )}
      </section>

      {/* Compare to Form Transition */}
      {l0Combinations.length > 0 && (
         <div className="mt-20 border-t border-[var(--brand-primary)]/10 pt-16 text-center">
            <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-3">
               가장 마음에 드는 조합 유형을 고르셨나요?
            </h2>
            <p className="text-[var(--brand-text-secondary)] font-medium mb-8">
               담당 수석 매니저가 스케줄표 확인 후 24시간 내 프라이빗 브리프를 회신합니다.
            </p>
            <Link 
               href={`/${vertical}/${brandSlug}/brief/new`} 
               className="inline-block px-8 py-5 rounded-2xl bg-[var(--brand-text-main)] text-white font-bold text-lg shadow-xl shadow-[var(--brand-text-main)]/20 hover:-translate-y-1 transition-transform"
            >
               해당 조합으로 봉투(Envelope) 밀어넣기
            </Link>
         </div>
      )}

    </main>
  );
}
