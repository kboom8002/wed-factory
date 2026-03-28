-- ==============================================================================
-- Migration: 04_create_user_profiles_rbac
-- Description: RBAC (Role-Based Access Control) 권한 제어 테이블 구축 및 L1/L2/L3 정의
-- ==============================================================================

-- 1. 플랫폼 권한 (RBAC) 프로필 테이블 생성
-- auth.users 테이블과 1:1 매핑되어 사용자의 '직위(Role)'와 '소속 브랜드'를 영구 귀속합니다.
CREATE TABLE IF NOT EXISTS user_profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email TEXT UNIQUE NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('super_admin', 'platform_admin', 'vendor', 'user')),
    
    -- L1: vendor(점주) 권한일 경우에만 작성되는 소속 브랜드 ID (타 브랜드 조작 봉쇄용)
    brand_id UUID REFERENCES brand_registry(brand_id) ON DELETE SET NULL,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. RLS(Row Level Security) 정책 씌우기
ALTER TABLE user_profiles ENABLE ROW LEVEL SECURITY;

-- Policy A: 어드민들은 모든 유저의 프로필(권한)을 볼 수 있다.
CREATE POLICY "Admins can view all profiles"
ON user_profiles
FOR SELECT
USING (
   EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'platform_admin')
   )
);

-- Policy B: 일반 벤더(Vendor)나 퍼블릭 유저는 자신의 프로필 권한만 확인 가능하다.
CREATE POLICY "Users can view own profile"
ON user_profiles
FOR SELECT
USING (id = auth.uid());

-- Policy C: 오직 L3(Super Admin)와 L2(Platform Admin) 만이 새로운 벤더 계정을 발급(생성)할 수 있다.
CREATE POLICY "Only admins can insert new profiles"
ON user_profiles
FOR INSERT
WITH CHECK (
   EXISTS (
      SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'platform_admin')
   )
);

-- 3. (Optional) 브랜드 소속 검증을 위한 RLS 함수 Helper
CREATE OR REPLACE FUNCTION is_admin() RETURNS BOOLEAN AS $$
BEGIN
  RETURN EXISTS (
    SELECT 1 FROM user_profiles WHERE id = auth.uid() AND role IN ('super_admin', 'platform_admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
