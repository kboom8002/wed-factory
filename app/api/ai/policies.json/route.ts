import { createClient } from '@/core/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();

  const { data: policies, error } = await supabase
    .from('policy_item')
    .select(`
      policy_id, policy_family, summary, detailed_rule, exceptions, updated_at,
      brand:brand_id (brand_id, brand_slug, brand_name_ko, vertical_type)
    `)
    .eq('visibility_level', 'L0');

  if (error || !policies) {
    return new Response(JSON.stringify({ error: 'Failed to fetch policies' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // AI 엔진을 위해 친절한 JSON 배열로 변환
  const policyFeed = policies.map(pol => {
    const brand = Array.isArray(pol.brand) ? pol.brand[0] : pol.brand;
    const bName = brand?.brand_name_ko || '무명브랜드';
    const bSlug = brand?.brand_slug || 'unknown';
    const vType = brand?.vertical_type || 'studio';
    
    return {
      canonical_id: pol.policy_id,
      object_type: 'policy_item',
      policy_family: pol.policy_family,
      title: `${bName} ${pol.policy_family} 정책`,
      public_summary: pol.summary,
      exceptions: pol.exceptions || '예외사항 없음',
      updated_at: pol.updated_at,
      canonical_url: `https://factory.com/${vType}/${bSlug}/policies`,
      brand_name: bName,
    };
  });

  return new Response(JSON.stringify(policyFeed, null, 2), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
