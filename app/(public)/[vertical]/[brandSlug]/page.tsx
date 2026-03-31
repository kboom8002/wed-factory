import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { projectAnswerCard, RawAnswerCard } from '@/core/engines/projection';
import { createClient } from '@/core/utils/supabase/server';
import { HeroBlock } from './_components/HeroBlock';
import { TrustStrip } from './_components/TrustStrip';
import { QnaCardList } from './_components/QnaCardList';
import Link from 'next/link';

export default async function BrandHomePage({
  params,
}: {
  params: Promise<{ vertical: string; brandSlug: string }>
}) {
  const { vertical, brandSlug } = await params;
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);
  if (!context) {
    notFound();
  }

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  const isAuthenticated = !!user;

  // 1. 핵심 질문 데이터 패치 (L0, L1 Published Top 3)
  const { data: rawCards } = await supabase
    .from('answer_card')
    .select('*')
    .eq('brand_id', context.id)
    .eq('public_status', 'published')
    .in('visibility_level', ['L0', 'L1'])
    .limit(3);

  const { maskAnswerCard } = await import('@/core/engines/disclosure-engine/masking');

  const projectedCards = (rawCards || [])
    .map(raw => projectAnswerCard(raw as RawAnswerCard, 'brand_home', isAuthenticated ? 'L1' : 'L0'))
    .filter(item => item !== null)
    .map(dto => maskAnswerCard(dto, isAuthenticated) as any); // 보안 마스킹 오버레이 처리

  // 2. 대표 포트폴리오 패치 (Latest 3)
  const { data: latestShots } = await supabase
    .from('portfolio_shot')
    .select('*')
    .eq('brand_id', context.id)
    .eq('visibility_level', 'L0')
    .order('created_at', { ascending: false })
    .limit(3);

  // 3. (Phase 12) 역제안/견적 정보 기반 Product Schema Data Fetch 
  const { data: baseDeals } = await supabase
    .from('vendor_envelope')
    .select('price_range_min, price_range_max')
    .eq('brand_id', context.id)
    .limit(1)
    .single();

  // --- AEO/SEO Structured Data Generation ---
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: projectedCards.map(c => ({
      '@type': 'Question',
      name: c.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: c.short_answer
      }
    }))
  };

  const localBusinessSchema = {
    '@context': 'https://schema.org',
    '@type': 'LocalBusiness',
    name: context.brand_name,
    url: `https://factory.com/${vertical}/${brandSlug}`,
    telephone: '02-0000-0000',
    address: {
      '@type': 'PostalAddress',
      addressLocality: 'Seoul',
      addressCountry: 'KR'
    }
  };

  const productSchema = baseDeals ? {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: `${context.brand_name} 정규 패키지`,
    description: `${context.vertical_type} 부문 대표 스냅 패키지 구성 및 팩트체크 결제 라인업`,
    brand: {
      '@type': 'Brand',
      name: context.brand_name
    },
    offers: {
      '@type': 'AggregateOffer',
      lowPrice: baseDeals.price_range_min,
      highPrice: baseDeals.price_range_max,
      priceCurrency: 'KRW',
      offerCount: 1, // 대표 패키지 1세트 기준
      availability: 'https://schema.org/InStock'
    }
  } : null;

  return (
    <>
      {/* 🤖 AEO JSON-LD Injections for Google/Perplexity Bots */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(localBusinessSchema) }}
      />
      {productSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(productSchema) }}
        />
      )}
      
      <main className="min-h-screen bg-transparent flex flex-col items-center w-full fade-in pb-20">
      
      {/* 1. Hero & Trust Strip */}
      <div className="w-full relative">
         <HeroBlock brandName={context.brand_name} verticalType={context.vertical_type} heroBgUrl={context.hero_bg_url} />
         <TrustStrip />
      </div>

      <div className="w-full max-w-5xl px-6 md:px-10 flex flex-col gap-20 mt-12">

        {/* 2. Top Portfolio Glimpse */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b-2 border-slate-100 pb-4">
             <div>
                <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-1">
                   우리가 가장 잘하는 핏 (Fit)
                </h2>
                <p className="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-widest">Selected Portfolio</p>
             </div>
             <Link href={`/${vertical}/${brandSlug}/portfolio`} className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
               전체 갤러리 보기 →
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             {latestShots && latestShots.length > 0 ? latestShots.map((shot, idx) => (
               <div key={idx} className="aspect-[3/4] rounded-2xl overflow-hidden bg-slate-100 relative group border border-slate-200 shadow-sm">
                  {shot.cdn_url ? (
                    <img src={shot.cdn_url} alt="portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-slate-300 font-black text-2xl">MOCK</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex items-end p-5">
                     <span className="text-xs font-bold text-white uppercase tracking-widest bg-white/20 backdrop-blur px-2 py-1 rounded">
                       {shot.mood_tags?.[0] || 'Signature'}
                     </span>
                  </div>
               </div>
             )) : (
               <div className="col-span-3 py-20 text-center bg-slate-50 rounded-3xl border border-dashed border-slate-300">
                  <p className="font-bold text-slate-400">포트폴리오 스냅샷이 아직 업로드되지 않았습니다.</p>
               </div>
             )}
          </div>
        </section>

        {/* 3. Included / Excluded (Risk-Aware Pricing Summary) */}
        <section className="bg-[var(--brand-surface)] rounded-3xl p-8 md:p-12 border border-[var(--brand-primary)]/20 shadow-lg shadow-[var(--brand-primary)]/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/10 rounded-bl-full blur-[20px] pointer-events-none"></div>
           
           <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-2">포함 및 불포함 요약</h2>
           <p className="text-sm font-medium text-[var(--brand-text-secondary)] mb-8">기본 패키지 안에서 해결되는 것과 추가금이 유발되는 항목을 투명하게 고시합니다.</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                 <h3 className="flex items-center gap-2 font-bold mb-4 text-[var(--brand-text-main)]">
                    <span className="text-emerald-500 bg-emerald-100 p-1 rounded">✓</span> 포함 (Included)
                 </h3>
                 <ul className="space-y-3 ms-2">
                    <li className="flex gap-3 text-sm font-medium text-slate-600"><span className="text-slate-300">•</span> 원본 데이터 전체 제공 (기본 패키지 포함)</li>
                    <li className="flex gap-3 text-sm font-medium text-slate-600"><span className="text-slate-300">•</span> 최고급 액자 1개 및 앨범 20p</li>
                    <li className="flex gap-3 text-sm font-medium text-slate-600"><span className="text-slate-300">•</span> 정밀 색감 및 체형 성형 보정본 20컷</li>
                 </ul>
              </div>
              <div className="p-5 bg-red-50/50 rounded-2xl border border-red-100">
                 <h3 className="flex items-center gap-2 font-bold mb-4 text-red-900">
                    <span className="text-red-500 bg-red-100 px-1.5 py-0.5 rounded text-xs">리스크</span> 불포함 / 추가금 유발
                 </h3>
                 <ul className="space-y-3 ms-2">
                    <li className="flex gap-3 text-sm font-medium text-red-700/80"><span className="text-red-300 border-b border-red-200 border-dashed">야간 씬 전구 세팅비</span> <span>+110,000원</span></li>
                    <li className="flex gap-3 text-sm font-medium text-red-700/80"><span className="text-red-300 border-b border-red-200 border-dashed">수석 지정 촬영</span> <span>+330,000원</span></li>
                    <li className="flex gap-3 text-sm font-medium text-slate-500 text-xs mt-4 pt-4 border-t border-red-100">
                       더 자세한 위약금 및 환불 정책은 하단 링크를 참조하세요.
                    </li>
                 </ul>
              </div>
           </div>
           
           <Link href={`/${vertical}/${brandSlug}/policies`} className="mt-8 inline-block px-5 py-2.5 bg-white border border-[var(--brand-primary)]/30 rounded-lg text-sm font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-white transition-colors">
              전체 견적표 및 정책 읽기
           </Link>
        </section>

        {/* 4. Top Answer Cards */}
        <section>
          <div className="flex items-end justify-between mb-8 pb-4">
             <div>
                <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-1">
                   가장 많이 묻는 질문 팩트체크
                </h2>
                <p className="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-widest">TOP Q&A</p>
             </div>
             <Link href={`/${vertical}/${brandSlug}/questions`} className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
               질문 허브로 가기 →
             </Link>
          </div>
          
          <div className="bg-slate-50 p-6 md:p-10 rounded-3xl border border-slate-200 shadow-inner">
             <QnaCardList cards={projectedCards} brandId={context.id} />
          </div>
        </section>

        {/* 5. Inference / Entry CTA Block */}
        <section className="bg-gradient-to-br from-slate-900 via-slate-800 to-black rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden flex flex-col items-center">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-20 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-3 py-1 bg-white/10 rounded-full text-xs font-bold text-white tracking-widest uppercase mb-6 border border-white/20">
               Step 1. Enquiry
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-white mb-6 leading-tight">
               우리의 핏 리포트에 동의하신다면, <br className="hidden md:block"/>직접 예산과 무드를 알려주세요.
            </h2>
            <p className="text-slate-300 font-medium mb-10 text-lg leading-relaxed">
               전화번호만 던지는 무의미한 상담은 거절합니다.<br />
               당신의 체형, 예산, 선호 무드를 정교하게 분석한 <strong>무료 핏 브리프(Fit Brief)</strong>를 48시간 내에 프라이빗하게 회신해 드립니다.
            </p>
            <Link 
               href={`/${vertical}/${brandSlug}/start`} 
               className="inline-block px-10 py-5 bg-[var(--brand-primary)] text-white text-lg font-black rounded-2xl shadow-[0_0_40px_rgba(0,0,0,0.3)] hover:scale-105 transition-transform active:scale-95 w-full sm:w-auto ring-4 ring-white/10 hover:ring-[var(--brand-primary)]/30"
            >
               맞춤 핏 브리프(Fit Brief) 무료 의뢰하기 →
            </Link>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
