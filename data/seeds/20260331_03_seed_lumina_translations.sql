-- data/seeds/20260331_03_seed_lumina_translations.sql

-- 1. Brand Registry Translations
UPDATE public.brand_registry
SET translations = '{
  "en": {
    "brand_name": "Lumiere Dress"
  },
  "ja": {
    "brand_name": "ルミエール ドレス"
  }
}'::jsonb
WHERE brand_slug = 'lumiere-dress';

-- 2. Combination Type Translations (Best Fit/Not Fit)
-- Assume we find the Best Fit combination for lumiere-dress
UPDATE public.combination_type
SET translations = '{
  "en": {
    "title": "Signature Silk Concept",
    "studio_type_summary": "Minimalist Studio Focus",
    "makeup_type_summary": "Clean & Glow Makeup",
    "regret_risks": "Not recommended for those seeking highly elaborate beadings."
  },
  "ja": {
    "title": "シグネチャーシルクコンセプト",
    "studio_type_summary": "ミニマリストスタジオ中心",
    "makeup_type_summary": "クリーン＆グロウメイクアップ",
    "regret_risks": "華やかなビーズ装飾を求める方にはお勧めしません。"
  }
}'::jsonb
WHERE brand_id = (SELECT id FROM public.brand_registry WHERE brand_slug = 'lumiere-dress' LIMIT 1);

-- 3. Policy Item Translations
UPDATE public.policy_item
SET translations = '{
  "en": {
    "summary": "Penalty applies for cancellation 30 days prior",
    "detailed_rule": "Full refund of deposit up to 30 days before the shooting date.\\n30% deduction for cancellations 29-15 days prior.\\nNo refund for cancellations within 14 days."
  },
  "ja": {
    "summary": "撮影30日前のキャンセルの場合、違約金が発生します",
    "detailed_rule": "撮影日の30日前までは予約金の全額返金。\\n29日～15日前のキャンセルの場合、30%控除後に返金。\\n14日前～当日キャンセルの場合、全額返金不可。"
  }
}'::jsonb
WHERE brand_id = (SELECT id FROM public.brand_registry WHERE brand_slug = 'lumiere-dress' LIMIT 1);
