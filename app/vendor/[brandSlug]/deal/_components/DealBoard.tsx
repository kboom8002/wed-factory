'use client';

import React, { useState } from 'react';
import { EnvelopeData, ProposalEditor } from './ProposalEditor';

export function DealBoard({ 
  brandId, 
  allBriefs 
}: { 
  brandId: string;
  allBriefs: EnvelopeData[];
}) {
  const [selectedEnvelope, setSelectedEnvelope] = useState<EnvelopeData | null>(null);
  const [activeTab, setActiveTab] = useState<'inbox'|'sent'|'won'|'lost'>('inbox');

  const filteredBriefs = allBriefs.filter(b => b.crm_status === activeTab);

  const getTabLabel = (tab: string) => {
    switch(tab) {
      case 'inbox': return { text: '수신함 (Inbox)', emoji: '📬' };
      case 'sent': return { text: '제안 발송 (Sent)', emoji: '📤' };
      case 'won': return { text: '계약 성사 (Won)', emoji: '🎉' };
      case 'lost': return { text: '거절/취소 (Lost/Refund)', emoji: '❌' };
      default: return { text: tab, emoji: '' };
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 border-b border-indigo-100 pb-4 gap-6">
         <div>
            <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
               <span className="text-4xl">💼</span> Private Dealroom
            </h1>
            <p className="text-slate-500 font-medium mt-2">
               고객의 역경매 브리프를 검토하고 견적을 수주하세요. 환불(Refund) 및 취소 건도 여기서 관리됩니다.
            </p>
         </div>
      </div>

      {/* CRM Navigation Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 bg-white p-2 rounded-2xl shadow-sm border border-slate-100 w-fit">
        {['inbox', 'sent', 'won', 'lost'].map(tab => {
          const isActive = activeTab === tab;
          const count = allBriefs.filter(b => b.crm_status === tab).length;
          return (
            <button
              key={tab}
              onClick={() => setActiveTab(tab as any)}
              className={`px-5 py-2.5 rounded-xl font-bold text-sm flex items-center gap-2 transition-all ${isActive ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-200' : 'bg-transparent text-slate-500 hover:bg-slate-50'}`}
            >
              {getTabLabel(tab).emoji} {getTabLabel(tab).text}
              <span className={`px-2 py-0.5 rounded-md text-xs ${isActive ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'}`}>
                {count}
              </span>
            </button>
          )
        })}
      </div>

      {/* Board Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
         {filteredBriefs.length === 0 ? (
            <div className="col-span-full py-32 flex flex-col justify-center items-center bg-white border border-dashed border-slate-200 rounded-[2rem]">
               <span className="text-5xl opacity-40 mb-4 grayscale">{getTabLabel(activeTab).emoji}</span>
               <p className="text-slate-500 font-bold text-lg">해당 상태({getTabLabel(activeTab).text})의 딜건이 없습니다.</p>
            </div>
         ) : (
            filteredBriefs.map(brief => (
               <div key={brief.envelope_id} className={`bg-white border p-6 rounded-[2rem] shadow-sm transition-all flex flex-col justify-between ${
                 activeTab === 'inbox' ? 'hover:border-indigo-400 border-slate-200 hover:shadow-xl hover:-translate-y-1 cursor-pointer group' : 
                 activeTab === 'won' ? 'border-green-200 bg-green-50/20' : 
                 activeTab === 'lost' ? 'border-red-100 bg-red-50/20 opacity-70' :
                 'border-slate-200'
               }`} onClick={() => activeTab === 'inbox' ? setSelectedEnvelope(brief) : null}>
                  
                  <div className="flex justify-between items-start mb-4">
                     <span className={`font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded ${
                       activeTab === 'inbox' ? 'bg-rose-50 text-rose-600' :
                       activeTab === 'sent' ? 'bg-blue-50 text-blue-600' :
                       activeTab === 'won' ? 'bg-green-100 text-green-700' :
                       'bg-slate-100 text-slate-500'
                     }`}>
                       {activeTab === 'inbox' ? 'New Request' : activeTab === 'won' ? 'Deal Closed' : activeTab}
                     </span>
                     <span className="text-xs text-slate-400 font-bold">{new Date(brief.created_at).toLocaleDateString()}</span>
                  </div>

                  <div className="mb-6">
                     <div className="text-xs text-indigo-500 font-bold mb-1 line-clamp-1">{brief.combination_title || '지정 패키지 없음'}</div>
                     <h3 className="text-xl font-black text-slate-800 leading-tight mb-2">고객 예산: {brief.budget_band}</h3>
                     <p className="text-sm font-medium text-slate-500 bg-slate-50 p-2 rounded">
                        <strong className="text-slate-700">희망시기:</strong> {brief.schedule_window}
                     </p>
                  </div>

                  {activeTab === 'inbox' && (
                    <button className="w-full bg-slate-900 text-white font-bold py-3.5 rounded-xl group-hover:bg-indigo-600 transition-colors shadow-lg active:scale-95">
                       제안서(Proposal) 작성 가기 →
                    </button>
                  )}
                  {activeTab === 'won' && brief.proposal && (
                    <div className="w-full bg-green-100 text-green-800 font-bold py-3.5 rounded-xl text-center">
                       확정 거래액: {brief.proposal.proposed_price?.toLocaleString()}원
                    </div>
                  )}
                  {activeTab === 'sent' && brief.proposal && (
                    <div className="w-full bg-slate-100 text-slate-600 font-bold py-3.5 rounded-xl text-center">
                       고객 응답 대기중 (제안가: {brief.proposal.proposed_price?.toLocaleString()}원)
                    </div>
                  )}
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
