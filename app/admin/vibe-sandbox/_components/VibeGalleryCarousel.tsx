'use client';

import React from 'react';
import { VibeSpec, VIBE_DICTIONARY } from '@/core/design-system/vibe-registry';

interface Props {
  currentVibeId: string;
  onSelect: (spec: VibeSpec) => void;
}

export function VibeGalleryCarousel({ currentVibeId, onSelect }: Props) {
  const allSpecs = Object.values(VIBE_DICTIONARY);

  // 무드보드에 카드를 그리는 함수
  const renderCard = (spec: VibeSpec) => {
    const isSelected = spec.id === currentVibeId;
    const { primary, secondary, background, surface, textMain, accent } = spec.colors;
    
    return (
      <button
        key={spec.id}
        onClick={() => onSelect(spec)}
        className={`flex-none w-56 snap-start text-left bg-white rounded-2xl shadow-sm border-2 overflow-hidden transition-all duration-300 hover:scale-[1.02] focus:outline-none ${isSelected ? 'border-blue-500 shadow-lg ring-4 ring-blue-500/20' : 'border-slate-200 hover:border-blue-300'}`}
      >
        {/* 상단: 컬러 스와치 & 폰트 무드보드 */}
        <div 
          className="h-24 w-full flex items-center justify-between p-4 relative"
          style={{ backgroundColor: background }}
        >
          {/* 우측 상단 배경 장식용 원형 */}
          <div 
            className="absolute -top-4 -right-4 w-16 h-16 rounded-full opacity-50 blur-xl" 
            style={{ backgroundColor: accent }} 
          />
          
          <div className="z-10 flex flex-col pt-1">
             <span className={`text-3xl font-bold leading-none ${spec.typography.fontFamilyClass}`} style={{ color: textMain }}>
               Ag
             </span>
             <span className="text-[10px] mt-1 opacity-60 font-medium" style={{ color: textMain }}>
                {spec.typography.fontFamilyClass.includes('Sans') ? 'Sans-Serif' : spec.typography.fontFamilyClass.includes('Serif') ? 'Serif' : 'Display'}
             </span>
          </div>
          
          <div className="z-10 flex flex-col items-center gap-1.5 p-1.5 rounded-full" style={{ backgroundColor: surface, boxShadow: `0 4px 10px rgba(0,0,0,0.05)` }}>
             <div className="w-5 h-5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: primary }} title="Primary" />
             <div className="w-5 h-5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: secondary }} title="Secondary" />
             <div className="w-5 h-5 rounded-full shadow-inner border border-black/5" style={{ backgroundColor: accent }} title="Accent" />
          </div>
        </div>

        {/* 하단: 타이틀 정보 */}
        <div className="p-4 border-t border-slate-100 bg-white">
          <p className="text-xs text-slate-400 font-bold uppercase tracking-widest mb-1 truncate block">{spec.id}</p>
          <h4 className="text-sm font-black text-slate-800 leading-tight line-clamp-2">
            {spec.name}
          </h4>
        </div>
      </button>
    );
  };

  return (
    <div className="w-full flex flex-col gap-3 my-2">
      <div className="flex items-center justify-between px-2">
        <h3 className="font-bold text-slate-800 flex items-center gap-2">
          <span>✨</span> Vibe 무드보드 갤러리 
          <span className="text-xs bg-blue-100 text-blue-700 font-black px-2 py-0.5 rounded-full ml-1">
            {allSpecs.length} Themes
          </span>
        </h3>
        <p className="text-xs text-slate-500 font-medium">← 좌우로 스크롤하여 탐색 →</p>
      </div>
      
      {/* 가로 스와이프 레일 */}
      <div className="w-full overflow-x-auto pb-6 pt-2 px-2 snap-x hide-scrollbars flex gap-4">
        {allSpecs.map(renderCard)}
      </div>
      <style dangerouslySetInnerHTML={{__html:`
        .hide-scrollbars::-webkit-scrollbar { height: 6px; }
        .hide-scrollbars::-webkit-scrollbar-track { background: transparent; }
        .hide-scrollbars::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 10px; }
        .hide-scrollbars:hover::-webkit-scrollbar-thumb { background: #94a3b8; }
      `}} />
    </div>
  );
}
