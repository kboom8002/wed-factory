-- 20260401_replace_stock_images.sql
-- 깨지거나 부적절한 Unsplash 스톡 이미지를 자체 제작한 AI 정적 이미지 경로(/images/mock/...)로 업데이트하기 위한 패치 스크립트

DO $$
DECLARE
  v_studio_id UUID := 'aaaa0000-0000-0000-0000-000000000001';
  v_dress_id UUID := 'bbbb0000-0000-0000-0000-000000000002';
BEGIN
  -- Studio 이미지 패치
  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/studio-night.png'
  WHERE brand_id = v_studio_id AND '야간스냅' = ANY(mood_tags);

  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/studio-road.png'
  WHERE brand_id = v_studio_id AND '로드씬' = ANY(mood_tags);

  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/studio-indoor.png'
  WHERE brand_id = v_studio_id AND '실내스튜디오' = ANY(mood_tags);

  -- Dress 이미지 패치
  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/dress-bead.png'
  WHERE brand_id = v_dress_id AND '비즈드레스' = ANY(mood_tags);

  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/dress-silk.png'
  WHERE brand_id = v_dress_id AND '실크드레스' = ANY(mood_tags);

  UPDATE public.portfolio_shot
  SET cdn_url = '/images/mock/dress-outdoor.png'
  WHERE brand_id = v_dress_id AND '야외스냅용' = ANY(mood_tags);
END $$;
