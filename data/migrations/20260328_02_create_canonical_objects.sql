-- data/migrations/20260328_02_create_canonical_objects.sql

-- Enums
CREATE TYPE visibility_level AS ENUM ('L0', 'L1', 'L2');
CREATE TYPE policy_family AS ENUM ('refund', 'change', 'schedule', 'original_delivery', 'retouch', 'select', 'fitting', 'helper', 'travel', 'rehearsal', 'family_support', 'language_support');

-- AnswerCard Table
CREATE TABLE public.answer_card (
    card_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    question TEXT NOT NULL,
    short_answer TEXT NOT NULL,
    full_answer TEXT,
    
    -- Relations
    related_policy_ids UUID[],
    related_combination_ids UUID[],
    related_portfolio_ids UUID[],
    
    -- Trust & Disclosure
    reviewer_id UUID, -- auth.users
    boundary_note VARCHAR(500),
    visibility_level visibility_level DEFAULT 'L0',
    cta_link VARCHAR(255),
    cta_label VARCHAR(50),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- PolicyItem Table
CREATE TABLE public.policy_item (
    policy_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    policy_family policy_family NOT NULL,
    summary VARCHAR(255) NOT NULL,
    detailed_rule TEXT,
    exceptions TEXT,
    risk_hint VARCHAR(255),
    
    -- Trust & Disclosure
    visibility_level visibility_level DEFAULT 'L0',
    reviewer_id UUID,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- PricingBand Table
CREATE TABLE public.pricing_band (
    band_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    band_label VARCHAR(100) NOT NULL,
    min_estimate INTEGER NOT NULL,
    max_estimate INTEGER,
    included_summary TEXT,
    excluded_summary TEXT,
    major_surcharge_axes VARCHAR(255)[],
    
    visibility_level visibility_level DEFAULT 'L0',
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- CombinationType Table
CREATE TABLE public.combination_type (
    combination_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    studio_type_summary TEXT,
    dress_type_summary TEXT,
    makeup_type_summary TEXT,
    
    best_for TEXT,
    not_fit_for TEXT,
    budget_strategy TEXT,
    regret_risks TEXT,
    
    follow_up_questions TEXT[],
    next_action_cta VARCHAR(255),
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- Common triggers and indexes
CREATE TRIGGER update_answer_card_modtime BEFORE UPDATE ON public.answer_card FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_policy_item_modtime BEFORE UPDATE ON public.policy_item FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_pricing_band_modtime BEFORE UPDATE ON public.pricing_band FOR EACH ROW EXECUTE FUNCTION update_modified_column();
CREATE TRIGGER update_combination_type_modtime BEFORE UPDATE ON public.combination_type FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE INDEX idx_answer_brand ON public.answer_card(brand_id, visibility_level);
CREATE INDEX idx_policy_brand ON public.policy_item(brand_id, policy_family);
