import React from 'react';

export interface EvidenceItem {
  evidence_id: string;
  target_type: string; // e.g. 'answer_card', 'policy_item', 'brand_registry'
  masked_summary: string;
  status: string; // 'verified', 'pending', 'rejected'
  reviewer_id?: string | null;
  created_at: string;
}

export function TrustEvidenceBoard({ evidences }: { evidences: EvidenceItem[] }) {
  if (!evidences || evidences.length === 0) {
    return (
      <div className="w-full p-8 text-center bg-gray-50 border border-dashed border-gray-200 rounded-xl">
        <p className="text-gray-500 font-medium tracking-tight">현재 공개된 인증 자산이 없습니다.</p>
      </div>
    );
  }

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {evidences.map((evItem) => (
        <div 
          key={evItem.evidence_id} 
          className="relative bg-white p-5 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between group hover:border-[var(--brand-primary)]/40 transition-colors"
        >
          {/* Status Badge */}
          <div className="absolute -top-3 left-4 flex gap-2">
            {evItem.status === 'verified' && (
              <span className="bg-emerald-500 text-white text-[10px] font-black tracking-widest px-2 py-0.5 rounded shadow-sm border border-emerald-600 uppercase flex items-center gap-1">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 13l4 4L19 7"></path></svg>
                VERIFIED
              </span>
            )}
            <span className="bg-slate-800 text-white text-[10px] uppercase font-bold px-2 py-0.5 rounded shadow-sm">
              {evItem.target_type.replace('_', ' ')}
            </span>
          </div>

          <div className="mt-3 pt-1 flex-1">
             <h4 className="font-bold text-gray-800 leading-snug mb-2 text-[15px] group-hover:text-[var(--brand-primary)] transition-colors">
               {evItem.masked_summary}
             </h4>
             <p className="text-xs text-gray-400 font-medium">관리자(Reviewer) 증빙 대조 필</p>
          </div>
          
          <div className="mt-4 pt-3 border-t border-dashed border-gray-100 flex justify-between items-center text-[10px] text-gray-400 uppercase tracking-widest font-semibold">
            <span>ID: {evItem.evidence_id.slice(0, 8)}</span>
            <span>Date: {formatDate(evItem.created_at)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
