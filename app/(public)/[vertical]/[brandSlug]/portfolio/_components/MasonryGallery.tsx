import React from 'react';

export interface PortfolioItem {
  shot_id: string;
  cdn_url: string;
  mood_tags: string[];
  caption?: string | null;
}

export function MasonryGallery({ items }: { items: PortfolioItem[] }) {
  if (!items || items.length === 0) {
    return (
      <div className="w-full h-80 flex flex-col items-center justify-center bg-[var(--brand-surface)] border border-dashed border-gray-200 rounded-3xl mt-8">
        <span className="text-4xl mb-4">🖼️</span>
        <h3 className="text-gray-900 font-bold mb-2">포트폴리오 대기 중</h3>
        <p className="text-gray-500 font-medium text-sm text-center">
          현재 브랜드의 화보 스타일 룩북을<br />선별 및 업데이트하고 있습니다.
        </p>
      </div>
    );
  }

  return (
    <div className="columns-1 sm:columns-2 md:columns-3 gap-6 space-y-6">
      {items.map((item) => (
        <div 
          key={item.shot_id} 
          className="break-inside-avoid relative rounded-[var(--brand-radius)] overflow-hidden shadow-sm group bg-gray-100 min-h-[200px]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img 
            src={item.cdn_url} 
            alt="Portfolio Shot" 
            className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105"
            loading="lazy"
          />
          
          {/* Hover Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
            <div className="flex flex-wrap gap-2 mb-3">
              {(item.mood_tags || []).map((tag, i) => (
                <span key={i} className="px-2 py-1 bg-white/20 backdrop-blur-md rounded text-[11px] font-bold text-white tracking-wider uppercase border border-white/10">
                  #{tag}
                </span>
              ))}
            </div>
            {item.caption && (
              <p className="text-white text-sm font-medium leading-relaxed drop-shadow-md">
                {item.caption}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
