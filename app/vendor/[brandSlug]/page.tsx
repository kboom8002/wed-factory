import { createClient } from '@/core/utils/supabase/server';
import Link from 'next/link';

export default async function VendorDashboard({ params }: { params: { brandSlug: string } }) {
  const supabase = await createClient();

  // 1. Fetch Brand Info
  const { data: brand } = await supabase
    .from('brand_registry')
    .select('*')
    .eq('brand_slug', params.brandSlug)
    .single();

  if (!brand) {
    return <div className="p-8 text-slate-500 font-bold">Brand not found...</div>;
  }

  // 2. Fetch Pending/Draft Content
  const { data: myAnswers } = await supabase
    .from('answer_card')
    .select('answer_id, question, public_status, updated_at')
    .eq('brand_id', brand.brand_id)
    .order('updated_at', { ascending: false })
    .limit(5);

  const { data: myPortfolios } = await supabase
    .from('portfolio_shot')
    .select('shot_id, cdn_url, visibility_level, created_at')
    .eq('brand_id', brand.brand_id)
    .order('created_at', { ascending: false })
    .limit(5);

  return (
    <div className="space-y-8 max-w-5xl">
       <div className="flex justify-between items-center bg-white p-8 rounded-2xl shadow-sm border border-slate-200">
          <div>
             <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">
                안녕하세요, <span className="text-indigo-600">{brand.brand_name}</span> 님!
             </h1>
             <p className="text-slate-500 font-medium">당신이 작성한 정책과 포트폴리오 조각이 곧 브랜드의 신뢰도 자산이 됩니다.</p>
          </div>
          <div className="flex gap-3">
             <Link href={`/vendor/${params.brandSlug}/questions/new`} className="px-5 py-3 bg-indigo-600 text-white font-bold rounded-xl shadow-md hover:bg-indigo-700 transition">
                + 새 답변 작성
             </Link>
             <Link href={`/vendor/${params.brandSlug}/portfolio/new`} className="px-5 py-3 bg-white text-indigo-700 font-bold border-2 border-indigo-100 rounded-xl hover:bg-indigo-50 transition">
                📷 포트폴리오 업로드
             </Link>
          </div>
       </div>

       <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-10">
          {/* Recent Answers */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-h-[400px] overflow-y-auto">
             <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between border-b pb-4">
               내가 작성한 QnA 내역
               <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{myAnswers?.length || 0}건</span>
             </h2>

             <div className="space-y-3">
               {myAnswers && myAnswers.length > 0 ? (
                  myAnswers.map((ans) => (
                     <div key={ans.answer_id} className="p-4 border rounded-xl hover:bg-slate-50 transition flex justify-between items-center group">
                        <div className="flex-1 pr-4 truncate block">
                           <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded mr-2 ${
                              ans.public_status === 'published' ? 'bg-emerald-100 text-emerald-700' : 'bg-orange-100 text-orange-700'
                           }`}>
                              {ans.public_status === 'published' ? 'L0 Live' : '심사 대기중'}
                           </span>
                           <strong className="text-[14px] text-slate-700">"{ans.question}"</strong>
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-slate-400 font-medium text-sm text-center py-8">아직 작성하신 질문/답변 카드가 없습니다.</p>
               )}
             </div>
          </section>

          {/* Recent Portfolios */}
          <section className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 max-h-[400px] overflow-y-auto">
             <h2 className="text-lg font-black text-slate-800 mb-6 flex items-center justify-between border-b pb-4">
               최근 업로드 스냅
               <span className="text-xs bg-slate-100 px-2 py-1 rounded text-slate-500">{myPortfolios?.length || 0}건</span>
             </h2>
             
             <div className="space-y-3">
               {myPortfolios && myPortfolios.length > 0 ? (
                  myPortfolios.map((shot) => (
                     <div key={shot.shot_id} className="p-4 border rounded-xl flex items-center gap-4 hover:border-slate-300 transition">
                        <div className="w-12 h-12 bg-slate-200 rounded object-cover overflow-hidden shrink-0 border border-slate-200">
                           <img src={shot.cdn_url} alt="Snap preview" className="w-full h-full object-cover" />
                        </div>
                        <div>
                           <span className={`text-[10px] font-bold uppercase block mb-1 ${
                              shot.visibility_level === 'L0' ? 'text-emerald-600' : 'text-slate-400'
                           }`}>
                              {shot.visibility_level === 'L0' ? '퍼블릭 인증됨 (L0)' : '등급: ' + shot.visibility_level}
                           </span>
                           <p className="text-xs text-slate-500 font-medium truncate max-w-[200px]">{shot.cdn_url.split('/').pop()}</p>
                        </div>
                     </div>
                  ))
               ) : (
                  <p className="text-slate-400 font-medium text-sm text-center py-8">아직 업로드하신 포트폴리오가 없습니다.</p>
               )}
             </div>
          </section>
       </div>
    </div>
  );
}
