import React from 'react';
import { createClient } from '@/core/utils/supabase/server';
import { EngineShowcase } from './_components/EngineShowcase';
import { BrandDirectory, PublicBrand } from './_components/BrandDirectory';
import { GlobalQuestionHub } from './_components/GlobalQuestionHub';

export const metadata = {
  title: 'Wedding Factory | 오직 팩트체크된 상위 1% 플랫폼',
  description: '숨겨진 위약금과 가짜 리뷰를 배제한 극강 투명성의 B2B2C 웨딩 AEO 허브.',
};

export default async function GlobalLobbyPage() {
  const supabase = await createClient();

  // 1. Fetch L0 Public Brands
  const { data: rawBrands } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name, brand_slug, vertical_type, public_status, vibe_spec_id, created_at')
    .eq('public_status', true)
    .order('created_at', { ascending: false });

  // 2. Fetch L0 Answer Cards for Global Hub (AEO)
  // 최상위 50개만 캐싱/프리로드 (성능)
  const { data: rawAnswers } = await supabase
    .from('answer_card')
    .select(`
      card_id, question, short_answer, updated_at, boundary_note, reviewer_id,
      brand:brand_id (brand_id, brand_slug, brand_name_ko, vertical_type)
    `)
    .eq('visibility_level', 'L0')
    .order('updated_at', { ascending: false })
    .limit(50);

  // Projection - QnA Cards
  const allAnswers = (rawAnswers || []).map(ans => {
    const brand = Array.isArray(ans.brand) ? ans.brand[0] : ans.brand;
    return {
      answer_id: ans.card_id,
      question: ans.question,
      short_answer: ans.short_answer,
      brand_id: brand?.brand_id || 'unknown',
      brand_slug: brand?.brand_slug || 'unknown',
      vertical_type: brand?.vertical_type || 'studio',
      brand_name: brand?.brand_name_ko || '무명브랜드',
      updated_at: ans.updated_at.split('T')[0],
      reviewer_name: 'Factory System',
      visibility_level: 'L0'
    };
  });

  // DB Map for Brands
  let brands: PublicBrand[] = (rawBrands || []).map(r => ({
    brand_id: r.brand_id,
    brand_name: r.brand_name,
    brand_slug: r.brand_slug,
    vertical_type: r.vertical_type,
    one_line_summary: '시스템 L0 심사 통과 (공인 파트너)',
    base_price_indicator: null
  }));

  // MVP Mock Fallback
  if (brands.length === 0) {
    brands = [
      { brand_id: 'mock-1', brand_name: 'Urban Studio', brand_slug: 'urban-studio', vertical_type: 'studio', one_line_summary: '테스트 스튜디오', base_price_indicator: null }
    ];
  }

  // 🤖 Global AEO JSON-LD (FAQPage)
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: allAnswers.slice(0, 15).map(a => ({
      '@type': 'Question',
      name: `[${a.brand_name}] ${a.question}`,
      acceptedAnswer: {
        '@type': 'Answer',
        text: a.short_answer
      }
    }))
  };

  return (
    <main className="min-h-screen bg-black w-full overflow-hidden flex flex-col items-center">
      
      {/* 🤖 AEO Search Bot Hooks */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      
      {/* 1. Global AI Search Hub (Hero Replacement) */}
      <GlobalQuestionHub allAnswers={allAnswers as any} />

      {/* 2. Core Engines Showcase */}
      <EngineShowcase />

      {/* 3. L0 Approved Brand Directory */}
      <BrandDirectory brands={brands} />

      {/* Footer */}
      <footer className="w-full bg-zinc-950 py-12 flex justify-center border-t border-zinc-900 mt-20">
         <div className="max-w-6xl w-full px-6 text-center">
            <h1 className="text-xl font-black text-white/50 tracking-tighter mb-4">W E D D I N G<br />F A C T O R Y</h1>
            <p className="text-zinc-700 text-xs font-bold uppercase tracking-widest">
               Built on Supabase & Next.js App Router<br />© 2026 The Zero-BS Platform
            </p>
         </div>
      </footer>
    </main>
  );
}

