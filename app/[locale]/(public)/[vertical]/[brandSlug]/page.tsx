import { notFound } from 'next/navigation';
import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VerticalType } from '@/core/runtime/brand-context';
import { projectAnswerCard, RawAnswerCard } from '@/core/engines/projection';
import { createClient } from '@/core/utils/supabase/server';
import { HeroBlock } from './_components/HeroBlock';
import { TrustStrip } from './_components/TrustStrip';
import { QnaCardList } from './_components/QnaCardList';
import Link from 'next/link';
import { getTranslations } from 'next-intl/server';

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

  const tHero = await getTranslations('Hero');
  const tPort = await getTranslations('Portfolio');
  const tPrice = await getTranslations('Pricing');
  const tQna = await getTranslations('QnA');
  const tCTA = await getTranslations('CTA');

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
         <HeroBlock 
            brandName={tHero('title', { brandName: context.brand_name })} 
            verticalType={context.vertical_type} 
            subtitle={tHero('subtitle', { verticalType: context.vertical_type })}
            heroBgUrl={context.hero_bg_url} 
         />
         <TrustStrip />
      </div>

      <div className="w-full max-w-5xl px-6 md:px-10 flex flex-col gap-20 mt-12">

        {/* 2. Top Portfolio Glimpse */}
        <section>
          <div className="flex items-end justify-between mb-8 border-b border-[var(--brand-primary)]/20 pb-4">
             <div>
                <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-1">
                   {tPort('title')}
                </h2>
                <p className="text-sm font-bold text-[var(--brand-primary)] uppercase tracking-widest">{tPort('subtitle')}</p>
             </div>
             <Link href={`/${vertical}/${brandSlug}/portfolio`} className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
               {tPort('viewAll')}
             </Link>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
             {latestShots && latestShots.length > 0 ? latestShots.map((shot, idx) => (
               <div key={idx} className="aspect-[3/4] rounded-2xl overflow-hidden bg-[var(--brand-surface)] relative group border border-[var(--brand-text-muted)]/20 shadow-sm">
                  {shot.cdn_url ? (
                    <img src={shot.cdn_url} alt="portfolio" className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-[var(--brand-text-muted)] font-black text-2xl">MOCK</div>
                  )}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent flex items-end p-5">
                     <span className="text-xs font-bold text-white uppercase tracking-widest bg-[var(--brand-primary)]/40 border border-[var(--brand-primary)]/50 backdrop-blur-md px-3 py-1 rounded">
                       {shot.mood_tags?.[0] || 'Signature'}
                     </span>
                  </div>
               </div>
             )) : (
               <div className="col-span-3 py-20 text-center bg-[var(--brand-surface)] rounded-3xl border border-dashed border-[var(--brand-text-muted)]/20">
                  <p className="font-bold text-[var(--brand-text-muted)]">{tPort('empty')}</p>
               </div>
             )}
          </div>
        </section>

        {/* 3. Included / Excluded (Risk-Aware Pricing Summary) */}
        <section className="bg-[var(--brand-surface)] rounded-3xl p-8 md:p-12 border border-[var(--brand-primary)]/20 shadow-lg shadow-[var(--brand-primary)]/5 relative overflow-hidden">
           <div className="absolute top-0 right-0 w-32 h-32 bg-[var(--brand-primary)]/10 rounded-bl-full blur-[20px] pointer-events-none"></div>
           
           <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-2">{tPrice('title')}</h2>
           <p className="text-sm font-medium text-[var(--brand-text-secondary)] mb-8">{tPrice('subtitle')}</p>
           
           <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="p-5 bg-[var(--brand-bg)] rounded-2xl border border-[var(--brand-text-muted)]/10">
                 <h3 className="flex items-center gap-2 font-bold mb-4 text-[var(--brand-text-main)]">
                    <span className="text-[var(--brand-surface)] bg-[var(--brand-text-main)] px-2 py-0.5 rounded text-xs">✓</span> {tPrice('included')}
                 </h3>
                 <ul className="space-y-3 ms-2">
                    <li className="flex gap-3 text-sm font-medium text-[var(--brand-text-main)]"><span className="text-[var(--brand-text-muted)]">•</span> {tPrice('inc1')}</li>
                    <li className="flex gap-3 text-sm font-medium text-[var(--brand-text-main)]"><span className="text-[var(--brand-text-muted)]">•</span> {tPrice('inc2')}</li>
                    <li className="flex gap-3 text-sm font-medium text-[var(--brand-text-main)]"><span className="text-[var(--brand-text-muted)]">•</span> {tPrice('inc3')}</li>
                 </ul>
              </div>
              <div className="p-5 bg-red-500/10 rounded-2xl border border-red-500/20">
                 <h3 className="flex items-center gap-2 font-bold mb-4 text-red-500">
                    <span className="text-white bg-red-600 px-1.5 py-0.5 rounded text-xs tracking-widest uppercase font-black">Risk</span> {tPrice('notIncluded')}
                 </h3>
                 <ul className="space-y-3 ms-2">
                    <li className="flex gap-3 text-sm font-medium text-red-400"><span className="border-b border-red-500/30 border-dashed pb-0.5">{tPrice('exc1')}</span> <span>{tPrice('exc1_price')}</span></li>
                    <li className="flex gap-3 text-sm font-medium text-red-400"><span className="border-b border-red-500/30 border-dashed pb-0.5">{tPrice('exc2')}</span> <span>{tPrice('exc2_price')}</span></li>
                    <li className="flex gap-3 text-sm font-medium text-[var(--brand-text-muted)] text-xs mt-4 pt-4 border-t border-red-500/10">
                       {tPrice('excNote')}
                    </li>
                 </ul>
              </div>
           </div>
           
           <Link href={`/${vertical}/${brandSlug}/policies`} className="mt-8 inline-block px-6 py-3 bg-transparent border border-[var(--brand-primary)]/30 rounded-lg text-sm font-bold text-[var(--brand-primary)] hover:bg-[var(--brand-primary)] hover:text-[var(--brand-surface)] transition-all uppercase tracking-widest shadow-[0_0_15px_rgba(212,175,55,0.05)]">
              {tPrice('viewAll')}
           </Link>
        </section>

        {/* 4. Top Answer Cards */}
        <section>
          <div className="flex items-end justify-between mb-8 pb-4">
             <div>
                <h2 className="text-2xl font-black text-[var(--brand-text-main)] mb-1">
                   {tQna('title')}
                </h2>
                <p className="text-sm font-bold text-[var(--brand-text-muted)] uppercase tracking-widest">{tQna('subtitle')}</p>
             </div>
             <Link href={`/${vertical}/${brandSlug}/questions`} className="text-sm font-bold text-[var(--brand-primary)] hover:underline">
               {tQna('viewAll')}
             </Link>
          </div>
          
          <div className="bg-[var(--brand-surface)] p-6 md:p-10 rounded-3xl border border-[var(--brand-primary)]/10 shadow-lg shadow-[var(--brand-primary)]/5">
             <QnaCardList cards={projectedCards} brandId={context.id} />
          </div>
        </section>

        {/* 5. Inference / Entry CTA Block */}
        <section className="bg-[var(--brand-text-main)] rounded-[3rem] p-10 md:p-16 text-center shadow-2xl relative overflow-hidden flex flex-col items-center border border-[var(--brand-primary)]/30">
          <div className="absolute inset-0 bg-[url('/noise.png')] opacity-10 mix-blend-overlay"></div>
          <div className="relative z-10 max-w-2xl">
            <span className="inline-block px-4 py-1.5 bg-[var(--brand-bg)]/20 rounded-full text-[10px] font-black text-[var(--brand-bg)] tracking-[0.2em] uppercase mb-8 border border-[var(--brand-bg)]/30 shadow-sm">
               {tCTA('step')}
            </span>
            <h2 className="text-3xl md:text-5xl font-black text-[var(--brand-bg)] mb-6 leading-tight uppercase tracking-tighter whitespace-pre-line">
               {tCTA('title')}
            </h2>
            <p className="text-[var(--brand-bg)]/80 font-bold mb-12 text-sm md:text-base leading-relaxed whitespace-pre-line">
               {tCTA('desc')}
            </p>
            <Link 
               href={`/${vertical}/${brandSlug}/start`} 
               className="inline-block px-10 py-5 bg-[var(--brand-primary)] text-[var(--brand-surface)] text-lg font-black rounded-2xl shadow-[0_0_40px_rgba(212,175,55,0.4)] hover:-translate-y-1 transition-transform active:scale-95 w-full sm:w-auto hover:brightness-110"
            >
               {tCTA('button')}
            </Link>
          </div>
        </section>

      </div>
    </main>
    </>
  );
}
