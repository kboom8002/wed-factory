-- data/migrations/20260328_09_create_deal_proposals.sql

CREATE TABLE public.deal_proposals (
    proposal_id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_envelope_id UUID REFERENCES public.bride_groom_envelope(envelope_id) ON DELETE CASCADE,
    brand_id UUID REFERENCES public.brand_registry(id) ON DELETE CASCADE,
    proposed_price INTEGER NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'pending', -- pending, accepted, rejected
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now() NOT NULL
);

CREATE TRIGGER update_deal_proposals_modtime BEFORE UPDATE ON public.deal_proposals FOR EACH ROW EXECUTE FUNCTION update_modified_column();

CREATE INDEX idx_deal_proposals_envelope ON public.deal_proposals(client_envelope_id);
CREATE INDEX idx_deal_proposals_brand ON public.deal_proposals(brand_id);
