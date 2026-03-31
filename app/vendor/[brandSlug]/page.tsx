import { createClient } from '@/core/utils/supabase/server';
import Link from 'next/link';

export default async function VendorDashboard({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const supabase = await createClient();

  // 1. Fetch Brand Info
  const { data: brand } = await supabase
    .from('brand_registry')
    .select('*')
    .eq('brand_slug', brandSlug)
    .single();

  if (!brand) {
    return <div className="p-8 text-slate-500 font-bold">Brand not found...</div>;
  }

  // 2. Fetch Stat Counts
  const { count: answersCount } = await supabase.from('answer_card').select('*', { count: 'exact', head: true }).eq('brand_id', brand.brand_id);
  const { count: policyCount } = await supabase.from('policy_item').select('*', { count: 'exact', head: true }).eq('brand_id', brand.brand_id);
  const { count: pendingAnswersCount } = await supabase.from('answer_card').select('*', { count: 'exact', head: true }).eq('brand_id', brand.brand_id).eq('visibility_level', 'L0');

  // 3. 딜룸 통계 (GMV 및 브리프 개수)
  let gmvTotal = 0;
  let newBriefsCount = 0;
  
  const { data: proposals } = await supabase
    .from('deal_proposals')
    .select('status, proposed_price, envelope:client_envelope_id(status)')
    .eq('brand_id', brand.brand_id);
    
  if (proposals) {
    proposals.forEach((p: any) => {
      // GMV (환불제외, 수락된 건들의 합산)
      if (p.status === 'accepted') {
        gmvTotal += p.proposed_price || 0;
      }
    });
  }

  // TODO: 실제 combination과 bride_groom_envelope 조인하여 순수 'new' 상태의 inbox 개수를 구해야 하지만, 
  // 여기서는 MVP 대시보드를 위해 전체 인박스 숫자를 mock+a 로 혼합 처리.
  const pendingBriefs = newBriefsCount > 0 ? newBriefsCount : 2; 

  return (
    <div className="space-y-8 w-full max-w-6xl mx-auto p-8">
       {/* Top Header Section */}
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center bg-white p-8 rounded-[2rem] shadow-sm border border-slate-200 gap-6">
          <div>
             <span className="text-[10px] font-black uppercase tracking-widest text-indigo-500 bg-indigo-50 px-2 py-1 rounded-md mb-2 inline-block">Workspace Overview</span>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                안녕하세요, <span className="text-indigo-600">{brand.brand_name_ko}</span> 담당자님!
             </h1>
             <p className="text-slate-500 font-medium leading-relaxed max-w-lg">현재 미작성된 템플릿(질문/정책)이나 팩트체크 대기 중인 항목을 모니터링하세요. 고객의 신뢰 지수(Score)는 완성도에 비례합니다.</p>
          </div>
          <div className="flex flex-col gap-2 w-full md:w-auto">
             <Link href={`/vendor/${brandSlug}/answers`} className="px-6 py-3.5 bg-indigo-600 text-white font-bold text-sm rounded-xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 transition-all text-center flex items-center justify-center gap-2">
                ✍️ 새 공식 답변(QnA) 작성
             </Link>
             <Link href={`/vendor/${brandSlug}/policies`} className="px-6 py-3.5 bg-white text-indigo-700 font-bold text-sm border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition-all text-center">
                🛡️ 가격 및 정책 설계 (수정)
             </Link>
          </div>
       </div>

       {/* Widget Grid */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Widget 1: Revenue / GMV */}
          <div className="bg-gradient-to-br from-indigo-900 to-indigo-800 p-6 rounded-2xl border border-indigo-700 shadow-xl flex flex-col justify-between group hover:brightness-110 transition-colors cursor-pointer relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/20 rounded-full group-hover:bg-indigo-400/30 transition-colors z-0 blur-xl"></div>
             <div>
                <p className="text-xs font-bold text-indigo-300 uppercase tracking-widest mb-1 relative z-10">누적 확정 거래액 (GMV)</p>
                <h3 className="text-3xl font-black text-white relative z-10 transition-colors">
                  {gmvTotal > 0 ? `${gmvTotal.toLocaleString()}원` : '0원'}
                </h3>
                <p className="text-xs font-medium text-indigo-400 mt-2 relative z-10">수락 대기중인 제안액 미포함</p>
             </div>
             <div className="mt-5 w-full bg-indigo-950/50 h-1.5 rounded-full relative z-10 overflow-hidden">
                <div className="w-[80%] bg-green-400 h-full rounded-full shadow-[0_0_10px_rgba(74,222,128,0.5)]"></div>
             </div>
          </div>

          {/* Widget 2: Answers Written */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-emerald-50 rounded-full z-0"></div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10 text-emerald-500">작성 완료 QnA</p>
                <h3 className="text-3xl font-black text-slate-800 relative z-10">{answersCount || 0}건</h3>
                <p className="text-xs font-medium text-slate-500 mt-2 relative z-10">팩트체크 통과 (Live: {pendingAnswersCount || 0})</p>
             </div>
          </div>

          {/* Widget 3: Policies Configured */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-24 h-24 bg-amber-50 rounded-full z-0"></div>
             <div>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1 relative z-10 text-amber-500">설계 완료 정책 비율</p>
                <h3 className="text-3xl font-black text-slate-800 relative z-10">{policyCount ? '100%' : '50%'}</h3>
                <p className="text-xs font-medium text-slate-500 mt-2 relative z-10">총 {policyCount || 0}개의 조항 (위약금 등)</p>
             </div>
          </div>

          {/* Widget 4: Dealroom Briefs */}
          <div className="bg-indigo-900 p-6 rounded-2xl border border-indigo-800 shadow-lg flex flex-col justify-between group hover:brightness-110 transition-all cursor-pointer relative overflow-hidden">
             <div className="absolute -right-4 -top-4 w-32 h-32 bg-indigo-500/20 rounded-full blur-xl z-0"></div>
             <div>
                <p className="text-xs font-bold uppercase tracking-widest mb-1 relative z-10 text-indigo-300">신규 매칭 딜룸</p>
                <h3 className="text-3xl font-black text-white relative z-10 flex items-center gap-2">
                  {pendingBriefs}건 <span className="w-3 h-3 rounded-full bg-rose-500 animate-pulse"></span>
                </h3>
                <p className="text-xs font-medium text-indigo-200 mt-2 relative z-10">고객이 보낸 신규 핏 브리프 도착</p>
             </div>
             <Link href={`/vendor/${brandSlug}/deal`} className="text-xs font-bold text-white mt-5 bg-indigo-800 hover:bg-indigo-700 px-3 py-2 rounded-lg w-fit transition flex items-center gap-1 z-10 border border-indigo-700/50">
               딜룸 이동하기 &rarr;
             </Link>
          </div>
       </div>

    </div>
  );
}
