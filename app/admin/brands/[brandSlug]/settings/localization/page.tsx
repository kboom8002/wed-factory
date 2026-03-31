import React from 'react';
import { notFound } from 'next/navigation';
import { createClient } from '@/core/utils/supabase/server';
import { TranslateActionBlock } from './_components/TranslateActionBlock';

export default async function BrandLocalizationSettingsPage({
  params
}: {
  params: Promise<{ brandSlug: string }>
}) {
  const { brandSlug } = await params;
  const supabase = await createClient();

  // 1. Validate Brand
  const { data: brand, error: brandErr } = await supabase
    .from('brand_registry')
    .select('*, id, brand_id')
    .eq('brand_slug', brandSlug)
    .single();

  if (brandErr || !brand) {
    notFound();
  }

  const brandId = brand.brand_id || brand.id;

  // 2. Fetch Entity Stats
  // A. Combinations
  const { data: combinations } = await supabase.from('combination_type').select('translations').eq('brand_id', brandId);
  const comboTotal = combinations?.length || 0;
  const comboDone = combinations?.filter(c => c.translations?.en && c.translations?.ja).length || 0;

  // B. Policies
  const { data: policies } = await supabase.from('policy_item').select('translations').eq('brand_id', brandId);
  const policyTotal = policies?.length || 0;
  const policyDone = policies?.filter(p => p.translations?.en && p.translations?.ja).length || 0;

  // C. Answers
  const { data: answers } = await supabase.from('answer_card').select('translations').eq('brand_id', brandId);
  const answerTotal = answers?.length || 0;
  const answerDone = answers?.filter(a => a.translations?.en && a.translations?.ja).length || 0;

  // D. Brand itself
  const brandDone = (brand.translations?.en && brand.translations?.ja) ? 1 : 0;

  const currentStats = {
    brandDone,
    comboTotal, comboDone,
    policyTotal, policyDone,
    answerTotal, answerDone
  };

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-black text-gray-900 mb-2">Globalization & i18n</h1>
        <p className="text-gray-500 font-medium">Auto-Localization 파이프라인을 구동하여 벤더 정책과 자산을 타겟 국가 고객들에게 일치시킵니다.</p>
      </div>

      <div className="grid grid-cols-1 gap-8">
        {/* Localization Trigger Block */}
        <section>
          <TranslateActionBlock brandSlug={brandSlug} currentStats={currentStats} />
        </section>

        {/* Translation Quality Control (Placeholder) */}
        <section className="bg-gray-50 p-6 rounded-2xl border border-gray-200 shadow-sm border-dashed">
           <h3 className="text-lg font-bold text-gray-800 mb-2">Translation Vault (수동 검수)</h3>
           <p className="text-gray-500 text-sm mb-4">AI가 생성한 JSON 트리를 직접 에디팅할 수 있는 모드는 다음 업데이트(Sprint 4)에 탑재됩니다.</p>
           <div className="h-32 bg-gray-100 rounded-xl flex items-center justify-center border border-gray-200">
             <span className="text-xl opacity-20 filter grayscale">🚧</span>
           </div>
        </section>
      </div>
    </div>
  );
}
