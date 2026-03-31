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
          <span>Brand Fit & Combination Guide</span>
        </div>
        <h1 className="text-3xl md:text-5xl font-black text-[var(--brand-text-main)] tracking-tight mb-4">
          누가 가장 잘 맞을까?
        </h1>
        <p className="text-[var(--brand-text-secondary)] font-medium text-lg leading-relaxed max-w-2xl border-l-[3px] border-[var(--brand-primary)] pl-5 py-1">
          실명 업체를 먼저 보면 피로도가 큽니다. <strong className="text-[var(--brand-text-main)]">{context.brand_name}</strong>이(가) 가장 잘 하는 패키지 조합 유형을 보고, 
          나에게 적합한지 (Best Fit)부터 검증해 보세요.
        </p>

        <div className="flex gap-4 mt-8 flex-wrap">
           <span className="flex items-center gap-2 bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 px-3 py-1.5 rounded text-sm text-[var(--brand-text-muted)] font-bold shadow-sm">
              <span className="text-[var(--brand-primary)]">✓</span> 체형별 핏 검증 완료
           </span>
           <span className="flex items-center gap-2 bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 px-3 py-1.5 rounded text-sm text-[var(--brand-text-muted)] font-bold shadow-sm">
              <span className="text-[#3b82f6]">✓</span> 딜브레이커 공개
           </span>
        </div>
      </header>

      {/* Section 1: Who it's for (Archetypes) */}
      <section className="mb-20">
         <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-8 flex items-center gap-2">
            <span className="text-3xl opacity-80">🙌</span> 이런 고객에게 최고의 선택입니다
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="p-8 bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/30 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 text-opacity-10 text-9xl leading-none font-black text-blue-500 blur-sm pointer-events-none">FIT</div>
               <h3 className="text-xl font-bold text-blue-800 dark:text-blue-300 mb-4 z-10 relative">최고의 궁합 (Best Fit)</h3>
               <ul className="space-y-4 relative z-10 font-medium text-[var(--brand-text-main)]">
                 <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> [비용] 일정 예산(200만 원 이상)을 투자하더라도 확실한 퀄리티를 원하는 분</li>
                 <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> [무드] 유행을 타지 않는 클래식/시네마틱 무드를 선호하는 분</li>
                 <li className="flex items-start gap-3"><span className="text-blue-500 mt-1">✓</span> [가치] 야간 촬영이나 로드씬 등 희소성 있는 시그니처 컷이 반드시 필요한 분</li>
               </ul>
            </div>
            
            <div className="p-8 bg-red-50/50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/30 rounded-3xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-6 text-opacity-10 text-9xl leading-none font-black text-red-500 blur-sm pointer-events-none">NOT</div>
               <h3 className="text-xl font-bold text-red-800 dark:text-red-300 mb-4 z-10 relative">추천하지 않음 (Not Fit)</h3>
               <ul className="space-y-4 relative z-10 font-medium text-[var(--brand-text-main)]">
                 <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> [비용] 추가금 포함 총 예산이 150만 원 미만으로 한정된 분 (필연적으로 추가금이 발생합니다)</li>
                 <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> [무드] 자연광 기반의 화사하고 캐주얼한 스냅 느낌을 원하시는 분</li>
                 <li className="flex items-start gap-3"><span className="text-red-500 mt-1">✕</span> [일정] 촬영 후 2개월 이내에 원본과 수정본이 모두 급하게 필요하신 분</li>
               </ul>
            </div>
         </div>
      </section>

      {/* Grid: Recommended Combinations */}
      <section>
         <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-8 flex items-center gap-2">
            <span className="text-3xl opacity-80">🎯</span> 대표 조합 가이드
         </h2>
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
            <div className="flex flex-col items-center justify-center p-20 bg-[var(--brand-bg)] rounded-3xl border border-dashed border-[var(--brand-text-muted)]/20 min-h-[400px]">
               <span className="text-5xl opcaity-20 mb-6 grayscale text-[var(--brand-text-muted)]">⚖️</span>
               <h3 className="font-bold text-xl text-[var(--brand-text-main)] mb-2">현재 공개된 조합(Combination) 패키지가 없습니다.</h3>
               <p className="text-[var(--brand-text-muted)] font-medium mb-6">스튜디오가 새로운 L0 팩트체크를 진행 중입니다.</p>
               <Link 
                 href={`/${vertical}/${brandSlug}/portfolio`} 
                 className="px-6 py-3 rounded-xl bg-[var(--brand-surface)] text-[var(--brand-primary)] border border-[var(--brand-text-muted)]/20 font-bold shadow-sm hover:shadow-md transition-shadow"
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
               가장 잘 맞는 조합(Fit)을 찾으셨나요?
            </h2>
            <p className="text-[var(--brand-text-secondary)] font-medium mb-8">
               해당 가이드를 기반으로 맞춤 브리프를 작성해 주시면, 24시간 내 정확한 견적/스케줄을 회신합니다.
            </p>
            <Link 
               href={`/${vertical}/${brandSlug}/start`} 
               className="inline-block px-8 py-5 rounded-2xl bg-[var(--brand-primary)] text-white font-bold text-lg shadow-xl hover:brightness-90 transition-all hover:-translate-y-1"
            >
               맞춤 브리프(Fit Brief) 시작하기
            </Link>
         </div>
      )}

    </main>
  );
}
