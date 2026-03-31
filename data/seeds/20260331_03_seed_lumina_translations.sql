-- data/seeds/20260331_03_seed_lumina_translations.sql

DO $$
BEGIN
  -- 1. 체형 컴플렉스 QnA 다국어 샘플 매핑
  UPDATE public.answer_card 
  SET translations = '{
    "en": {"question": "Can it perfectly cover physical complexes like the trapezius muscle or thick arms?", "answer": "Lumina Dress possesses over 30 types of off-shoulder and convertible boleros, specifically designed to specialize in upper body fit and flawless coverage."},
    "ja": {"question": "体型の悩み（僧帽筋、二の腕など）はうまくカバーできますか？", "answer": "ルミナドレスには、オフショルダーやアレンジ用ボレロが30種類以上備わっており、上半身のカバー（フィット感）や体型補正に特化しています。"},
    "zh-TW": {"question": "能很好地修飾體型困擾（斜方肌、粗手臂等）嗎？", "answer": "Lumina 婚紗擁有 30 種以上的露肩及可變形披肩，專門針對上半身修飾（Fit）而設計，能給您完美的視覺效果。"},
    "zh-CN": {"question": "能很好地修饰体型困扰（斜方肌、粗手臂等）吗？", "answer": "Lumina 婚纱拥有 30 种以上的露肩及可变形披肩，专为修饰上半身（Fit）设计，为您打造完美的视觉效果。"}
  }'::jsonb
  WHERE question LIKE '%체형 컴플렉스%';

  -- 2. 가봉 스냅 QnA 다국어 샘플 매핑
  UPDATE public.answer_card 
  SET translations = '{
    "en": {"question": "Do you also offer fitting snapshots?", "answer": "Fitting snapshots are available exclusively on weekdays in a private room for 2 hours, with an additional studio rental fee of 200,000 KRW."},
    "ja": {"question": "フィッティング時のスナップ撮影も可能ですか？", "answer": "フィッティングのスナップ撮影は平日に限り、プライベートルームにて2時間実施可能です。（スタジオレンタル料：別途20万ウォン発生）"},
    "zh-TW": {"question": "請問也可以拍試穿婚紗時的快照嗎？", "answer": "試穿快照僅限平日，在私人 VIP 室拍攝 2 小時，工作室租借費需另加收 20 萬韓元。"},
    "zh-CN": {"question": "请问也可以拍试穿婚纱时的快照吗？", "answer": "试穿快照仅限工作日，在私人 VIP 室拍摄 2 小时，工作室租借费需另加收 20 万韩元。"}
  }'::jsonb
  WHERE question LIKE '%가봉 스냅%';

END $$;
