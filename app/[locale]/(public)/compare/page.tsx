import { CombinationTypeProjection, HubCombinationData } from '@/hub/projections/CombinationTypeProjection';

const MOCK_COMBINATIONS: HubCombinationData[] = [
  {
    id: 'COMB-001',
    brand_name: '샘플 스튜디오',
    title: '인물 중심 스탠다드 로맨틱 조합',
    studio_summary: '심플한 배경지와 인물 중심의 따뜻한 조명 촬영',
    dress_summary: '화려한 비즈보다는 레이스 혹은 실크 A라인',
    makeup_summary: '피부결을 살린 맑고 내추럴한 색조',
    regret_risks: '배경이 단순하여 나중에 보기에 심심하다고 느낄 수 있음. 볼레로 등 소품 변형이 필수.',
    visibility_level: 'L0'
  },
  {
    id: 'COMB-002',
    brand_name: '투명하고 화려한 프리미엄',
    title: '호텔 예식 최적화 풀 비즈 세트',
    studio_summary: '야간 씬 및 화려한 샹들리에 배경 믹스',
    dress_summary: '은은하게 반짝이는 스와로브스키 비즈의 벨라인',
    makeup_summary: '또렷한 이목구비 강조와 아이 포인트 메이크업',
    regret_risks: '신랑측 어두운 정장과 대비되어 신부만 튈 수 있으니 사전에 채도 조정 필수',
    visibility_level: 'L0'
  }
];

export default function CompareHubPage() {
  return (
    <main className="min-h-screen bg-gray-50 flex flex-col items-center">
      {/* 1. Compare Hub Header */}
      <section className="w-full bg-slate-800 flex flex-col justify-center items-center text-white py-16 px-4 text-center border-b-[8px] border-slate-700">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-5 tracking-tight">유형별 조합 비교 (Filter & Fit)</h1>
        <p className="text-lg md:text-xl max-w-2xl font-medium text-slate-300">
          단일 브랜드가 아닌 "스드메가 완성된 시점의 무드"를 비교하세요.<br/>
          광고성 리뷰가 아닌 구조화된 리스크(Regret Risks)와 예상 핏을 제공합니다.
        </p>
      </section>

      {/* 2. Visual Filter Mockup */}
      <section className="w-full max-w-5xl px-4 -mt-8 relative z-10">
        <div className="bg-white p-6 justify-center flex gap-4 rounded-xl shadow-lg border border-slate-200">
          <select className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-4 py-3 outline-none min-w-[150px] font-medium shadow-sm">
            <option>촬영 무드 전체</option>
            <option>인물 중심 (심플)</option>
            <option>배경 중심 (화려)</option>
            <option>야외 스냅 (자연)</option>
          </select>
          <select className="bg-slate-50 border border-slate-300 text-slate-800 rounded-lg px-4 py-3 outline-none min-w-[150px] font-medium shadow-sm">
            <option>드레스 스타일 전체</option>
            <option>비즈 뿜뿜</option>
            <option>실크 단아함</option>
            <option>레이스 클래식</option>
          </select>
          <button className="bg-blue-600 font-bold px-8 py-3 rounded-lg hover:bg-blue-700 transition text-white shadow-md">
            조건 좁혀서 비교하기
          </button>
        </div>
      </section>

      {/* 3. Combination Projection Grid */}
      <section className="w-full max-w-5xl px-4 py-12">
        <div className="flex justify-between items-end mb-8 border-b border-gray-200 pb-4">
          <h2 className="text-2xl font-extrabold text-slate-800">대표 추천 조합</h2>
          <span className="text-sm text-slate-500 font-bold bg-slate-100 px-3 py-1 rounded-full">Results: {MOCK_COMBINATIONS.length}개</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {MOCK_COMBINATIONS.map((combo, i) => (
            <CombinationTypeProjection key={i} data={combo} />
          ))}
        </div>
      </section>

      {/* 4. Fit Brief Request CTA */}
      <section className="w-full max-w-5xl px-4 pb-20">
        <div className="bg-gradient-to-r from-blue-900 to-slate-900 rounded-3xl p-10 text-center flex flex-col items-center">
          <span className="text-4xl mb-4">📝</span>
          <h3 className="text-2xl font-bold text-white mb-3">어떤 조합이 어울릴지 확신이 없으신가요?</h3>
          <p className="text-slate-300 mb-8 max-w-lg text-[15px] font-medium">우리 예산, 장점, 취항 등 10가지 짧은 객관식 답변만 입력하시면 L1 Verified 등급의 상세 Fit Brief(맞춤 추천 견적 + 업체 실명)을 보내드립니다.</p>
          <button className="bg-white text-blue-900 font-bold px-10 py-4 mb-2 rounded-xl text-lg hover:shadow-xl transition-all shadow-md mt-2">
            내 취향으로 Fit 브리프 무료 진단받기
          </button>
        </div>
      </section>
    </main>
  );
}
