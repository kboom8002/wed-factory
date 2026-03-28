import Link from 'next/link';
import { createClient } from '@/core/utils/supabase/server';

export default async function VendorExtranetGateway() {
  const supabase = await createClient();

  // Fetch registered brands to simulate vendor login
  const { data: brands, error } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name, brand_slug, vertical_type');

  if (error) {
    console.error('Vendor Gateway Error:', error);
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl overflow-hidden border border-slate-200">
         <div className="p-8 pb-6 border-b border-slate-100 text-center">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">Vendor CMS Portal</h1>
            <p className="text-slate-500 text-sm font-medium mt-2">입점 브랜드 파트너용 콘텐츠 에디터 허브</p>
         </div>
         
         <div className="p-8">
            <div className="mb-4 text-xs font-bold text-slate-400 uppercase tracking-widest text-center">
               (MVP) 접속할 브랜드를 선택하세요
            </div>
            <div className="space-y-3">
               {brands && brands.length > 0 ? (
                  brands.map((brand) => (
                     <Link 
                        key={brand.brand_id} 
                        href={`/vendor/${brand.brand_slug}`}
                        className="block w-full p-4 rounded-xl border-2 border-slate-100 hover:border-indigo-500 hover:bg-indigo-50 transition flex justify-between items-center group"
                     >
                        <div>
                           <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1">
                              {brand.vertical_type}
                           </span>
                           <span className="font-bold text-slate-800 text-lg group-hover:text-indigo-900">
                              {brand.brand_name}
                           </span>
                        </div>
                        <span className="text-indigo-500 font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                           접속 →
                        </span>
                     </Link>
                  ))
               ) : (
                  <div className="text-center p-6 text-slate-400 font-medium bg-slate-50 rounded-xl">
                     등록된 입점 브랜드가 없습니다.
                  </div>
               )}
            </div>
         </div>
         <div className="px-8 py-5 bg-slate-900 text-center">
            <p className="text-xs font-medium text-slate-400">
               이 화면은 점주 시뮬레이션을 위한 Gateway입니다.<br/>실제 서비스에선 이메일/비밀번호 로그인이 연동됩니다.
            </p>
         </div>
      </div>
    </div>
  );
}
