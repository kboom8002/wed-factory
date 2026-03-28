-- data/migrations/20260328_05_add_hero_bg_url.sql

-- 1. 새로운 컬럼 추가
ALTER TABLE public.brand_registry ADD COLUMN IF NOT EXISTS hero_bg_url TEXT;

-- 2. 기존 테넌트들에 멋진 B-SSoT 데모 시네마틱 이미지 기본값 꽂아주기
UPDATE public.brand_registry 
SET hero_bg_url = 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&q=80&w=1920'
WHERE brand_slug = 'urban-studio';

UPDATE public.brand_registry 
SET hero_bg_url = 'https://images.unsplash.com/photo-1566737236500-c8ac43014a67?auto=format&fit=crop&q=80&w=1920'
WHERE brand_slug = 'lumiere-dress';
