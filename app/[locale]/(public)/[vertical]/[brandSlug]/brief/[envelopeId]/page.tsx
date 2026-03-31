import { createClient } from '@/core/utils/supabase/server';
import { notFound } from 'next/navigation';
import ClientEnvelopeProposals from './ClientEnvelopeProposals';

export default async function CustomerMySpacePage({ 
  params 
}: { 
  params: Promise<{ vertical: string, brandSlug: string, envelopeId: string }> 
}) {
  const { envelopeId, vertical, brandSlug } = await params;
  const supabase = await createClient();

  // 1. Fetch Envelope Details
  const { data: env, error: envErr } = await supabase
    .from('bride_groom_envelope')
    .select('*')
    .eq('envelope_id', envelopeId)
    .single();

  if (envErr || !env) {
    return notFound();
  }

  // 2. Fetch Proposals specifically matching this envelope
  const { data: proposals } = await supabase
    .from('deal_proposals')
    .select(`
      *,
      brand_registry(id, brand_name, brand_slug, vertical_type, colors, kakao_channel_url, bank_account_info)
    `)
    .eq('client_envelope_id', envelopeId)
    .order('created_at', { ascending: false });

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-32">
       <div className="max-w-4xl mx-auto px-6">
          <div className="text-center mb-10">
             <span className="bg-blue-100 text-blue-800 text-[10px] uppercase font-black px-3 py-1.5 rounded-full tracking-widest shadow-sm">
               Secure My-Space
             </span>
             <h1 className="text-4xl font-black mt-4 tracking-tighter text-slate-900">내 핏 브리프 및 제안</h1>
             <p className="text-slate-500 font-medium mt-3 text-sm">
                접수하신 조건에 맞춰 검증된 파트너 점주들의 공식 제안(역경매/프러포절)이 도착했습니다. <br/>
                상세 조건을 비교하고, 가장 마음에 드는 제안을 수락(Deal) 해보세요.
             </p>
          </div>

          <div className="bg-white p-8 rounded-[2rem] shadow-xl shadow-slate-200/50 mb-8 border border-slate-100">
             <h2 className="text-xl font-bold mb-4 border-b border-slate-100 pb-3 flex items-center gap-2">
               📝 나의 브리프 (요청 내역)
             </h2>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
               <div>
                 <span className="block text-slate-400 font-bold text-xs uppercase mb-1">예산대</span>
                 <strong className="text-slate-800 text-base">{env.budget_band}</strong>
               </div>
               <div>
                 <span className="block text-slate-400 font-bold text-xs uppercase mb-1">일정</span>
                 <strong className="text-slate-800 text-base">{env.schedule_window}</strong>
               </div>
               <div>
                 <span className="block text-slate-400 font-bold text-xs uppercase mb-1">개인정보 보호</span>
                 <strong className="text-slate-800 text-base">{env.privacy_preference || '일반 제공'}</strong>
               </div>
               <div>
                 <span className="block text-slate-400 font-bold text-xs uppercase mb-1">주요 태그</span>
                 <div className="flex flex-wrap gap-1 mt-0.5">
                   {env.priority_tags?.map((t: string) => (
                     <span key={t} className="bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded text-[10px] font-bold">#{t}</span>
                   ))}
                 </div>
               </div>
             </div>
             
             {env.status === 'closed' && (
                <div className="mt-8 bg-green-50/50 border border-green-200 p-4 rounded-xl text-center">
                  <span className="text-green-700 font-bold flex items-center justify-center gap-2">
                    <span className="text-xl">✅</span> 이미 계약이 수락(분류: CLOSED)된 매칭건입니다.
                  </span>
                </div>
             )}
          </div>

          <div>
             <h2 className="text-xl font-bold mb-6 flex items-center gap-2 px-2 text-slate-800">
               상점 응답 견적 <span className="bg-blue-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-xs ml-1">{proposals?.length || 0}</span>
             </h2>

             {proposals?.length === 0 ? (
               <div className="text-center py-16 bg-white rounded-3xl border border-dashed border-slate-300">
                 <span className="text-4xl text-slate-300 mb-4 block">👀</span>
                 <p className="font-bold text-slate-500">아직 접수된 역제안 견적이 없습니다.</p>
                 <p className="text-xs text-slate-400 mt-2">점주가 브리프를 검토 중입니다. 제안이 오면 알림이 발송됩니다.</p>
               </div>
             ) : (
               <ClientEnvelopeProposals proposals={proposals || []} envelopeId={env.envelope_id} envelopeStatus={env.status} />
             )}
          </div>
       </div>
    </div>
  );
}
