import { NextResponse, type NextRequest } from 'next/server'
import { updateSession } from '@/core/utils/supabase/middleware'
import createMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const handleI18nRouting = createMiddleware(routing);

export async function middleware(request: NextRequest) {
  // 1. Next-Intl Locale 처리 (자동 언어 감지 및 redirect)
  const pathname = request.nextUrl.pathname;
  
  // admin, vendor, api, login 패스는 다국어 리다이렉트 예외처리
  const isBypassLocale = pathname.startsWith('/admin') || pathname.startsWith('/vendor') || pathname.startsWith('/api') || pathname.startsWith('/login') || pathname.startsWith('/_next') || pathname.startsWith('/favicon.ico');
  
  let response = isBypassLocale ? NextResponse.next({ request }) : handleI18nRouting(request);

  // 2. Supabase 세션 갱신 및 커스텀 도메인 라우팅 반영
  // updateSession 함수 내에서 response 객체에 직접 쿠키를 구우도록 전달
  return await updateSession(request, response as any);
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
