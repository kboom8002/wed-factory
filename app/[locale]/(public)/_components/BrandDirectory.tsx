import React from 'react';
import { Link } from '@/i18n/routing';

export interface PublicBrand {
  brand_id: string;
  brand_name: string;
  brand_slug: string;
  vertical_type: string;
  one_line_summary: string | null;
  base_price_indicator: number | null;
}

export function BrandDirectory({ brands, locale }: { brands: PublicBrand[], locale: string }) {
  if (!brands || brands.length === 0) {
    return (
      <section id="directory" className="w-full bg-zinc-950 py-32 text-center text-zinc-500 font-medium tracking-tight">
        <p>현재 퍼블릭 공개(L0) 승인을 받은 입점 브랜드가 없습니다.</p>
      </section>
    );
  }

  const formatPrice = (price: number | null) => {
    if (!price) {
      return locale === 'ko' ? '견적 비공개' : locale === 'ja' ? '見積もり非公開' : 'Price Upon Request';
    }
    return locale === 'ko' ? (price / 10000).toLocaleString() + '만 원 ~' :
           locale === 'ja' ? (price * 110).toLocaleString() + '円 ~' :
           '$' + Math.floor(price / 1300).toLocaleString() + ' ~';
  };

  return (
    <section id="directory" className="w-full bg-black py-24 md:py-32 flex justify-center border-t-8 border-indigo-500/10">
      <div className="max-w-6xl w-full px-6 flex flex-col items-center">
        
        <div className="text-center mb-16">
           <h2 className="text-3xl md:text-5xl font-black text-white mb-4">
             {locale === 'ko' ? '공식 입점 스튜디오 웜홀' : locale === 'ja' ? '公式提携スタジオ ギャラリー' : 'Official Partners Wormhole'}
           </h2>
           <p className="text-zinc-400 font-medium">
             {locale === 'ko' ? '단 하나의 숨김도 없이, 이 엄격한 플랫폼의 팩트체크를 견뎌낸 명품 브랜드 아카이브.' :
              locale === 'ja' ? '一つも隠すことなく、厳しいファクトチェックを通過したプレミアムブランドアーカイブ。' :
              'A genuine archive of premium brands that passed our strict zero-bs fact-checks.'}
           </p>
        </div>

        {/* Directory Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
           {brands.map((b) => (
             <Link 
               href={`/${b.vertical_type}/${b.brand_slug}`} 
               key={b.brand_id} 
               className="group relative block w-full bg-zinc-900 overflow-hidden rounded-3xl border border-zinc-800 hover:border-indigo-500/50 transition-colors shadow-xl h-[320px] flex flex-col items-center justify-center p-8 text-center"
             >
                {/* Visual Vibe Mesh on Hover */}
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none duration-700"></div>
                <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-white/5 rounded-full blur-[40px] group-hover:bg-indigo-500/20 transition-all duration-700"></div>

                <div className="relative z-10 w-full h-full flex flex-col justify-center items-center">
                   <span className="text-xs font-bold text-zinc-500 bg-black px-2 py-1 rounded-full uppercase tracking-widest border border-zinc-800 mb-6">
                     {b.vertical_type.toUpperCase()}
                   </span>

                   <h3 className="text-3xl font-black text-white leading-none tracking-tight mb-2 group-hover:-translate-y-1 transition-transform">
                     {b.brand_name}
                   </h3>
                   
                   <p className="text-indigo-400 font-bold mb-4 group-hover:-translate-y-1 transition-transform">{formatPrice(b.base_price_indicator)}</p>
                   
                   <p className="text-sm font-medium text-zinc-500 italic max-w-xs line-clamp-2 leading-relaxed opacity-0 group-hover:opacity-100 -translate-y-4 group-hover:translate-y-0 transition-all duration-500 delay-75">
                     "{b.one_line_summary}"
                   </p>
                </div>
                
                <div className="absolute bottom-6 font-bold text-[11px] text-zinc-600 uppercase tracking-widest flex items-center gap-1 group-hover:text-indigo-300 transition-colors">
                   Enter Dealroom →
                </div>
             </Link>
           ))}
        </div>

      </div>
    </section>
  );
}
