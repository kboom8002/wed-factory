import { NextResponse } from 'next/server';
import { projectAnswerCard, RawAnswerCard } from '@/core/engines/projection';
import { createClient } from '@/core/utils/supabase/server';

export async function GET() {
  const supabase = await createClient();
  
  // L2 억제 원칙: 무조건 public_status === 'published' 인 검증된 답변만 외부 Agent에 피드로 제공
  const { data: rawCards, error } = await supabase
    .from('answer_card')
    .select('*')
    .eq('public_status', 'published');

  if (error || !rawCards) {
    console.error('Failed to fetch AnswerCards for AEO Feed:', error);
    return NextResponse.json({ _meta: { error: 'Fetch failed' }, data: [] }, { status: 500 });
  }

  // JSON-LD Surface를 타겟으로 프로젝션 실행
  const jsonLdFeed = (rawCards as RawAnswerCard[])
    .map(item => projectAnswerCard(item, 'faq_json_ld', 'L0'))
    .filter(item => item !== null);

  return NextResponse.json({
    _meta: {
      generated_at: new Date().toISOString(),
      platform: "Wedding Factory Brain",
      description: "L0-verified Answer Feed for Generative AI (AEO) and External Crawlers.",
      total_items: jsonLdFeed.length
    },
    data: jsonLdFeed
  }, {
    headers: {
      'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=86400',
    }
  });
}
