'use client';

import { useState } from 'react';
import { resolveZeroResult } from '@/app/actions/resolveZeroResult';

interface ZeroResult {
  id: string;
  query_text: string;
  vertical_context: string;
  created_at: string;
}

interface Brand {
  id: string;
  brand_name: string;
  vertical_type: string;
}

interface Props {
  initialQueries: ZeroResult[];
  brands: Brand[];
}

export default function ClientInbox({ initialQueries, brands }: Props) {
  const [queries, setQueries] = useState<ZeroResult[]>(initialQueries);
  const [loadingId, setLoadingId] = useState<string | null>(null);
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, queryId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brandId = formData.get('brandId') as string;
    const questionText = formData.get('questionFormatted') as string;
    const answerText = formData.get('answerText') as string;

    if (!brandId || !questionText || !answerText) {
      alert('모든 필드를 입력해 주세요.');
      return;
    }

    setLoadingId(queryId);
    try {
      const res = await resolveZeroResult(queryId, brandId, questionText, answerText);
      if (res.success) {
        alert(res.message);
        // Remove from list
        setQueries(prev => prev.filter(q => q.id !== queryId));
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('발행 중 오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  if (queries.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-slate-400 font-medium">
        <span className="text-4xl mb-4">📭</span>
        <p className="text-lg">현재 밀려있는 고객 제보 질문이 없습니다.</p>
        <p className="text-sm mt-2">지식 허브가 완벽히 대응 중입니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex gap-2 mb-4">
        <span className="bg-blue-100 text-blue-800 text-xs font-bold px-3 py-1.5 rounded-full">
          대기 중인 발굴 카드: {queries.length}건
        </span>
      </div>

      {queries.map(q => (
        <div key={q.id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="flex justify-between items-start mb-6 pb-4 border-b border-gray-100">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 bg-amber-50 px-2.5 py-1 rounded mb-2 inline-block">
                Missing Query
              </span>
              <h3 className="text-xl font-bold text-gray-900 mt-1">"{q.query_text}"</h3>
              <p className="text-sm text-gray-400 mt-1">
                들어온 맥락: {q.vertical_context} | 접수 시각: {new Date(q.created_at).toLocaleString()}
              </p>
            </div>
          </div>

          <form onSubmit={(e) => handleSubmit(e, q.id)} className="bg-slate-50/50 p-5 rounded-xl border border-dashed border-slate-300">
            <h4 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
              <span className="text-blue-500">▶</span> 즉석에서 정식 Answer Card로 변환/발행하기
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">채택할 질문 포맷(수정가능)</label>
                  <input 
                    type="text" 
                    name="questionFormatted" 
                    defaultValue={q.query_text} 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                  />
               </div>
               <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1">편입시킬 브랜드(Tenant)</label>
                  <select 
                    name="brandId" 
                    className="w-full text-sm p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
                    required
                  >
                    <option value="">-- 브랜드를 선택하세요 --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>[{b.vertical_type}] {b.brand_name}</option>
                    ))}
                  </select>
               </div>
            </div>

            <div className="mb-5">
               <label className="block text-xs font-bold text-gray-500 mb-1">답변 본문 요약 (L0 팩트체크)</label>
               <textarea 
                  name="answerText" 
                  rows={3}
                  placeholder="고객의 질문에 대해 검증된 구체적인 정책/비용 답변을 입력하세요. Vibe 린트에 위배되지 않도록 주의하세요."
                  className="w-full text-sm p-3 border border-gray-300 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm resize-y"
                  required
               />
            </div>

            <div className="flex justify-end gap-3">
               <button 
                 type="submit" 
                 disabled={loadingId === q.id}
                 className="bg-slate-900 text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-black transition-colors shadow-sm disabled:opacity-50"
               >
                 {loadingId === q.id ? '발행 중...' : 'L0 퍼블릭으로 저장 및 발행'}
               </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}
