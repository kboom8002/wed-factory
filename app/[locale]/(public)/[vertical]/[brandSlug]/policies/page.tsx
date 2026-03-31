import React from 'react';
import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { createClient } from '@/core/utils/supabase/server';
import { PricingBandCard, PricingBandItem } from './_components/PricingBandCard';
import { PolicyFactCheckBlock, PolicyItemProps } from './_components/PolicyFactCheckBlock';

export default async function PoliciesPage({
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

  // 1. Fetch Pricing Bands (L0)
  const { data: rawBands } = await supabase
    .from('pricing_band')
    .select('*')
    .eq('brand_id', context.id)
    .eq('visibility_level', 'L0')
    .order('min_estimate');
    
  let bands: PricingBandItem[] = rawBands || [];

  // MVP Fallback for Empty DB (개발 테스트 중 빈화면 방지용)
  if (bands.length === 0) {
    bands = [
      {
        band_id: 'mock-b1',
        band_label: 'Basic 하프 촬영',
        min_estimate: 750000,
        max_estimate: 800000,
        included_summary: '3시간 실내외 촬영 / 원본 전체 제공 / 수정본 10장 / 20R 액자 1개',
        excluded_summary: '드레스 피팅, 헤어/메이크업 별도 (제휴샵 연계 가능)',
        major_surcharge_axes: ['야간 전구씬(+10만)', '헬퍼 이모님(+20만)']
      },
      {
        band_id: 'mock-b2',
        band_label: 'Signature 올데이',
        min_estimate: 1500000,
        included_summary: '6시간 심야 야외, 실내 촬영 / 원본 전체 제공 / 앨범 20P 1권 / 수정본 30장',
        excluded_summary: '지정 작가비 미포함, 헬퍼비 별도',
        major_surcharge_axes: ['수석 작가 지정(+20만)', '앨범 페이지 추가(장당 3만)']
      }
    ];
  }

  // 2. Fetch Policies (L0)
  const { data: rawPolicies } = await supabase
    .from('policy_item')
    .select('*')
    .eq('brand_id', context.id)
    .eq('visibility_level', 'L0');

  let policies: PolicyItemProps[] = rawPolicies || [];

  // MVP Fallback for Empty DB
  if (policies.length === 0) {
    policies = [
      {
        policy_id: 'mock-p1',
        policy_family: 'refund',
        summary: '촬영 30일 전 취소 위약금 발생',
        detailed_rule: '촬영일 기준 30일 전까지는 예약금 전액 환불.\n29일~15일 전 취소 시 30% 공제 후 환불.\n14일 전~당일 취소 시 전액 환불 불가.',
        exceptions: '천재지변, 혹은 병원 입원 등 불가항력적 사유 입증 시 전액 이월 가능 (단 1회에 한함)',
        risk_hint: '단순 변심 취소금 강제'
      },
      {
        policy_id: 'mock-p2',
        policy_family: 'retouch',
        summary: '수정본 프리뷰 30일, 최종수정 60일 소요',
        detailed_rule: '고객님의 셀렉(선택)이 완료된 날짜 기준으로 프리뷰 형태의 1차 수정본이 30일 이내에 전송됩니다. 이후 재수정 피드백이 오가며 최종본까지 60일이 걸립니다.',
        exceptions: '긴급 보정(청첩장용 5장)은 +10만원 결제 시 1주일 내 우선 처리',
        risk_hint: '예식일 임박 시 모청 사용 불가'
      }
    ];
  }

  // 🤖 AEO JSON-LD Generation for Policy
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: policies.map(pol => ({
      '@type': 'Question',
      name: `${context.brand_name}의 ${pol.policy_family} 관련 정책은 어떻게 되나요?`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: pol.detailed_rule || pol.summary
      }
    }))
  };

  return (
    <>
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
    />
    <main className="min-h-screen bg-transparent flex flex-col items-center w-full max-w-4xl p-4 sm:p-6 md:p-12">
      
      <div className="w-full mb-10 text-center sm:text-left">
         <h1 className="text-3xl font-black text-[var(--brand-text-main)] mb-2">
            {context.brand_name} 팩트체크 견적
         </h1>
         <p className="text-[var(--brand-text-muted)] font-medium text-sm sm:text-base leading-relaxed tracking-tight">
            플랫폼이 팩트체크를 끝낸 공정 정책입니다. 숨겨진 <strong className="text-red-500 font-bold px-1 bg-red-50 border border-red-100 rounded">추가금 리스크</strong>까지 한눈에 비교하세요.
         </p>
      </div>
      
      {/* 1. 가격 밴드 렌더링 구역 */}
      <h2 className="w-full text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-6">📸 공식 패키지 가격</h2>
      <PricingBandCard bands={bands} />

      {/* 2. 환불/위약금 팩트체크 구역 */}
      <h2 className="w-full text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mt-8 mb-6">🛡️ 위약금 및 중요 정책 팩트체크</h2>
      <PolicyFactCheckBlock policies={policies} brandId={context.id} />

    </main>
    </>
  );
}

