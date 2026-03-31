'use client';

import React from 'react';

export interface TrustMetaProps {
  lastVerifiedAt: string;
  verifier: string;
  visibilityRule?: string;
  updateLogs?: number;
  hasProof?: boolean;
}

export function TrustMetaTag({ lastVerifiedAt, verifier, visibilityRule = 'L0 공개', updateLogs = 0, hasProof = false }: TrustMetaProps) {
  return (
    <div className="flex flex-wrap gap-2 text-[10px] font-bold mt-4 pt-3 border-t border-[var(--brand-text-muted)]/10">
      <span className="bg-[var(--brand-bg)] border border-[var(--brand-text-muted)]/20 text-[var(--brand-text-muted)] px-2 py-1 rounded shadow-sm flex items-center gap-1">
        <span className="text-[11px] opacity-80">✅</span> {verifier} 검증완료 <span className="opacity-50">({lastVerifiedAt})</span>
      </span>
      {visibilityRule && (
        <span className="bg-slate-100 border border-slate-200 text-slate-500 px-2 py-1 rounded shadow-sm flex items-center">
          {visibilityRule}
        </span>
      )}
      {updateLogs > 0 && (
         <span className="bg-amber-50 border border-amber-200 text-amber-700 px-2 py-1 rounded shadow-sm flex items-center gap-1">
            <span>🔄</span> 수정이력 {updateLogs}건
         </span>
      )}
      {hasProof && (
         <span className="bg-blue-50 border border-blue-200 text-blue-700 px-2 py-1 rounded shadow-sm flex items-center gap-1">
            <span>📎</span> 증빙 첨부됨
         </span>
      )}
    </div>
  );
}
