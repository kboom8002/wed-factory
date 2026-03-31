'use client';

import React, { useState } from 'react';
import { savePolicyDraft } from '@/app/actions/vendorActions';

type PolicyData = {
  policy_id?: string;
  policy_family?: string;
  title?: string;
  summary?: string;
  exceptions?: string[] | null;
  risk_hint?: string;
  is_fact_checked?: boolean;
};

export function PolicyEditor({ 
  brandId, 
  brandSlug,
  initialData, 
  onClose 
}: { 
  brandId: string;
  brandSlug: string;
  initialData?: PolicyData;
  onClose?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  // Manage exceptions as a newline-separated string for simplicity in textarea
  const defaultExceptions = initialData?.exceptions 
     ? (Array.isArray(initialData.exceptions) ? initialData.exceptions.join('\n') : initialData.exceptions)
     : '';

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await savePolicyDraft(brandId, brandSlug, formData);
    setIsPending(false);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border-2 border-slate-200 rounded-3xl shadow-xl overflow-hidden my-6">
       <div className="bg-slate-50 px-8 py-5 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-sm font-black text-slate-800 tracking-wider uppercase">
             {initialData?.policy_id ? '🛡️ 정책 세부 조항 편집' : '🛡️ 새 정책 조항 설계'}
          </h3>
          {onClose && (
            <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-800 transition font-bold p-1">✕</button>
          )}
       </div>
       
       <div className="p-8 space-y-8">
          <input type="hidden" name="policy_id" value={initialData?.policy_id || ''} />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
             <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">Policy Family (카테고리)</label>
                <select name="policy_family" required defaultValue={initialData?.policy_family || 'refund'} className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-700 bg-white focus:outline-none focus:border-slate-800 transition-all">
                   <option value="refund">환불 및 위약금</option>
                   <option value="surcharge">피팅 및 추가 부대비용</option>
                   <option value="product">제작 및 배송(수령) 조건</option>
                   <option value="schedule">스케줄 변경 패널티</option>
                   <option value="others">기타 예약 조건</option>
                </select>
             </div>
             <div>
                <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">정책 명칭 (Title)</label>
                <input type="text" name="title" required defaultValue={initialData?.title} placeholder="예: 지정 작가 변경 패널티" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300" />
             </div>
          </div>

          <div>
             <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">정책 핵심 내용 (요약)</label>
             <textarea name="summary" required defaultValue={initialData?.summary} rows={3} placeholder="고객에게 명확하게 고지할 정책의 주요 내용을 적어주세요." className="w-full border-2 border-slate-200 rounded-xl px-4 py-4 text-sm font-bold text-slate-800 bg-slate-50 focus:outline-none focus:bg-white focus:border-slate-800 transition-all placeholder:font-medium placeholder:text-slate-300 resize-none"></textarea>
          </div>

          <div className="bg-red-50/50 p-6 rounded-2xl border border-red-100">
             <label className="block text-xs font-black text-red-500 uppercase tracking-widest mb-3 flex items-center gap-2">
                <span>⚠️ 예외 사항 (Exceptions)</span>
                <span className="text-[10px] bg-red-100 text-red-600 px-2 py-0.5 rounded-sm font-bold">엔터(줄바꿈)로 구분합니다</span>
             </label>
             <textarea name="exceptions" defaultValue={defaultExceptions} rows={3} placeholder="본 정책이 적용되지 않는 예외 상황을 열거해 주세요. (예: 우천 시 위약금 없음)" className="w-full border-2 border-red-200/50 rounded-xl px-4 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-red-400 transition-all placeholder:text-slate-300 resize-none"></textarea>
          </div>

          <div>
             <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3 flex justify-between">
                <span>Risk Hint (내부 참고용/고객 경고용)</span>
                <span className="text-[10px] bg-slate-100 px-2 rounded-sm font-semibold">선택</span>
             </label>
             <input type="text" name="risk_hint" defaultValue={initialData?.risk_hint} placeholder="예: 무단 지각 30분 초과 시 노쇼 간주" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-medium text-slate-600 focus:outline-none focus:border-slate-800 transition-all placeholder:text-slate-300" />
          </div>
          
          {/* 증빙서류 업로드 목업 UI - Phase 6 태스크 4번 요소 */}
          <div className="mt-8 border-t border-slate-100 pt-8">
             <p className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-3">📄 공식 약관 / 계약서 캡처 첨부 (선택)</p>
             <div className="bg-slate-50 border-2 border-slate-200 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-slate-100 transition-colors">
                <span className="text-2xl">📸</span>
                <span className="text-sm font-bold text-slate-600">파일을 드래그하거나 클릭하여 업로드</span>
                <span className="text-xs text-slate-400 font-medium tracking-tight">JPG, PNG (최대 5MB) - <strong>현재 목업 단계</strong></span>
             </div>
          </div>
       </div>

       <div className="bg-slate-50 px-8 py-5 border-t border-slate-200 flex justify-end gap-3 items-center">
          {initialData?.is_fact_checked && (
             <span className="text-xs font-bold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-lg mr-auto">
               ✅ 현재 Admin 검증 통과 (Live) 상태입니다. 수정 시 재검증을 받게 됩니다.
             </span>
          )}
          <button type="submit" disabled={isPending} className="bg-slate-800 hover:bg-slate-900 text-white font-bold text-sm px-8 py-3 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-70">
             {isPending ? '설계 중...' : '해당 약관/정책 저장하기'}
          </button>
       </div>
    </form>
  );
}
