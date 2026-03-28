import React from 'react';

export function EngineShowcase() {
  const engines = [
    {
      title: 'Zero-BS Pricing',
      sub: '숨겨진 위약금 강제 박제',
      icon: '💵',
      desc: '본식 헬퍼 이모님 식대부터 야간 촬영 추가금, 터무니없는 노쇼 위약금까지. 웨딩 업계의 부조리한 독소 조항들을 UI 최상단에 강제로 고시합니다.'
    },
    {
      title: 'Anti-Selling Fit',
      sub: '우리와 안 맞는 고객 고지',
      icon: '⚖️',
      desc: '모두를 위한 스튜디오는 없습니다. 과한 성형 보정을 원하시거나, 우리와 톤앤매너가 맞지 않는 고객의 이탈을 오히려 적극 장려하는 안티 셀링 엔진입니다.'
    },
    {
      title: 'Audit Trust Log',
      sub: '팩토리 관리자 서면 인증',
      icon: '📜',
      desc: '알바를 동원한 감성 리뷰를 전면 금지합니다. 오직 웨딩 팩토리의 엄격한 서류 대조 통과 내역과 타임라인 로그만이 브랜드를 보증합니다.'
    }
  ];

  return (
    <section className="w-full bg-zinc-900 py-24 flex justify-center border-t border-zinc-800 border-b">
      <div className="max-w-6xl w-full px-6 flex flex-col items-center">
        
        <div className="text-center mb-16 max-w-2xl">
           <h2 className="text-3xl font-black text-white mb-4">웨딩이 공정해지는 3가지 엔진</h2>
           <p className="text-zinc-400 font-medium">플랫폼에 입점한 브랜드들은 매 월 강도 높은 팩트체크 시스템에 의해 감시당하며, 오직 소비자 친화적인 투명성을 유지할 때만 L0 등급으로 생존합니다.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full">
           {engines.map((eg, idx) => (
             <div key={idx} className="bg-zinc-950 border border-zinc-800 rounded-3xl p-8 hover:border-zinc-700 transition-colors shadow-2xl flex flex-col items-center text-center">
               <span className="text-5xl mb-6 bg-zinc-900 p-4 rounded-2xl border border-zinc-800">{eg.icon}</span>
               <h3 className="font-bold text-white text-xl mb-1 tracking-tight">{eg.title}</h3>
               <span className="text-xs font-bold text-indigo-400 uppercase tracking-widest mb-4 inline-block">{eg.sub}</span>
               <p className="text-sm text-zinc-500 font-medium leading-relaxed">
                 {eg.desc}
               </p>
             </div>
           ))}
        </div>

      </div>
    </section>
  );
}
