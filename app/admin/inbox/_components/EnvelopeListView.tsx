'use client';

import React, { useState } from 'react';
import { updateEnvelopeStatus } from '@/app/actions/updateEnvelopeStatus';

export interface AdminEnvelopeData {
  envelope_id: string;
  legal_names: string;
  contact_info: string;
  schedule_window: string;
  budget_band: string;
  style_mood_tags: string[];
  status: string;
  created_at: string;
}

export function EnvelopeListView({ initialEnvelopes }: { initialEnvelopes: AdminEnvelopeData[] }) {
  const [envelopes, setEnvelopes] = useState<AdminEnvelopeData[]>(initialEnvelopes);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setLoadingId(id);
    const res = await updateEnvelopeStatus(id, newStatus);
    if (res.success) {
      setEnvelopes(prev => prev.map(env => env.envelope_id === id ? { ...env, status: newStatus } : env));
    } else {
      alert(res.error || 'Failed to update status');
    }
    setLoadingId(null);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'requested': return <span className="bg-blue-100 text-blue-700 font-bold px-2.5 py-1 text-[11px] rounded uppercase tracking-widest border border-blue-200">새 요청 (Requested)</span>;
      case 'reviewing': return <span className="bg-amber-100 text-amber-700 font-bold px-2.5 py-1 text-[11px] rounded uppercase tracking-widest border border-amber-200">검토 중 (Reviewing)</span>;
      case 'matched': return <span className="bg-emerald-100 text-emerald-700 font-bold px-2.5 py-1 text-[11px] rounded uppercase tracking-widest border border-emerald-200">견적 확정 (Matched)</span>;
      case 'rejected': return <span className="bg-red-100 text-red-700 font-bold px-2.5 py-1 text-[11px] rounded uppercase tracking-widest border border-red-200">거절 (Rejected)</span>;
      default: return <span className="bg-gray-100 text-gray-700 font-bold px-2.5 py-1 text-[11px] rounded uppercase border border-gray-200">{status}</span>;
    }
  };

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const bMap: Record<string, string> = {
      'under_100': '100만 원 미만',
      '100_to_150': '100~150만 원',
      '150_to_200': '150~200만 원',
      'over_200': '200만 원 이상'
  };

  if (envelopes.length === 0) {
     return (
       <div className="w-full h-64 bg-white border border-dashed border-gray-300 rounded-xl flex items-center justify-center flex-col shadow-sm">
          <span className="text-4xl text-gray-300 mb-2">📥</span>
          <p className="text-gray-500 font-bold">현재 쌓인 견적 요청 봉투가 없습니다.</p>
       </div>
     )
  }

  // Kanban or List UI. We will use a clean SaaS Table Card UI.
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
      {envelopes.map((env) => (
        <div 
          key={env.envelope_id} 
          className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden flex flex-col group hover:shadow-md transition-shadow"
        >
          {/* Header */}
          <div className="bg-gray-50/50 px-5 py-3 border-b border-gray-100 flex justify-between items-center">
             <div className="flex flex-col gap-0.5">
                <span className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-none">
                  ID: {env.envelope_id.split('-')[0]}
                </span>
                <span className="text-gray-900 font-black text-base">{env.legal_names || '익명 고객'}</span>
             </div>
             <div className="text-right flex flex-col items-end gap-1.5">
                {getStatusBadge(env.status)}
                <span className="text-gray-400 text-[10px] font-bold">{formatDate(env.created_at)}</span>
             </div>
          </div>

          {/* Body */}
          <div className="p-5 flex-1 flex flex-col gap-4 text-sm">
             <div className="grid grid-cols-2 gap-4">
                <div>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">예산 대역</p>
                   <p className="text-indigo-600 font-bold bg-indigo-50 inline-block px-2 py-0.5 rounded border border-indigo-100">
                     {bMap[env.budget_band] || env.budget_band}
                   </p>
                </div>
                <div>
                   <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">희망 시기</p>
                   <p className="text-gray-800 font-semibold">{env.schedule_window}</p>
                </div>
             </div>

             <div>
               <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-2">요청 화보 핏 (Mood)</p>
               <div className="flex flex-wrap gap-1.5">
                 {(env.style_mood_tags || []).map((tag, i) => (
                   <span key={i} className="text-[11px] font-bold text-gray-500 bg-gray-100 px-2 py-1 rounded-full border border-gray-200">
                     #{tag}
                   </span>
                 ))}
               </div>
             </div>

             <div className="mt-auto pt-4 border-t border-dashed border-gray-100">
                <p className="text-xs text-gray-400 font-bold uppercase tracking-wider mb-1">복호화된 연락처 (L2 권한)</p>
                <p className="text-gray-800 font-mono tracking-tight">{env.contact_info || '미기입'}</p>
             </div>
          </div>

          {/* Action Footer */}
          <div className="bg-slate-50 border-t border-gray-200 p-3 grid grid-cols-2 gap-2">
            {env.status === 'requested' ? (
              <button 
                onClick={() => handleStatusChange(env.envelope_id, 'reviewing')}
                disabled={loadingId === env.envelope_id}
                className="col-span-2 bg-amber-500 hover:bg-amber-600 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
              >
                검토 시작하기 (Reviewing 전환)
              </button>
            ) : env.status === 'reviewing' ? (
              <>
                <button 
                  onClick={() => handleStatusChange(env.envelope_id, 'matched')}
                  disabled={loadingId === env.envelope_id}
                  className="bg-emerald-500 hover:bg-emerald-600 text-white font-bold py-2 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  견적 확정 (Matched)
                </button>
                <button 
                  onClick={() => handleStatusChange(env.envelope_id, 'rejected')}
                  disabled={loadingId === env.envelope_id}
                  className="bg-white border border-red-200 text-red-600 hover:bg-red-50 font-bold py-2 rounded-lg text-sm transition-colors shadow-sm disabled:opacity-50"
                >
                  스케줄 불가 반려
                </button>
              </>
            ) : (
              <div className="col-span-2 text-center text-xs text-slate-400 font-bold py-2 uppercase tracking-widest">
                [ 상태 변경 종료됨 ]
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
