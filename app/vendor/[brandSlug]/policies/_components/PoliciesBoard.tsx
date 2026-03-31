'use client';

import React, { useState } from 'react';
import { PolicyEditor } from './PolicyEditor';

type PolicyItem = {
  policy_id: string;
  brand_id: string;
  policy_family: string;
  title: string;
  summary: string;
  exceptions: string[] | null;
  risk_hint: string | null;
  is_fact_checked: boolean;
};

export function PoliciesBoard({ 
  brandId, 
  brandSlug, 
  initialPolicies 
}: { 
  brandId: string;
  brandSlug: string; 
  initialPolicies: PolicyItem[] 
}) {
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Define policy family names for UI grouping
  const familyNames: Record<string, string> = {
    'refund': '환불 및 위약금 약관',
    'surcharge': '피팅 및 추가 부대비용',
    'product': '제작 및 배송(수령) 조건',
    'schedule': '스케줄 변경 패널티',
    'others': '기타 공통 조건'
  };

  return (
    <div className="w-full max-w-5xl mx-auto p-8 space-y-8">
       {/* Header */}
       <div className="flex justify-between items-center pb-4 border-b-2 border-slate-200">
          <div>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight flex items-center gap-3">
               🛡️ 공식 정책/페널티 빌더
               <span className="bg-slate-800 text-white text-xs font-bold px-2.5 py-1 rounded-full">{initialPolicies.length}건 규제 중</span>
            </h1>
            <p className="text-slate-500 font-medium text-sm mt-2 leading-relaxed">자사 패키지의 숨겨진 추가금이나 위약금 제도를 고객이 오해하지 않도록 명시해 주세요. 이곳에 명시되지 않은 페널티는 나중에 부과하실 수 없습니다.</p>
          </div>
          <button 
             onClick={() => { setIsAddingNew(true); setEditingId(null); }}
             className="bg-slate-800 hover:bg-slate-900 text-white font-bold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex gap-2 active:scale-95"
          >
             + 새 정책 항목 추가
          </button>
       </div>

       {/* Add New Editor */}
       {isAddingNew && (
          <div className="mb-10">
            <PolicyEditor 
               brandId={brandId} 
               brandSlug={brandSlug}
               onClose={() => setIsAddingNew(false)} 
            />
          </div>
       )}

       {/* List of Policies */}
       <div className="space-y-6">
          {initialPolicies.length === 0 && !isAddingNew && (
             <div className="text-center py-24 bg-white border-2 border-dashed border-slate-200 rounded-3xl shadow-sm">
               <span className="text-5xl mb-6 block drop-shadow-sm">🕊️</span>
               <h3 className="text-xl font-black text-slate-700 mb-2">설정된 조건/약관이 아직 없습니다.</h3>
               <p className="text-slate-400 font-medium text-sm">위약금부터 드레스 피팅비까지 브랜드 고유의 룰을 정의하세요.</p>
             </div>
          )}

          {initialPolicies.map((pol) => (
            <div key={pol.policy_id}>
              {editingId === pol.policy_id ? (
                 <PolicyEditor 
                   brandId={brandId}
                   brandSlug={brandSlug}
                   initialData={{
                      policy_id: pol.policy_id,
                      policy_family: pol.policy_family,
                      title: pol.title,
                      summary: pol.summary,
                      exceptions: pol.exceptions,
                      risk_hint: pol.risk_hint || undefined,
                      is_fact_checked: pol.is_fact_checked
                   }}
                   onClose={() => setEditingId(null)}
                 />
              ) : (
                 <div className="bg-white border-2 border-slate-100 shadow-sm rounded-3xl p-8 hover:shadow-md transition-shadow group flex flex-col items-start relative overflow-hidden">
                    
                    {/* Status Badge */}
                    <div className="absolute top-0 right-0 px-5 py-2 rounded-bl-2xl font-bold text-[10px] uppercase tracking-widest shadow-sm">
                       {pol.is_fact_checked ? (
                          <span className="bg-emerald-100 text-emerald-700 px-3 py-1.5 rounded-full border border-emerald-200">✅ Audit Passed (L0)</span>
                       ) : (
                          <span className="bg-orange-100 text-orange-700 px-3 py-1.5 rounded-full border border-orange-200">👀 Admin 심사 대기</span>
                       )}
                    </div>

                    <div className="flex w-full justify-between items-start mb-6 pt-2">
                       <div>
                          <span className="bg-slate-100 text-slate-500 font-black text-[10px] uppercase tracking-widest px-2.5 py-1 rounded inline-block mb-3 border border-slate-200">
                            {familyNames[pol.policy_family] || pol.policy_family}
                          </span>
                          <h2 className="text-xl font-black text-slate-900 group-hover:text-slate-700 transition-colors uppercase tracking-tight">
                            {pol.title}
                          </h2>
                       </div>
                       <button 
                         onClick={() => { setEditingId(pol.policy_id); setIsAddingNew(false); }}
                         className="text-xs font-bold text-slate-400 hover:text-slate-800 transition py-1 bg-slate-50 px-3 rounded-lg border border-slate-200"
                       >
                         편집 (Edit)
                       </button>
                    </div>
                    
                    <p className="text-slate-600 font-semibold bg-slate-50 p-5 rounded-2xl text-sm leading-relaxed mb-4 w-full border border-slate-100">
                      {pol.summary}
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                       {pol.exceptions && pol.exceptions.length > 0 && (
                          <div className="flex flex-col gap-2 mt-2 text-sm text-slate-600 bg-red-50/50 px-5 py-4 border border-red-100 rounded-2xl w-full">
                             <span className="font-bold text-red-600 text-xs uppercase tracking-widest flex items-center gap-1.5"><span className="text-base leading-none">⚠️</span> 예외 상황 처리</span> 
                             <ul className="list-disc list-inside font-medium marker:text-red-400 marker:mr-1">
                                {pol.exceptions.map((ex, i) => <li key={i}>{ex}</li>)}
                             </ul>
                          </div>
                       )}

                       {pol.risk_hint && (
                          <div className="flex flex-col gap-2 mt-2 text-sm text-slate-600 bg-amber-50/50 px-5 py-4 border border-amber-100 rounded-2xl w-full h-fit">
                             <span className="font-bold text-amber-600 text-xs uppercase tracking-widest flex items-center gap-1.5"><span className="text-base leading-none">💡</span> Risk Hint</span> 
                             <p className="font-medium text-amber-800 leading-relaxed">{pol.risk_hint}</p>
                          </div>
                       )}
                    </div>

                 </div>
              )}
            </div>
          ))}
       </div>
    </div>
  );
}
