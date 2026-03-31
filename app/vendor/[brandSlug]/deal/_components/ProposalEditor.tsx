'use client';

import React, { useState } from 'react';
import { submitVendorProposal, rejectEnvelope } from '@/app/actions/vendorDealActions';
import { useRouter } from 'next/navigation';

export interface EnvelopeData {
  envelope_id: string;
  user_id?: string;
  combination_id: string;
  schedule_window: string;
  budget_band: string;
  requirements: string;
  status: string;
  created_at: string;
  combination_title?: string;
  user_phone?: string;
}

export function ProposalEditor({ 
  envelope, 
  brandId, 
  onClose 
}: { 
  envelope: EnvelopeData; 
  brandId: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    proposedPrice: '',
    confirmedSchedule: envelope.schedule_window,
    perks: '',
    comment: '문의해 주셔서 감사합니다. 요청하신 일정과 예산에 맞춰 최적의 플랜을 제안드립니다.'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 천단위 콤마 포맷팅용 헬퍼
  const formatNumber = (numStr: string) => {
     const clean = numStr.replace(/[^0-9]/g, '');
     if (!clean) return '';
     return parseInt(clean, 10).toLocaleString();
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
     setFormData(prev => ({ ...prev, proposedPrice: formatNumber(e.target.value) }));
  };

  const parsePrice = (str: string) => parseInt(str.replace(/,/g, ''), 10) || 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsedPrice = parsePrice(formData.proposedPrice);
    if (!parsedPrice || parsedPrice <= 0) {
       alert("정확한 견적금액(원)을 입력해 주세요.");
       return;
    }

    setIsSubmitting(true);
    const res = await submitVendorProposal({
      envelopeId: envelope.envelope_id,
      brandId: brandId,
      proposedPrice: parsedPrice,
      confirmedSchedule: formData.confirmedSchedule,
      perks: formData.perks,
      comment: formData.comment
    });

    if (res.success) {
      alert("✅ 제안서 전송 완료!");
      router.refresh(); // re-fetch the route data to remove the envelope from the active list
      onClose();
    } else {
      alert("❌ 전송 실패: " + res.message);
    }
    setIsSubmitting(false);
  };

  const handleReject = async () => {
    if (!window.confirm("정말로 이 브리프를 거절하시겠습니까?\n거절 시 고객에게 알림이 가며 철회할 수 없습니다.")) return;
    
    setIsSubmitting(true);
    const res = await rejectEnvelope(envelope.envelope_id);
    if (res.success) {
       router.refresh();
       onClose();
    } else {
       alert("❌ 처리 실패: " + res.message);
    }
    setIsSubmitting(false);
  };

  const createdAt = new Date(envelope.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
       <div className="bg-white rounded-[2rem] shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in zoom-in-95 duration-200">
          
          <div className="flex justify-between items-center p-6 md:px-8 border-b border-slate-100 bg-slate-50/50">
             <div>
                <div className="flex gap-2 items-center mb-1">
                   <span className="text-[10px] font-black uppercase text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded tracking-widest">New Brief</span>
                   <span className="text-xs text-slate-400 font-medium">{createdAt}</span>
                </div>
                <h2 className="text-2xl font-black text-slate-800 tracking-tight">맞춤 견적서(Proposal) 작성</h2>
             </div>
             <button onClick={onClose} className="p-2 text-slate-400 hover:text-slate-600 bg-slate-100/50 hover:bg-slate-100 rounded-full transition">
                ✕
             </button>
          </div>

          <div className="flex flex-col md:flex-row flex-1 overflow-y-auto">
             {/* Left Panel: Customer Brief Data */}
             <div className="w-full md:w-5/12 bg-slate-50 p-6 md:p-8 border-b md:border-b-0 md:border-r border-slate-100 overflow-y-auto">
                <h3 className="text-sm font-bold text-slate-800 uppercase tracking-widest mb-6 border-b border-slate-200 pb-2">Customer Envelope</h3>
                
                <div className="space-y-6">
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Target Package (예상 패키지)</p>
                      <p className="text-sm text-slate-900 font-bold bg-white p-3 border border-slate-200 rounded-xl leading-relaxed">{envelope.combination_title || '지정되지 않음'}</p>
                   </div>
                   
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"> 희망 일정 (Schedule)</p>
                      <p className="text-sm text-indigo-700 bg-indigo-50/50 font-bold p-3 border border-indigo-100 rounded-xl">{envelope.schedule_window}</p>
                   </div>
                   
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"> 고객 예산 구간 (Budget)</p>
                      <p className="text-sm font-bold text-slate-700">{envelope.budget_band}</p>
                   </div>
                   
                   <div>
                      <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1"> 추가 요청/우려사항</p>
                      <p className="text-sm text-slate-600 leading-relaxed font-medium bg-white p-4 border border-slate-200 rounded-xl min-h-[100px] whitespace-pre-wrap">
                         {envelope.requirements || '특이사항 없음'}
                      </p>
                   </div>
                </div>
             </div>

             {/* Right Panel: Official Proposal Form */}
             <form onSubmit={handleSubmit} className="w-full md:w-7/12 p-6 md:p-8 flex flex-col justify-between">
                <div className="space-y-6">
                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                         최종 확정 견적가 (Price Guarantee) <span className="text-rose-500">*</span>
                      </label>
                      <div className="relative">
                         <input 
                            type="text" 
                            required
                            value={formData.proposedPrice}
                            onChange={handlePriceChange}
                            placeholder="ex) 2,500,000"
                            className="w-full text-right bg-white border border-slate-300 focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 rounded-xl px-4 py-3 text-lg font-black text-slate-900 placeholder:text-slate-300 transition-colors shadow-sm pr-10"
                         />
                         <span className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 font-bold">원</span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1">
                         <span className="text-indigo-500">ℹ️</span> 이 금액은 고객에게 플랫폼이 보증하는 원본 대조필 금액으로 노출됩니다. 추가금 낚시를 조심하세요.
                      </p>
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                         제안 가능한 정확한 일정 / 가능일자
                      </label>
                      <input 
                         type="text" 
                         value={formData.confirmedSchedule}
                         onChange={e => setFormData(prev => ({ ...prev, confirmedSchedule: e.target.value }))}
                         placeholder="ex) 10월 3주차 평일 전부 가능, 주말은 마감"
                         className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium transition-colors"
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">비밀 코멘트 및 담당자 인삿말</label>
                      <textarea 
                         required
                         value={formData.comment}
                         onChange={e => setFormData(prev => ({ ...prev, comment: e.target.value }))}
                         rows={3}
                         className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 focus:bg-white rounded-xl px-4 py-3 text-sm font-medium transition-colors resize-none leading-relaxed"
                      />
                   </div>

                   <div>
                      <label className="block text-xs font-bold text-slate-700 mb-2">
                         당일 계약 시 한정 혜택 (Perks) <span className="text-slate-400 font-normal ml-1">선택사항</span>
                      </label>
                      <input 
                         type="text" 
                         value={formData.perks}
                         onChange={e => setFormData(prev => ({ ...prev, perks: e.target.value }))}
                         placeholder="ex) 야간 라이트 씬 촬영 서비스 (20만원 상당) 무료 추가"
                         className="w-full bg-amber-50/50 border border-amber-200 focus:border-amber-400 focus:bg-amber-50 rounded-xl px-4 py-3 text-sm font-medium text-amber-900 transition-colors placeholder:text-amber-300"
                      />
                   </div>
                </div>

                <div className="mt-10 pt-6 border-t border-slate-100 flex gap-3 justify-end items-center">
                   <button 
                      type="button"
                      onClick={handleReject}
                      disabled={isSubmitting}
                      className="px-6 py-3.5 text-sm font-bold text-slate-500 bg-white border border-slate-200 hover:bg-red-50 hover:text-red-600 hover:border-red-200 rounded-xl transition-all disabled:opacity-50"
                   >
                      견적 거절하기 (일정마감 등)
                   </button>
                   <button 
                      type="submit"
                      disabled={isSubmitting}
                      className="px-8 py-3.5 text-sm font-black text-white bg-indigo-600 hover:bg-indigo-700 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/40 hover:-translate-y-0.5 rounded-xl transition-all disabled:opacity-50 flex items-center gap-2"
                   >
                      {isSubmitting ? '전송 중...' : '견적서(Price Guarantee) 발송 🚀'}
                   </button>
                </div>
             </form>
          </div>
       </div>
    </div>
  );
}
