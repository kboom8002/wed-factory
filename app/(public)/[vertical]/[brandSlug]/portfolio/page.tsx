import React from 'react';
import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { createClient } from '@/core/utils/supabase/server';
import { FitGuideBlock } from './_components/FitGuideBlock';
import { MasonryGallery, PortfolioItem } from './_components/MasonryGallery';

export default async function PortfolioPage({
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

  // 1. Portfolio Data Fetching (L0 공개분만)
  const { data: rawShots, error: shotErr } = await supabase
    .from('portfolio_shot')
    .select('shot_id, cdn_url, mood_tags, caption')
    .eq('brand_id', context.id)
    .eq('visibility_level', 'L0')
    .order('sort_order', { ascending: true });
    
  if (shotErr) console.error('Portfolio fetch error', shotErr);
  const items: PortfolioItem[] = rawShots || [];

  // MOCK DATA for Empty state visualization (만약 DB에 포트폴리오가 하나도 없다면 가짜 데이터라도 보여주기 위함)
  const displayItems = items.length > 0 ? items : [
    { shot_id: 'mock-1', cdn_url: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80', mood_tags: ['인물중심', '클래식'], caption: '샘플 화보 모드입니다.' },
    { shot_id: 'mock-2', cdn_url: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80', mood_tags: ['자연광', '데이트스냅'], caption: '본식 당일의 스냅 느낌' },
    { shot_id: 'mock-3', cdn_url: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&q=80', mood_tags: ['본식', '어두운홀'], caption: '풍부한 대비감을 살린 리터칭' },
  ];

  // 2. Fit Guide (Regret Risk) Data Fetching
  // vendor_envelope의 not_fit_for 필드를 탐색하거나 fallback으로 하드코딩 문구 사용
  const { data: vendorEnv } = await supabase
    .from('vendor_envelope')
    .select('not_fit_for, included_summary')
    .eq('brand_id', context.id)
    .single();

  const negativeHints = vendorEnv?.not_fit_for?.length ? vendorEnv.not_fit_for : [
    '고도화된 체형 및 배경 합성/성형 보정을 원하시는 분',
    '정해진 스크립트대로만 기계적으로 촬영하는 시스템을 원하시는 분'
  ];
  
  const positiveHints = [
    '자연스러운 얼굴선과 표정을 이끌어내는 것을 중요하게 생각하시는 분',
    '인위적인 색감보다 텍스처를 살린 모던한 필름 톤을 선호하시는 분'
  ];

  return (
    <main className="min-h-screen bg-transparent flex flex-col items-center w-full max-w-5xl py-12 px-4 sm:px-6">
      
      {/* 화면 상단 시선 고정: Regret Risk (안티셀링) 블록 */}
      <FitGuideBlock positiveHints={positiveHints} negativeHints={negativeHints} />
      
      <div className="w-full mb-8 flex justify-between items-end border-b border-[var(--brand-primary)]/20 pb-4">
         <div>
            <h1 className="text-3xl font-black text-[var(--brand-text-main)] mb-1">
               {context.brand_name} 매거진 화보
            </h1>
            <p className="text-[var(--brand-text-muted)] font-medium text-sm tracking-tight">
               L0 등급으로 공개 승인된 팩트체크 이미지 에셋 (총 {displayItems.length}장)
            </p>
         </div>
      </div>

      {/* 포트폴리오 Masonry 그리드 렌더링 */}
      <div className="w-full">
         <MasonryGallery items={displayItems} />
      </div>
      
    </main>
  );
}

