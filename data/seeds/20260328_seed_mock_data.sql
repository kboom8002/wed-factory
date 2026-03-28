-- data/seeds/20260328_seed_mock_data.sql

DO $$
DECLARE
  v_studio_id UUID := '10000000-0000-0000-0000-000000000001';
  v_dress_id UUID := '20000000-0000-0000-0000-000000000002';
  v_makeup_id UUID := '30000000-0000-0000-0000-000000000003';
BEGIN

  -- 1. Brand Registry (3 Tenants)
  INSERT INTO public.brand_registry (brand_id, brand_slug, brand_name_ko, vertical_type, public_status, package_tier, locale_set, active_modules, shared_hub_eligibility) 
  VALUES
  (v_studio_id, 'sample-studio', '샘플 스튜디오', 'studio', 'published', 'standard', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE),
  (v_dress_id, 'sample-dress', '샘플 드레스', 'dress', 'published', 'entry', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE),
  (v_makeup_id, 'sample-makeup', '샘플 메이크업', 'makeup', 'published', 'professional', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE)
  ON CONFLICT (brand_slug) DO NOTHING;

  -- 2. AnswerCards (Question-first 자산)
  -- Studio
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level) VALUES
  (v_studio_id, '원본 데이터는 무료로 제공되나요?', '네, 저희 스탠다드 패키지부터는 원본 데이터가 전액 무료로 포함됩니다.', 'L0'),
  (v_studio_id, '야외 촬영 시 비가 오면 어떻게 하나요?', '위약금 없이 실내 3시간 진행 후 추후 1회에 한해 무료로 야외 변동 촬영을 지원해 드립니다.', 'L0');

  -- Dress
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level) VALUES
  (v_dress_id, '당일 지정 혜택은 어떤 것들이 있나요?', '당일 현장 계약 시 예식 당일 프리미엄 드레스 1회 무료 업그레이드를 보장해 드립니다.', 'L0'),
  (v_dress_id, '빅사이즈 드레스 피팅도 가능한가요?', '네, 사이즈 77~88 이상의 전문 커스텀 라인을 별도 보유하고 있어 원활한 피팅이 가능합니다.', 'L0');

  -- Makeup
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level) VALUES
  (v_makeup_id, '혼주 메이크업도 한 곳에서 진행하나요?', '부모님을 위한 별도 프라이빗 룸이 마련되어 있어 동선 걱정 없이 편안하게 받으실 수 있습니다.', 'L0');

  -- 3. PolicyItems
  INSERT INTO public.policy_item (brand_id, policy_family, summary, exceptions, visibility_level) VALUES
  (v_dress_id, 'fitting', '피팅비 5만원 (방문 시 안내)', '본식 확정 고객님의 재방문 피팅의 경우 3만원으로 특별 할인이 적용됩니다.', 'L0'),
  (v_studio_id, 'refund', '촬영 30일 전 100% 환불 가능', '천재지변 등 불가피한 기상 악화 시 일정 무료 연기가 우선 적용됩니다.', 'L0');

  -- 4. PricingBands
  INSERT INTO public.pricing_band (brand_id, band_label, min_estimate, max_estimate, included_summary) VALUES
  (v_makeup_id, '리허설 + 본식 결합', 400000, 600000, '신랑/신부 헤어 및 메이크업 각각 1회 진행 (총 2회)'),
  (v_studio_id, '프리미엄 야외 패키지', 1200000, 1800000, '의상 3벌 교체 가능, 야외 단독 씬 스냅 촬영 4시간 포함');

  -- 5. CombinationType (비교 단위 조합형)
  INSERT INTO public.combination_type (brand_id, title, studio_type_summary, dress_type_summary, makeup_type_summary, regret_risks) VALUES
  (v_studio_id, '인물 중심 스탠다드 로맨틱 패키지', '심플한 배경지 위주의 자연스러운 인물 촬영', '화려한 비즈보다는 실크나 레이스 중심', '과도한 색조보다는 피부결 중심의 맑은 톤', '배경이 심플하여 나중에 보기에 다소 밋밋할 수 있음');

END $$;
