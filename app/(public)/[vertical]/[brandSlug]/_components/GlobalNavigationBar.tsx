'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function GlobalNavigationBar({ vertical, brandSlug }: { vertical: string; brandSlug: string }) {
  const pathname = usePathname();
  
  const basePath = `/${vertical}/${brandSlug}`;
  
  const navItems = [
    { name: '개요 홈', path: basePath, exact: true },
    { name: '❓ 질문 허브', path: `${basePath}/questions`, exact: false },
    { name: '포트폴리오', path: `${basePath}/portfolio`, exact: false },
    { name: '⚖️ 비교/조합', path: `${basePath}/compare`, exact: false },
    { name: '견적·정책', path: `${basePath}/policies`, exact: false },
    { name: '공식 리뷰', path: `${basePath}/reviews`, exact: false },
  ];

  return (
    <nav className="sticky top-0 z-50 w-full bg-[var(--brand-surface)]/80 backdrop-blur-lg border-b shadow-sm border-gray-100 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-6">
        <ul className="flex space-x-6 sm:space-x-8 overflow-x-auto no-scrollbar items-center h-14">
          {navItems.map((item) => {
            const isActive = item.exact ? pathname === item.path : pathname.startsWith(item.path);
            
            return (
              <li key={item.path} className="shrink-0 h-full flex items-center">
                <Link 
                  href={item.path} 
                  className={`h-full flex items-center px-1 text-sm font-bold transition-all duration-200 border-b-[3px] ${
                    isActive 
                      ? 'text-[var(--brand-primary)] border-[var(--brand-primary)]' 
                      : 'text-gray-400 hover:text-[var(--brand-text-main)] border-transparent'
                  }`}
                >
                  {item.name}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
