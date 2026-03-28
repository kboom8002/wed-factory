'use client';

import React, { useState } from 'react';
import { demoteAnswerCard, requestEvidence } from '@/app/actions/trustQueueActions';

export function TrustActionButtons({ cardId }: { cardId: string }) {
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<'idle' | 'demoted'>('idle');

  const handleDemote = async () => {
    if (!confirm('이 질문을 즉시 소비자 화면에서 숨기시겠습니까? (L1 비공개 전환)')) return;
    
    setLoading(true);
    const res = await demoteAnswerCard(cardId);
    if(res.success) {
      setStatus('demoted');
    } else {
      alert(`오류: ${res.message}`);
    }
    setLoading(false);
  };

  const handleRequest = async () => {
    setLoading(true);
    const res = await requestEvidence(cardId);
    if(res.success) {
      alert(res.message);
    } else {
      alert(`오류: ${res.message}`);
    }
    setLoading(false);
  };

  if (status === 'demoted') {
    return (
       <div className="bg-red-50 text-red-600 font-bold text-xs px-3 py-2 rounded border border-red-100 text-center animate-pulse">
          🚨 직권 비공개 처리됨
       </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 w-full sm:w-auto">
      <button 
        onClick={handleDemote} 
        disabled={loading} 
        className="text-[11px] font-bold bg-white text-red-600 border border-red-200 px-4 py-2 rounded-lg shadow-sm hover:bg-red-50 transition min-w-[120px] disabled:opacity-50"
      >
        🚨 직권 비공개 (Demote)
      </button>
      <button 
        onClick={handleRequest} 
        disabled={loading} 
        className="text-[11px] font-bold bg-slate-900 text-white px-4 py-2 rounded-lg shadow-sm hover:bg-slate-800 transition min-w-[120px] disabled:opacity-50"
      >
        ✉️ 점주 증빙 재요청
      </button>
    </div>
  );
}
