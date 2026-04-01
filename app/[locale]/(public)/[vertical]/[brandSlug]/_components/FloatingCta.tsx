'use client';

import React from 'react';
import { Link } from '@/i18n/routing';
import { useVibe } from '@/core/design-system/VibeProvider';

import { useTranslations } from 'next-intl';

export function FloatingCta({ vertical, brandSlug, brandName }: { vertical: string, brandSlug: string, brandName: string }) {
  const briefUrl = `/${vertical}/${brandSlug}/start`;
  const vibe = useVibe();
  const t = useTranslations('FloatingCta');

  return (
    <div className="fixed bottom-6 right-6 z-50 pointer-events-none flex flex-col items-end">
      <div className="pointer-events-auto relative">
         <Link 
            href={briefUrl}
            className="group flex flex-col items-center justify-center bg-[var(--brand-primary)] text-white font-bold py-3 px-6 rounded-full shadow-2xl hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 active:translate-y-0 active:scale-[0.98] border-2 border-white/20"
         >
           <div className="flex items-center gap-2">
             <span className="text-lg">✉️</span>
             <span className="text-sm tracking-tight">{vibe.hooks.cta_tone}</span>
           </div>
           
           <div className="h-0 overflow-hidden opacity-0 group-hover:h-auto group-hover:opacity-100 group-hover:mt-1 transition-all duration-200 ease-in-out">
              <span className="text-[10px] font-medium text-white/80 block pb-1">{t('title', { brandName })}</span>
           </div>
         </Link>
      </div>
    </div>
  );
}
