'use client';

import { useState } from 'react';
import { submitAnswerDraft } from '@/app/actions/vendorActions';
import { useRouter } from 'next/navigation';

export default function VendorAnswerCardNewPage({ params }: { params: { brandSlug: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg('');
    
    const formData = new FormData(e.currentTarget);
    const res = await submitAnswerDraft(params.brandSlug, formData);
    
    if (res.success) {
      setMsg('✅ 퍼블리싱 담당자에게 승인을 요청했습니다. (Draft 완료)');
      setTimeout(() => {
         router.push(`/vendor/${params.brandSlug}`);
      }, 1500);
    } else {
      setMsg(`❌ 저장 실패: ${res.error}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6 fade-in">
       <div className="mb-8">
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">QnA 컴포넌트(답변카드) 작성</h1>
          <p className="text-slate-500 font-medium text-sm">고객이 궁금해 할 핵심 정책/추가금/사실 관계를 솔직하게 답변하여 B-SSoT 화면에 띄우세요.</p>
       </div>

       {msg && (
         <div className={`p-4 rounded-xl font-bold border transition-all ${msg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg}
         </div>
       )}

       <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">고객이 묻고자 하는 실제 질문 (Q)</label>
            <input 
              name="question"
              required
              placeholder="예: 아이폰 스냅 촬영 시 반입 보조금이나 페널티가 있나요?"
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition shadow-sm"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-slate-700 mb-2">팩트체크 기반 공식 짧은 답변 (A)</label>
            <textarea 
              name="short_answer"
              required
              rows={4}
              placeholder="예: 네, 저희 스튜디오는 공식적으로 아이폰 스냅을 제한하지 않습니다. 다만 플래시 사용이나 동선 방해 시 현장에서..."
              className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition shadow-sm"
            />
            <p className="text-[11px] font-bold text-slate-400 mt-2 flex items-center gap-1">
               <span className="text-red-400 text-sm">🚨</span> 고객을 속이는 기만 행위나 과대 광고는 플랫폼 매니저의 필터에 의해 즉각 반려(Reject) 됩니다.
            </p>
          </div>

          <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
             <button type="button" onClick={() => router.back()} className="px-5 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
               돌아가기
             </button>
             <button type="submit" disabled={isSubmitting} className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2">
               {isSubmitting ? '전송 중...' : '검수 요청하기 (Submit Draft)'}
             </button>
          </div>
       </form>
    </div>
  );
}
