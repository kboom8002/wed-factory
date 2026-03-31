'use client';

import React from 'react';
import { VibeSpec } from '@/core/design-system/vibe-registry';
import { getContrastRatio, checkWCAG } from '@/core/utils/color-contrast';

interface Props {
  spec: VibeSpec;
}

export function ContrastReport({ spec }: Props) {
  const { colors } = spec;

  const bgTextRatio = getContrastRatio(colors.background, colors.textMain);
  const surfaceTextRatio = getContrastRatio(colors.surface, colors.textMain);
  const primaryTextRatio = getContrastRatio(colors.primary, colors.surface);

  const bgResult = checkWCAG(bgTextRatio);
  const surfaceResult = checkWCAG(surfaceTextRatio);
  const primaryResult = checkWCAG(primaryTextRatio);

  const getStatusBadge = (passed: boolean, level: string) => {
    if (passed) return <span className="bg-emerald-100 text-emerald-700 font-bold px-2 py-0.5 rounded text-xs">PASS ({level})</span>;
    if (level === 'Large Text Only') return <span className="bg-yellow-100 text-yellow-700 font-bold px-2 py-0.5 rounded text-xs">⚠ Warning</span>;
    return <span className="bg-red-100 text-red-700 font-bold px-2 py-0.5 rounded text-xs animate-pulse">FAIL 🚨</span>;
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col gap-4">
      <h3 className="font-bold text-slate-800 text-lg flex items-center gap-2">
        <span>🔍</span> 실시간 WCAG 가독성 분석 (접근성)
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-2">
        {/* BG vs Text */}
        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${bgResult.passed ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/50'}`}>
           <p className="text-xs font-bold text-slate-500">전체 배경 ↔ 메인 텍스트</p>
           <div className="flex justify-between items-center">
             <span className="text-xl font-black">{bgTextRatio.toFixed(2)} : 1</span>
             {getStatusBadge(bgResult.passed, bgResult.level)}
           </div>
           {!bgResult.passed && <p className="text-[10px] text-red-600 font-bold mt-1">텍스트를 배경과 더 대비되게 수정하세요.</p>}
        </div>

        {/* Surface vs Text */}
        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${surfaceResult.passed ? 'border-emerald-200 bg-emerald-50/30' : 'border-red-200 bg-red-50/50'}`}>
           <p className="text-xs font-bold text-slate-500">카드 표면 ↔ 메인 텍스트</p>
           <div className="flex justify-between items-center">
             <span className="text-xl font-black">{surfaceTextRatio.toFixed(2)} : 1</span>
             {getStatusBadge(surfaceResult.passed, surfaceResult.level)}
           </div>
           {!surfaceResult.passed && <p className="text-[10px] text-red-600 font-bold mt-1">카드 배경색과 글자색이 너무 비슷합니다.</p>}
        </div>

        {/* Primary vs Surface (Button Text) */}
        <div className={`p-4 rounded-lg border flex flex-col gap-2 ${primaryResult.passed ? 'border-emerald-200 bg-emerald-50/30' : 'border-yellow-200 bg-yellow-50/50'}`}>
           <p className="text-xs font-bold text-slate-500">포인트 컬러 ↔ 버튼/표면 글씨</p>
           <div className="flex justify-between items-center">
             <span className="text-xl font-black">{primaryTextRatio.toFixed(2)} : 1</span>
             {getStatusBadge(primaryResult.passed, primaryResult.level)}
           </div>
           {!primaryResult.passed && <p className="text-[10px] text-yellow-700 font-bold mt-1">큰 버튼에는 괜찮지만 작은 글씨엔 부적합합니다.</p>}
        </div>
      </div>
    </div>
  );
}
