import { AnswerCardProjection, HubAnswerCardData } from '@/hub/projections/AnswerCardProjection';
import { createClient } from '@/core/utils/supabase/server';
import { ZeroResultLogger } from '@/hub/projections/ZeroResultLogger';
import { ZeroResultForm } from './ZeroResultForm';

export default async function QuestionsHubPage() {
  const supabase = await createClient();

  // DB Fetch: 모든 'L0' (Public) Answer Card 및 연결된 Brand 정보 조인
  const { data, error } = await supabase
    .from('answer_card')
    .select(`
      question,
      short_answer,
      updated_at,
      visibility_level,
      reviewer_id,
      brand_registry (
        brand_slug,
        brand_name,
        vertical_type
      )
    `)
    .eq('visibility_level', 'L0')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('[QuestionsHub] Failed to fetch answer cards:', error);
  }

  // Type Casting
  const answers: HubAnswerCardData[] = (data || []).map((row: any) => ({
    question: row.question,
    short_answer: row.short_answer,
    updated_at: new Date(row.updated_at).toLocaleDateString(),
    visibility_level: row.visibility_level,
    reviewer_id: row.reviewer_id || 'System (DB)',
    brand_slug: row.brand_registry?.brand_slug || 'unknown',
    brand_name: row.brand_registry?.brand_name || '알 수 없음',
    vertical_type: row.brand_registry?.vertical_type || 'etc',
    reviewer_name: 'verified' // MVP fallback
  }));

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* 1. Hub Header */}
      <section className="w-full bg-blue-600 flex flex-col justify-center items-center text-white py-16 px-4 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-4 tracking-tight">웨딩 질문 허브</h1>
        <p className="text-lg md:text-xl text-blue-100 max-w-2xl font-medium">
          각 브랜드에서 검수된 공식 답변만 모았습니다.<br/>
          광고 없는 객관적인 정보로 믿고 검색하세요.
        </p>
      </section>

      {/* 2. Search Box MVP */}
      <section className="w-full max-w-4xl p-4 -mt-8 relative z-10">
        <div className="bg-white p-2 rounded-xl shadow-lg border border-gray-100 flex items-center">
          <span className="pl-4 text-2xl">🔍</span>
          <input 
            type="text" 
            placeholder="궁금한 정책이나 단어를 검색해 보세요 (예: 위약금, 드레스 추가)" 
            className="w-full px-4 py-3 outline-none text-gray-800"
          />
          <button className="bg-blue-600 text-white font-bold px-6 py-3 rounded-lg hover:bg-blue-700 transition">검색</button>
        </div>
      </section>

      {/* 3. Aggregated Answers Array */}
      <section className="w-full max-w-4xl p-4 md:p-8 space-y-6">
        <div className="flex justify-between items-end mb-2">
          <h2 className="text-xl font-bold text-gray-800">최근 업데이트된 공식 답변</h2>
          <span className="text-sm text-gray-500 font-medium">총 {answers.length}개</span>
        </div>
        
        {answers.length > 0 ? (
          answers.map((answer, i) => (
            <AnswerCardProjection key={i} data={answer} />
          ))
        ) : (
          <div className="text-center py-10 bg-white border border-gray-200 rounded-xl text-gray-500">
            현재 데이터베이스에 'L0' 공개 설정된 질문 자산이 없습니다.<br/> (Seed Data 주입 필요)
          </div>
        )}
      </section>
      
      {/* 4. Zero-Result Recovery Entry Point */}
      <section className="w-full max-w-4xl p-4 md:px-8 pb-16">
        <ZeroResultForm />
      </section>
    </main>
  );
}
