-- data/migrations/20260328_06_create_telemetry.sql

CREATE TABLE public.event_telemetry (
    event_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    event_type VARCHAR(50) NOT NULL, -- 'answer_open', 'policy_open', 'compare_click', 'trust_expand'
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    target_id UUID, -- 눌러본 카드/정책/증빙의 ID
    session_hash VARCHAR(255), -- 동일 고객 연속 클릭 파악을 위한 해시 (IP+UA 조합)
    metadata JSONB DEFAULT '{}'::jsonb, -- 기타 맥락적 메타데이터
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 통계 쿼리 최적화를 위한 인덱스 생성
CREATE INDEX idx_telemetry_event_type ON public.event_telemetry(event_type);
CREATE INDEX idx_telemetry_brand_id ON public.event_telemetry(brand_id);
CREATE INDEX idx_telemetry_created_at ON public.event_telemetry(created_at);
