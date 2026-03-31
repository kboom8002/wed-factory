import { createClient } from '@/core/utils/supabase/server';
import { FactcheckBoard } from './_components/FactcheckBoard';

export const revalidate = 0; // Ensures fresh data for the queue on every load

export default async function AdminFactcheckQueuePage() {
  const supabase = await createClient();

  // 1. Fetch pending AnswerCards
  const { data: rawAnswers } = await supabase
    .from('answer_card')
    .select(`
      answer_id,
      brand_id,
      question,
      short_answer,
      boundary_note,
      updated_at,
      brand_registry (
        brand_name_ko
      )
    `)
    .eq('public_status', 'reviewing')
    .order('updated_at', { ascending: false });

  // 2. Fetch pending PolicyItems
  const { data: rawPolicies } = await supabase
    .from('policy_item')
    .select(`
      policy_id,
      brand_id,
      policy_family,
      title,
      summary,
      exceptions,
      risk_hint,
      updated_at,
      brand_registry (
        brand_name_ko
      )
    `)
    .eq('is_fact_checked', false)
    .order('updated_at', { ascending: false });

  // Flatten the response payload
  const pendingAnswers = (rawAnswers || []).map((ans: any) => ({
    card_id: ans.answer_id,
    brand_name: ans.brand_registry?.brand_name_ko || 'Unknown',
    question: ans.question,
    short_answer: ans.short_answer,
    boundary_note: ans.boundary_note,
    updated_at: ans.updated_at
  }));

  const pendingPolicies = (rawPolicies || []).map((pol: any) => ({
    policy_id: pol.policy_id,
    brand_name: pol.brand_registry?.brand_name_ko || 'Unknown',
    policy_family: pol.policy_family,
    title: pol.title,
    summary: pol.summary,
    exceptions: pol.exceptions,
    risk_hint: pol.risk_hint,
    updated_at: pol.updated_at
  }));

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end pb-4 border-b border-gray-200">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-indigo-50 text-indigo-600 border border-indigo-200 text-[10px] font-black uppercase tracking-widest mb-3">
             <span>L0 Publishing Gate</span>
           </div>
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight flex items-center gap-3">
             <span className="text-3xl">🏅</span> Factcheck Queue
          </h1>
          <p className="text-gray-500 font-medium text-sm leading-relaxed max-w-2xl">
             입점 브랜드가 초안(Draft)으로 작성 후 팩트체크를 요청한 **공식 답변(QnA) 및 패널티 정책** 항목들입니다.<br/>
             내용에 문제가 없다면 승인하여 L0(Public) 영역으로 확산시키고, 허위 요소가 있다면 반려(Draft 전환)하세요.
          </p>
        </div>
      </div>

      <FactcheckBoard 
         pendingAnswers={pendingAnswers} 
         pendingPolicies={pendingPolicies} 
      />

    </div>
  );
}
