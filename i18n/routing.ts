import {defineRouting} from 'next-intl/routing';
import {createNavigation} from 'next-intl/navigation';
 
export const routing = defineRouting({
  locales: ['ko', 'en', 'ja'],
  defaultLocale: 'ko',
  localeDetection: false // 브라우저 언어 감지 비활성화 (무조건 한국어 우선 렌더링)
});
 
export const {Link, redirect, usePathname, useRouter} = createNavigation(routing);
