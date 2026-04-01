-- ==============================================================================
-- 클릭스루 풀-테스트 전용 가상 데이터 시드 (Full Mock Seed for E2E Test)
-- 대상: 어반 스튜디오 (Urban Studio), 르미에르 드레스 (Lumiere Dress)
-- ==============================================================================

DO $$
DECLARE
  v_studio_id UUID := 'aaaa0000-0000-0000-0000-000000000001';
  v_dress_id UUID := 'bbbb0000-0000-0000-0000-000000000002';
BEGIN

  -- 0. Schema Patch (vibe_spec_id가 UUID로 되어 있을 수 있으므로 VARCHAR로 강제 변경하여 문자열을 쓸 수 있게 함)
  ALTER TABLE public.brand_registry ALTER COLUMN vibe_spec_id TYPE VARCHAR(100) USING vibe_spec_id::varchar;
  
  -- [추가] answer_card 에 Vendor CMS 편집상태 표시를 위한 public_status(draft/published) 컬럼이 없을 경우 자동 추가
  BEGIN
    ALTER TABLE public.answer_card ADD COLUMN public_status public_status DEFAULT 'published';
  EXCEPTION
    WHEN duplicate_column THEN
      NULL; -- 이미 존재하면 패스
  END;

  -- 1. Brand Registry (2개의 강력한 테넌트)
  INSERT INTO public.brand_registry (brand_id, brand_slug, brand_name_ko, brand_name_en, vertical_type, public_status, vibe_spec_id, package_tier, locale_set, active_modules) 
  VALUES
  (v_studio_id, 'urban-studio', '어반 스튜디오', 'Urban Studio', 'studio', 'published', 'cinematic-night', 'professional', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry', 'compare']),
  (v_dress_id, 'lumiere-dress', '르미에르 하우스', 'Lumiere House', 'dress', 'published', 'lovely-peach', 'standard', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry', 'compare'])
  ON CONFLICT (brand_slug) DO UPDATE SET 
    brand_name_en = EXCLUDED.brand_name_en,
    vibe_spec_id = EXCLUDED.vibe_spec_id;

  -- 2. QnA (답변 카드) - 각 4개씩 풍부하게 채움
  -- Studio QnA
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level, public_status) VALUES
  (v_studio_id, '야간 옥상씬 촬영은 추가금이 있나요?', '네, 야간 조명 세팅 비용으로 15만 원의 야간 촬영 추가금이 발생합니다.', 'L0', 'published'),
  (v_studio_id, '원본 데이터(Raw) 구매는 필수인가요?', '아닙니다. 스탠다드 패키지에 전체 원본 데이터(JPEG)와 보정본 20장이 기본 포함되어 있습니다.', 'L0', 'published'),
  (v_studio_id, '지인이나 아이폰 스냅 작가 동행이 가능한가요?', '메인 작가의 동선(특히 계단 씬)을 방해하지 않는 선에서 1인까지 무료 동행이 허용됩니다.', 'L0', 'published'),
  (v_studio_id, '촬영 당일 간식은 준비해야 하나요?', '간단한 물과 한입 사이즈의 캔디면 충분합니다. 냄새나는 김밥 류는 스튜디오 내 취식이 제한됩니다.', 'L0', 'published');

  -- Dress QnA
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level, public_status) VALUES
  (v_dress_id, '지정 피팅과 일반 피팅의 차이가 뭔가요?', '지정 피팅은 저희 샵을 첫 방문으로 계약하실 때 진행되며, 프리미엄 코스 드레스 1벌 무료 업그레이드 혜택을 드립니다.', 'L0', 'published'),
  (v_dress_id, '피팅 시 사진 촬영이 가능한가요?', '가봉 스냅을 제외한 일반 피팅 시에는 디자인 유출 방지를 위해 스케치만 가능하며, 사진/영상 촬영은 금지됩니다.', 'L0', 'published'),
  (v_dress_id, '당일 취소 위약금은 얼마인가요?', '피팅 예약 당일 취소 시에는 예약금 5만 원이 전액 환불되지 않습니다.', 'L0', 'published'),
  (v_dress_id, '헬퍼 이모님 비용은 언제 결제하나요?', '본식 당일 현장에서 이모님께 현금이나 송금으로 25만 원을 직접 결제해 주시면 됩니다.', 'L0', 'published');

  -- 3. 포트폴리오 스냅 (Portfolio Shots)
  INSERT INTO public.portfolio_shot (brand_id, cdn_url, mood_tags, visibility_level) VALUES
  -- Studio
  (v_studio_id, '/images/mock/studio-night.png', ARRAY['야간스냅', '폭죽씬', '시네마틱'], 'L0'),
  (v_studio_id, '/images/mock/studio-road.png', ARRAY['로드씬', '흑백사진', '자연스러움'], 'L0'),
  (v_studio_id, '/images/mock/studio-indoor.png', ARRAY['실내스튜디오', '창가씬', '역광'], 'L0'),
  -- Dress
  (v_dress_id, '/images/mock/dress-bead.png', ARRAY['비즈드레스', '벨라인', '본식용'], 'L0'),
  (v_dress_id, '/images/mock/dress-silk.png', ARRAY['실크드레스', '오프숄더', '촬영용'], 'L0'),
  (v_dress_id, '/images/mock/dress-outdoor.png', ARRAY['야외스냅용', '빈티지레이스'], 'L0');

  -- 4. 정책 (Policy Items)
  INSERT INTO public.policy_item (brand_id, policy_family, summary, exceptions, visibility_level) VALUES
  (v_studio_id, 'schedule', '촬영일 기준 14일 전까지 1회 날짜 변경 무료', '기상 악화(우천, 폭설)로 인한 야외 씬 대체 시 당일에도 무료 연기 지원', 'L0'),
  (v_dress_id, 'fitting', '피팅 예약금 5만 원 (당일 미방문 시 소멸)', '천재지변이나 샵 측의 스케줄 오류 시 예약금은 100% 환불됩니다.', 'L0');

  -- 5. 조합/비교 허브 데이터 (Combination Type)
  INSERT INTO public.combination_type (brand_id, title, studio_type_summary, dress_type_summary, makeup_type_summary, regret_risks) VALUES
  (v_studio_id, '어반 시네마틱 + 실크 드레스 조합', '배경이 어둡고 그림자가 짙어 웅장한 느낌 연출', '화려한 비즈보다는 실크 라인이 어두운 배경에서 질감이 더 잘 살아남', '스모키 음영보다는 립 포인트만 준 클래식 메이크업 추천', '화려한 공주풍을 기대했다면 사진이 너무 모던해 보일 수 있음'),
  (v_dress_id, '러블리 피치 메이크업 + 비즈 벨라인 조합', '화사하고 밝은 자연광 스튜디오 조명에 최적화', '조명을 받을 때마다 상단 비즈가 부서지듯 반짝임', '과즙상의 생기있는 블러셔와 글로시 립 매칭', '이목구비가 뚜렷한 편이면 과즙상 화장이 다소 촌스러워 보일 위험이 있음');

  -- 6. 백로그(미답변 질문 처리) 시뮬레이션 용(Admin 대시보드 알림용)
  INSERT INTO public.zero_result_query (query_text, vertical_context, status) VALUES
  ('어반 스튜디오 반려견 동반 가능한가요?', 'studio', 'pending'),
  ('르미에르 하우스 본식 당일 드레스 변경 위약금', 'dress', 'pending');

END $$;
