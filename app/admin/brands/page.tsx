import Link from 'next/link';
import { createClient } from '@/core/utils/supabase/server';

export default async function BrandRegistryPage() {
  const supabase = await createClient();
  const { data: brands, error } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_slug, brand_name_ko, brand_name_en, vertical_type, public_status, created_at')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Failed to load brands:', error);
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Brand Registry Console</h1>
          <p className="text-gray-500 font-medium">테넌트 온보딩(Lead ~ Published) 상태 및 각 브랜드별 다국어 자산 현황을 관리합니다.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2.5 px-6 rounded-lg shadow-sm transition">
          신규 브랜드 온보딩 생성
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50 border-b border-gray-200 text-sm font-bold text-gray-700 uppercase tracking-wider">
              <th className="p-4">Brand (Slug)</th>
              <th className="p-4">Vertical</th>
              <th className="p-4">Status</th>
              <th className="p-4 text-center">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {brands && brands.map((brand: any) => {
              const bId = brand.brand_id || brand.id;
              return (
                <tr key={bId} className="hover:bg-blue-50/50 transition">
                  <td className="p-4">
                    <Link href={`/${brand.vertical_type}/${brand.brand_slug}`} target="_blank" className="font-bold text-blue-600 hover:text-blue-800 text-base transition-colors inline-block">
                      {brand.brand_name_ko}
                    </Link>
                    <div className="text-xs text-gray-400 mt-1 font-mono">/{brand.vertical_type}/{brand.brand_slug}</div>
                  </td>
                  <td className="p-4">
                    <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded border border-gray-200 uppercase">
                      {brand.vertical_type}
                    </span>
                  </td>
                  <td className="p-4">
                    <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${brand.public_status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                      {brand.public_status.toUpperCase()}
                    </span>
                  </td>
                  <td className="p-4 flex gap-2 justify-center">
                    <Link href={`/admin/brands/${brand.brand_slug}/settings`} className="inline-block text-purple-600 hover:text-purple-800 font-bold text-sm bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 shadow-sm transition">
                      고객 화면 제어
                    </Link>
                    <Link href={`/admin/brands/${brand.brand_slug}/settings/localization`} className="inline-block text-white bg-indigo-600 hover:bg-indigo-700 font-bold text-sm px-3 py-1.5 rounded-lg shadow-sm transition flex items-center gap-1">
                      🌐 전역 다국어 관리
                    </Link>
                  </td>
                </tr>
              );
            })}

            {(!brands || brands.length === 0) && (
              <tr>
                <td colSpan={4} className="p-8 text-center text-gray-400 font-medium">
                  등록된 브랜드가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
