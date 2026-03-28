'use client';

import { useState } from 'react';
import { submitPortfolioShot } from '@/app/actions/vendorActions';
import { useRouter } from 'next/navigation';

export default function VendorPortfolioNewPage({ params }: { params: { brandSlug: string } }) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [msg, setMsg] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMsg('');
    
    const formData = new FormData(e.currentTarget);
    const res = await submitPortfolioShot(params.brandSlug, formData);
    
    if (res.success) {
      setMsg('✅ 포트폴리오를 업로드했습니다! L0 승인 대기 중입니다.');
      setTimeout(() => {
         router.push(`/vendor/${params.brandSlug}`);
      }, 1500);
    } else {
      setMsg(`❌ 업로드 실패: ${res.error}`);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in flex flex-col md:flex-row gap-8">
       
       {/* Left: Form */}
       <div className="flex-1 w-full">
         <div className="mb-8">
            <h1 className="text-2xl font-black text-slate-900 tracking-tight">포트폴리오 ス냅 업로드</h1>
            <p className="text-slate-500 font-medium text-sm mt-1">
               최신 트렌드의 무드에 맞는 사진 1장씩 해시태그와 함께 올려주세요. B-SSoT 홈 화면에 랜덤/스마트 분배됩니다.
            </p>
         </div>

         {msg && (
           <div className={`p-4 rounded-xl font-bold border transition-all mb-4 ${msg.includes('✅') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
              {msg}
           </div>
         )}

         <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-sm border border-slate-200 p-8 space-y-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                 이미지 CDN 주소 (URL)
                 <span className="text-[10px] text-indigo-500 bg-indigo-50 px-2 rounded uppercase align-middle mt-0.5">Required</span>
              </label>
              <input 
                name="cdn_url"
                required
                type="url"
                onChange={(e) => setPreviewUrl(e.target.value)}
                placeholder="https://example.com/asset-id/shot.jpg"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition shadow-sm"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2 flex justify-between">
                 무드 타겟팅 해시태그
                 <span className="text-[10px] text-slate-400 bg-slate-100 px-2 rounded uppercase align-middle mt-0.5">Optional</span>
              </label>
              <input 
                name="mood_tags"
                placeholder="예: 야간촬영, 시네마틱, 아이폰, 과즙상 (쉼표로 구분)"
                className="w-full p-3.5 border border-slate-300 rounded-xl bg-slate-50 text-slate-800 font-medium focus:ring-2 focus:ring-indigo-500 focus:bg-white outline-none transition shadow-sm"
              />
              <p className="text-[11px] font-bold text-slate-400 mt-2">
                 태그를 정확히 달아두면 "야간 촬영 잘하는 데 없나요?" 같은 고객의 검색(QnA)에 이 컷이 증거물로 자동 추천됩니다!
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 flex justify-end gap-3">
               <button type="button" onClick={() => router.back()} className="px-5 py-3 font-bold text-slate-500 bg-slate-100 hover:bg-slate-200 rounded-xl transition">
                 취소
               </button>
               <button type="submit" disabled={isSubmitting || !previewUrl} className="px-6 py-3 font-bold text-white bg-indigo-600 hover:bg-indigo-700 rounded-xl shadow-md transition disabled:opacity-50 flex items-center gap-2">
                 {isSubmitting ? '업로딩...' : '포트폴리오 업로드 대기열 등록'}
               </button>
            </div>
         </form>
       </div>

       {/* Right: Live Preview Panel */}
       <div className="w-full md:w-80 shrink-0">
          <div className="sticky top-24">
             <h3 className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">Live Preview</h3>
             <div className="w-full h-96 bg-slate-100 rounded-3xl border-4 border-slate-200 overflow-hidden flex items-center justify-center relative shadow-inner">
                {previewUrl ? (
                   // eslint-disable-next-line @next/next/no-img-element
                   <img 
                      src={previewUrl} 
                      alt="Preview" 
                      className="w-full h-full object-cover" 
                      onError={(e) => { (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x800?text=Invalid+URL' }}
                   />
                ) : (
                   <div className="text-center p-6 text-slate-300">
                      <span className="text-6xl block mb-2">📸</span>
                      <span className="font-bold text-sm">이미지 URL을 입력하면 실시간 미리보기가 노출됩니다.</span>
                   </div>
                )}
                {/* Fake UI Overlay to look like the app */}
                <div className="absolute bottom-4 left-4 right-4 p-3 bg-black/40 backdrop-blur-md rounded-xl border border-white/20">
                   <div className="h-2 w-16 bg-white/60 mb-2 rounded-full"></div>
                   <div className="h-1.5 w-full bg-white/30 rounded-full mb-1"></div>
                   <div className="h-1.5 w-2/3 bg-white/30 rounded-full"></div>
                </div>
             </div>
          </div>
       </div>

    </div>
  );
}
