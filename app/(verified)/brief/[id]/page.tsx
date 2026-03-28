import { createClient } from '@/core/utils/supabase/server';
import { notFound } from 'next/navigation';

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

  // 2. 조합(Combination) 이름 매핑용 (옵션)
  let comboTitle = '지정 안 된 조합';
  if (bgEnvelope.target_combination_id) {
    const { data: combo } = await supabase
       .from('combination_type')
       .select('title')
       .eq('combination_id', bgEnvelope.target_combination_id)
       .single();
    if (combo) comboTitle = combo.title;
  }

  // MVP: Vendor L1 Mock 매핑 데이터 (추후 VendorEnvelope 테이블 매핑 쿼리로 대체)
  const vendorCombinationL1 = {
      studio: { name: '비슈어 스튜디오', price_range: '120~150', fit_score: '85%' },
      dress: { name: '브라이덜 공', price_range: '300~450', fit_score: '95%' },
      makeup: { name: '정샘물 웨스트', price_range: '60~80', fit_score: '90%' }
  };

  const riskSummary = '드레스 중심 예산 초과 가능성 존재. 고객님의 우선순위인 "원본 무료 제공" 옵션이 스튜디오의 기본 정책과 일부 상충될 수 있어 L2 오프라인 상담 시 확실한 조율이 필요합니다.';

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center py-10 px-4">
      <div className="w-full max-w-4xl space-y-8">
        
        {/* 1. Verified Header */}
        <div className="bg-slate-900 rounded-2xl p-8 flex justify-between items-center shadow-md">
          <div className="text-white">
             <span className="bg-blue-500 text-[10px] font-black uppercase px-2 py-1 rounded-sm mb-3 inline-block tracking-wider">L1 Verified Access</span>
             <h1 className="text-2xl font-bold mb-1">매칭 리포트 (Fit Brief) 완성본</h1>
             <p className="text-slate-400 font-medium text-sm block">조합: {comboTitle}</p>
          </div>
          <button className="bg-white text-slate-900 font-bold px-5 py-2.5 rounded-lg text-sm transition hover:bg-gray-100 flex gap-2 items-center">
            🔐 보안 계약 카카오 연동
          </button>
        </div>

        {/* 2. envelopes comparison */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col md:flex-row gap-6">
           {/* 고객 측 Envelope */}
           <div className="flex-1 bg-slate-50 border border-slate-100 p-5 rounded-xl text-sm">
              <h3 className="font-bold text-slate-800 mb-4 border-b pb-3 flex justify-between">
                <span>Bride/Groom Envelope (L1 요약)</span>
                <span className="text-slate-400 text-[10px] uppercase">수요자 Base</span>
              </h3>
              <ul className="space-y-3 font-medium text-slate-700">
                <li><strong className="text-slate-400 block pb-0.5">예산 비중 (Budget Band)</strong> {bgEnvelope.budget_band}</li>
                <li><strong className="text-slate-400 block pb-0.5">일정 (Time Window)</strong> {bgEnvelope.schedule_window}</li>
                <li>
                  <strong className="text-slate-400 block pb-1.5">선호 우선순위 (Priorities)</strong> 
                  <div className="flex flex-wrap gap-1.5">
                    {bgEnvelope.priority_tags && bgEnvelope.priority_tags.length > 0 ? (
                      bgEnvelope.priority_tags.map((tag: string, i: number) => (
                        <span key={i} className="bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded text-xs shadow-sm">{tag}</span>
                      ))
                    ) : (
                      <span className="text-gray-400 italic">선택 항목 없음</span>
                    )}
                  </div>
                </li>
              </ul>
           </div>
           
           <div className="w-12 flex justify-center items-center">
             <span className="bg-blue-100 text-blue-600 font-bold text-[11px] px-2.5 py-1 rounded-full shadow-sm tracking-wide">매칭결과</span>
           </div>
           
           {/* 플랫폼 측 Vendor Envelope */}
           <div className="flex-1 bg-blue-50/50 border border-blue-100 p-5 rounded-xl text-sm">
              <h3 className="font-bold text-blue-900 mb-4 border-b border-blue-200/50 pb-3 flex justify-between">
                <span>Vendor Envelope (L1 확정 실명)</span>
                <span className="text-blue-500 text-[10px] font-semibold uppercase">공급자 패키지 현황</span>
              </h3>
              <ul className="space-y-3 text-blue-900">
                <li className="flex justify-between items-center"><strong className="text-blue-500 w-16 block">Studio</strong> {vendorCombinationL1.studio.name} <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold border shadow-sm">{vendorCombinationL1.studio.price_range}만</span></li>
                <li className="flex justify-between items-center"><strong className="text-blue-500 w-16 block">Dress</strong> {vendorCombinationL1.dress.name} <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold border shadow-sm">{vendorCombinationL1.dress.price_range}만</span></li>
                <li className="flex justify-between items-center"><strong className="text-blue-500 w-16 block">Makeup</strong> {vendorCombinationL1.makeup.name} <span className="bg-white px-1.5 py-0.5 rounded text-[10px] font-bold border shadow-sm">{vendorCombinationL1.makeup.price_range}만</span></li>
              </ul>
              <div className="mt-5 bg-blue-100 p-3 rounded-lg text-blue-800 font-bold flex justify-between items-center text-sm shadow-sm border border-blue-200/50">
                <span>총합 최소 금액(L1)</span>
                <span className="text-lg">480만원 예상</span>
              </div>
           </div>
        </section>

        {/* 3. Fit & Regret Risk Skeleton */}
        <section className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col">
          <h2 className="text-lg font-bold text-gray-800 mb-4">팩트체크 및 후회 리스크 점검</h2>
          <div className="bg-red-50 p-5 rounded-xl border border-red-100 mb-6 flex gap-3">
             <span className="text-xl mt-0.5">🚨</span>
             <p className="text-red-800 font-medium leading-relaxed text-[15px]">{riskSummary}</p>
          </div>
          
          <button className="bg-blue-600 text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:bg-blue-700 transition w-full text-lg">
             총 3개 업체 오프라인 방문 예약하기 (L2 진입)
          </button>
          <div className="text-center mt-4">
             <span className="text-xs text-gray-400 font-medium">오프라인 상담 진행 시부터 L2 등급의 정확한 세부 금액/계약서가 열람 허용됩니다.</span>
          </div>
        </section>

      </div>
    </main>
  );
}
