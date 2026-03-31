import { BrandRuntimeContext, VerticalType } from '../../runtime/brand-context';
import { createClient } from '@/core/utils/supabase/server';

export async function resolveBrandContext(slug: string, vertical?: VerticalType, locale?: string): Promise<BrandRuntimeContext | null> {
  const supabase = await createClient();
  
  const { data, error } = await supabase
    .from('brand_registry')
    .select('*')
    .eq('brand_slug', slug)
    .single();

  if (error || !data) {
    console.error(`[BrandResolution] Not found or error for slug: ${slug}`, error);
    return null;
  }

  // MVP Mock 단계 제거 및 DB Fetch 데이터 매핑
  const verticalMatch = data.vertical_type as VerticalType;
  let translatedBrandName = data.brand_name_ko || data.brand_name;

  if (locale && data.translations && data.translations[locale]) {
     if (data.translations[locale].brand_name) {
       translatedBrandName = data.translations[locale].brand_name;
     }
  }

  return {
    id: data.brand_id || data.id,
    brand_slug: data.brand_slug,
    brand_name: translatedBrandName,
    vertical_type: verticalMatch || vertical || 'studio',
    package_tier: data.package_tier || 'standard',
    
    // DB의 값이 없으면 기본 Fallback 제공 (MVP 테스트를 위해 vertical별로 다르게 분기)
    overlay_packs: data.overlay_pack_ids ? data.overlay_pack_ids.map((v: string) => ({overlay_id: v, overlay_type: 'IA'})) : [
      { overlay_id: 'default-ia', overlay_type: 'IA' },
      { overlay_id: 'default-design', overlay_type: 'Design' }
    ],
    vibe_spec_id: slug === 'urban-studio' ? 'cinematic-night' : (data.vibe_spec_id || (verticalMatch === 'studio' ? 'cinematic-night' : verticalMatch === 'dress' ? 'lovely-peach' : 'default-vibe-target')),
    surface_recipe_id: data.surface_recipe_id || `${verticalMatch}-home-v1`,
    hero_bg_url: data.hero_bg_url || null,
    
    locale: 'ko-KR',
    active_modules: data.active_modules || ['portfolio', 'questions', 'policies', 'inquiry'],
    
    disclosure_profile_id: 'default-public',
    conversion_tracking_enabled: true,
    zero_result_capture_enabled: true,
    
    // L0 Public 통제 변수: DB public_status 기준
    isPublic: data.public_status === 'published',
    sharedHubEligible: true
  };
}

export async function buildAccessContext(): Promise<import('../../runtime/brand-context').AccessRuntimeContext> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (user) {
    return {
      access_level: 'L1',
      viewer_role: 'verified_couple',
      verification_state: 'phone_verified',
      locale: 'ko-KR'
     }
  }

  return {
    access_level: 'L0',
    viewer_role: 'guest',
    verification_state: 'none',
    locale: 'ko-KR'
  };
}
