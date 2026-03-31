import { createClient } from '@/core/utils/supabase/server';
import { notFound } from 'next/navigation';
import Link from 'next/link';

export default async function VerifiedBriefPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params;
  const supabase = await createClient();

  // 1. 고객이 입력(Insert)했던 BrideGroom Envelope 로드
  const { data: bgEnvelope, error: envError } = await supabase
    .from('bride_groom_envelope')
    .select('*')
    .eq('envelope_id', id)
    .single();

  if (envError || !bgEnvelope) {
    console.error('L1 Envelope Error:', envError);
    notFound();
  }

  const { data: brandInfo } = await supabase
    .from('brand_registry')
    .select('brand_name_ko, brand_slug, vertical_type')
    .eq('brand_id', bgEnvelope.target_brand_id)
    .single();

  const brandName = brandInfo?.brand_name_ko || '지정 브랜드 없음';
  const brandSlug = brandInfo?.brand_slug || '';
  const vertical = brandInfo?.vertical_type || 'studio';

  // 딜룸 가상 응답 (Mock Proposal)
  const isPending = true; // 실제 앱이라면 status 테이블 연동

  return (
    <main className="min-h-screen bg-zinc-50 flex flex-col items-center pb-20">
      
      {/* 1. Global Navigation / Header */}
      <nav className="w-full bg-slate-900 text-white shadow-md relative z-20">
         <div className="max-w-6xl mx-auto px-6 h-16 flex justify-between items-center">
            <div className="flex items-center gap-3">
               <span className="text-xl">🤝</span>
               <div>
                  <h1 className="text-sm font-black tracking-widest text-slate-300">DEALROOM / 딜룸</h1>
                  <p className="text-xs text-slate-500 font-bold uppercase">{brandName} 매칭 전용 방</p>
               </div>
            </div>
            <Link href={`/${vertical}/${brandSlug}`} className="text-sm font-bold text-slate-400 hover:text-white transition-colors bg-white/10 px-4 py-1.5 rounded-full">
              B-SSoT 홈으로 돌아가기
            </Link>
         </div>
      </nav>

      <div className="w-full max-w-6xl px-4 sm:px-6 pt-10 space-y-10">
        
        {/* 2. Timeline Status Tracker */}
        <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200/60 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-bl-full pointer-events-none"></div>
           <h2 className="text-sm font-black text-slate-400 uppercase tracking-widest mb-8 flex items-center gap-2">
             <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
             진행 상황 (Status)
           </h2>
           
           <div className="flex flex-col md:flex-row justify-between relative gap-6 md:gap-0">
              {/* Line in background */}
              <div className="hidden md:block absolute top-[28px] left-[50px] right-[50px] h-[3px] bg-zinc-100 -z-10 rounded-full">
                 <div className="h-full bg-blue-500 w-[50%] transition-all duration-1000 ease-out shadow-[0_0_15px_rgba(59,130,246,0.5)]"></div>
              </div>

              {[
                { step: 1, title: '브리프 제출 완료', desc: '고객님의 요청 접수', active: true, done: true },
                { step: 2, title: '조건/스케줄 확인 중', desc: '브랜드 담당자 검토 (1~2일 소요)', active: true, done: false },
                { step: 3, title: 'L1 확정 핏 리포트', desc: '최종 견적/조건 수신', active: false, done: false },
                { step: 4, title: '초회 방문 확정', desc: '보안 계약 및 매칭 성사', active: false, done: false },
              ].map((s, idx) => (
                <div key={idx} className="flex md:flex-col items-center md:text-center w-full md:w-1/4 gap-4 md:gap-3 group">
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center font-black text-lg transition-all duration-500 z-10 ${
                    s.done ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/20' :
                    s.active ? 'bg-white border-[3px] border-blue-500 text-blue-500 scale-110 shadow-xl' :
                    'bg-zinc-100 text-zinc-400 border border-zinc-200'
                  }`}>
                    {s.done ? <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7"/></svg> : s.step}
                  </div>
                  <div className="flex flex-col md:min-h-[60px] md:justify-start pt-1 md:pt-0">
                    <h3 className={`font-bold pb-1 ${s.active ? 'text-slate-900' : 'text-slate-400'}`}>{s.title}</h3>
                    <p className="text-xs text-slate-500 font-medium break-keep">{s.desc}</p>
                  </div>
                </div>
              ))}
           </div>
        </section>

        {/* 3. Deal Compare Board */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full items-start">
          
          {/* Left: Client's Request */}
          <section className="bg-white rounded-[2rem] p-8 shadow-sm border border-zinc-200/60 flex flex-col h-full">
            <h2 className="text-2xl font-black text-slate-800 mb-6 flex items-center gap-3">
              <span className="text-3xl">📝</span> 나의 핏 브리프
            </h2>
            
            <div className="space-y-6 flex-1 bg-zinc-50 border border-zinc-100 rounded-2xl p-6">
               <div className="flex justify-between items-start border-b border-zinc-200 pb-4">
                 <div>
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">기안자 및 대상</p>
                   <p className="text-lg font-bold text-slate-900">{bgEnvelope.legal_names} 님의 브리프</p>
                   <p className="text-sm font-medium text-slate-500 mt-1">To. {brandName} 담당자 앞</p>
                 </div>
                 <div className="text-right">
                   <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">본식 혹은 희망 시기</p>
                   <p className="text-sm font-bold text-slate-800 bg-white border border-zinc-200 px-3 py-1.5 rounded-lg shadow-sm">
                     {bgEnvelope.exact_event_date ? bgEnvelope.exact_event_date : '본식 미정'} (촬영: {bgEnvelope.schedule_window})
                   </p>
                 </div>
               </div>

               <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm flex flex-col justify-center">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">총괄 예산 방어선</p>
                    <p className="text-base font-black text-indigo-600 bg-indigo-50 w-fit px-3 py-1 rounded-lg">
                      {bgEnvelope.budget_band}
                    </p>
                 </div>
                 <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm">
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">선호 무드 키워드</p>
                    <div className="flex flex-wrap gap-2">
                       {bgEnvelope.style_mood_tags?.length > 0 ? (
                         bgEnvelope.style_mood_tags.map((tag: string) => (
                           <span key={tag} className="text-[11px] font-bold bg-slate-100 text-slate-700 px-2 py-1 rounded-md">{tag}</span>
                         ))
                       ) : (
                         <span className="text-xs text-slate-400">선택 키워드 없음</span>
                       )}
                    </div>
                 </div>
               </div>
               
               <div className="bg-white p-4 rounded-xl border border-zinc-200 shadow-sm mt-4">
                  <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">보정 민감도 (Retouching Need)</p>
                  <p className="text-sm font-semibold text-slate-800">{bgEnvelope.original_retouch_sensitivity}</p>
               </div>
            </div>
          </section>

          {/* Right: Vendor's Mock Proposal */}
          <section className="bg-indigo-950 rounded-[2rem] p-8 shadow-2xl border border-indigo-900 flex flex-col h-full relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl pointer-events-none"></div>
            
            <h2 className="text-2xl font-black text-white mb-6 flex items-center justify-between z-10">
              <span className="flex items-center gap-3">
                <span className="text-3xl">💌</span> 공식 핏 제안서 
              </span>
              <span className="text-xs font-bold text-blue-400 bg-blue-900/50 px-3 py-1 rounded-full border border-blue-800">Reviewing</span>
            </h2>

            <div className="space-y-6 flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-sm z-10 flex flex-col justify-center items-center text-center">
               
               {isPending ? (
                 <>
                   <div className="w-16 h-16 relative flex items-center justify-center mb-4">
                      <div className="absolute inset-0 border-4 border-indigo-500/30 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-t-blue-400 rounded-full animate-spin"></div>
                      <span className="text-2xl">👀</span>
                   </div>
                   <h3 className="text-xl font-bold text-white mb-2">{brandName} 실장님이 매칭을 검토 중입니다.</h3>
                   <p className="text-indigo-200 text-sm max-w-sm leading-relaxed mb-8">
                     고객님의 예산과 일정, 그리고 무드 취향을 수용할 수 있는 최적의 L1 확정 견적(투명 프라이싱)을 산출하여 이 곳 딜룸으로 회신해 드립니다.
                   </p>
                   
                   <div className="bg-indigo-900/50 border border-indigo-500/30 rounded-xl p-5 w-full text-left">
                     <p className="text-xs font-black text-indigo-300 uppercase tracking-widest mb-3 flex items-center gap-2">
                       <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                       What's Next?
                     </p>
                     <ul className="text-sm text-indigo-100 flex flex-col gap-2 font-medium">
                       <li className="flex items-start gap-2"><span className="text-blue-400 pt-0.5">•</span> <span>브랜드 담당자가 확정 견적과 예상 핏 매칭률(Score)을 제안합니다.</span></li>
                       <li className="flex items-start gap-2"><span className="text-blue-400 pt-0.5">•</span> <span>고객님이 마음에 드시면, 우선 예약금 송금 후 1차 방문 상담 스케줄이 잡힙니다.</span></li>
                       <li className="flex items-start gap-2"><span className="text-blue-400 pt-0.5">•</span> <span>상담 시 본 딜룸에 기록된 내용은 가격 보장(Price Guarantee)의 기준이 됩니다.</span></li>
                     </ul>
                   </div>
                 </>
               ) : (
                 <div className="w-full text-left">
                   {/* This area is reserved for the future payload rendering */}
                 </div>
               )}

            </div>
          </section>

        </div>
      </div>
    </main>
  );
}
