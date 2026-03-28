-- data/migrations/20260328_03_create_envelopes_and_portfolio.sql

-- 1. Portfolio Shot Table
CREATE TABLE public.portfolio_shot (
    shot_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    cdn_url VARCHAR(500) NOT NULL,
    mood_tags TEXT[],
    visibility_level visibility_level DEFAULT 'L0',
    sort_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE INDEX idx_portfolio_brand ON public.portfolio_shot(brand_id, visibility_level);

-- 2. BrideGroom (Couple) Envelope Table
-- 고객이 L0 허브에서 제출하는 Fit Brief (견적 및 무드 조건)
CREATE TABLE public.bride_groom_envelope (
    envelope_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID, -- MVP에서는 익명 처리를 위해 Null 허용
    target_combination_id UUID REFERENCES public.combination_type(combination_id) ON DELETE SET NULL,
    schedule_window VARCHAR(100) NOT NULL,
    budget_band VARCHAR(100) NOT NULL,
    priority_tags TEXT[],
    status VARCHAR(50) DEFAULT 'requested', -- requested -> matched
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 3. Vendor Envelope Table
-- 플랫폼 관리자가 매칭할 때 대상이 되는 공급자 패키지 정보
CREATE TABLE public.vendor_envelope (
    envelope_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    price_range_min INTEGER NOT NULL,
    price_range_max INTEGER NOT NULL,
    capacity_status VARCHAR(50) DEFAULT 'open',
    style_keywords TEXT[],
    valid_until TIMESTAMP WITH TIME ZONE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Triggers for updated_at
CREATE TRIGGER update_bride_groom_envelope_modtime BEFORE UPDATE ON public.bride_groom_envelope FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_vendor_envelope_modtime BEFORE UPDATE ON public.vendor_envelope FOR EACH ROW EXECUTE FUNCTION update_modified_column();
