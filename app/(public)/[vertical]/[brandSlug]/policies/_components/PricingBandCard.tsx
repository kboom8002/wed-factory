import React from 'react';

export interface PricingBandItem {
  band_id: string;
  band_label: string;
  min_estimate: number;
  max_estimate?: number | null;
  included_summary?: string | null;
  excluded_summary?: string | null;
  major_surcharge_axes?: string[] | null;
}

export function PricingBandCard({ bands }: { bands: PricingBandItem[] }) {
  if (!bands || bands.length === 0) {
    return (
      <div className="w-full h-40 flex flex-col items-center justify-center bg-[var(--brand-surface)] border border-dashed border-gray-200 rounded-2xl mb-12">
        <p className="text-gray-400 font-medium">현재 패키지별 가격표가 업데이트되지 않았습니다.</p>
      </div>
    );
  }

  const formatPrice = (price: number) => {
    return (price / 10000).toLocaleString() + '만 원';
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6 mb-16">
      {bands.map((band) => (
        <div key={band.band_id} className="bg-[var(--brand-surface)] rounded-[var(--brand-radius)] border border-[var(--brand-text-muted)]/20 shadow-sm overflow-hidden flex flex-col transition-all hover:shadow-md hover:border-[var(--brand-primary)]/40 relative">
          
          {/* Header */}
          <div className="p-6 pb-4 border-b border-[var(--brand-text-muted)]/10 bg-[var(--brand-bg)]/30">
            <h3 className="text-xl font-bold text-[var(--brand-text-main)] mb-1 tracking-tight">{band.band_label}</h3>
            <div className="text-[var(--brand-primary)] font-black text-2xl flex items-baseline gap-1">
              {formatPrice(band.min_estimate)} 
              {band.max_estimate ? <span className="text-gray-400 text-sm font-semibold">~ {formatPrice(band.max_estimate)}</span> : <span className="text-gray-400 text-sm font-semibold">부터</span>}
            </div>
          </div>

          {/* Surcharge Alert (안티셀링 팩트체크) */}
          {band.major_surcharge_axes && band.major_surcharge_axes.length > 0 && (
            <div className="bg-red-500/10 px-6 py-3 border-b border-red-500/20 flex flex-col gap-2">
              <span className="text-xs font-bold text-red-500 flex items-center gap-1 uppercase tracking-wider">
                <span className="text-lg leading-none">⚠️</span> 필독 추가금 발생 요소
              </span>
              <div className="flex flex-wrap gap-1.5">
                {band.major_surcharge_axes.map((axis, i) => (
                  <span key={i} className="bg-[var(--brand-bg)] border border-red-500/30 text-red-500 font-medium text-[11px] px-2 py-0.5 rounded shadow-sm">
                    {axis}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Body: Inclusions & Exclusions */}
          <div className="p-6 flex-1 flex flex-col gap-4">
            {band.included_summary && (
              <div>
                <h4 className="text-xs font-bold text-[var(--brand-text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1"><span className="text-green-500 font-normal">✔️</span> 기본 포함 내역</h4>
                <p className="text-[var(--brand-text-main)] text-sm leading-relaxed font-medium bg-[var(--brand-bg)]/50 p-3 rounded-xl border border-[var(--brand-text-muted)]/10">
                  {band.included_summary}
                </p>
              </div>
            )}
            
            {band.excluded_summary && (
              <div className="mt-auto pt-4 border-t border-dashed border-[var(--brand-text-muted)]/20">
                <h4 className="text-xs font-bold text-[var(--brand-text-muted)] uppercase tracking-widest mb-2 flex items-center gap-1"><span className="text-red-400 font-normal">❌</span> 불포함 내역 (별도 결제 필요)</h4>
                <p className="text-[var(--brand-text-muted)] text-sm leading-relaxed p-0">
                  {band.excluded_summary}
                </p>
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
