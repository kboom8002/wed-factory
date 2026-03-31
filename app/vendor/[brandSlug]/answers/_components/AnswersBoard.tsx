'use client';

import React, { useState } from 'react';
import { AnswerEditor } from './AnswerEditor';

type AnswerItem = {
  answer_id: string;
  brand_id: string;
  question: string;
  short_answer: string;
  boundary_note: string | null;
  public_status: string;
};

export function AnswersBoard({ 
  brandId, 
  brandSlug, 
  initialAnswers 
}: { 
  brandId: string;
  brandSlug: string; 
  initialAnswers: AnswerItem[] 
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  return (
    <div className="w-full max-w-5xl mx-auto p-8 space-y-8">
       {/* Header */}
       <div className="flex justify-between items-center pb-4 border-b-2 border-slate-100">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
               💬 공식 답변(QnA) 팩토리
               <span className="bg-indigo-100 text-indigo-700 text-xs font-bold px-2 py-1 rounded-full">{initialAnswers.length}건</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-2">고객들이 벤더에게 궁금해하는 바운더리 정보와 코어 질문을 관리합니다.</p>
          </div>
          <button 
             onClick={() => { setIsAddingNew(true); setEditingId(null); }}
             className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-indigo-200 transition-all text-sm flex gap-2 active:scale-95"
          >
             + 새 초안 작성
          </button>
       </div>

       {/* Add New Editor */}
       {isAddingNew && (
          <div className="mb-10">
            <AnswerEditor 
               brandId={brandId} 
               brandSlug={brandSlug}
               onClose={() => setIsAddingNew(false)} 
            />
          </div>
       )}

       {/* List of Answers */}
       <div className="space-y-4">
          {initialAnswers.length === 0 && !isAddingNew && (
             <div className="text-center py-20 bg-slate-50 border-2 border-dashed border-slate-200 rounded-2xl">
               <span className="text-4xl mb-4 block">📭</span>
               <h3 className="text-lg font-bold text-slate-600 mb-2">아직 등록된 공식 답변이 없습니다.</h3>
               <p className="text-slate-400 font-medium text-sm">자주 묻는 질문에 대한 답변을 작성하여 플랫폼 L0 매칭 확률을 높이세요!</p>
             </div>
          )}

          {initialAnswers.map((ans) => (
            <div key={ans.answer_id}>
              {editingId === ans.answer_id ? (
                 <AnswerEditor 
                   brandId={brandId}
                   brandSlug={brandSlug}
                   initialData={{
                      answer_id: ans.answer_id,
                      question: ans.question,
                      short_answer: ans.short_answer,
                      boundary_note: ans.boundary_note || '',
                      public_status: ans.public_status
                   }}
                   onClose={() => setEditingId(null)}
                 />
              ) : (
                 <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6 hover:border-indigo-300 transition-colors group">
                    <div className="flex justify-between items-start mb-4">
                       <div className="flex items-center gap-3">
                          <span className={`text-[10px] font-bold uppercase px-2.5 py-1 rounded shadow-sm tracking-widest ${
                             ans.public_status === 'published' ? 'bg-emerald-50 text-emerald-600 border border-emerald-100' :
                             ans.public_status === 'reviewing' ? 'bg-orange-50 text-orange-600 border border-orange-100' : 
                             'bg-slate-100 text-slate-500'
                          }`}>
                             {ans.public_status === 'published' ? 'L0 Live (발행됨)' : 
                              ans.public_status === 'reviewing' ? '팩트체크 대기중' : '임시 저장(Draft)'}
                          </span>
                       </div>
                       <button 
                         onClick={() => { setEditingId(ans.answer_id); setIsAddingNew(false); }}
                         className="text-xs font-bold text-slate-400 hover:text-indigo-600 transition underline underline-offset-4 decoration-slate-200 py-1"
                       >
                         수정 (Edit)
                       </button>
                    </div>
                    
                    <h2 className="text-lg font-black text-slate-800 mb-2 group-hover:text-indigo-900 transition-colors">
                      Q. {ans.question}
                    </h2>
                    <p className="text-indigo-600 font-bold bg-indigo-50/50 p-4 border border-indigo-100/50 rounded-xl text-sm leading-relaxed mb-3">
                      <span className="text-indigo-300 mr-2">A.</span> {ans.short_answer}
                    </p>

                    {ans.boundary_note && (
                       <div className="flex items-start gap-2 mt-4 text-xs font-medium text-slate-500 bg-slate-50 px-4 py-3 border border-slate-100 rounded-lg">
                          <span className="text-amber-500 text-sm mt-0.5">⚠️</span> 
                          <span className="leading-relaxed"><strong>예외/바운더리 노트:</strong> {ans.boundary_note}</span>
                       </div>
                    )}
                 </div>
              )}
            </div>
          ))}
       </div>
    </div>
  );
}
