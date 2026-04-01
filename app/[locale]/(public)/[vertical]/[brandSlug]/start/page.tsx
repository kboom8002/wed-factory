import React from 'react';
import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { submitBrideGroomEnvelope } from '@/app/actions/submitEnvelope';
import { SubmitBriefButton } from './_components/SubmitBriefButton';

export default async function BriefComposerPage({
  params,
}: {
  params: Promise<{ locale: string; vertical: string; brandSlug: string }>
}) {
  const { locale, vertical, brandSlug } = await params;
  
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType, locale);
  if (!context) {
    notFound();
  }

  // 예산/스타일 옵션 동적화 (스튜디오/드레스 여부)
  const isStudio = vertical === 'studio';

  return (
    <main className="min-h-screen bg-[var(--brand-surface)] flex flex-col items-center w-full py-0 sm:py-12 px-0 sm:px-6">
      
      <div className="w-full max-w-2xl bg-[var(--brand-bg)] sm:rounded-[2rem] shadow-2xl shadow-indigo-500/5 sm:border border-[var(--brand-text-muted)]/10 overflow-hidden mb-20">
        
        {/* Sticky Header */}
        <div className="sticky top-14 sm:top-0 z-40 bg-[var(--brand-bg)]/90 backdrop-blur-xl border-b border-[var(--brand-text-muted)]/10 px-6 py-5 flex items-center justify-between shadow-sm">
           <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-[var(--brand-primary)] bg-[var(--brand-primary)]/10 px-2 py-1 rounded-sm mb-1 inline-block">Fit Brief Builder</span>
             <h1 className="text-xl font-black text-[var(--brand-text-main)] leading-tight tracking-tight">
               {context.brand_name} 매칭 조율
             </h1>
           </div>
           <div className="w-10 h-10 rounded-full bg-[var(--brand-surface)] border border-[var(--brand-text-muted)]/20 flex items-center justify-center text-xl shadow-inner">
             💍
           </div>
        </div>

        {/* Intro Banner */}
        <div className="bg-gradient-to-br from-[var(--brand-primary)] to-[var(--brand-text-main)] px-8 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-20 -mr-20 w-64 h-64 bg-white opacity-10 rounded-full blur-3xl"></div>
          <p className="text-white/90 font-bold text-[15px] relative z-10 leading-relaxed tracking-tight break-keep">
            단순 질문이 아닌 구체적인 선호도와 예산 범위를 스튜디오 측에 사전 브리핑합니다. 불필요한 추가금 핑퐁이나 방문 후 실망을 막기 위해 솔직하게 작성해 주세요.
          </p>
        </div>

        {/* Form Body */}
        <form action={async (formData) => {
          'use server';
          await submitBrideGroomEnvelope(null, formData);
        }} className="p-6 sm:p-10 space-y-16">
          
          <input type="hidden" name="vertical" value={vertical} />
          <input type="hidden" name="brandSlug" value={brandSlug} />
          <input type="hidden" name="combination_id" value="null" />

          {/* Section 1: Customer Info */}
          <section className="scroll-mt-32">
            <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-6 flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[var(--brand-surface)] shadow-inner text-base flex items-center justify-center border border-[var(--brand-text-muted)]/20">1</span>
              기본 연락처
            </h2>
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-2 ml-1">계약자 성함 (신랑/신부)</label>
                <input type="text" name="legal_names" required placeholder="예: 김동욱" className="w-full bg-[var(--brand-surface)] border-2 border-[var(--brand-text-muted)]/10 rounded-2xl px-5 py-4 text-base font-bold text-[var(--brand-text-main)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all placeholder:text-[var(--brand-text-muted)]/40" />
              </div>
              <div>
                <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-2 ml-1">휴대전화 번호 (매칭 룸 초대용)</label>
                <input type="tel" name="contact_info" required placeholder="010-0000-0000" className="w-full bg-[var(--brand-surface)] border-2 border-[var(--brand-text-muted)]/10 rounded-2xl px-5 py-4 text-base font-bold text-[var(--brand-text-main)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all placeholder:text-[var(--brand-text-muted)]/40" />
              </div>
            </div>
          </section>

          {/* Section 2: Timeline */}
          <section className="scroll-mt-32 pt-10 border-t border-[var(--brand-text-muted)]/10">
            <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-6 flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[var(--brand-surface)] shadow-inner text-base flex items-center justify-center border border-[var(--brand-text-muted)]/20">2</span>
              어느 시점에 필요하신가요?
            </h2>
            <div className="space-y-6">
               <div>
                  <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-3 ml-1">본식(예식) 예정일</label>
                  <input type="date" name="exact_event_date" className="w-full bg-[var(--brand-surface)] border-2 border-[var(--brand-text-muted)]/10 rounded-2xl px-5 py-4 text-base font-bold text-[var(--brand-text-main)] focus:outline-none focus:border-[var(--brand-primary)] focus:ring-4 focus:ring-[var(--brand-primary)]/10 transition-all" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-3 ml-1">원하시는 진행(촬영/가봉) 시기</label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { val: 'asap', label: '가장 빠른 스케줄', desc: '1~2개월 내 급행' },
                      { val: '3_months', label: '3~6개월 뒤', desc: '표준적인 여유 일정' },
                      { val: 'over_6_months', label: '6개월 이상', desc: '얼리버드' },
                      { val: 'undecided', label: '미정', desc: '우선 상담부터 필요함' }
                    ].map(opt => (
                      <label key={opt.val} className="cursor-pointer group relative block">
                        <input type="radio" name="schedule_window" required value={opt.val} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0" />
                        <div className="p-4 rounded-2xl border-2 border-[var(--brand-text-muted)]/10 bg-[var(--brand-surface)] group-has-[:checked]:border-[var(--brand-primary)] transition-all text-left group-hover:bg-[var(--brand-text-muted)]/5 relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
                          {/* CSS 변수 투명도 지원을 위한 인라인 필터/오버레이 */}
                          <div className="absolute inset-0 bg-[var(--brand-primary)] opacity-0 group-has-[:checked]:opacity-5 transition-opacity pointer-events-none"></div>
                          <div className="relative z-0">
                            <span className="block font-bold text-[var(--brand-text-main)] mb-1">{opt.label}</span>
                            <span className="block text-xs font-medium text-[var(--brand-text-muted)] uppercase tracking-tight">{opt.desc}</span>
                          </div>
                          <div className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 rounded-full border-2 border-[var(--brand-text-muted)]/20 group-has-[:checked]:border-[var(--brand-primary)] group-has-[:checked]:bg-[var(--brand-primary)] flex items-center justify-center transition-all z-0">
                             <span className="w-2 h-2 rounded-full bg-white scale-0 group-has-[:checked]:scale-100 transition-transform"></span>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
               </div>
            </div>
          </section>

          {/* Section 3: Budget & Vibe */}
          <section className="scroll-mt-32 pt-10 border-t border-[var(--brand-text-muted)]/10">
            <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-6 flex gap-3 items-center">
              <span className="w-8 h-8 rounded-full bg-[var(--brand-surface)] shadow-inner text-base flex items-center justify-center border border-[var(--brand-text-muted)]/20">3</span>
              선호 예산 및 스타일
            </h2>
             <div className="space-y-10">
               <div>
                  <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-3 ml-1">총 예상 예산대 (추가금 모두 포함 방어선)</label>
                  <div className="grid grid-cols-1 gap-3">
                    {[
                      { val: 'under_100', title: '100만 원 미만 방어', subtitle: '불필요한 추가 구매를 원치 않습니다.' },
                      { val: '100_to_150', title: '100 ~ 150만 원', subtitle: '가장 스탠다드한 구성을 원합니다.' },
                      { val: '150_to_200', title: '150 ~ 200만 원', subtitle: '수석 지정이나 시그니처 컷 등 투자가 가능합니다.' },
                      { val: 'over_200', title: '200만 원 이상', subtitle: '비용보다 하이엔드 퀄리티 우선입니다.' }
                    ].map(opt => (
                      <label key={opt.val} className="cursor-pointer group relative block">
                        <input type="radio" name="budget_band" required value={opt.val} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10 m-0" />
                        <div className="p-5 rounded-2xl border-2 border-[var(--brand-text-muted)]/10 bg-[var(--brand-surface)] group-has-[:checked]:border-[var(--brand-primary)] transition-all text-left flex items-center justify-between relative overflow-hidden" style={{ backgroundColor: 'transparent' }}>
                          <div className="absolute inset-0 bg-[var(--brand-primary)] opacity-0 group-has-[:checked]:opacity-5 transition-opacity pointer-events-none"></div>
                          <div className="relative z-0">
                            <span className="block font-black text-[var(--brand-text-main)] mb-1 text-base">{opt.title}</span>
                            <span className="block text-xs font-semibold text-[var(--brand-text-muted)] tracking-tight">{opt.subtitle}</span>
                          </div>
                          <div className="w-6 h-6 rounded-full border-2 border-[var(--brand-text-muted)]/20 group-has-[:checked]:border-[var(--brand-primary)] group-has-[:checked]:bg-[var(--brand-primary)] flex items-center justify-center transition-all bg-white shrink-0 z-0">
                             <svg className="w-3.5 h-3.5 text-white scale-0 group-has-[:checked]:scale-100 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                          </div>
                        </div>
                      </label>
                    ))}
                  </div>
               </div>

               <div>
                 <label className="block text-sm font-bold text-[var(--brand-text-muted)] mb-3 ml-1">원하시는 무드 키워드 (다중 선택)</label>
                 <div className="flex flex-wrap gap-2.5">
                    {(isStudio ? 
                      ['인물 중심', '자연광 화사함', '어두운 홀/고급스러움', '노을/야외', '빈티지/필름톤', '생동감/데이트스냅'] : 
                      ['풍성한 벨라인', '깔끔한 실크', '화려한 비즈', '유니크/디자이너', '체형 보완(승모근 등)', '촬영용 유색 드레스']
                    ).map((mood) => (
                      <label key={mood} className="cursor-pointer group">
                        <input type="checkbox" name="style_mood_tags" value={mood} className="peer sr-only" />
                        <div className="px-5 py-3 text-[13px] font-bold text-[var(--brand-text-muted)] bg-[var(--brand-surface)] rounded-xl border-2 border-[var(--brand-text-muted)]/10 peer-checked:bg-[var(--brand-text-main)] peer-checked:text-[var(--brand-surface)] peer-checked:border-[var(--brand-text-main)] transition-all shadow-sm hover:border-[var(--brand-text-main)]/30">
                          {mood}
                        </div>
                      </label>
                    ))}
                 </div>
               </div>
             </div>
          </section>

          {/* Submit Action */}
          <div className="pt-10 border-t-2 border-dashed border-[var(--brand-text-muted)]/20 mt-10">
             <SubmitBriefButton />
             <p className="text-center text-xs text-[var(--brand-text-muted)] mt-5 leading-relaxed font-bold">
               이 내용은 외부로 유출되지 않으며, 선택하신 브랜드(<span className="text-[var(--brand-text-main)] uppercase tracking-widest px-1">{context.brand_name}</span>)의 확정 견적 산출을 위해서만 L1 클리어런스로 관리됩니다.
             </p>
          </div>

        </form>
      </div>

    </main>
  );
}
