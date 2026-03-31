import Link from 'next/link';
import { createClient } from '@/core/utils/supabase/server';

export default async function PlatformDashboardPage() {
  const supabase = await createClient();

  // 1. 병렬 KPI 집계 쿼리 실행
  const [
    { count: brandCount }, 
    { count: assetCount }, 
    { count: zeroResultCount }, 
    { count: envelopeCount },
    { count: pendingAnswers },
    { count: pendingPolicies }
  ] = await Promise.all([
    supabase.from('brand_registry').select('*', { count: 'exact', head: true }).eq('public_status', 'published'),
    supabase.from('answer_card').select('*', { count: 'exact', head: true }).eq('visibility_level', 'L0'),
    supabase.from('zero_result_query').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('bride_groom_envelope').select('*', { count: 'exact', head: true }).eq('status', 'requested'),
    supabase.from('answer_card').select('*', { count: 'exact', head: true }).eq('public_status', 'reviewing'),
    supabase.from('policy_item').select('*', { count: 'exact', head: true }).eq('is_fact_checked', false)
  ]);

  const factcheckPendingCount = (pendingAnswers || 0) + (pendingPolicies || 0);

  // 2. 대기열(Queue) 및 B2B 매출 지표 데이터 조회
  const { data: acceptedDeals } = await supabase
    .from('deal_proposals')
    .select('proposed_price')
    .eq('status', 'accepted');
  
  const totalGmv = (acceptedDeals || []).reduce((acc, curr) => acc + curr.proposed_price, 0);

  const { data: envelopes } = await supabase
    .from('bride_groom_envelope')
    .select(`
      envelope_id, 
      schedule_window, 
      budget_band, 
      created_at, 
      combination_type ( title )
    `)
    .eq('status', 'requested')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: zeroResults } = await supabase
    .from('zero_result_query')
    .select('query_id, query_text, vertical_context, created_at')
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
    .limit(5);

  const { data: healthWarningData } = await supabase
    .from('v_brand_health_observatory')
    .select('*');

  // 데이터 부패이거나 필수 공시가 누락된 브랜드들만 필터링
  const staleBrands = (healthWarningData || []).filter(h => 
    h.stale_risk_status === 'stale_warning' || 
    h.stale_risk_status === 'no_data' ||
    (h.missing_mandatory_policies && h.missing_mandatory_policies.length > 0)
  );

  const KpiCards = [
    { title: 'Factcheck Queue', value: factcheckPendingCount, desc: '승인 대기 중인 초안(Draft)', route: '/admin/factcheck', icon: '🏅', isAlert: factcheckPendingCount > 0 },
    { title: 'Active Brands', value: brandCount || 0, desc: '현재 L0 노출 테넌트', route: '/admin/brands', icon: '🏢' },
    { title: 'Answer Cards', value: assetCount || 0, desc: '퍼블릭 허브로 확산된 자산 총합', route: '/admin/questions', icon: '💬' },
    { title: 'Envelope Queue', value: envelopeCount || 0, desc: '공급자 매칭을 기다리는 Fit Brief', route: '/admin/dealroom', icon: '💌', isAlert: (envelopeCount || 0) > 0 },
    { title: 'Total GMV (Deals)', value: `₩${(totalGmv / 10000).toLocaleString()}만`, desc: `${acceptedDeals?.length || 0}건 계약 성사 (수락됨)`, route: '/admin/dealroom', icon: '💰', isHighlight: true },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-slate-900 text-white p-6 rounded-3xl shadow-lg mb-8">
        <div>
          <h1 className="text-3xl font-black mb-2 tracking-tight flex items-center gap-3">
             <span className="text-indigo-400">Observatory</span> KPI
          </h1>
          <p className="text-slate-400 font-medium text-sm">플랫폼 공통 운영 자산과 예비 점주 대기열(Queue)을 중앙 모니터링합니다.</p>
        </div>
        <div className="flex gap-4">
           <Link href="/admin/publishing/trust-queue" className="bg-rose-600 hover:bg-rose-500 text-white font-black py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95 text-sm">
             ⚖️ 증빙/Trust 검토 큐
           </Link>
           <Link href="/admin/brands/new" className="bg-indigo-600 hover:bg-indigo-500 text-white font-black py-3 px-6 rounded-xl shadow-lg transition flex items-center gap-2 transform hover:scale-105 active:scale-95 text-sm">
             🚀 신규 B-SSoT 입점
           </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {KpiCards.map((kpi: any, idx) => (
          <Link key={idx} href={kpi.route}>
            <div className={`p-6 rounded-2xl shadow-sm border transition h-full group ${
              kpi.isAlert 
                ? 'bg-red-50/50 border-red-100 hover:bg-red-50 hover:border-red-200' 
                : kpi.isHighlight 
                  ? 'bg-[var(--brand-primary)] border-[var(--brand-primary)]/80 hover:brightness-110 shadow-lg shadow-[var(--brand-primary)]/20' 
                  : 'bg-white border-gray-100 hover:shadow-md hover:border-blue-100'
            }`}>
              <div className="flex justify-between items-start mb-4">
                <span className="text-3xl bg-white bg-opacity-80 rounded-xl p-2.5 shadow-sm border border-black/5 leading-none">
                  {kpi.icon}
                </span>
                {kpi.isAlert && (
                  <span className="bg-red-500 text-white text-[10px] font-extrabold px-2 py-0.5 rounded-full animate-pulse uppercase tracking-wider">
                    Action Reqd
                  </span>
                )}
                {kpi.isHighlight && (
                  <span className="bg-white/20 text-white border border-white/30 text-[10px] font-black px-2 py-0.5 rounded-full uppercase tracking-widest">
                    Revenue
                  </span>
                )}
              </div>
              <h3 className={`text-3xl font-black mb-1.5 ${kpi.isAlert ? 'text-red-900' : kpi.isHighlight ? 'text-white' : 'text-gray-900'}`}>{kpi.value}</h3>
              <p className={`font-bold mb-2 ${kpi.isAlert ? 'text-red-700' : kpi.isHighlight ? 'text-white/90' : 'text-gray-800'}`}>{kpi.title}</p>
              <p className={`text-xs font-medium leading-relaxed ${kpi.isAlert ? 'text-red-500' : kpi.isHighlight ? 'text-white/70' : 'text-gray-500'}`}>{kpi.desc}</p>
            </div>
          </Link>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-12">
        {/* Envelope Review Queue */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className={`w-3 h-3 rounded-full inline-block ${(envelopeCount||0) > 0 ? 'bg-blue-500 animate-pulse' : 'bg-gray-300'}`}></span>
                Envelope Queue (견적 매칭 대기)
             </h2>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
            {envelopes && envelopes.length > 0 ? (
              envelopes.map(env => (
                <div key={env.envelope_id} className="flex justify-between p-4 bg-blue-50/50 border border-blue-100 rounded-xl hover:bg-blue-50 transition">
                  <div className="flex-1">
                    <div className="flex gap-2 items-center mb-1">
                      <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-bold px-2 py-0.5 rounded">Bride/Groom</span>
                      <strong className="text-gray-900 text-sm">{env.budget_band}</strong>
                    </div>
                    <p className="text-gray-600 text-xs truncate max-w-[200px]">일정: {env.schedule_window}</p>
                    <p className="text-gray-400 text-[10px] mt-1">{new Date(env.created_at).toLocaleString()}</p>
                  </div>
                  <div className="flex items-center">
                    <Link href={`/brief/${env.envelope_id}`} className="text-xs bg-white border border-gray-200 text-blue-700 hover:text-white hover:bg-blue-600 font-bold px-3 py-1.5 rounded-lg shadow-sm transition">
                      매칭/발송하기
                    </Link>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-12 text-gray-400 font-medium">대기 중인 Envelope가 없습니다.</div>
            )}
          </div>
        </section>

        {/* Zero-Result Backlog */}
        <section className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-xl">🚨</span>
                Zero-Result & Void Backlog
             </h2>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-4">검색 후 답을 얻지 못해 이탈된 키워드. 컨설팅 팩트체크가 시급합니다.</p>
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
             {zeroResults && zeroResults.length > 0 ? (
               zeroResults.map(zr => (
                 <div key={zr.query_id} className="p-4 bg-red-50/50 border border-red-100 rounded-xl flex justify-between items-center">
                   <div className="flex-1 pr-4">
                      <strong className="text-red-900 text-sm block mb-1">"{zr.query_text}"</strong>
                      <span className="text-red-500 text-[10px] font-medium block">
                        요청처: {zr.vertical_context} · {new Date(zr.created_at).toLocaleTimeString()}
                      </span>
                   </div>
                   <button className="bg-red-100 text-red-800 hover:bg-red-200 text-xs font-bold px-3 py-2 rounded-lg transition shadow-sm whitespace-nowrap">
                     답변 생성(Assign)
                   </button>
                 </div>
               ))
             ) : (
               <div className="text-center py-12 text-gray-400 font-medium">처리할 공백(Void) 질문이 없습니다.</div>
             )}
          </div>
        </section>

        {/* Database View based Observatory Queue */}
        <section className="bg-red-50/20 p-6 rounded-2xl shadow-sm border border-red-100 h-[400px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
             <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                <span className="text-xl animate-pulse">⚠️</span>
                Data Stale Warning 
                <span className="bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{staleBrands.length}건</span>
             </h2>
          </div>
          <p className="text-sm text-gray-500 font-medium mb-4">갱신이 누락된 테넌트.</p>
          
          <div className="space-y-3 flex-1 overflow-y-auto pr-2">
             {staleBrands && staleBrands.length > 0 ? (
               staleBrands.map(b => (
                 <div key={b.brand_id} className="p-4 bg-white border border-red-100 shadow-sm rounded-xl flex flex-col justify-between">
                   <div>
                      <strong className="text-gray-900 text-sm block mb-1 flex items-center gap-1">
                        {b.brand_name} <span className="text-[10px] bg-slate-100 text-slate-500 px-1 rounded uppercase tracking-wider">{b.vertical_type}</span>
                      </strong>
                      <div className="flex flex-col gap-1 mt-2">
                        {b.stale_risk_status === 'stale_warning' && <span className="text-red-500 text-[11px] font-bold">🚨 60일 초과 미갱신 (Stale)</span>}
                        {b.stale_risk_status === 'no_data' && <span className="text-orange-500 text-[11px] font-bold">⚠️ 질의응답 자산 전혀 없음</span>}
                        {b.missing_mandatory_policies && b.missing_mandatory_policies.length > 0 && (
                          <span className="text-rose-600 text-[11px] font-bold">
                            🚫 누락: {b.missing_mandatory_policies.join(', ')}
                          </span>
                        )}
                      </div>
                   </div>
                   <div className="mt-4 pt-3 border-t border-gray-100 text-right">
                     <button className="bg-white border border-red-200 text-red-600 hover:bg-red-50 text-[11px] font-bold px-3 py-1.5 rounded-lg transition shadow-sm whitespace-nowrap">
                       점주에게 알림
                     </button>
                   </div>
                 </div>
               ))
             ) : (
               <div className="col-span-full text-center py-8 text-emerald-600 bg-emerald-50 rounded-xl font-bold border border-emerald-100 border-dashed">
                 미공시/부패 데이터 없음.
               </div>
             )}
          </div>
        </section>

      </div>
    </div>
  );
}
