import Link from 'next/link';
import { TrustMetaTag } from '@/app/(public)/[vertical]/[brandSlug]/_components/TrustMetaTag';

export interface HubCombinationData {
  id: string;
  brand_name: string;
  title: string;
  studio_summary?: string;
  dress_summary?: string;
  makeup_summary?: string;
  regret_risks?: string;
  visibility_level: string;
  last_verified_at?: string;
}

export function CombinationTypeProjection({ data }: { data: HubCombinationData }) {
  if (data.visibility_level !== 'L0') return null;

  return (
    <div className="bg-[var(--brand-surface)] border rounded-2xl shadow-sm hover:shadow-md transition relative flex flex-col p-6 h-full border-[var(--brand-text-muted)]/20">
      <div className="absolute -top-3 left-6 bg-[var(--brand-primary)]/10 border border-[var(--brand-primary)]/20 text-[var(--brand-primary)] text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest shadow-sm">
        조합 제안
      </div>
      
      <div className="mt-2 mb-4">
        <span className="text-xs text-[var(--brand-text-muted)] font-medium tracking-tight mb-1 block">by {data.brand_name}</span>
        <h3 className="text-2xl font-bold text-[var(--brand-text-main)] leading-tight">
          {data.title}
        </h3>
      </div>

      <div className="flex-1 space-y-3 mt-4 text-[15px]">
        {data.studio_summary && (
          <div className="flex items-start gap-3 bg-[var(--brand-bg)] p-3 rounded-lg border border-[var(--brand-text-muted)]/10">
            <span className="text-xl">📷</span>
            <p className="text-[var(--brand-text-main)]"><strong className="font-semibold text-[var(--brand-text-main)] mr-2">Studio</strong>{data.studio_summary}</p>
          </div>
        )}
        {data.dress_summary && (
          <div className="flex items-start gap-3 bg-[var(--brand-bg)] p-3 rounded-lg border border-[var(--brand-text-muted)]/10">
            <span className="text-xl">👗</span>
            <p className="text-[var(--brand-text-main)]"><strong className="font-semibold text-[var(--brand-text-main)] mr-2">Dress</strong>{data.dress_summary}</p>
          </div>
        )}
        {data.makeup_summary && (
          <div className="flex items-start gap-3 bg-[var(--brand-bg)] p-3 rounded-lg border border-[var(--brand-text-muted)]/10">
            <span className="text-xl">💄</span>
            <p className="text-[var(--brand-text-main)]"><strong className="font-semibold text-[var(--brand-text-main)] mr-2">Makeup</strong>{data.makeup_summary}</p>
          </div>
        )}
      </div>

      {data.regret_risks && (
        <div className="mt-5 p-4 border border-red-500/20 bg-red-500/5 rounded-lg text-sm flex gap-3">
          <span className="text-base text-red-500">🚨</span>
          <div>
            <span className="font-bold block mb-1 text-red-600 dark:text-red-400">후회 방지 딜브레이커</span>
            <p className="text-red-600/90 dark:text-red-400/90 leading-relaxed font-medium">{data.regret_risks}</p>
          </div>
        </div>
      )}

      {/* Trust Meta Footer */}
      <div className="mt-4 pt-1">
         <TrustMetaTag 
            lastVerifiedAt={data.last_verified_at || '2026-03-31'} 
            verifier="플랫폼" 
            visibilityRule="L0 공개" 
         />
      </div>

      <div className="mt-6 pt-5 border-t border-[var(--brand-text-muted)]/20 text-center">
        <Link 
          href={`/start?combination_id=${data.id}`}
          className="bg-[var(--brand-text-main)] text-[var(--brand-surface)] w-full flex justify-center py-3.5 rounded-xl font-bold hover:brightness-125 transition-colors shadow-sm"
        >
          해당 조합으로 Fit 브리프 요청하기
        </Link>
        <p className="text-xs text-[var(--brand-text-muted)] mt-3 flex items-center justify-center gap-1.5 font-medium">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-blue-500"></span> 
          L1 Verified 맞춤 견적 확인
        </p>
      </div>
    </div>
  );
}
