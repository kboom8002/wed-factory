'use client';

import { Link, usePathname, useRouter } from '@/i18n/routing';
import { useLocale, useTranslations } from 'next-intl';

export function GlobalNavigationBar({ vertical, brandSlug }: { vertical: string; brandSlug: string }) {
  const pathname = usePathname();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations('Nav');
  
  const basePath = `/${vertical}/${brandSlug}`;
  
  const navItems = [
    { name: t('home'), path: basePath, exact: true },
    { name: t('fit'), path: `${basePath}/fit`, exact: false },
    { name: t('portfolio'), path: `${basePath}/portfolio`, exact: false },
    { name: t('policies'), path: `${basePath}/policies`, exact: false },
    { name: t('questions'), path: `${basePath}/questions`, exact: false },
    { name: t('proof'), path: `${basePath}/proof`, exact: false },
  ];

  const handleLanguageSwitch = () => {
    // 순환 스위칭 로직 (ko -> en -> ja -> ko)
    const nextLocale = locale === 'ko' ? 'en' : locale === 'en' ? 'ja' : 'ko';
    router.replace(pathname, { locale: nextLocale });
  };

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--brand-surface)]/80 backdrop-blur-lg border-b shadow-sm border-gray-100 transition-colors duration-300">
      <div className="max-w-5xl mx-auto px-6 flex justify-between items-center h-14">
        
        <ul className="flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar items-center h-full">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
            
            return (
              <li key={item.path} className="shrink-0 h-full flex items-center">
                <Link 
                  href={item.path} 
                  className={`h-full flex items-center px-1 text-sm font-bold transition-all duration-200 border-b-[3px] ${
                    isActive 
                      ? 'text-[var(--brand-primary)] border-[var(--brand-primary)]' 
                      : 'text-[var(--brand-text-muted)] hover:text-[var(--brand-text-main)] border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Action Button & Language Switcher */}
        <div className="flex shrink-0 items-center gap-3">
          <button 
             onClick={handleLanguageSwitch}
             className="px-2 py-1 text-[10px] font-black tracking-widest uppercase border border-[var(--brand-text-muted)]/30 text-[var(--brand-text-muted)] hover:text-[var(--brand-primary)] hover:border-[var(--brand-primary)] rounded transition-all bg-[var(--brand-surface)]"
             title="Switch Language"
          >
             {locale}
          </button>

          <div className="hidden md:flex shrink-0">
            <Link 
              href={`${basePath}/start`}
              className="px-4 py-1.5 bg-[var(--brand-primary)] text-[var(--brand-surface)] font-bold text-xs rounded-full shadow-sm hover:brightness-90 transition-all flex items-center gap-1.5"
            >
              {t('cta')}
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
