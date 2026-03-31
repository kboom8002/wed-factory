'use client';

import { useActionState } from 'react';
import { submitZeroResult } from '@/app/actions/submitZeroResult';

export function ZeroResultForm() {
  const [state, formAction, isPending] = useActionState(submitZeroResult, { success: false, error: null });

  if (state.success) {
    return (
      <div className="bg-green-50/80 border border-green-200 rounded-xl p-8 text-center flex flex-col items-center w-full max-w-2xl mx-auto">
        <span className="text-3xl mb-3">✅</span>
        <h3 className="text-lg font-bold text-green-900 mb-2">질문 제보가 성공적으로 접수되었습니다.</h3>
        <p className="text-green-700 max-w-md">담당자가 내용 확인 후 관련 브랜드에 정책 확정을 요청하여 답변 카드로 발행하겠습니다.</p>
      </div>
    );
  }

  return (
    <form action={formAction} className="bg-gray-100 border border-gray-200 rounded-xl p-8 flex flex-col items-center w-full max-w-2xl mx-auto">
      <h3 className="text-lg font-bold text-gray-800 mb-2">궁금한 답변이 없으신가요?</h3>
      <p className="text-gray-600 mb-6 max-w-md text-center text-sm">
        찾으시는 정책이나 답변이 없다면 직접 질문을 남겨주세요.<br/>
        플랫폼 검수팀이 각 브랜드에 확인 후 48시간 내에 공식 답변 자산으로 등록해 드립니다.
      </p>
      
      <div className="w-full flex flex-col sm:flex-row gap-3">
        <input 
          type="hidden" 
          name="vertical_context" 
          value="hub" 
        />
        <input 
          type="text" 
          name="query_text" 
          required
          disabled={isPending}
          placeholder="예: 강아지 동반 촬영 시 추가금이 있나요?" 
          className="flex-1 px-4 py-3 rounded-lg border border-gray-300 outline-none focus:ring-2 focus:ring-blue-500 shadow-inner"
        />
        <button 
          type="submit" 
          disabled={isPending}
          className="bg-gray-900 text-white font-bold px-6 py-3 rounded-lg hover:bg-black transition shadow-md whitespace-nowrap disabled:opacity-50"
        >
          {isPending ? '전송중...' : '제보하기 (Zero-result Queue)'}
        </button>
      </div>

      {state.error && (
        <p className="text-red-600 text-sm font-bold mt-4 animate-bounce">{state.error}</p>
      )}
    </form>
  );
}
