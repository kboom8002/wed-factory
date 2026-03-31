-- data/seeds/20260331_03_seed_lumina_translations.sql

-- 1. Brand Registry Translations
UPDATE public.brand_registry
SET translations = '{
  "en": {
    "brand_name": "Lumina Dress"
  },
  "ja": {
    "brand_name": "ルミナ ドレス"
  }
}'::jsonb
WHERE brand_slug = 'lumina-dress';

-- 2. Combination Type Translations (Best Fit/Not Fit)
UPDATE public.combination_type
SET translations = '{
  "en": {
    "title": "Classic Shape-Correction Bolero Package",
    "studio_type_summary": "Elegant vibe covering upper body and arms",
    "dress_type_summary": "Mix of A-line and slim dresses with various transformable boleros",
    "makeup_type_summary": "Clean upstyle and clear skin tone",
    "regret_risks": "The dress fit heavily depends on the helper''s sense on your wedding day."
  },
  "ja": {
    "title": "クラシック体型カバーボレロパッケージ",
    "studio_type_summary": "上半身と腕をカバーしつつエレガントな雰囲気を演出",
    "dress_type_summary": "多様な変形ボレロを含むAラインとスリムドレスのミックス",
    "makeup_type_summary": "すっきりとしたアップスタイルと透明感のある肌表現",
    "regret_risks": "挙式当日のヘルパーのセンスによってドレスのフィット感が大きく左右される可能性があります。"
  }
}'::jsonb
WHERE brand_id = (SELECT brand_id FROM public.brand_registry WHERE brand_slug = 'lumina-dress' LIMIT 1);

-- 3. Policy Item Translations
UPDATE public.policy_item
SET translations = '{
  "en": {
    "summary": "50,000 KRW Fitting Fee (Non-refundable if not contracted on the same day)",
    "detailed_rule": "If a contract is confirmed on the same day, the 50,000 KRW fitting fee will be deducted from the total amount.",
    "exceptions": "Not recommended for a casual tour."
  },
  "ja": {
    "summary": "フィッティング費用 50,000ウォン (当日未契約の場合は消滅)",
    "detailed_rule": "当日契約が確定したお客様の場合、フィッティング費用の50,000ウォンは総額から差し引かれます。",
    "exceptions": "軽い気持ちでの見学はお勧めしません。"
  }
}'::jsonb
WHERE brand_id = (SELECT brand_id FROM public.brand_registry WHERE brand_slug = 'lumina-dress' LIMIT 1);

-- 4. Answer Card Translations
UPDATE public.answer_card
SET translations = '{
  "en": {
    "question": "Will it hide my upper body complexes (trapezius, arms)?",
    "answer": "Lumina Dress specializes in upper body fitting, offering over 30 types of off-shoulder and transformable boleros."
  },
  "ja": {
    "question": "体型のコンプレックス（僧帽筋、腕）はうまくカバーできますか？",
    "answer": "ルミナドレスは、30種類以上のオフショルダーや変形ボレロを取り揃えており、上半身のカバー（Fit）に特化しています。"
  }
}'::jsonb
WHERE brand_id = (SELECT brand_id FROM public.brand_registry WHERE brand_slug = 'lumina-dress' LIMIT 1)
AND short_answer LIKE '%상체 커버%';
