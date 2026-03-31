import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function updateSession(request: NextRequest, initialResponse?: NextResponse) {
  let supabaseResponse = initialResponse || NextResponse.next({
    request,
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({
            request,
          })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // [Custom Domain Routing / Next.js Multi-tenant Support]
  // 들어오는 요청의 Host 헤더를 분석 (로컬 테스트용 mock_host 파라미터 지원)
  let hostname = request.headers.get('host') || '';
  if (request.nextUrl.searchParams.has('mock_host')) {
    hostname = request.nextUrl.searchParams.get('mock_host') || '';
  }

  const isBypassPath = pathname.startsWith('/admin') || pathname.startsWith('/api') || pathname.startsWith('/login');
  const rootDomains = ['localhost:3000', '127.0.0.1:3000', 'weddingfactory.ai', 'www.weddingfactory.ai'];

  if (hostname && !rootDomains.includes(hostname) && !isBypassPath) {
    // Edge 환경에서 Supabase DB에 캐싱된 custom_domain 목록을 짧게 스캔합니다.
    const { data: brand } = await supabase
      .from('brand_registry')
      .select('brand_slug, vertical_type')
      .eq('custom_domain', hostname)
      .single();

    if (brand) {
      const rewriteUrl = request.nextUrl.clone();
      // 기존 경로(예: /questions)를 플랫폼 내부 경로(예: /studio/urban-studio/questions)로 몰래 포워딩
      rewriteUrl.pathname = `/${brand.vertical_type}/${brand.brand_slug}${pathname === '/' ? '' : pathname}`;
      
      const newResponse = NextResponse.rewrite(rewriteUrl, { request });
      
      // auth token 등 앞서 setAll()로 예약된 쿠키들을 새로 만들 response에 복붙해줍니다.
      supabaseResponse.cookies.getAll().forEach(cookie => {
        newResponse.cookies.set(cookie.name, cookie.value);
      });
      
      supabaseResponse = newResponse;
    }
  }

  // Admin (L2) Guard
  if (pathname.startsWith('/admin') && !user) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  return supabaseResponse
}
