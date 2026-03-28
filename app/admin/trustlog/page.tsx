import { createClient } from '@/core/utils/supabase/server';

export default async function TrustLogCenterPage() {
  const supabase = await createClient();

  // For MVP, we will fetch recent policy updates or verified answer cards
  // as a proxy for "Changelog & Trust Events". In a full production schema,
  // there would be an explicit `audit_log` or `trust_correction` table.
  const { data: recentEdits, error } = await supabase
    .from('answer_card')
    .select('answer_id, question, brand_id, updated_at, reviewer_name, public_status')
    .order('updated_at', { ascending: false })
    .limit(10);

  if (error) {
    console.error('TrustLog fetch error:', error);
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      
      {/* Header */}
      <div className="flex justify-between items-end pb-4 border-b border-gray-200">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-slate-100 text-slate-600 border border-slate-200 text-[10px] font-bold uppercase tracking-widest mb-2">
             <span>Platform Security Level 1</span>
           </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight flex items-center gap-3">
             <span className="text-3xl opacity-80">🛡️</span> Trust & Correction Center
          </h1>
          <p className="text-gray-500 font-bold text-sm">
             입점 브랜드들의 모든 L0 정보 수정(정책, 견적, 포트폴리오 캡션) 이별을 감시하고 승인 내역을 박제(Audit Log)합니다.
          </p>
        </div>
      </div>

      {/* KPI Panels */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
         <div className="p-6 bg-slate-900 text-white rounded-2xl shadow-lg border border-slate-800">
            <span className="text-slate-400 font-bold text-xs uppercase tracking-widest block mb-2">Total Monitored Nodes</span>
            <span className="text-4xl font-black">1,024</span>
         </div>
         <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-emerald-600 font-bold text-xs uppercase tracking-widest block mb-2 flex items-center justify-between">
               Verified Corrections
               <span className="text-lg">✅</span>
            </span>
            <span className="text-4xl font-black text-slate-800">32</span>
         </div>
         <div className="p-6 bg-white rounded-2xl shadow-sm border border-slate-200">
            <span className="text-orange-600 font-bold text-xs uppercase tracking-widest block mb-2 flex items-center justify-between">
               Pending Triage
               <span className="text-lg">⏳</span>
            </span>
            <span className="text-4xl font-black text-slate-800">0</span>
         </div>
         <div className="p-6 bg-red-50 rounded-2xl shadow-sm border border-red-100 relative overflow-hidden">
            <div className="absolute -right-4 -bottom-4 text-6xl opacity-10">🚨</div>
            <span className="text-red-700 font-bold text-xs uppercase tracking-widest block mb-2">
               Policy Drift Warning
            </span>
            <span className="text-4xl font-black text-red-900">0</span>
         </div>
      </div>

      {/* Audit Log / Change History */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden mt-8">
         <div className="p-5 bg-slate-50 border-b border-slate-200 flex justify-between items-center">
            <h2 className="font-bold text-gray-800 flex items-center gap-2">
               <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
               최근 팩트체크/수정 타임라인 (Changelog)
            </h2>
         </div>

         <div className="p-0">
            <table className="w-full text-left">
               <thead>
                  <tr className="bg-white border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                     <th className="p-4 w-12 text-center">Status</th>
                     <th className="p-4">Entity Context</th>
                     <th className="p-4">Modified Action</th>
                     <th className="p-4">Reviewer Sign-off</th>
                     <th className="p-4 text-right">Timestamp</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-100">
                  {recentEdits && recentEdits.length > 0 ? (
                     recentEdits.map((log) => (
                        <tr key={log.answer_id} className="hover:bg-slate-50/50 transition">
                           <td className="p-4 text-center">
                              {log.public_status === 'published' ? (
                                 <span className="inline-block w-2.5 h-2.5 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></span>
                              ) : (
                                 <span className="inline-block w-2.5 h-2.5 rounded-full bg-orange-400 ring-4 ring-orange-50"></span>
                              )}
                           </td>
                           <td className="p-4">
                              <span className="text-xs font-bold bg-slate-100 text-slate-600 px-2 py-0.5 rounded uppercase tracking-wider block w-max mb-1">
                                 Answer Card
                              </span>
                              <strong className="text-[14px] text-slate-800 truncate max-w-sm block">
                                 "{log.question}"
                              </strong>
                           </td>
                           <td className="p-4">
                              <span className="text-sm font-medium text-slate-600">
                                 {log.public_status === 'published' ? '공식 발행(Deploy)' : '초안 갱신(Draft Edit)'}
                              </span>
                           </td>
                           <td className="p-4">
                              <div className="flex items-center gap-2">
                                 <div className="w-6 h-6 rounded-full bg-indigo-100 text-indigo-700 font-bold flex items-center justify-center text-[10px]">
                                    {log.reviewer_name ? log.reviewer_name[0] : 'S'}
                                 </div>
                                 <span className="text-xs font-bold text-slate-700">{log.reviewer_name || 'System Operator'}</span>
                              </div>
                           </td>
                           <td className="p-4 text-right text-xs font-bold text-slate-400">
                              {new Date(log.updated_at).toLocaleString()}
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan={5} className="p-16 text-center text-slate-400 font-medium bg-slate-50/50">
                           관측된 로그가 없습니다.
                        </td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}
