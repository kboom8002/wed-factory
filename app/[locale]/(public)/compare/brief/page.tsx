'use client';

import { useSearchParams } from 'next/navigation';
import { Suspense, useActionState } from 'react';
import { useFormStatus } from 'react-dom';
import { submitBrideGroomEnvelope } from '@/app/actions/submitEnvelope';

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full font-bold py-4 rounded-xl mt-4 shadow-sm transition ${pending ? 'bg-slate-400 text-slate-100 cursor-wait' : 'bg-slate-900 hover:bg-black text-white'}`}
    >
      {pending ? '매칭 분석 중... (L1 보안 전송)' : '안전하게 매칭 및 L1 브리프 요청하기'}
    </button>
  );
}

function BriefRequestForm() {
  const searchParams = useSearchParams();
  const comboId = searchParams.get('combination_id') || '';
  
  // React 19 / Next.js 15 new hook
  const [state, formAction] = useActionState(submitBrideGroomEnvelope, { error: null } as { error: string | null });

  return (
    <form className="bg-white border rounded-3xl p-8 mt-8 shadow-sm" action={formAction}>
      <h3 className="text-xl font-bold text-gray-900 mb-6">Bride/Groom Envelope (L0 기본 요건) 작성</h3>
      
      {/* Hidden input to pass comboId to Server Action */}
      <input type="hidden" name="combination_id" value={comboId} />

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">예상 예식 일정 (Time Window)</label>
          <select name="schedule_window" className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800">
            <option value="내년 상반기 (3~6월)">내년 상반기 (3~6월)</option>
            <option value="내년 하반기 (9~12월)">내년 하반기 (9~12월)</option>
            <option value="미정 (상담 후 결정)">미정 (상담 후 결정)</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-700 mb-2">가용 예산 밴드 (Budget Band)</label>
          <select name="budget_band" className="w-full border border-gray-300 rounded-xl p-3 bg-gray-50 outline-none focus:ring-2 focus:ring-blue-500 font-medium text-gray-800">
            <option value="200~300만원 (가성비)">200~300만원 (가성비)</option>
            <option value="300~500만원 (스탠다드)">300~500만원 (스탠다드)</option>
            <option value="500만원 이상 (프리미엄)">500만원 이상 (프리미엄)</option>
          </select>
          <p className="text-xs text-gray-400 mt-2">* 이 예산은 업체에 L0 수준의 대략적 밴드로만 공유됩니다.</p>
        </div>

        <div>
           <label className="block text-sm font-bold text-gray-700 mb-2">포기할 수 없는 우선순위 (Top Priorities)</label>
           <div className="grid grid-cols-2 gap-3">
             <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700"><input type="checkbox" name="priority_tags" value="헤어/메이크업 밀착케어" /> 헤어/메이크업 밀착케어</label>
             <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700"><input type="checkbox" name="priority_tags" value="풍성하고 다양한 드레스" /> 풍성하고 다양한 드레스</label>
             <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700"><input type="checkbox" name="priority_tags" value="원본 데이터 무료 제공" /> 원본 데이터 무료 제공</label>
             <label className="flex items-center gap-2 p-3 border rounded-xl hover:bg-blue-50 cursor-pointer text-sm font-medium text-gray-700"><input type="checkbox" name="priority_tags" value="프라이빗 단독 촬영" /> 프라이빗 단독 촬영</label>
           </div>
        </div>

        {state?.error && (
          <div className="p-3 bg-red-50 text-red-700 border border-red-200 rounded-lg text-sm font-bold">
            {state.error}
          </div>
        )}

        <SubmitButton />
      </div>
    </form>
  );
}

export default function CompareBriefRequestPage() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 flex justify-center">
      <div className="max-w-3xl w-full">
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 tracking-tight mb-3">맞춤 견적 & 무드 체커 (Fit Brief)</h1>
        <p className="text-slate-600 font-medium text-lg leading-relaxed">
           개인의 연락처를 무분별하게 뿌리지 마세요.<br/> 
           Factory가 고객님의 <strong className="text-slate-800">예산과 취향(Envelope)</strong>을 포장하여, 해당 세트 업체들이 수용 가능한지 익명으로 검증한 후 L1 브리프를 띄워드립니다.
        </p>
        
        <Suspense fallback={<div className="p-10 text-center animate-pulse font-bold text-gray-500 mt-8 bg-white rounded-3xl border">폼 렌더링 중...</div>}>
           <BriefRequestForm />
        </Suspense>
      </div>
    </main>
  );
}
