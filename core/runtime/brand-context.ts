export type VerticalType = 'studio' | 'dress' | 'makeup';
export type PackageTier = 'entry' | 'standard' | 'professional';
export type AccessLevel = 'L0' | 'L1' | 'L2';
export type Role = 'guest' | 'verified_couple' | 'deal_couple' | 'vendor' | 'admin' | 'reviewer';

export interface OverlayPackRef {
  overlay_id: string;
  overlay_type: 'IA' | 'Question' | 'Design' | 'VCO' | 'Disclosure' | 'KPI';
}

export interface BrandRuntimeContext {
  id: string; // uuid
  brand_slug: string;
  brand_name: string;
  vertical_type: VerticalType;
  package_tier: PackageTier;
  
  // Overlay & Design
  overlay_packs: OverlayPackRef[];
  vibe_spec_id: string | null;
  surface_recipe_id: string | null;
  hero_bg_url: string | null;
  
  // Scopes
  locale: string;
  active_modules: string[];
  
  // Core Platform features
  disclosure_profile_id: string | null;
  conversion_tracking_enabled: boolean;
  zero_result_capture_enabled: boolean;
  
  // Derived state (for performance)
  isPublic: boolean;
  sharedHubEligible: boolean;
}

export interface AccessRuntimeContext {
  access_level: AccessLevel;
  viewer_role: Role;
  verification_state: 'none' | 'phone_verified' | 'contract_verified';
  locale: string;
}

export interface SurfaceRuntimeContext {
  route_type: 'brand_home' | 'questions' | 'compare' | 'policy' | 'inquiry' | 'trust' | 'portfolio';
  projection_mode: 'public_summary' | 'verified_detail' | 'privileged_full';
  render_recipe_id: string;
  hub_or_brand_scope: 'brand' | 'hub';
}
