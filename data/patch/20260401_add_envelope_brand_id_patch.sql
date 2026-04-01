-- 20260401_10_add_envelope_brand_id.sql

-- 1. bride_groom_envelope 테이블에 target_brand_id (필수) 추가
-- 기존 레코드들이 있을 수 있으므로 먼저 NULL 허용으로 생성
ALTER TABLE public.bride_groom_envelope 
ADD COLUMN target_brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE;

-- 2. Index 추가
CREATE INDEX idx_envelope_target_brand ON public.bride_groom_envelope(target_brand_id);

-- 3. (Patch 전용 로직) 기존 데이터 마이그레이션 백업 처리
DO $$
DECLARE
  v_lumiere_id UUID := 'bbbb0000-0000-0000-0000-000000000002'; -- lumiere-dress
BEGIN
  -- A. 이미 target_combination_id가 있는 브리프들은 해당 조합의 brand_id로 연결
  UPDATE public.bride_groom_envelope bge
  SET target_brand_id = ct.brand_id
  FROM public.combination_type ct
  WHERE bge.target_combination_id = ct.combination_id
    AND bge.target_brand_id IS NULL;

  -- B. target_combination_id가 아예 NULL인 오펀 브리프 중, 최근 고객님이 테스트하신 뤼미에르 드레스 임의 할당 복구!
  UPDATE public.bride_groom_envelope
  SET target_brand_id = v_lumiere_id
  WHERE target_combination_id IS NULL AND target_brand_id IS NULL;
END $$;
