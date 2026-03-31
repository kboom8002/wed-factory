import Link from 'next/link';
import { createClient } from '@/core/utils/supabase/server';
import { logout } from '@/app/actions/auth';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const [{ count: pendingCount }, { count: brandCount }] = await Promise.all([
    supabase.from('zero_result_query').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('brand_registry').select('*', { count: 'exact', head: true })
  ]);

  const menuItems = [
    { name: '📊 팩토리 개요', path: '/admin' },
    { name: '🏢 브랜드 레지스트리', path: '/admin/brands' },
    { name: '📑 템플릿/스키마 관리', path: '/admin/templates' },
    { name: '🚀 퍼블리싱 큐 (Publish)', path: '/admin/publishing' },
    { name: '🏅 팩트체크 큐 (Factcheck)', path: '/admin/factcheck' },
    { name: '📭 질문 인박스', path: '/admin/inbox' },
    { name: '💼 브리프/딜룸 모니터링', path: '/admin/dealroom' },
    { name: '🌍 다국어 관리 큐', path: '/admin/localization' },
    { name: '⏳ 변경 이력/감사 로그', path: '/admin/audit' },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shadow-xl z-20 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950">
          <h1 className="text-lg font-bold text-white tracking-tight">Factory <span className="text-blue-500">Admin</span></h1>
        </div>
        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {menuItems.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className="block px-6 py-2.5 text-sm font-medium hover:bg-slate-800 hover:text-white transition-colors border-l-4 border-transparent hover:border-blue-500"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t border-slate-800 text-xs text-slate-500 flex flex-col items-start font-medium">
          <p className="mb-1">Platform Admin:</p>
          <strong className="text-slate-300 text-[11px] truncate w-full block mb-3">{user?.email || 'Unauthorized'}</strong>
          <form action={logout} className="w-full">
            <button type="submit" className="w-full text-left text-red-400 hover:text-red-300 transition font-bold">
              Sign Out (로그아웃)
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden">
        <header className="h-16 bg-white border-b px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <h2 className="text-xl font-bold tracking-tight">Observatory & Platform Ops</h2>
          <div className="flex gap-4">
            <span className="bg-red-50 text-red-600 px-3 py-1 rounded-full text-xs font-bold border border-red-100 shadow-sm flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></span>
              Inbox Backlog: {pendingCount || 0}
            </span>
            <span className="bg-blue-50 text-blue-600 px-3 py-1 rounded-full text-xs font-bold border border-blue-100 shadow-sm">
              Public Tenants: {brandCount || 0}
            </span>
          </div>
        </header>
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
