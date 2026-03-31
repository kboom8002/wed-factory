-- data/migrations/20260401_01_add_global_translations.sql

-- 1. brand_registry 테이블에 다국어 필드 추가 (브랜드 이름 등을 지원)
ALTER TABLE public.brand_registry ADD COLUMN translations JSONB DEFAULT '{}'::jsonb;

-- 2. combination_type 테이블에 다국어 필드 추가 (핏 가이드용: 제목/상세)
ALTER TABLE public.combination_type ADD COLUMN translations JSONB DEFAULT '{}'::jsonb;

-- 3. policy_item 테이블에 다국어 필드 추가 (정책/위약금)
ALTER TABLE public.policy_item ADD COLUMN translations JSONB DEFAULT '{}'::jsonb;

-- (추가) review_evidence, deal_proposals 등은 시스템 내 파트너용과 관리자용으로 쓰이므로 우선 제외
