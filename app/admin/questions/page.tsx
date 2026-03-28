import { createClient } from '@/core/utils/supabase/server';

export default async function QuestionCapitalPage() {
  const supabase = await createClient();

  // 1. KPI 현황 패치 (Answer Card 통계 및 Void 쿼리)
  const [{ count: staleCount }, { count: voidCount }] = await Promise.all([
    supabase.from('answer_card').select('*', { count: 'exact', head: true }).eq('public_status', 'draft'), // Needs review/stale
    supabase.from('zero_result_query').select('*', { count: 'exact', head: true }).eq('status', 'pending')
  ]);

  // 2. 누락된 질문(Void/Zero-result) 실시간 대기열 로드
  const { data: backlogList, error } = await supabase
    .from('zero_result_query')
    .select(`
      query_id,
      query_text,
      vertical_context,
      occurrences,
      last_searched_at,
      status
    `)
    .order('last_searched_at', { ascending: false })
    .limit(20);

  if (error) {
    console.error('Failed to fetch backlog', error);
  }

  // 3. Status Badge Helper
  const renderStatus = (status: string) => {
    switch(status) {
       case 'pending': return <span className="text-white bg-blue-600 font-bold text-xs px-3 py-1.5 rounded shadow-sm transition">새 답변 작성 (Assign)</span>;
       case 'drafting': return <span className="text-orange-600 font-bold text-xs px-3 py-1 bg-orange-50 rounded border border-orange-100">임시저장 (작성중)</span>;
       case 'published': return <span className="text-green-600 font-bold text-xs px-3 py-1 bg-green-50 rounded border border-green-100">조치 완료 (발행됨)</span>;
       default: return <span className="text-gray-500 font-bold text-xs">{status}</span>;
    }
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-20">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
           <div className="inline-flex items-center gap-2 px-3 py-1 rounded bg-[var(--brand-primary)]/10 text-[var(--brand-primary)] text-[10px] font-bold uppercase tracking-widest mb-2">
             <span>Live Database Connected</span>
           </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Question Capital (Q-Bank)</h1>
          <p className="text-gray-500 font-bold text-sm">유저가 퍼블릭에서 검색했으나 답을 얻지 못한 키워드(Zero-result)를 즉각 수집하고 답변을 배정합니다.</p>
        </div>
      </div>

      {/* KPI Widgets */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-red-800 font-bold block mb-1">Zero-result (무응답 이탈)</span>
            <span className="text-3xl font-black text-red-900">{voidCount || 0}건</span>
          </div>
          <span className="text-4xl grayscale opacity-80">📭</span>
        </div>
        <div className="bg-orange-50 border border-orange-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-orange-800 font-bold block mb-1">Stale & Draft (작성 대기)</span>
            <span className="text-3xl font-black text-orange-900">{staleCount || 0}건</span>
          </div>
          <span className="text-4xl grayscale opacity-80">⏳</span>
        </div>
        <div className="bg-blue-50 border border-blue-100 p-6 rounded-2xl flex items-center justify-between shadow-sm">
          <div>
            <span className="text-blue-800 font-bold block mb-1">Drift (정책/무드 불일치)</span>
            <span className="text-3xl font-black text-blue-900">0건</span>
          </div>
          <span className="text-4xl grayscale opacity-80">🎯</span>
        </div>
      </div>

      {/* Backlog Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-5 bg-slate-50 border-b border-gray-200 flex justify-between items-center">
          <h2 className="font-bold text-gray-800">질문 자산 편입 대기열 (Action Queue)</h2>
          <div className="flex gap-2 text-sm">
            <button className="px-3 py-1.5 bg-white border border-gray-300 rounded-md font-bold text-gray-700 shadow-sm hover:bg-gray-50 flex items-center gap-1">
               <span className="w-2 h-2 rounded-full bg-blue-500"></span>
               Pending 감시 중
            </button>
          </div>
        </div>
        
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-white border-b border-gray-200 text-[11px] font-bold text-gray-500 uppercase tracking-widest bg-gray-50/50">
              <th className="p-4 w-16 text-center">Type</th>
              <th className="p-4">Raw Query (고객 입력 키워드)</th>
              <th className="p-4 text-center">Vertical Scope</th>
              <th className="p-4 text-center">Search Miss Count</th>
              <th className="p-4">Time Captured</th>
              <th className="p-4 text-center">Action Required</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 bg-white">
            {backlogList && backlogList.length > 0 ? (
               backlogList.map(item => (
                 <tr key={item.query_id} className="hover:bg-blue-50/30 transition group">
                   <td className="p-4 text-center">
                     <span className={`px-2 py-1 text-[10px] font-bold uppercase rounded ${item.status === 'pending' ? 'bg-red-100 text-red-700' : 'bg-slate-100 text-slate-600'}`}>
                       VOID
                     </span>
                   </td>
                   <td className="p-4 font-black text-gray-900 text-[15px]">"{item.query_text}"</td>
                   <td className="p-4 text-center">
                     <span className="text-xs bg-gray-100 px-2.5 py-1 rounded font-bold text-gray-600 uppercase tracking-wider">{item.vertical_context || 'GLOBAL'}</span>
                   </td>
                   <td className="p-4 text-center font-black text-red-600 text-lg">{item.occurrences || 1}</td>
                   <td className="p-4 text-xs text-gray-500 font-bold">{new Date(item.last_searched_at).toLocaleString()}</td>
                   <td className="p-4 text-center group-hover:scale-105 transition-transform origin-center">
                     {renderStatus(item.status)}
                   </td>
                 </tr>
               ))
            ) : (
               <tr>
                  <td colSpan={6} className="p-16 text-center text-gray-400 font-bold bg-gray-50">
                     <span className="text-4xl block mb-4 opacity-50 block">🎉</span>
                     포착된 Zero-Result 이탈 쿼리가 없습니다.<br/>모든 고객이 정답지를 무사히 찾아갔습니다.
                  </td>
               </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
