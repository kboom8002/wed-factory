import React from 'react';

interface FitGuideProps {
  positiveHints: string[];
  negativeHints: string[];  // Regret Risk
}

export function FitGuideBlock({ positiveHints, negativeHints }: FitGuideProps) {
  return (
    <section className="w-full bg-[var(--brand-surface)] border border-gray-100 shadow-sm rounded-2xl overflow-hidden mb-12">
      <div className="bg-[var(--brand-primary)]/10 px-6 py-4 border-b border-[var(--brand-primary)]/20 flex items-center justify-between">
         <h2 className="text-xl font-bold text-[var(--brand-text-main)] flex items-center gap-2">
            <span className="text-2xl">⚖️</span>
            Compare & Fit 안내
         </h2>
         <span className="text-[11px] font-bold tracking-wider uppercase bg-white px-2 py-1 rounded shadow-sm text-[var(--brand-secondary)] hidden sm:block">
           투명성 강화 정책 (L0)
         </span>
      </div>
      
      <div className="p-6 md:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12">
         {/* Best Fit */}
         <div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
               <span className="text-green-500">✅</span> 이런 분들께 추천합니다
            </h3>
            <ul className="space-y-3">
               {positiveHints.map((hint, idx) => (
                 <li key={idx} className="flex gap-3 text-gray-600 font-medium">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-green-400 shrink-0"></div>
                   <p className="leading-relaxed">{hint}</p>
                 </li>
               ))}
            </ul>
         </div>

         {/* Regret Risk (Anti-fit) */}
         <div className="relative">
            <div className="absolute top-0 bottom-0 left-[-2rem] w-px bg-gray-100 hidden md:block"></div>
            <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
               <span className="text-red-500">⚠️</span> 안내사항 (Regret Risk)
            </h3>
            <p className="text-xs font-bold text-red-500/80 mb-4 uppercase tracking-tighter bg-red-50 p-2 rounded-lg border border-red-100">
              저희 브랜드와 핏(Fit)이 맞지 않을 수 있는 요소를 사전에 솔직하게 고지합니다.
            </p>
            <ul className="space-y-3">
               {negativeHints.map((hint, idx) => (
                 <li key={idx} className="flex gap-3 text-gray-600 font-medium opacity-80 decoration-gray-400 line-through decoration-1 hover:no-underline transition-all">
                   <div className="mt-1 w-1.5 h-1.5 rounded-full bg-red-400 shrink-0"></div>
                   <p className="leading-relaxed text-sm">{hint}</p>
                 </li>
               ))}
            </ul>
         </div>
      </div>
    </section>
  );
}
