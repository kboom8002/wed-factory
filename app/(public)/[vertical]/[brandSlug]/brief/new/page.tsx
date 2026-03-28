import React from 'react';
import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { submitBrideGroomEnvelope } from '@/app/actions/submitEnvelope';

export default async function BriefComposerPage({
  params,
}: {
  params: Promise<{ vertical: string; brandSlug: string }>
}) {
  const { vertical, brandSlug } = await params;
  
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);
  if (!context) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center w-full py-12 px-4 sm:px-6">
      
      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-sm border border-gray-200 overflow-hidden mb-20">
        
        {/* Header */}
        <div className="bg-[var(--brand-primary)] px-8 py-10 relative overflow-hidden">
          <div className="absolute top-0 right-0 -mt-10 -mr-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl"></div>
          <h1 className="text-2xl font-black text-white relative z-10 mb-2 leading-tight">
            {context.brand_name} 매칭을 위한<br />맞춤 핏 브리프 작성
          </h1>
          <p className="text-white/80 font-medium text-sm relative z-10 tracking-tight">
             단순한 양식이 아닙니다. 스튜디오 측에 고객님의 정확한 선호 무드와 예산 범위를 브리핑하여, 불필요한 감정 소모나 추가금 핑퐁을 막습니다.
          </p>
        </div>

        {/* Form Body */}
        <form action={async (formData) => {
          'use server';
          await submitBrideGroomEnvelope(null, formData);
        }} className="p-8 space-y-8">
          
          {/* Target Brand (Hidden) */}
          <input type="hidden" name="vertical" value={vertical} />
          <input type="hidden" name="brandSlug" value={brandSlug} />
          <input type="hidden" name="combination_id" value="null" />

          {/* Section 1: Customer Info */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">👤</span> 기안자 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">성함 (신랑/신부 중 1명)</label>
                <input type="text" name="legal_names" required placeholder="예: 김동욱" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">연락처</label>
                <input type="tel" name="contact_info" required placeholder="010-0000-0000" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50" />
              </div>
            </div>
          </section>

          {/* Section 2: Event Timeline */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">🗓️</span> 일정
            </h2>
            <div className="space-y-4">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">본식(예식) 예정일</label>
                  <input type="date" name="exact_event_date" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 text-gray-600" />
               </div>
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">희망 촬영 시기 (Window)</label>
                  <select name="schedule_window" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 text-gray-700 font-medium">
                    <option value="">시기 선택...</option>
                    <option value="asap">최대한 빨리 (1~2달 내)</option>
                    <option value="3-6_months">여유 있음 (3~6개월 뒤)</option>
                    <option value="undecided">아직 무관함 / 미정</option>
                  </select>
               </div>
            </div>
          </section>

          {/* Section 3: Vibe & Budget */}
          <section>
            <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
              <span className="text-xl">💰</span> 예산 및 선호 핏
            </h2>
             <div className="space-y-5">
               <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1">본 패키지에 할당할 예산 (Surcharge 포함)</label>
                  <select name="budget_band" required className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 text-gray-700 font-medium">
                    <option value="">예산 대역 선택...</option>
                    <option value="under_100">100만 원 미만 (가성비 우선)</option>
                    <option value="100_to_150">100~150만 원 (스탠다드 수준)</option>
                    <option value="150_to_200">150~200만 원 (시그니처/수석 지정 포함)</option>
                    <option value="over_200">200만 원 이상 (예산보다 퀄리티 압도적 중시)</option>
                  </select>
               </div>

               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-2">원하시는 화보 무드 (다중 선택 가능)</label>
                 <div className="flex flex-wrap gap-2">
                    {['인물 중심', '자연광 화사함', '어두운 홀/고급스러움', '노을/야외', '빈티지/필름톤', '생동감/데이트스냅'].map((mood) => (
                      <label key={mood} className="cursor-pointer">
                        <input type="checkbox" name="style_mood_tags" value={mood} className="hidden peer" />
                        <div className="px-4 py-2 text-xs font-bold text-gray-500 bg-gray-100 rounded-full border border-gray-200 peer-checked:bg-[var(--brand-primary)] peer-checked:text-white peer-checked:border-[var(--brand-primary)] transition-all">
                          {mood}
                        </div>
                      </label>
                    ))}
                 </div>
               </div>
               
               <div>
                 <label className="block text-sm font-bold text-gray-700 mb-1">색감 및 성형 보정 민감도</label>
                 <select name="original_retouch_sensitivity" defaultValue="normal" className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-[var(--brand-primary)]/50 text-gray-700 font-medium">
                    <option value="high">매우 민감함 (디테일한 합성/성형 보정 필수)</option>
                    <option value="normal">보통 (작가님의 기본 색감과 체형 보정을 믿음)</option>
                    <option value="low">낮음 (완전 원본/다큐멘터리 같은 자연스러움 추구)</option>
                  </select>
               </div>
             </div>
          </section>

          {/* Submit Action */}
          <div className="pt-6 border-t border-gray-100">
             <button 
                type="submit" 
                className="w-full bg-slate-900 text-white font-bold text-lg py-4 rounded-xl shadow-md hover:bg-black transition-all active:scale-[0.98]"
              >
               제출 및 매칭 룸 생성
             </button>
             <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed font-medium">
               이 내용은 일반 마케팅 DB로 유통되지 않으며, 선택하신 브랜드(<strong className="text-gray-500">{context.brand_name}</strong>)의 담당 실장님과 매칭을 위한 용도로 플랫폼 내에서 암호화되어 보관됩니다.
             </p>
          </div>

        </form>
      </div>

    </main>
  );
}
