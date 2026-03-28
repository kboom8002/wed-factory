'use client';

import { useState } from 'react';
import { submitProposal } from '@/app/actions/submitProposal';

interface Envelope {
  envelope_id: string;
  schedule_window: string;
  budget_band: string;
  privacy_preference: string;
  contact_info: string;
  created_at: string;
  priority_tags: string[];
}

interface Brand {
  id: string;
  brand_name: string;
  vertical_type: string;
}

interface Props {
  initialEnvelopes: Envelope[];
  brands: Brand[];
}

export default function ClientDealroom({ initialEnvelopes, brands }: Props) {
  const [envelopes] = useState<Envelope[]>(initialEnvelopes);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>, envelopeId: string) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const brandId = formData.get('brandId') as string;
    const priceRaw = formData.get('proposedPrice') as string;
    const message = formData.get('message') as string;

    const proposedPrice = parseInt(priceRaw, 10);
    if (!brandId || !proposedPrice || !message) {
      alert('필수 제안 항목을 입력하세요.');
      return;
    }

    setLoadingId(envelopeId);
    try {
      const res = await submitProposal(envelopeId, brandId, proposedPrice, message);
      if (res.success) {
        alert(res.message);
        e.currentTarget.reset();
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('처리에 실패했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  if (envelopes.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-16 flex flex-col items-center justify-center text-slate-400 font-medium">
        <span className="text-4xl mb-4">📭</span>
        <p className="text-lg">새로운 핏 브리프(요청)가 없습니다.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {envelopes.map(env => (
        <div key={env.envelope_id} className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <div className="mb-4 pb-4 border-b border-gray-100 flex flex-col gap-2">
            <div className="flex justify-between items-start">
              <span className="bg-purple-100 text-purple-700 font-bold px-2.5 py-1 rounded text-[11px] tracking-wider uppercase">
                New Brief Request
              </span>
              <span className="text-xs text-gray-400 font-medium">{new Date(env.created_at).toLocaleString()}</span>
            </div>
            
            <h3 className="text-lg font-black text-gray-900 mt-2">
              일정: {env.schedule_window} <span className="text-gray-300 mx-2">|</span> 예산: {env.budget_band}
            </h3>
            
            <div className="flex flex-wrap gap-2 mt-2">
               {env.priority_tags?.map(tag => (
                 <span key={tag} className="bg-gray-100 text-gray-600 px-2 py-0.5 rounded text-[10px] font-bold">
                   #{tag}
                 </span>
               ))}
            </div>
            <p className="text-sm text-gray-600 font-medium mt-1">연락처: {env.contact_info} (Privacy: {env.privacy_preference || 'N/A'})</p>
            <p className="text-[10px] text-gray-400 mt-1">ID: {env.envelope_id}</p>
          </div>

          <form onSubmit={(e) => handleSubmit(e, env.envelope_id)} className="bg-blue-50/40 p-5 rounded-xl border border-dashed border-blue-200">
            <h4 className="font-bold text-blue-900 mb-4 flex items-center gap-2">
              <span className="text-blue-500 text-lg">🏷️</span> Vendor Envelope 발송 (역제안)
            </h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
               <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">제안 대상 브랜드</label>
                  <select 
                    name="brandId" 
                    className="w-full text-sm p-3 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
                    required
                  >
                    <option value="">-- 브랜드를 선택하세요 --</option>
                    {brands.map(b => (
                      <option key={b.id} value={b.id}>[{b.vertical_type}] {b.brand_name}</option>
                    ))}
                  </select>
               </div>
               <div>
                  <label className="block text-xs font-bold text-blue-800 mb-1">최종 제안 금액 (원)</label>
                  <input 
                    type="number" 
                    name="proposedPrice" 
                    placeholder="예: 2800000" 
                    className="w-full text-sm p-3 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white"
                    required
                  />
               </div>
            </div>

            <div className="mb-5">
               <label className="block text-xs font-bold text-blue-800 mb-1">고객 응대 메시지 (패키지 세부 구성 등)</label>
               <textarea 
                  name="message" 
                  rows={3}
                  placeholder="요청하신 예산대를 확인했으며, 저희 시그니처 패키지로 진행 시 본식 스냅까지 총 290만에 맞춰드릴 수 있습니다..."
                  className="w-full text-sm p-3 border border-blue-200 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 shadow-sm bg-white resize-y"
                  required
               />
            </div>

            <div className="flex justify-end gap-3">
               <button 
                 type="submit" 
                 disabled={loadingId === env.envelope_id}
                 className="bg-blue-600 text-white font-bold py-2.5 px-6 rounded-lg text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50"
               >
                 {loadingId === env.envelope_id ? '발송 중...' : '역제안 발송 (Send Proposal)'}
               </button>
            </div>
          </form>
        </div>
      ))}
    </div>
  );
}
