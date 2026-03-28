-- data/migrations/20260328_05_schema_gap_refinement.sql

-- 1. bride_groom_envelope 확장
ALTER TABLE public.bride_groom_envelope
  ADD COLUMN wedding_time_window VARCHAR(100),
  ADD COLUMN style_mood_tags TEXT[],
  ADD COLUMN privacy_preference VARCHAR(50),
  ADD COLUMN budget_allocation_preference TEXT,
  ADD COLUMN photo_usage_purpose VARCHAR(100),
  ADD COLUMN original_retouch_sensitivity VARCHAR(50),
  ADD COLUMN exact_event_date DATE,
  ADD COLUMN legal_names VARCHAR(200),
  ADD COLUMN contact_info VARCHAR(200),
  ADD COLUMN visibility_level visibility_level DEFAULT 'L0';

-- 2. vendor_envelope 확장
ALTER TABLE public.vendor_envelope
  ADD COLUMN included_summary TEXT,
  ADD COLUMN not_fit_for TEXT[],
  ADD COLUMN policy_refs UUID[],
  ADD COLUMN vertical_type VARCHAR(50),
  ADD COLUMN vertical_spec JSONB,
  ADD COLUMN visibility_level visibility_level DEFAULT 'L0';

-- 3. portfolio_shot 확장
ALTER TABLE public.portfolio_shot
  ADD COLUMN caption TEXT,
  ADD COLUMN style_axes JSONB,
  ADD COLUMN fit_hint TEXT,
  ADD COLUMN related_question_ids UUID[],
  ADD COLUMN related_policy_ids UUID[];

-- 4. trust_evidence 분리
CREATE TABLE public.trust_evidence (
    evidence_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    target_type VARCHAR(50) NOT NULL,
    target_id UUID NOT NULL,
    evidence_url VARCHAR(500),
    masked_summary TEXT,
    reviewer_id UUID,
    status VARCHAR(50) DEFAULT 'verified',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 5. change_log 분리
CREATE TABLE public.change_log (
    log_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_name VARCHAR(100) NOT NULL,
    entity_id UUID NOT NULL,
    changes JSONB NOT NULL,
    visibility_level visibility_level DEFAULT 'L1',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 6. inquiry_template 추가
CREATE TABLE public.inquiry_template (
    template_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brand_id UUID REFERENCES public.brand_registry(brand_id) ON DELETE CASCADE,
    purpose_type VARCHAR(50) NOT NULL,
    required_inputs JSONB NOT NULL,
    draft_rules TEXT,
    cta_label VARCHAR(100),
    privacy_note TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

-- 7. Indexes
CREATE INDEX idx_inquiry_template_brand ON public.inquiry_template(brand_id);
CREATE INDEX idx_trust_evidence_target ON public.trust_evidence(target_type, target_id);
