import { type NextRequest } from 'next/server'
import { updateSession } from '@/core/utils/supabase/middleware'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Next-Intl Locale 처리 (자동 언어 감지 및 redirect)
  const pathname = request.nextUrl.pathname;
  
  // admin, vendor, api, login 패스는 다국어 리다이렉트 예외처리
  const isBypassLocale = pathname.startsWith('/admin') || pathname.startsWith('/vendor') || pathname.startsWith('/api') || pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico');
  
  let response;
  if (!isBypassLocale) {
    response = handleI18nRouting(request);
  }

  // 2. Supabase 세션 갱신 및 커스텀 도메인 라우팅 반영
  const supabaseResponse = await updateSession(request);
  
  // (MVP) 두 미들웨어 응답 결합의 단순화를 위해, next-intl이 리다이렉트(307/308)를 뱉었으면 먼저 우선시
  if (response && response.status !== 200 && response.headers.has('location')) {
    response.headers.forEach((value, key) => {
      supabaseResponse.headers.set(key, value);
    });
    return response; 
  }

  return supabaseResponse;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
