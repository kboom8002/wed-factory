-- data/migrations/20260328_04_create_observatory_tables.sql

CREATE TYPE query_status AS ENUM ('pending', 'assigned', 'resolved', 'spam');

-- 고객이 검색했으나 답을 얻지 못하고 '제보하기'를 누른 검색어 큐 (Zero-Result)
CREATE TABLE public.zero_result_query (
    query_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    query_text VARCHAR(500) NOT NULL,
    status query_status DEFAULT 'pending',
    
    -- Contextual Data
    vertical_context VARCHAR(100), -- 어디서 눌렀는지 (예: hub, studio 등)
    ip_hash VARCHAR(100), -- 악성 도배 방지용 단방향 해시
    
    -- Admin resolution Tracking
    assigned_admin_id UUID,
    resolution_answer_card_id UUID REFERENCES public.answer_card(card_id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Triggers 
CREATE TRIGGER update_zero_result_modtime BEFORE UPDATE ON public.zero_result_query FOR EACH ROW EXECUTE FUNCTION update_modified_column();
