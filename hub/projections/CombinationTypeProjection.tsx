import Link from 'next/link';

export interface HubCombinationData {
  id: string;
  brand_name: string;
  title: string;
  studio_summary?: string;
  dress_summary?: string;
  makeup_summary?: string;
  regret_risks?: string;
  visibility_level: string;
}

export function CombinationTypeProjection({ data }: { data: HubCombinationData }) {
  if (data.visibility_level !== 'L0') return null; // L0 검증 (Hub 공통 룰)

  return (
    <div className="bg-white border rounded-2xl shadow-sm hover:shadow-md transition relative flex flex-col p-6 h-full border-gray-100">
      <div className="absolute -top-3 left-6 bg-blue-100 border border-blue-200 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
        조합 제안
      </div>
      
      <div className="mt-2 mb-4">
        <span className="text-xs text-gray-500 font-medium tracking-tight mb-1 block">by {data.brand_name}</span>
        <h3 className="text-2xl font-bold text-gray-900 leading-tight">
          {data.title}
        </h3>
      </div>

      <div className="flex-1 space-y-3 mt-4 text-[15px]">
        {data.studio_summary && (
          <div className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-lg">
            <span className="text-xl">📷</span>
            <p className="text-gray-800"><strong className="font-semibold text-gray-900 mr-2">Studio</strong>{data.studio_summary}</p>
          </div>
        )}
        {data.dress_summary && (
          <div className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-lg">
            <span className="text-xl">👗</span>
            <p className="text-gray-800"><strong className="font-semibold text-gray-900 mr-2">Dress</strong>{data.dress_summary}</p>
          </div>
        )}
        {data.makeup_summary && (
          <div className="flex items-start gap-3 bg-gray-50/50 p-3 rounded-lg">
            <span className="text-xl">💄</span>
            <p className="text-gray-800"><strong className="font-semibold text-gray-900 mr-2">Makeup</strong>{data.makeup_summary}</p>
          </div>
        )}
      </div>

      {data.regret_risks && (
        <div className="mt-5 p-4 border border-red-50 bg-red-50/30 rounded-lg text-sm flex gap-3 text-red-900/80">
          <span className="text-base text-red-400">🚨</span>
          <div>
            <span className="font-bold block mb-1 text-red-700">후회 방지 체크리스크</span>
            <p className="text-red-800 leading-relaxed font-medium">{data.regret_risks}</p>
          </div>
        </div>
      )}

      <div className="mt-6 pt-5 border-t border-gray-100/80 text-center">
        <Link 
          href={`/compare/brief?combination_id=${data.id}`}
          className="bg-gray-900 text-white w-full flex justify-center py-3.5 rounded-xl font-bold hover:bg-black transition-colors shadow-sm"
        >
          해당 조합으로 Fit 브리프 요청하기
        </Link>
        <p className="text-xs text-gray-400 mt-3 flex items-center justify-center gap-1.5 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span> 
          L1 Verified 맞춤 견적 확인
        </p>
      </div>
    </div>
  );
}
