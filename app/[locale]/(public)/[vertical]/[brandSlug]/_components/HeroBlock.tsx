import React from 'react';

export function HeroBlock({ brandName, verticalType, heroBgUrl, subtitle }: { brandName: string; verticalType: string; heroBgUrl?: string | null, subtitle?: string }) {
  // 공백, 한글 특수문자 대응을 위한 URI 안전 인코딩 적용
  const safeUrl = heroBgUrl ? encodeURI(heroBgUrl) : null;
  const bgStyle = safeUrl ? { backgroundImage: `url('${safeUrl}')`, backgroundSize: 'cover', backgroundPosition: 'center' } : {};

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
