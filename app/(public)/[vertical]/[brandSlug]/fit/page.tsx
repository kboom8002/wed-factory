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
    <main className="w-full max-w-6xl mx-auto py-20 px-6 fade-in leading-relaxed">
      
      {/* Editorial Header */}
      <header className="mb-24 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 border border-[var(--brand-primary)]/30 rounded-full text-[var(--brand-primary)] text-[10px] font-black uppercase tracking-[0.2em] mb-6 shadow-[0_0_15px_rgba(212,175,55,0.1)]">
          <span>Brand Fit & Combination Guide</span>
        </div>
        <h1 className="text-4xl md:text-6xl font-black text-[var(--brand-text-main)] mb-6 drop-shadow-sm uppercase">
          누가 가장 잘 맞을까?
        </h1>
        <p className="text-[var(--brand-text-muted)] font-medium text-lg md:text-xl max-w-2xl mx-auto leading-relaxed">
          실명 업체를 무작정 스크랩하면 피로도만 높아집니다.<br/>
          <strong className="text-[var(--brand-primary)] font-bold">{context.brand_name}</strong>이(가) 가장 잘 하는 디렉팅 무드를 인지하고, <br/>나에게 적합한지 (Best Fit)부터 검증해 보세요.
        </p>

        <div className="flex justify-center gap-5 mt-10">
           <span className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[var(--brand-surface)] border border-[var(--brand-text-muted)]/10 rounded-lg text-sm text-[var(--brand-text-main)] font-bold shadow-sm backdrop-blur-md">
              <span className="text-[var(--brand-primary)] text-lg">✦</span> 체형별 핏 검증 완료
           </span>
           <span className="flex items-center justify-center gap-2.5 px-4 py-2 bg-[var(--brand-surface)] border border-[var(--brand-text-muted)]/10 rounded-lg text-sm text-[var(--brand-text-main)] font-bold shadow-sm backdrop-blur-md">
              <span className="text-[var(--brand-primary)] text-lg">✦</span> 딜브레이커 공개
           </span>
        </div>
      </header>

      {/* Section 1: Editorial Archetype Cards */}
      <section className="mb-32">
         <h2 className="text-xl md:text-2xl font-black text-[var(--brand-text-main)] mb-10 text-center uppercase tracking-widest">
            이런 고객에게 최고의 선택입니다
         </h2>
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
            
            {/* Best Fit Card (Glassmorphism + Gold/Primary Accent) */}
            <div className="p-10 bg-[var(--brand-surface)] border-2 border-[var(--brand-primary)]/20 rounded-[2rem] relative overflow-hidden group hover:border-[var(--brand-primary)] transition-colors shadow-2xl">
               <div className="absolute top-10 right-0 p-6 opacity-5 text-9xl leading-none font-black text-[var(--brand-primary)] select-none" style={{ WebkitTextStroke: '2px var(--brand-primary)', color: 'transparent' }}>
                  FIT
               </div>
               
               <h3 className="text-2xl font-black text-[var(--brand-primary)] mb-8 flex items-center gap-3 relative z-10 border-b border-[var(--brand-primary)]/10 pb-4">
                 <span className="w-2 h-8 bg-[var(--brand-primary)]"></span> 
                 최고의 궁합 (Best Fit)
               </h3>
               
               <ul className="space-y-6 relative z-10 font-bold text-[var(--brand-text-main)] text-sm md:text-base">
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-primary)] text-xs">✓</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)] block text-xs uppercase tracking-widest pt-1 pb-1">Budget</span> 일정 예산(200만 원 이상)을 투자하더라도 확실한 퀄리티를 원하는 분</span>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-primary)] text-xs">✓</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)] block text-xs uppercase tracking-widest pt-1 pb-1">Vibe</span> 유행을 타지 않는 클래식/시네마틱 무드를 선호하는 분</span>
                 </li>
                 <li className="flex items-start gap-4">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/30 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-primary)] text-xs">✓</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)] block text-xs uppercase tracking-widest pt-1 pb-1">Value</span> 야간 촬영이나 로드씬 등 희소성 있는 시그니처 컷이 반드시 필요한 분</span>
                 </li>
               </ul>
            </div>
            
            {/* Not Fit Card (Muted + Subdued Graphic) */}
            <div className="p-10 bg-[var(--brand-surface)] border border-[var(--brand-text-muted)]/20 rounded-[2rem] relative overflow-hidden group backdrop-blur-lg">
               <div className="absolute top-10 right-0 p-6 opacity-[0.03] text-9xl leading-none font-black text-[var(--brand-text-main)] select-none" style={{ WebkitTextStroke: '2px var(--brand-text-main)', color: 'transparent' }}>
                  NOT
               </div>
               
               <h3 className="text-2xl font-black text-[var(--brand-text-muted)] mb-8 flex items-center gap-3 relative z-10 border-b border-[var(--brand-text-muted)]/10 pb-4">
                 <span className="w-2 h-8 bg-[var(--brand-text-muted)]/30"></span> 
                 추천하지 않음 (Not Fit)
               </h3>
               
               <ul className="space-y-6 relative z-10 font-medium text-[var(--brand-text-muted)] text-sm md:text-base">
                 <li className="flex items-start gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-text-muted)] text-xs font-black">✕</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)]/60 block text-xs uppercase tracking-widest pt-1 pb-1">Budget</span> 추가금 포함 총 예산이 150만 원 미만으로 한정된 분 (필연적으로 추가금 발생)</span>
                 </li>
                 <li className="flex items-start gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-text-muted)] text-xs font-black">✕</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)]/60 block text-xs uppercase tracking-widest pt-1 pb-1">Vibe</span> 자연광 기반의 화사하고 캐주얼한 스냅 느낌을 원하시는 분</span>
                 </li>
                 <li className="flex items-start gap-4 opacity-80 group-hover:opacity-100 transition-opacity">
                   <div className="w-6 h-6 rounded-full bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 flex items-center justify-center shrink-0 mt-0.5 text-[var(--brand-text-muted)] text-xs font-black">✕</div>
                   <span className="leading-relaxed"><span className="text-[var(--brand-text-muted)]/60 block text-xs uppercase tracking-widest pt-1 pb-1">Schedule</span> 촬영 후 2개월 이내에 원본과 수정본이 모두 급하게 필요하신 분</span>
                 </li>
               </ul>
            </div>
         </div>
      </section>

      {/* Grid: Recommended Combinations */}
      <section>
         <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-[var(--brand-text-main)] mb-4 tracking-tight uppercase">
                대표 조합 가이드
            </h2>
            <div className="w-10 h-1 bg-[var(--brand-primary)] mx-auto rounded-full"></div>
         </div>

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
            <div className="flex flex-col items-center justify-center py-32 bg-[var(--brand-surface)] rounded-3xl border border-dashed border-[var(--brand-text-muted)]/20 min-h-[400px]">
               <span className="text-4xl opacity-50 mb-6 grayscale text-[var(--brand-primary)]">✨</span>
               <h3 className="font-bold text-xl text-[var(--brand-text-main)] mb-2 uppercase tracking-wide">런칭 준비 중인 패키지</h3>
               <p className="text-[var(--brand-text-muted)] font-medium mb-8">새로운 하이엔드 팩트체크를 모델링 중입니다.</p>
               <Link 
                 href={`/${vertical}/${brandSlug}/portfolio`} 
                 className="px-8 py-4 rounded-xl text-[var(--brand-primary)] border border-[var(--brand-primary)]/50 font-bold uppercase tracking-widest text-xs hover:bg-[var(--brand-primary)] hover:text-white transition-all shadow-[0_0_10px_rgba(212,175,55,0.1)]"
               >
                 포트폴리오 프리뷰
               </Link>
            </div>
         )}
      </section>

      {/* Compare to Form Transition */}
      {l0Combinations.length > 0 && (
         <div className="mt-32 pt-20 border-t border-[var(--brand-text-muted)]/10 text-center flex flex-col items-center">
            <h2 className="text-3xl font-black text-[var(--brand-text-main)] mb-4 tracking-tight">
               가장 잘 맞는 조합(Fit)을 찾으셨나요?
            </h2>
            <p className="text-[var(--brand-text-muted)] font-medium mb-10 max-w-xl leading-relaxed text-sm md:text-base">
               해당 가이드를 기반으로 원하시는 무드/예산을 알려주세요.<br/>
               가장 명확하고 투명한 결정을 돕기 위해 <strong className="text-[var(--brand-text-main)]">확정 견적(Price Guarantee)</strong>과 플랜을 프라이빗 딜룸으로 회신합니다.
            </p>
            <Link 
               href={`/${vertical}/${brandSlug}/start`} 
               className="inline-flex items-center gap-3 px-10 py-5 rounded-[2rem] bg-[var(--brand-text-main)] text-[var(--brand-bg)] font-black text-lg hover:shadow-[0_0_30px_rgba(212,175,55,0.3)] transition-all hover:scale-105 active:scale-95"
            >
               맞춤 브리프(Fit Brief) 작성 ✦
            </Link>
         </div>
      )}

    </main>
  );
}
