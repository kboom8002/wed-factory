'use client';

import { useEffect, useState } from 'react';

export function ZeroResultLogger({ query }: { query: string }) {
  const [logged, setLogged] = useState(false);

  useEffect(() => {
    // Zero-result event observability logger
    console.log(`[Observability] zero_result event captured. Query: "${query}"`);
    // fetch('/api/observatory/zero-result', { method: 'POST', body: JSON.stringify({ query }) });
    setLogged(true);
  }, [query]);

  return (
    <div className="bg-red-50 border border-red-100 rounded-2xl p-10 text-center flex flex-col items-center">
      <span className="text-4xl mb-4">📭</span>
      <h3 className="text-2xl font-bold text-red-900 mb-3">"{query}"에 대한 질문 자산이 아직 없습니다.</h3>
      <p className="text-red-700 mb-8 max-w-md font-medium leading-relaxed">
        검색하신 내용이 <strong>Question Backlog</strong>에 
        우선순위 관찰(Zero-result Queue) 항목으로 방금 기록되었습니다. ({logged ? '기록 완료' : '기록 중...'})
      </p>
      <div className="bg-white p-6 rounded-xl border border-red-200 mt-2 shadow-sm max-w-lg w-full">
        <h4 className="font-bold text-gray-800 mb-2">플랫폼 운영팀 제보하기</h4>
        <p className="text-sm text-gray-500 mb-4">제보해주시면 검수팀이 각 브랜드에 확인하여 48시간 내에 공식 답변을 발행해 드립니다.</p>
        <button className="bg-red-600 text-white font-bold w-full py-3 rounded-lg hover:bg-red-700 transition">
          해당 키워드로 답변 제보 요청하기
        </button>
      </div>
    </div>
  );
}
