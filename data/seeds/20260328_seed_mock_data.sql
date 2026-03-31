-- data/seeds/20260328_seed_mock_data.sql

DO $$
DECLARE
  v_urban_id UUID := '10000000-0000-0000-0000-000000000001';
  v_lumina_id UUID := '20000000-0000-0000-0000-000000000002';
  v_makeup_id UUID := '30000000-0000-0000-0000-000000000003';
BEGIN

  -- 1. Brand Registry
  INSERT INTO public.brand_registry (brand_id, brand_slug, brand_name_ko, vertical_type, public_status, package_tier, locale_set, active_modules, shared_hub_eligibility) 
  VALUES
  (v_urban_id, 'urban-studio', '어반 스튜디오', 'studio', 'published', 'standard', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE),
  (v_lumina_id, 'lumina-dress', '루미나 드레스', 'dress', 'published', 'entry', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE),
  (v_makeup_id, 'sample-makeup', '샘플 메이크업', 'makeup', 'published', 'professional', ARRAY['ko-KR'], ARRAY['portfolio', 'questions', 'policies', 'inquiry'], TRUE)
  ON CONFLICT (brand_slug) DO NOTHING;

  -- 2. AnswerCards (Question-first 자산)
  INSERT INTO public.answer_card (brand_id, question, short_answer, visibility_level) VALUES
  (v_urban_id, '야간 씬(Night Scene) 촬영 시 추가금이 있나요?', '네, 야간 조명 세팅 및 야근 수당으로 인해 11만원의 야간 씬 추가금이 발생합니다. (단, 17시 시작 타임 제외)', 'L0'),
  (v_urban_id, '지각하면 어떻게 되나요?', '촬영 시작 시간 기준 30분 지각 시 5만원, 1시간 지각 시 10만원의 딜레이 페널티가 발생하며, 촬영 컷수가 제한될 수 있습니다.', 'L0'),
  (v_lumina_id, '체형 컴플렉스(승모근, 팔뚝) 커버가 잘 될까요?', '루미나 드레스는 오프숄더와 변형 볼레로를 30종 이상 보유하고 있어 상체 커버(Fit)에 특화되어 있습니다.', 'L0'),
  (v_lumina_id, '가봉 스냅도 가능한가요?', '가봉 스냅은 평일에 한해 스튜디오 대관료 20만원 별도로 프라이빗 룸에서 2시간 진행 가능합니다.', 'L0');

  -- 3. PolicyItems
  INSERT INTO public.policy_item (brand_id, policy_family, summary, exceptions, risk_hint, visibility_level) VALUES
  (v_urban_id, 'change', '촬영 14일 전 일정 변경 불가', '우천 시 야외 씬 대체 혹은 실내 촬영으로 무료 전환 가능', '일정 확정 후 위약금이 매우 강한 편이니 신중히 선택하세요.', 'L0'),
  (v_lumina_id, 'fitting', '피팅비 5만원 (당일 미계약 시 소멸)', '당일 계약 확정 고객님의 경우 피팅비 5만원은 총액에서 차감됩니다.', '가벼운 마음의 투어용으로는 추천하지 않습니다.', 'L0');

  -- 4. CombinationType (비교 단위 조합형 가이드)
  INSERT INTO public.combination_type (brand_id, title, studio_type_summary, dress_type_summary, makeup_type_summary, regret_risks) VALUES
  (v_urban_id, '시그니처 시네마틱 (나이트씬 포함)', '어두운 배경과 핀조명을 활용한 영화 같은 무드', '실크나 화려한 비즈가 모두 잘 어울리며 볼드한 스타일 추천', '세미 스모키 또는 또렷한 윤곽 메이크업 권장', '자연광 느낌의 뽀얗고 캐주얼한 느낌을 원한다면 100% 후회합니다.'),
  (v_lumina_id, '클래식 체형보완 볼레로 패키지', '상체 및 팔뚝을 커버하면서 단아한 느낌 연출', '다양한 변형 볼레로가 포함된 풍성/슬림 드레스 혼합 구성', '깔끔한 업스타일과 맑은 피부 표현', '본식 당일 현장 이모님의 센스에 드레스 핏이 크게 좌우될 수 있습니다.');

  -- 5. Trust Evidence (증빙 자산)
  INSERT INTO public.trust_evidence (evidence_id, target_type, masked_summary, status, created_at) VALUES
  ('ev-urban-1', 'policy_item', '위약금 규정 공정위 표준약관 대조 완료', 'verified', NOW() - INTERVAL '5 days'),
  ('ev-urban-2', 'answer_card', '야간 씬 추가금 고지서 및 실제 영수증 샘플 확인 완료', 'verified', NOW() - INTERVAL '1 days'),
  ('ev-lumina-1', 'brand_registry', '사업자 등록증 상태 (정상 영업) 및 대표자 신원 확인', 'verified', NOW() - INTERVAL '12 days');

  -- 6. Change Logs (업데이트 로깅)
  INSERT INTO public.change_log (log_id, entity_id, entity_name, changes, created_at) VALUES
  ('log-urban-1', v_urban_id, 'policy_item', '{"action":"POLICY_UPDATE", "note":"지각 페널티 3만원에서 5만원으로 상향 조정 (2025년 1월 기준)"}'::jsonb, NOW() - INTERVAL '14 days'),
  ('log-lumina-1', v_lumina_id, 'answer_card', '{"action":"ANSWER_ADD", "note":"가봉 스냅 관련 룸 대관료 명시(20만원) 및 가능 요일 업데이트"}'::jsonb, NOW() - INTERVAL '3 days');

END $$;
