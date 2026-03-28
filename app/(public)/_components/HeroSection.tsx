import React from 'react';

export function HeroSection() {
  return (
    <section className="relative w-full min-h-[90vh] flex flex-col items-center justify-center bg-zinc-950 overflow-hidden text-center px-6 py-20">
      
      {/* Background Glow / Vibe Mesh */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-indigo-500/20 rounded-full blur-[120px] pointer-events-none mix-blend-screen"></div>
      <div className="absolute bottom-0 right-[-10%] w-[60vw] h-[60vw] max-w-[600px] max-h-[600px] bg-rose-500/10 rounded-full blur-[100px] pointer-events-none mix-blend-screen"></div>

      <div className="relative z-10 max-w-4xl flex flex-col items-center">
         <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-zinc-800 bg-zinc-900/50 backdrop-blur-md text-xs font-bold text-zinc-400 tracking-widest uppercase mb-8">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Private L0 Hub Engine Operational
         </div>

         <h1 className="text-4xl sm:text-5xl md:text-7xl font-black tracking-tighter text-white leading-tight mb-6">
            모든 결제와 위약금이<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-rose-400">
               팩트체크 당한 오직 1%
            </span>
         </h1>

         <p className="text-lg md:text-xl text-zinc-400 font-medium max-w-2xl leading-relaxed mb-12">
            숨겨진 추가금, 불리한 환불 규정, 알바를 동원한 가짜 감성 후기.<br />
            웨딩 팩토리는 극강의 <strong className="text-zinc-200">데이터 투명성(B-SSoT)</strong> 심사를 통과한 하이엔드/프리미엄 브랜드만을 선별합니다.
         </p>

         <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <a href="#directory" className="px-8 py-4 rounded-xl bg-white text-zinc-950 font-bold text-lg hover:bg-zinc-200 transition-colors shadow-lg shadow-white/10 active:scale-95">
               입점 스튜디오 탐색
            </a>
            <button className="px-8 py-4 rounded-xl bg-zinc-900 border border-zinc-800 text-white font-bold text-lg hover:bg-zinc-800 transition-colors active:scale-95">
               내 맞춤 핏(Fit) 의뢰하기
            </button>
         </div>
         
         <p className="text-xs text-zinc-600 mt-6 font-bold tracking-widest uppercase">
            No Hidden Fees · Anti-selling Fit · Absolute Trust
         </p>
      </div>

    </section>
  );
}
