'use client';

import { useState } from 'react';
import { batchTranslateBrand } from '@/app/actions/i18nActions';

export function TranslateActionBlock({ brandSlug, currentStats }: { brandSlug: string, currentStats: any }) {
  const [isTranslating, setIsTranslating] = useState(false);
  const [result, setResult] = useState<{success: boolean, message: string} | null>(null);

  const handleTranslate = async () => {
    if (!confirm('Gemini 2.5 Pro를 통해 한국어 기반 다국어 일괄 번역을 시작하시겠습니까? (API 비용이 발생합니다)')) {
      return;
    }
    
    setIsTranslating(true);
    setResult(null);

    const res = await batchTranslateBrand(brandSlug);
    setResult(res);
    setIsTranslating(false);
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Auto-Localization Engine</h2>
          <p className="text-gray-500 text-sm">
            데이터베이스 내 생성된 브랜드 텍스트(조합, 정책, Q&A 등)를 스캔하여 번역이 없는 항목에 대해 영어/일본어 JSON 구조를 생성합니다.
          </p>
        </div>
        <button
          onClick={handleTranslate}
          disabled={isTranslating}
          className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all ${
            isTranslating 
              ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
              : 'bg-indigo-600 text-white hover:bg-indigo-700 shadow-md hover:shadow-lg focus:ring-4 focus:ring-indigo-100'
          }`}
        >
          {isTranslating ? (
            <>
              <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              번역 파이프라인 가동 중...
            </>
          ) : (
            <>🌐 글로벌 일괄 번역 시작</>
          )}
        </button>
      </div>

      {result && (
        <div className={`mt-4 p-4 rounded-xl border ${result.success ? 'bg-green-50 border-green-200 text-green-800' : 'bg-red-50 border-red-200 text-red-800'}`}>
          <div className="font-bold mb-1">{result.success ? '번역 완료' : '오류 발생'}</div>
          <div className="text-sm">{result.message}</div>
        </div>
      )}

      {/* Progress / Status Mock UI */}
      <div className="mt-8 border-t border-gray-100 pt-6">
        <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-4">현재 번역 맵핑 진행률</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <StatBox label="Brand Registry" total={1} done={currentStats.brandDone} />
          <StatBox label="Combinations" total={currentStats.comboTotal} done={currentStats.comboDone} />
          <StatBox label="Policies" total={currentStats.policyTotal} done={currentStats.policyDone} />
          <StatBox label="Answers" total={currentStats.answerTotal} done={currentStats.answerDone} />
        </div>
      </div>
    </div>
  );
}

function StatBox({ label, total, done }: { label: string, total: number, done: number }) {
  const isComplete = total > 0 && total === done;
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  
  return (
    <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 flex flex-col justify-between">
      <div className="text-xs font-bold text-gray-400 mb-2 truncate">{label}</div>
      <div className="flex items-end justify-between">
        <div className="text-2xl font-black text-gray-800">
          {done}<span className="text-sm text-gray-400 font-medium">/{total}</span>
        </div>
        <div className={`text-xs font-bold px-2 py-0.5 rounded-full ${isComplete ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
          {pct}%
        </div>
      </div>
    </div>
  );
}
