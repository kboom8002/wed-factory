import { redirect } from 'next/navigation';
import { AnswerCardProjection, HubAnswerCardData } from '@/hub/projections/AnswerCardProjection';
import { ZeroResultLogger } from '@/hub/projections/ZeroResultLogger';

export default async function SearchPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>
}) {
  const { q } = await searchParams;

  if (!q) {
    redirect('/questions');
  }

  // MVP Mock Data: "no" 또는 "none"이 포함되면 Zero Result 로직 발동
  const isZeroResult = typeof q === 'string' && (q.toLowerCase().includes('no') || q.toLowerCase() === 'none');
  
  const MOCK_ANSWERS: HubAnswerCardData[] = isZeroResult ? [] : [
    {
      question: `${q} 관련 기본 포함 내역이 어떻게 되나요?`,
      short_answer: '해당 문의에 대한 공식 답변이 일부 등록되어 있습니다.',
      brand_slug: 'sample-studio',
      brand_name: '샘플 스튜디오',
      vertical_type: 'studio',
      updated_at: '2026.03.28',
      reviewer_name: '운영팀',
      visibility_level: 'L0'
    }
  ];

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center pb-20">
      {/* 1. Header */}
      <section className="w-full bg-blue-600 flex flex-col justify-center items-center text-white py-12 px-4 shadow-sm border-b-[6px] border-blue-500">
        <h1 className="text-3xl font-extrabold mb-3 tracking-tight">"{q}" 통합 검색</h1>
        <p className="text-blue-100 font-medium">단일 브랜드 검색이 아닌, 전체 L0 Public 자산에서 가장 관련성이 높은 질문을 찾습니다.</p>
      </section>

      {/* 2. Search Result & Zero Result Fallback */}
      <section className="w-full max-w-4xl p-4 md:p-8 mt-4">
        {MOCK_ANSWERS.length > 0 ? (
          <div className="space-y-6">
            <div className="text-gray-500 font-bold mb-4 bg-gray-100 px-4 py-2 rounded-lg inline-block text-sm border-l-4 border-gray-400">
              검색된 투명한 정책 답변: {MOCK_ANSWERS.length}개
            </div>
            {MOCK_ANSWERS.map((ans, i) => (
              <AnswerCardProjection key={i} data={ans} />
            ))}
          </div>
        ) : (
          <div className="mt-8">
             <ZeroResultLogger query={q} />
          </div>
        )}
      </section>
    </main>
  );
}
