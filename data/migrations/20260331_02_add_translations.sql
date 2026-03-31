-- Add translations JSONB column to answer_card
ALTER TABLE public.answer_card 
ADD COLUMN IF NOT EXISTS translations JSONB DEFAULT '{}'::jsonb;

COMMENT ON COLUMN public.answer_card.translations IS 'Store multi-lingual AI translations (e.g., {"en": "...", "ja": "..."})';
