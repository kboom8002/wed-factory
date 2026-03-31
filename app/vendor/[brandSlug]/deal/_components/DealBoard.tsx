'use client';

import React, { useState } from 'react';
import { EnvelopeData, ProposalEditor } from './ProposalEditor';

export function DealBoard({ 
  brandId, 
  pendingBriefs 
}: { 
  brandId: string;
  pendingBriefs: EnvelopeData[];
}) {
  const [selectedEnvelope, setSelectedEnvelope] = useState<EnvelopeData | null>(null);

  return (
    <div className="w-full">
      <div className="flex justify-between items-end mb-8 border-b border-indigo-100 pb-4">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <span className="text-4xl">💼</span> Private Dealroom
            </h1>
            <p className="text-slate-500 font-medium mt-2">
               고객이 남긴 맞춤 견적 브리프에 응답하여 최종 가격(Price Guarantee)과 일정을 제안하세요.
            </p>
         </div>
         <div className="bg-indigo-50 text-indigo-600 px-4 py-2 flex items-center gap-2 rounded-xl font-bold shadow-inner">
            <span>대기 중인 요청</span>
            <span className="bg-indigo-600 text-white rounded-lg px-2 text-sm">{pendingBriefs.length}건</span>
         </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {pendingBriefs.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col justify-center items-center bg-white border border-dashed border-slate-200 rounded-[2rem]">
               <span className="text-5xl opacity-40 mb-4 grayscale">📮</span>
               <p className="text-slate-500 font-bold text-lg">새로 들어온 견적 요청(Brief)이 없습니다.</p>
               <p className="text-slate-400 text-sm mt-1">포트폴리오나 QnA를 업데이트하여 노출도를 높여보세요.</p>
            </div>
         ) : (
            pendingBriefs.map(brief => (
               <div key={brief.envelope_id} className="bg-white border hover:border-indigo-400 border-slate-200 p-6 rounded-[2rem] shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all group flex flex-col justify-between cursor-pointer" onClick={() => setSelectedEnvelope(brief)}>
                  
                  <div className="flex justify-between items-start mb-4">
                     <span className="bg-rose-50 text-rose-600 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded">New Request</span>
                     <span className="text-xs text-slate-400 font-bold">{new Date(brief.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-6">
                     <div className="text-xs text-indigo-500 font-bold mb-1 line-clamp-1">{brief.combination_title || '지정 패키지 없음'}</div>
                     <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">Budget: {brief.budget_band}</h3>
                     <p className="text-sm font-medium text-slate-500 bg-slate-50 p-2 rounded">
                        <strong className="text-slate-700">희망시기:</strong> {brief.schedule_window}
                     </p>
                  </div>

                  <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl group-hover:bg-indigo-600 transition-colors shadow-lg active:scale-95">
                     제안서(Proposal) 작성 가기 →
                  </button>
               </div>
            ))
         )}
      </div>

      {selectedEnvelope && (
         <ProposalEditor 
            envelope={selectedEnvelope} 
            brandId={brandId}
            onClose={() => setSelectedEnvelope(null)} 
         />
      )}
    </div>
  );
}
