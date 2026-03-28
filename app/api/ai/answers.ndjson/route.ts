import { createClient } from '@/core/utils/supabase/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = await createClient();

  const { data: answers, error } = await supabase
    .from('answer_card')
    .select(`
      card_id, question, short_answer, updated_at, boundary_note, reviewer_id,
      brand:brand_id (brand_id, brand_slug, brand_name_ko, vertical_type)
    `)
    .eq('visibility_level', 'L0');

  if (error || !answers) {
    // Return standard error json
    return new Response(JSON.stringify({ error: 'Failed to fetch answers' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  // AEO Feed 규격에 맞는 형식으로 평탄화 (Flatten) 및 JSON 문자열화
  const lines = answers.map(ans => {
    // 외래키 관계로 불러온 brand 객체 (Supabase-JS의 경우 단일 객체나 배열로 떨어질 수 있음)
    const brand = Array.isArray(ans.brand) ? ans.brand[0] : ans.brand;
    const bName = brand?.brand_name_ko || '무명브랜드';
    const bSlug = brand?.brand_slug || 'unknown';
    const vType = brand?.vertical_type || 'studio';
    
    return JSON.stringify({
      canonical_id: ans.card_id,
      object_type: 'answer_card',
      title: ans.question,
      short_answer: ans.short_answer,
      public_summary: ans.short_answer, // fallback
      reviewer: ans.reviewer_id || 'System_Operator',
      updated_at: ans.updated_at,
      boundary_note: ans.boundary_note || null,
      canonical_url: `https://factory.com/${vType}/${bSlug}`,
      brand_name: bName,
      visibility_level: 'L0'
    });
  });

  const ndjsonResult = lines.join('\n');

  // 오픈데이터를 위해 누구나 조회 가능한 CORS 헤더 추가
  return new Response(ndjsonResult, {
    headers: {
      'Content-Type': 'application/x-ndjson; charset=utf-8',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
