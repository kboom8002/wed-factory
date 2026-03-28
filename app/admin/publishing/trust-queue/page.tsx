import React from 'react';
import { createClient } from '@/core/utils/supabase/server';
import Link from 'next/link';
import { TrustActionButtons } from './_components/TrustActionButtons';

export default async function TrustQueuePage() {
  const supabase = await createClient();

  // 1. Fetch L0 (Public) Answer Cards
  const { data: rawAnswers, error: answerError } = await supabase
    .from('answer_card')
    .select('card_id, brand_id, question, updated_at')
    .eq('visibility_level', 'L0')
    .order('updated_at', { ascending: false });

  if (answerError) {
    console.error('[TrustQueue] Error fetching answers:', answerError);
  }

  // 2. Fetch all Brands for mapping
  const { data: rawBrands } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name_ko, vertical_type');
  
  const brandMap = new Map((rawBrands || []).map(b => [b.brand_id, b]));

  // 3. Fetch all Verified Evidences for answer_card
  const { data: rawEvidences } = await supabase
    .from('trust_evidence')
    .select('target_id, status')
    .eq('target_type', 'answer_card')
    .eq('status', 'verified');

  const verifiedTargetIds = new Set((rawEvidences || []).map(e => e.target_id));

  // 4. Filter answers that DO NOT HAVE verified evidence
  const unverifiedAnswers = (rawAnswers || []).filter(a => !verifiedTargetIds.has(a.card_id));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-red-50 text-red-600 border border-red-200 text-[10px] font-bold uppercase tracking-widest mb-2">
             <span>Level 1 · Critical Security</span>
           </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight flex items-center gap-3">
             <span className="text-3xl animate-pulse">🏛️</span> Trust Incomplete Review Queue
          </h1>
          <p className="text-gray-500 font-bold text-sm leading-relaxed max-w-2xl">
             현재 <strong className="text-indigo-600">L0 (퍼블릭)</strong> 상태로 노출 중이지만, 점주가 검증가능한 서류(계약서, 영수증 캡쳐 등)를 제출하지 않은 
             "구두 답변"들을 모니터링합니다. 허위 광고가 의심되면 직권으로 블락(L1 강등)하십시오.
          </p>
        </div>
        <div className="hidden md:block">
           <Link href="/admin" className="text-sm font-bold text-indigo-600 hover:text-indigo-800 transition px-4 py-2 bg-indigo-50 rounded-lg">
             ← Back to Dashboard
           </Link>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
         <div className="p-6 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
               🚨 미검증 (Evidence Missing) 자산 목록
               <span className="bg-red-500 text-white text-xs px-2.5 py-0.5 rounded-full font-bold ml-2 shadow-sm">{unverifiedAnswers.length}건</span>
            </h2>
         </div>

         <div className="divide-y divide-gray-100">
            {unverifiedAnswers.length > 0 ? (
               unverifiedAnswers.map(ans => {
                 const brand = brandMap.get(ans.brand_id) || { brand_name_ko: 'Unknown', vertical_type: 'unknown' };
                 return (
                   <div key={ans.card_id} className="p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:bg-slate-50/50 transition">
                      <div className="flex-1">
                         <div className="flex items-center gap-2 mb-2">
                           <span className="text-[10px] font-bold uppercase tracking-wider bg-slate-100 text-slate-500 px-2 py-0.5 rounded border border-slate-200">
                             {brand.vertical_type}
                           </span>
                           <strong className="text-sm text-gray-900 font-black">{brand.brand_name_ko}</strong>
                           <span className="text-xs text-gray-400 border-l border-gray-300 pl-2 ml-1">
                             {new Date(ans.updated_at).toLocaleDateString()} 수정됨
                           </span>
                         </div>
                         <h3 className="text-lg font-bold text-gray-800 leading-snug">
                           <span className="text-red-500 mr-2 shadow-sm">⚠️</span>
                           "{ans.question}"
                         </h3>
                         <p className="text-sm text-gray-500 mt-2">
                           현재 B-SSoT 홈 검색망에 완전 공개중이지만 교차 검증된 증거 자료가 없음.
                         </p>
                      </div>
                      
                      {/* Actions */}
                      <TrustActionButtons cardId={ans.card_id} />
                   </div>
                 );
               })
            ) : (
               <div className="py-20 text-center flex flex-col items-center justify-center">
                  <span className="text-6xl mb-4 opacity-50">🏆</span>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">퍼펙트 클린!</h3>
                  <p className="text-gray-500">모든 퍼블릭 답변이 서류 증빙으로 안전하게 검증되었습니다.</p>
               </div>
            )}
         </div>
      </div>

    </div>
  );
}
