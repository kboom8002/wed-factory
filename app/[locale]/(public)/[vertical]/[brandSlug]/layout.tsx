import { resolveBrandContext } from '@/core/engines/brand-resolution';
import { VibeProvider } from '@/core/design-system/VibeProvider';
import { notFound } from 'next/navigation';
import { VerticalType } from '@/core/runtime/brand-context';
import { GlobalNavigationBar } from './_components/GlobalNavigationBar';
import { FloatingCta } from './_components/FloatingCta';
import { headers } from 'next/headers';
import { Metadata, Viewport } from 'next';
import { VIBE_DICTIONARY } from '@/core/design-system/vibe-registry';

export async function generateViewport({
  params,
}: {
  params: Promise<{ vertical: string; brandSlug: string }>;
}): Promise<Viewport> {
  const { vertical, brandSlug } = await params;
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);
  const vibeId = context?.vibe_spec_id || 'default-vibe-target';
  const spec = VIBE_DICTIONARY[vibeId] || VIBE_DICTIONARY['default-vibe-target'];

  return {
    themeColor: spec.colors.background,
  };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ vertical: string; brandSlug: string }>;
}): Promise<Metadata> {
  const { vertical, brandSlug } = await params;
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);
  if (!context) return {};

  // Custom Domain Host 추출을 통한 메타데이터 동적 바인딩 (Next.js Multi-tenant)
  const headersList = await headers();
  const host = headersList.get('mock_host') || headersList.get('host') || 'weddingfactory.ai';
  const protocol = host.includes('localhost') ? 'http' : 'https';

  return {
    title: {
      template: `%s | ${context.brand_name}`,
      default: `${context.brand_name} B-SSoT 홈`,
    },
    description: `${context.brand_name}의 팩트체크된 공식 패키지 가격과 위약금, QnA를 확인하세요.`,
    metadataBase: new URL(`${protocol}://${host}`),
    alternates: {
      canonical: '/',
    }
  };
}

export default async function BrandLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ vertical: string; brandSlug: string }>;
}) {
  const { vertical, brandSlug } = await params;
  
  // 1. 테넌트(Brand)의 Vibe ID 조회
  const context = await resolveBrandContext(brandSlug, vertical as VerticalType);

  if (!context) {
    notFound();
  }

  // 2. 하위 트리에 해당 Vibe Token (CSS, Font) 강제 주입
  const vibeId = context.vibe_spec_id || 'default-vibe-target';
  const { loadVibeSpec } = await import('@/core/design-system/vibe-loader');
  const spec = loadVibeSpec(vibeId);

  return (
    <VibeProvider vibeId={vibeId} initialSpec={spec}>
      {/* 최상단 Sticky 네비게이션 */}
      <GlobalNavigationBar vertical={vertical} brandSlug={brandSlug} />
      
      {/* 렌더링 영역 (page.tsx 또는 portfolio/page.tsx 등) */}
      <div className="flex-1 w-full flex flex-col items-center">
        {children}
      </div>

      {/* Floating CTA (견적/상담 연결용) */}
      <FloatingCta vertical={vertical} brandSlug={brandSlug} brandName={context.brand_name} />
    </VibeProvider>
  );
}


