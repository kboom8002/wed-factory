import React from 'react';

export function TrustStrip() {
  return (
    <section className="w-full max-w-4xl bg-[var(--brand-surface)] border-b px-6 py-4 flex flex-col sm:flex-row text-sm text-[var(--brand-text-muted)] justify-between items-center shadow-sm -mt-6 rounded-t-xl z-10 relative">
      <div className="flex items-center space-x-2">
        <span>✅ 리뷰 확인 완료: 최신 업데이트 검증됨</span>
        <span className="font-semibold text-[var(--brand-secondary)]">L0 Public Surface</span>
      </div>
      <button className="text-[var(--brand-accent)] hover:underline mt-2 sm:mt-0 font-medium tracking-tight">
        업데이트 제안 및 오류 제보
      </button>
    </section>
  );
}
