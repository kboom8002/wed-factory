-- Add Kakao Channel and Bank Account info for Deal Closing
ALTER TABLE public.brand_registry 
ADD COLUMN IF NOT EXISTS kakao_channel_url VARCHAR(255),
ADD COLUMN IF NOT EXISTS bank_account_info VARCHAR(255);

COMMENT ON COLUMN public.brand_registry.kakao_channel_url IS 'Kakao Chat URL for client communication after deal closed (e.g. pf.kakao.com/...)';
COMMENT ON COLUMN public.brand_registry.bank_account_info IS 'Bank details for initial deposit (e.g. KB 123-456-7890 웨딩팩토리)';

-- Seed mock data to Urban Studio & Lumina Dress
UPDATE public.brand_registry 
SET kakao_channel_url = 'http://pf.kakao.com/_sample',
    bank_account_info = '국민은행 123456-01-123456 (주)어반스튜디오'
WHERE brand_slug = 'urban-studio';

UPDATE public.brand_registry 
SET kakao_channel_url = 'http://pf.kakao.com/_lumina',
    bank_account_info = '신한은행 110-000-000000 최루미'
WHERE brand_slug = 'lumina-dress';
