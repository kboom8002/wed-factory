-- 20260401_10_add_envelope_brand_id.sql
-- 벤더 대시보드(Dealroom)에서 Generic Brief(연결 조합이 없는 견적 요청서)를 확인할 수 있도록
-- brand_registry 테이블과의 직접 연결성을 보장하는 컬럼을 신설합니다.

ALTER TABLE public.bride_groom_envelope
ADD COLUMN target_brand_id UUID REFERENCES public.brand_registry(id) ON DELETE CASCADE;

-- 인덱스 추가를 통해 벤더 대시보드 조회 성능 최적화
CREATE INDEX idx_envelope_target_brand ON public.bride_groom_envelope(target_brand_id);
