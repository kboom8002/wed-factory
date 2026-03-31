import React from 'react';

export function HeroBlock({ brandName, verticalType, heroBgUrl, subtitle }: { brandName: string; verticalType: string; heroBgUrl?: string | null, subtitle?: string }) {
  // 배경 이미지가 있을 경우의 인라인 스타일
  const bgStyle = heroBgUrl ? { backgroundImage: `url('${heroBgUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

  return (
    <section 
      className={`w-full h-96 flex flex-col justify-center items-center px-4 text-center transition-colors duration-500 ease-in-out relative ${!heroBgUrl ? 'bg-[var(--brand-primary)] text-[var(--brand-surface)]' : 'text-white'}`}
      style={bgStyle}
    >
      {/* 배경 이미지가 있을 때 텍스트 가독성을 위한 다크 오버레이 */}
      {heroBgUrl && <div className="absolute inset-0 bg-black/50 pointer-events-none"></div>}
      
      <div className="relative z-10 w-full flex flex-col items-center">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">{brandName}</h1>
        <p className={`text-xl md:text-2xl ${heroBgUrl ? 'text-white/80' : 'text-[var(--brand-surface)]/80'}`}>
          {subtitle || `웨딩 스드메 AI홈페이지 Factory - ${verticalType} 공식 테넌트`}
        </p>
      </div>
    </section>
  );
}
