import Link from 'next/link';

export default function BrandRegistryPage() {
  const MOCK_BRANDS = [
    { id: '1', name: '샘플 스튜디오', slug: 'sample-studio', vertical: 'studio', status: 'published', questions: 2, policies: 1, last_pub: '2시간 전' },
    { id: '2', name: '샘플 드레스', slug: 'sample-dress', vertical: 'dress', status: 'published', questions: 2, policies: 1, last_pub: '1일 전' },
    { id: '3', name: '샘플 메이크업', slug: 'sample-makeup', vertical: 'makeup', status: 'published', questions: 1, policies: 0, last_pub: '3일 전' },
    { id: '4', name: '미입점 인바운드 스튜디오', slug: 'lead-studio', vertical: 'studio', status: 'draft', questions: 0, policies: 0, last_pub: '-' },
  ];

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Brand Registry Console</h1>
          <p className="text-gray-500 font-medium">테넌트 온보딩(Lead ~ Published) 상태 및 각 브랜드별 보유 자산 현황을 관리합니다.</p>
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
              <th className="p-4">Q-Asset</th>
              <th className="p-4">Policy-Asset</th>
              <th className="p-4">Last Published</th>
              <th className="p-4 text-center">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {MOCK_BRANDS.map(brand => (
              <tr key={brand.id} className="hover:bg-blue-50/50 transition">
                <td className="p-4">
                  <div className="font-bold text-gray-900 text-base">{brand.name}</div>
                  <div className="text-xs text-gray-400 mt-1 font-mono">/{brand.vertical}/{brand.slug}</div>
                </td>
                <td className="p-4">
                  <span className="bg-gray-100 text-gray-700 text-xs font-bold px-2.5 py-1 rounded border border-gray-200 uppercase">
                    {brand.vertical}
                  </span>
                </td>
                <td className="p-4">
                  <span className={`text-xs font-bold px-3 py-1.5 rounded-full border ${brand.status === 'published' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-gray-50 text-gray-600 border-gray-200'}`}>
                    {brand.status.toUpperCase()}
                  </span>
                </td>
                <td className="p-4 font-bold text-gray-700">{brand.questions}</td>
                <td className="p-4 font-bold text-gray-700">{brand.policies}</td>
                <td className="p-4 text-sm text-gray-500 font-medium">{brand.last_pub}</td>
                <td className="p-4 text-center space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 font-bold text-sm bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100 shadow-sm transition">
                    자산 관리
                  </button>
                  <Link href={`/admin/brands/${brand.slug}/settings`} className="inline-block text-purple-600 hover:text-purple-800 font-bold text-sm bg-purple-50 px-3 py-1.5 rounded-lg border border-purple-100 shadow-sm transition">
                    Hero 설정
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
