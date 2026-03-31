'use client';

import React, { useState } from 'react';
import { approveAnswerCard, rejectAnswerCard, approvePolicyItem, rejectPolicyItem } from '@/app/actions/adminFactcheckActions';
import { useRouter } from 'next/navigation';

type AnswerPayload = {
  card_id: string;
  brand_name: string;
  question: string;
  short_answer: string;
  boundary_note: string | null;
  updated_at: string;
};

type PolicyPayload = {
  policy_id: string;
  brand_name: string;
  policy_family: string;
  title: string;
  summary: string;
  exceptions: string[] | null;
  risk_hint: string | null;
  updated_at: string;
};

export function FactcheckBoard({ 
  pendingAnswers, 
  pendingPolicies 
}: { 
  pendingAnswers: AnswerPayload[];
  pendingPolicies: PolicyPayload[];
}) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'answers' | 'policies'>('answers');
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleAction = async (id: string, type: 'answers' | 'policies', action: 'approve' | 'reject') => {
    setProcessingId(id);
    try {
      if (type === 'answers') {
        if (action === 'approve') await approveAnswerCard(id);
        else await rejectAnswerCard(id);
      } else {
        if (action === 'approve') await approvePolicyItem(id);
        else await rejectPolicyItem(id);
      }
      // Assuming Server Actions calls revalidatePath, which mostly works, but router.refresh() forces immediate client update here
      router.refresh();
    } catch (e) {
      console.error(e);
      alert('오류가 발생했습니다.');
    } finally {
      setProcessingId(null);
    }
  };

  return (
    <div className="w-full">
       
       {/* Custom Tabs */}
       <div className="flex gap-4 mb-6">
          <button 
            onClick={() => setActiveTab('answers')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm tracking-tight transition-all flex items-center gap-2 ${
              activeTab === 'answers' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
             💬 QnA 검수 대기열
             <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'answers' ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>
                {pendingAnswers.length}
             </span>
          </button>
          <button 
            onClick={() => setActiveTab('policies')}
            className={`px-6 py-3 rounded-2xl font-bold text-sm tracking-tight transition-all flex items-center gap-2 ${
              activeTab === 'policies' ? 'bg-indigo-600 text-white shadow-md' : 'bg-white text-slate-500 hover:bg-slate-50 border border-slate-200'
            }`}
          >
             🛡️ 정책(위약금 등) 검수 대기열
             <span className={`px-2 py-0.5 rounded-full text-[10px] ${activeTab === 'policies' ? 'bg-indigo-500 text-white' : 'bg-slate-100'}`}>
                {pendingPolicies.length}
             </span>
          </button>
       </div>

       {/* Panel Content */}
       <div className="bg-white border text-left border-slate-200 rounded-[2rem] shadow-sm p-8 min-h-[500px]">
          {activeTab === 'answers' && (
             <div className="space-y-6">
                {pendingAnswers.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                      <span className="text-4xl mb-4 grayscale opacity-50">✨</span>
                      <p className="font-bold">심사 대기 중인 벤더의 답변이 없습니다.</p>
                   </div>
                ) : (
                   pendingAnswers.map((ans) => (
                      <div key={ans.card_id} className="border-2 border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start group hover:border-indigo-100 transition-colors bg-slate-50/30">
                         <div className="flex-1">
                            <span className="text-xs font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded inline-block mb-3 tracking-widest">
                               {ans.brand_name}
                            </span>
                            <h3 className="text-lg font-black text-slate-800 mb-2 leading-tight">Q. {ans.question}</h3>
                            <div className="bg-white border border-slate-200 p-4 rounded-xl shadow-sm">
                               <p className="text-sm font-bold text-slate-600 mb-2"><span className="text-indigo-500 mr-2">A. (핵심)</span> {ans.short_answer}</p>
                               {ans.boundary_note && (
                                  <p className="text-xs font-medium text-slate-400 mt-2 bg-slate-50 p-2 rounded"><strong className="text-amber-500">예외조항:</strong> {ans.boundary_note}</p>
                               )}
                            </div>
                         </div>
                         <div className="shrink-0 flex flex-col md:flex-row gap-2 mt-4 md:mt-0">
                            <button 
                               onClick={() => handleAction(ans.card_id, 'answers', 'reject')}
                               disabled={processingId === ans.card_id}
                               className="px-6 py-2.5 rounded-xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 transition whitespace-nowrap disabled:opacity-50"
                            >
                               반려 (Draft 변환)
                            </button>
                            <button 
                               onClick={() => handleAction(ans.card_id, 'answers', 'approve')}
                               disabled={processingId === ans.card_id}
                               className="px-6 py-2.5 rounded-xl font-bold text-sm bg-indigo-600 text-white shadow hover:bg-indigo-700 transition whitespace-nowrap disabled:opacity-50 flex items-center gap-1"
                            >
                               승인 (L0 노출) 🚀
                            </button>
                         </div>
                      </div>
                   ))
                )}
             </div>
          )}

          {activeTab === 'policies' && (
             <div className="space-y-6">
                {pendingPolicies.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-24 text-slate-400">
                      <span className="text-4xl mb-4 grayscale opacity-50">✨</span>
                      <p className="font-bold">심사 대기 중인 벤더의 정책(위약금 등) 룰이 없습니다.</p>
                   </div>
                ) : (
                   pendingPolicies.map((pol) => (
                      <div key={pol.policy_id} className="border-2 border-slate-100 p-6 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-start group hover:border-indigo-100 transition-colors bg-slate-50/30">
                         <div className="flex-1 w-full">
                            <div className="flex gap-2 items-center mb-3">
                               <span className="text-xs font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-1 rounded tracking-widest">
                                  {pol.brand_name}
                               </span>
                               <span className="text-[10px] font-bold uppercase text-slate-400 border border-slate-200 px-2 py-0.5 rounded tracking-widest">
                                  {pol.policy_family}
                               </span>
                            </div>
                            <h3 className="text-xl font-black text-slate-800 mb-3 tracking-tight">{pol.title}</h3>
                            <div className="bg-white border border-slate-200 p-5 rounded-xl shadow-sm space-y-3">
                               <p className="text-sm font-semibold text-slate-700 leading-relaxed">{pol.summary}</p>
                               {pol.exceptions && pol.exceptions.length > 0 && (
                                  <div className="text-xs font-medium text-slate-500 bg-red-50/30 px-3 py-2 border border-red-50 rounded">
                                     <strong className="text-red-500 block mb-1">⚠️ 주의해야 할 예외사항</strong>
                                     <ul className="list-disc list-inside">
                                        {pol.exceptions.map((ex, i) => <li key={i}>{ex}</li>)}
                                     </ul>
                                  </div>
                               )}
                               {pol.risk_hint && (
                                  <div className="text-xs font-medium text-amber-700 bg-amber-50 p-2 rounded">
                                     <strong className="text-amber-800 uppercase tracking-widest text-[10px]">Factcheck Hint:</strong> {pol.risk_hint}
                                  </div>
                               )}
                            </div>
                         </div>
                         <div className="shrink-0 flex flex-col md:flex-row gap-2 mt-4 md:mt-0 w-full md:w-auto">
                            <button 
                               onClick={() => handleAction(pol.policy_id, 'policies', 'reject')}
                               disabled={processingId === pol.policy_id}
                               className="px-6 py-2.5 rounded-xl font-bold text-sm bg-rose-50 text-rose-600 hover:bg-rose-100 transition disabled:opacity-50"
                            >
                               반려 (삭제됨)
                            </button>
                            <button 
                               onClick={() => handleAction(pol.policy_id, 'policies', 'approve')}
                               disabled={processingId === pol.policy_id}
                               className="px-6 py-2.5 rounded-xl font-bold text-sm bg-slate-900 text-white shadow-xl hover:bg-black transition disabled:opacity-50 flex items-center justify-center gap-1"
                            >
                               규정 승인 📜
                            </button>
                         </div>
                      </div>
                   ))
                )}
             </div>
          )}
       </div>
    </div>
  );
}
