import React, { use } from 'react';
import { createClient } from '@/core/utils/supabase/server';
import { EngineShowcase } from './_components/EngineShowcase';
import { BrandDirectory, PublicBrand } from './_components/BrandDirectory';
import { GlobalQuestionHub } from './_components/GlobalQuestionHub';

export const metadata = {
  title: 'Wedding Factory | 오직 팩트체크된 상위 1% 플랫폼',
  description: '숨겨진 위약금과 가짜 리뷰를 배제한 극강 투명성의 B2B2C 웨딩 AEO 허브.',
};

export default async function GlobalLobbyPage({ params }: { params: Promise<{ locale: string }> }) {
  const resolvedParams = await params;
  const locale = resolvedParams.locale;
  const supabase = await createClient();

  // 1. Fetch L0 Public Brands
  const { data: rawBrands, error: brandError } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name_ko, brand_name_en, brand_slug, vertical_type, public_status, vibe_spec_id, created_at, translations')
    .eq('public_status', 'published')
    .order('created_at', { ascending: false });

  if (brandError) console.error('Brand Fetch Error:', brandError);

  // 2. Fetch L0 Answer Cards for Global Hub (AEO)
  const { data: rawAnswers, error: answerError } = await supabase
    .from('answer_card')
    .select(`
      card_id, question, short_answer, updated_at, boundary_note, reviewer_id, translations,
      brand_registry!inner(brand_id, brand_slug, brand_name_ko, vertical_type)
    `)
    .eq('visibility_level', 'L0')
    .order('updated_at', { ascending: false })
    .limit(50);

  if (answerError) console.error('Answer Fetch Error:', answerError);

  // Projection - QnA Cards (Applying locale)
  const allAnswers = (rawAnswers || []).map(ans => {
    const b = Array.isArray(ans.brand_registry) ? ans.brand_registry[0] : ans.brand_registry;
    
    // 다국어 텍스트 투영
    let targetQuestion = ans.question;
    let targetAnswer = ans.short_answer;
    
    // answer_card translations schema: { "en": { question, short_answer }, "ja": ... }
    const trans = ans.translations as any;
    if (locale !== 'ko' && trans && trans[locale]) {
       targetQuestion = trans[locale].question || targetQuestion;
       targetAnswer = trans[locale].short_answer || targetAnswer;
    }

    return {
      answer_id: ans.card_id,
      question: targetQuestion,
      short_answer: targetAnswer,
      brand_id: b?.brand_id || 'unknown',
      brand_slug: b?.brand_slug || 'unknown',
      vertical_type: b?.vertical_type || 'studio',
      brand_name: b?.brand_name_ko || '무명브랜드',
      updated_at: ans.updated_at.split('T')[0],
      reviewer_name: 'Factory System',
      visibility_level: 'L0'
    };
  });

  // DB Map for Brands (Applying locale)
  let brands: PublicBrand[] = (rawBrands || []).map(r => {
    let targetName = locale === 'ko' ? r.brand_name_ko : (r.brand_name_en || r.brand_name_ko);
    let targetSummary = locale === 'ko' ? '시스템 L0 심사 통과 (공인 파트너)' : 'System L0 Verified (Official Partner)';
    
    // brand_registry translations schema: { "en": { summary, rules }, "ja": ... }
    const trans = r.translations as any;
    if (locale === 'ja') {
       if (trans?.ja?.brand_name) targetName = trans.ja.brand_name;
       targetSummary = 'L0審査通過（公式パートナー）';
    } else if (locale === 'en' && trans?.en?.brand_name) {
       targetName = trans.en.brand_name;
    }

    return {
      brand_id: r.brand_id,
      brand_name: targetName,
      brand_slug: r.brand_slug,
      vertical_type: r.vertical_type,
      one_line_summary: targetSummary,
      base_price_indicator: null
    };
  });

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
      <GlobalQuestionHub allAnswers={allAnswers as any} locale={locale} />

      {/* 2. Core Engines Showcase */}
      <EngineShowcase />

      {/* 3. L0 Approved Brand Directory */}
      <BrandDirectory brands={brands} locale={locale} />

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

