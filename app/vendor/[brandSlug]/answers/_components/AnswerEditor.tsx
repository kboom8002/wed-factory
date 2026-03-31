'use client';

import React, { useState } from 'react';
import { saveAnswerDraft } from '@/app/actions/vendorActions';

type AnswerData = {
  answer_id?: string;
  question?: string;
  short_answer?: string;
  boundary_note?: string;
  public_status?: string;
};

export function AnswerEditor({ 
  brandId, 
  brandSlug,
  initialData, 
  onClose 
}: { 
  brandId: string;
  brandSlug: string;
  initialData?: AnswerData;
  onClose?: () => void;
}) {
  const [isPending, setIsPending] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const formData = new FormData(e.currentTarget);
    await saveAnswerDraft(brandId, brandSlug, formData);
    setIsPending(false);
    if (onClose) onClose();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-indigo-200 rounded-2xl shadow-xl overflow-hidden my-4">
       <div className="bg-indigo-50/50 px-6 py-4 border-b border-indigo-100 flex justify-between items-center">
          <h3 className="text-sm font-black text-indigo-900 tracking-tight">
             {initialData?.answer_id ? '✏️ 공식 답변 수정 (초안)' : '✨ 새 답변 카드 드래프트 작성'}
          </h3>
          {onClose && (
            <button type="button" onClick={onClose} className="text-indigo-400 hover:text-indigo-600 font-bold p-1">✕</button>
          )}
       </div>
       
       <div className="p-6 space-y-6">
          <input type="hidden" name="answer_id" value={initialData?.answer_id || ''} />

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">공식 질문 (Q)</label>
             <input type="text" name="question" required defaultValue={initialData?.question} placeholder="예: 추가금 없이 진행되는 컷은 몇 장인가요?" className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-900 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:font-medium placeholder:text-slate-300" />
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2">핵심 답변 (한 줄 요약)</label>
             <input type="text" name="short_answer" required defaultValue={initialData?.short_answer} placeholder="예: 기본 패키지 당 20장의 정밀 보정본이 무료 제공됩니다." className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-indigo-700 bg-indigo-50/30 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:font-medium placeholder:text-slate-300" />
          </div>

          <div>
             <label className="block text-xs font-bold text-slate-500 uppercase tracking-widest mb-2 flex justify-between">
                <span>예외 및 바운더리 조건 (Boundary Note)</span>
                <span className="text-[10px] bg-slate-100 px-2 rounded-sm font-semibold">선택</span>
             </label>
             <textarea name="boundary_note" defaultValue={initialData?.boundary_note} rows={3} placeholder="고객이 오해할 수 있는 부분이나 예외 조항을 남겨주세요." className="w-full border-2 border-slate-200 rounded-xl px-4 py-3 text-sm font-bold text-slate-600 focus:outline-none focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100 transition-all placeholder:font-medium placeholder:text-slate-300 resize-none"></textarea>
          </div>

          {/* 증빙서류 목업 영역 */}
          <div className="bg-slate-50 border border-slate-200 border-dashed rounded-xl p-4 flex items-center justify-between">
             <div>
                <span className="text-xs font-bold text-slate-700 block mb-0.5">증빙 스크린샷 첨부 (선택)</span>
                <span className="text-[10px] text-slate-500 font-medium tracking-tight">상담톡 캡처본 등</span>
             </div>
             <button type="button" className="text-xs font-bold bg-white border border-slate-200 px-3 py-1.5 rounded-lg shadow-sm text-slate-600 cursor-not-allowed opacity-50">파일 찾기</button>
          </div>
       </div>

       <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex justify-end gap-3">
          <button type="submit" disabled={isPending} className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm px-6 py-2.5 rounded-xl transition-all shadow-md active:scale-95 flex items-center gap-2 disabled:opacity-70">
             {isPending ? '저장/요청 중...' : '임시 저장 및 검수 요청 (Review)'}
          </button>
       </div>
    </form>
  );
}
