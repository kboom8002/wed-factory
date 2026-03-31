-- data/migrations/20260331_01_add_hero_bg_and_storage.sql

-- 1. brand_registry 테이블에 백그라운드 이미지 URL 컬럼 추가
ALTER TABLE public.brand_registry ADD COLUMN IF NOT EXISTS hero_bg_url VARCHAR(500);

-- 2. 'brand_assets' Public Storage Bucket 생성 (존재하지 않을 경우)
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM storage.buckets WHERE id = 'brand_assets') THEN
    INSERT INTO storage.buckets (id, name, public) VALUES ('brand_assets', 'brand_assets', true);
  END IF;
END $$;

-- 3. 스토리지 RLS 정책 적용 (오직 brand_assets 버킷에만)
-- 기존 정책 초기화
DROP POLICY IF EXISTS "Brand Assets Public Select" ON storage.objects;
DROP POLICY IF EXISTS "Brand Assets Auth Insert" ON storage.objects;
DROP POLICY IF EXISTS "Brand Assets Auth Update" ON storage.objects;
DROP POLICY IF EXISTS "Brand Assets Auth Delete" ON storage.objects;

-- 정책 생성
CREATE POLICY "Brand Assets Public Select" 
  ON storage.objects FOR SELECT 
  USING (bucket_id = 'brand_assets');

CREATE POLICY "Brand Assets Auth Insert" 
  ON storage.objects FOR INSERT 
  WITH CHECK (bucket_id = 'brand_assets' AND auth.role() = 'authenticated');

CREATE POLICY "Brand Assets Auth Update" 
  ON storage.objects FOR UPDATE 
  USING (bucket_id = 'brand_assets' AND auth.role() = 'authenticated');
  
CREATE POLICY "Brand Assets Auth Delete" 
  ON storage.objects FOR DELETE 
  USING (bucket_id = 'brand_assets' AND auth.role() = 'authenticated');
