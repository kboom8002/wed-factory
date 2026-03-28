'use client';

import { useState } from 'react';
import { provisionNewBrand } from '@/app/actions/builderActions';
import { useRouter } from 'next/navigation';

export default function BuilderStudioPage() {
  const router = useRouter();
  const [isBuilding, setIsBuilding] = useState(false);
  const [msg, setMsg] = useState('');

  const handleBuild = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsBuilding(true);
    setMsg('');
    
    const formData = new FormData(e.currentTarget);
    const res = await provisionNewBrand(formData);
    
    if (res.success) {
      setMsg('🎉 B-SSoT 홈 개통 및 벤더 계정 발급이 완료되었습니다! (배포 통과)');
      setTimeout(() => {
         router.push('/admin');
      }, 2000);
    } else {
      setMsg(`❌ 생성 실패: ${res.error}`);
      setIsBuilding(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 fade-in pb-20">
       
       <div className="mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase tracking-widest mb-3 border border-indigo-200">
             <span>🚀 Platform Administrator Tool</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
            B-SSoT Builder Studio (개설 마법사)
          </h1>
          <p className="text-slate-500 font-medium text-sm mt-3 leading-relaxed">
             영업으로 확보한 신규 클라이언트의 B-SSoT를 수초만에 다이내믹 라우팅으로 띄워줍니다.<br/>
             홈페이지 코드를 개발자에게 건드릴 필요 없이, <strong className="text-slate-700">디자인 토큰 주입부터 점주(L1) 초안 시딩까지 자동화</strong>됩니다.
          </p>
       </div>

       {msg && (
         <div className={`p-4 rounded-xl font-bold border transition-all ${msg.includes('🎉') ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-red-50 text-red-800 border-red-200'}`}>
            {msg}
         </div>
       )}

       {/* Builder Form */}
       <form onSubmit={handleBuild} className="bg-white rounded-3xl shadow-sm border border-slate-200 overflow-hidden">
          
          <div className="p-8 space-y-8 bg-slate-50/50 border-b border-slate-100">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center font-black">1</span>
                Identity & Domain Routing
             </h2>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pl-8">
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">카테고리 분류 (Vertical Type)</label>
                  <select name="verticalType" className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
                     <option value="studio">스튜디오 (Studio)</option>
                     <option value="dress">드레스 (Dress)</option>
                     <option value="makeup">메이크업 (Make-Up)</option>
                  </select>
               </div>
               <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">입점 상호명 (Brand Name)</label>
                  <input name="brandName" required placeholder="예: 시티스냅 스튜디오" className="w-full p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm" />
               </div>
               <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-slate-700 mb-2">도메인 URL 슬러그 (Brand Slug)</label>
                  <div className="flex shadow-sm rounded-xl overflow-hidden border border-slate-300 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-indigo-500 transition">
                     <span className="bg-slate-100 border-r border-slate-300 flex items-center px-4 font-medium text-slate-500 font-mono text-sm">
                        wedding-factory.com / [vertical] /
                     </span>
                     <input name="brandSlug" required pattern="[a-z0-9\-]+" placeholder="예: city-snap" className="w-full p-3.5 bg-white text-slate-900 font-bold font-mono outline-none" />
                  </div>
                  <p className="text-[11px] text-slate-400 font-bold mt-2">영어 소문자와 대시(-)만 사용 가능합니다. 이 값으로 홈페이지 구조가 즉시 열립니다.</p>
               </div>
             </div>
          </div>

          <div className="p-8 space-y-8 bg-white border-b border-slate-100">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-slate-200 text-slate-500 text-xs flex items-center justify-center font-black">2</span>
                Design SSoT Token (테마 주입)
             </h2>
             <div className="pl-8">
               <label className="block text-sm font-bold text-slate-700 mb-2">무드 테마(Vibe Registry) 선택</label>
               <select name="vibeId" className="w-full max-w-sm p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm">
                  <option value="default-vibe-target">디폴트 (블랙 & 화이트)</option>
                  <option value="lovely-peach">러블리 피치 (핑크 톤)</option>
                  <option value="cinematic-night">시네마틱 나이트 (다크 무드)</option>
               </select>
               <label className="block text-sm font-bold text-slate-700 mb-2 mt-6">히어로 배경 이미지 (Hero BG URL)</label>
               <input name="heroBgUrl" type="url" placeholder="https://images.unsplash.com/..." className="w-full max-w-sm p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm block" />
               <p className="text-[11px] text-slate-400 font-bold mt-2">B-SSoT 홈 최상단을 장식할 시네마틱 백그라운드 이미지 주소입니다.</p>
             </div>
          </div>

          <div className="p-8 space-y-8 bg-slate-50/30">
             <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-indigo-200 text-indigo-700 text-xs flex items-center justify-center font-black">3</span>
                Vendor RBAC Account (권한 및 메일 전송)
             </h2>
             <div className="pl-8">
               <label className="block text-sm font-bold text-slate-700 mb-2">점주 초대용 이메일 발송</label>
               <input name="vendorEmail" type="email" placeholder="ceo@city-snap.com" className="w-full max-w-sm p-3.5 border border-slate-300 rounded-xl bg-white text-slate-900 font-bold focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm block" />
               <p className="text-[11px] text-slate-500 font-bold mt-2 leading-relaxed">
                  개설 직후 이 이메일 계정으로 **L1 (Vendor) 등급의 Auth 초대장**을 발송합니다.<br/>
                  점주가 해당 링크로 로그인하면 강제 주입된(Seeding) QnA 초안에 답변을 적고 입점을 마무리하게 됩니다.
               </p>
             </div>
          </div>

          <div className="p-8 bg-slate-900 flex justify-end gap-4 items-center rounded-b-3xl">
             <span className="text-slate-400 font-medium text-xs">Vercel 빌드 불필요. DB 트랜잭션으로 즉시 Launching 됩니다.</span>
             <button type="submit" disabled={isBuilding} className="px-8 py-4 font-black text-white bg-indigo-500 hover:bg-indigo-400 rounded-xl shadow-lg transition disabled:opacity-50 disabled:grayscale flex items-center gap-2">
               {isBuilding ? '초고속 개설 중...' : '🚀 B-SSoT 홈 Spin-up 개통!'}
             </button>
          </div>
       </form>

    </div>
  );
}
