-- data/migrations/20260328_01_create_brand_registry.sql

-- Enable UUID extension if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Enum Definitions
CREATE TYPE vertical_type AS ENUM ('studio', 'dress', 'makeup');
CREATE TYPE brand_status AS ENUM ('active', 'inactive', 'archived');
CREATE TYPE package_tier AS ENUM ('entry', 'standard', 'professional');
CREATE TYPE onboarding_stage AS ENUM ('lead', 'intake_accepted', 'source_ingested', 'structured_draft_ready', 'overlay_draft_ready', 'review_approved', 'published', 'managed');
CREATE TYPE public_status AS ENUM ('draft', 'review', 'published', 'unpublished');

-- Brand Registry Table
CREATE TABLE public.brand_registry (
    brand_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_slug VARCHAR(255) NOT NULL UNIQUE,
    brand_name_ko VARCHAR(255) NOT NULL,
    brand_name_en VARCHAR(255),
    vertical_type vertical_type NOT NULL,
    brand_status brand_status DEFAULT 'active',
    
    -- Commercial
    package_tier package_tier DEFAULT 'entry',
    billing_status VARCHAR(50) DEFAULT 'trial',
    onboarding_stage onboarding_stage DEFAULT 'lead',
    operator_owner UUID, -- References auth.users(id)
    
    -- Runtime configurations (Stored as JSONB for flexibility initially, or arrays)
    overlay_pack_ids UUID[],
    vibe_spec_id UUID,
    disclosure_profile_id UUID,
    surface_recipe_id VARCHAR(100),
    locale_set VARCHAR(5)[] DEFAULT ARRAY['ko-KR'],
    active_modules VARCHAR(100)[],
    
    -- Publishing
    public_status public_status DEFAULT 'draft',
    published_at TIMESTAMP WITH TIME ZONE,
    last_republished_at TIMESTAMP WITH TIME ZONE,
    shared_hub_eligibility BOOLEAN DEFAULT FALSE,
    
    -- Trust Metrics
    default_reviewer_set UUID[],
    evidence_completeness_score INTEGER DEFAULT 0,
    trust_completeness_score INTEGER DEFAULT 0,
    stale_risk_status VARCHAR(50) DEFAULT 'fresh',
    
    -- Observability Baseline
    question_count INTEGER DEFAULT 0,
    policy_count INTEGER DEFAULT 0,
    portfolio_count INTEGER DEFAULT 0,
    conversion_tracking_enabled BOOLEAN DEFAULT TRUE,
    zero_result_capture_enabled BOOLEAN DEFAULT TRUE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Indexes for performance
CREATE INDEX idx_brand_registry_slug ON public.brand_registry(brand_slug);
CREATE INDEX idx_brand_registry_vertical ON public.brand_registry(vertical_type);
CREATE INDEX idx_brand_registry_status ON public.brand_registry(public_status, brand_status);

-- Update timestamp trigger setup
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_brand_registry_modtime
BEFORE UPDATE ON public.brand_registry
FOR EACH ROW
EXECUTE FUNCTION update_modified_column();
