-- data/migrations/20260328_08_add_custom_domain.sql

-- 1. brand_registry에 custom_domain 필드 추가
ALTER TABLE public.brand_registry
ADD COLUMN custom_domain VARCHAR(255) UNIQUE;

-- 2. Mock 데이터를 업데이트하여 도메인 라우팅 테스트 가능하게 설정
-- 예시: 스튜디오 어반을 'www.urban-studio.space'으로 연결 (로컬에선 X-Mock-Host로 테스트)
UPDATE public.brand_registry
SET custom_domain = 'urban-studio.local'
WHERE brand_slug = 'urban-studio';

UPDATE public.brand_registry
SET custom_domain = 'lumiere.local'
WHERE brand_slug = 'lumiere';
