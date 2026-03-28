-- data/migrations/20260328_07_create_brand_health_view.sql

-- B-SSoT 데이터의 최신성(Stale)과 공시 의무(Disclosure)를 판별해주는 Observatory View

CREATE OR REPLACE VIEW public.v_brand_health_observatory AS
SELECT 
    b.brand_id,
    b.brand_name_ko AS brand_name,
    b.vertical_type,
    
    -- 1. [Stale Rule] 해당 브랜드의 (최근 L0 업데이트 시간) 계산
    (
        SELECT MAX(a.updated_at) 
        FROM public.answer_card a 
        WHERE a.brand_id = b.brand_id AND a.visibility_level = 'L0'
    ) AS last_answer_updated_at,
    
    -- 기준: 마지막 업데이트가 60일(테스트용 60일, 실무는 180일)이 넘으면 부패(Stale) 상태로 간주
    CASE 
        WHEN (SELECT MAX(a.updated_at) FROM public.answer_card a WHERE a.brand_id = b.brand_id AND a.visibility_level = 'L0') IS NULL THEN 'no_data'
        WHEN (SELECT MAX(a.updated_at) FROM public.answer_card a WHERE a.brand_id = b.brand_id AND a.visibility_level = 'L0') < NOW() - INTERVAL '60 days' THEN 'stale_warning'
        ELSE 'fresh'
    END AS stale_risk_status,
    
    -- 2. [Disclosure Rule] 필수 공개 정책('refund', 'retouch') 누락 검사
    (
        SELECT COALESCE(jsonb_agg(req), '[]'::jsonb)
        FROM unnest(ARRAY['refund', 'retouch']) req
        WHERE NOT EXISTS (
            SELECT 1 FROM public.policy_item p 
            WHERE p.brand_id = b.brand_id AND p.policy_family::text = req AND p.visibility_level = 'L0'
        )
    ) AS missing_mandatory_policies

FROM public.brand_registry b
WHERE b.public_status = 'published';
