import Link from 'next/link';

export default async function VendorLayout({ 
   children, 
   params 
}: { 
   children: React.ReactNode, 
   params: Promise<{ brandSlug: string }> 
}) {
  const { brandSlug: brandId } = await params;
  
  const vendorMenu = [
    { name: '개요 (Overview)', path: `/vendor/${brandId}` },
    { name: '새 답변(QnA) 작성', path: `/vendor/${brandId}/questions/new` },
    { name: '새 포트폴리오 스냅 업로드', path: `/vendor/${brandId}/portfolio/new` },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Light Style Sidebar for Vendors */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm z-20 sticky top-0 h-screen">
        <div className="h-16 flex items-center px-6 border-b border-gray-100 bg-white">
          <h1 className="text-lg font-black text-slate-800 tracking-tight">
             Factory <span className="text-indigo-600">Vendor</span>
          </h1>
        </div>
        
        <div className="p-4 px-6 bg-slate-50 border-b border-slate-100 mb-2">
           <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 block mb-1">Current Workspace</span>
           <strong className="text-slate-900">{brandId}</strong>
        </div>

        <nav className="flex-1 py-4 overflow-y-auto">
          <ul className="space-y-1">
            {vendorMenu.map((item) => (
              <li key={item.path}>
                <Link 
                  href={item.path}
                  className="block px-6 py-2.5 text-[14px] font-bold text-slate-600 hover:bg-indigo-50 hover:text-indigo-700 transition-colors border-l-4 border-transparent hover:border-indigo-500"
                >
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
        <div className="p-6 border-t border-gray-100 text-xs text-gray-400 flex flex-col items-start font-medium bg-slate-50/50">
          <Link href="/vendor" className="text-red-500 hover:text-red-600 transition font-bold block mb-2 w-full">
            ← 포털로 나가기
          </Link>
          <p className="tracking-tight leading-relaxed">
             작성하신 초안(Draft)은 어드민의 발행 승인을 거친 뒤 L0(Public)로 노출됩니다.
          </p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-h-screen overflow-x-hidden relative">
        <header className="h-16 bg-white border-b border-gray-200 px-8 flex items-center justify-between shadow-sm sticky top-0 z-10">
          <h2 className="text-lg font-bold tracking-tight text-slate-800">
             파트너 스튜디오 콘텐츠 센터
          </h2>
          <div className="flex gap-4">
            <Link href={`/studio/${brandId}`} target="_blank" className="bg-slate-100 text-slate-700 hover:bg-slate-200 px-3 py-1.5 rounded text-xs font-bold transition shadow-sm border border-slate-200">
              내 퍼블릭 홈 보기 ↗
            </Link>
            <span className="bg-indigo-50 text-indigo-700 px-3 py-1.5 rounded text-xs font-bold shadow-sm border border-indigo-100 animate-pulse flex items-center gap-1.5">
               <span className="w-2 h-2 rounded-full bg-indigo-500"></span>
               L0 Sync Active
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
