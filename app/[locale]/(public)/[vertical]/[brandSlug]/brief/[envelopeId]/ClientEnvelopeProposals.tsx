'use client';

import { useState } from 'react';
import { acceptProposal } from '@/app/actions/acceptProposal';
import { trackEvent } from '@/app/actions/telemetryActions';

export default function ClientEnvelopeProposals({ proposals, envelopeId, envelopeStatus }: any) {
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleAccept = async (proposalId: string) => {
    if (!window.confirm('이 견적 제안을 최종 수락(Deal) 하시겠습니까?\n수락 시 다른 제안들은 모두 거절 처리됩니다.')) return;

    setLoadingId(proposalId);
    try {
      const res = await acceptProposal(proposalId, envelopeId);
      if (res.success) {
        alert(res.message);
        trackEvent('deal_accepted', {
          targetId: envelopeId,
          metadata: { proposalId }
        }).catch(() => {});
      } else {
        alert(res.message);
      }
    } catch (err) {
      alert('오류가 발생했습니다.');
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {proposals.map((p: any) => {
        const isAccepted = p.status === 'accepted';
        const isRejected = p.status === 'rejected';
        const isPending = p.status === 'pending';

        return (
          <div key={p.proposal_id} className={`bg-white rounded-3xl p-8 border hover:-translate-y-1 transition-transform hover:shadow-2xl hover:shadow-blue-500/10 ${isAccepted ? 'border-2 border-green-500 shadow-xl' : isRejected ? 'opacity-50 border-slate-200 cursor-not-allowed' : 'border-slate-200'}`}>
            <div className="flex justify-between items-start mb-4">
               <div>
                  <span className={`text-[10px] font-black uppercase tracking-widest px-2 py-1 rounded inline-block mb-3 ${isAccepted ? 'bg-green-100 text-green-700' : isRejected ? 'bg-slate-100 text-slate-500' : 'bg-blue-100 text-blue-700'}`}>
                    {isAccepted ? '🎉 최종 계약 확정 (DEAL)' : isRejected ? '❌ 거절됨' : '📬 검토 대기'}
                  </span>
                  <h3 className="text-2xl font-black text-slate-900 tracking-tight">[{p.brand_registry.vertical_type}] {p.brand_registry.brand_name}</h3>
               </div>
               <div className="text-right">
                  <span className="block text-slate-400 font-bold text-xs uppercase mb-1">최종 제안 금액</span>
                  <strong className={`text-2xl font-black ${isAccepted ? 'text-green-600' : 'text-blue-600'}`}>
                     {(p.proposed_price).toLocaleString()}원
                  </strong>
               </div>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100 mb-6">
               <p className="text-slate-600 whitespace-pre-wrap leading-relaxed text-[15px] font-medium border-l-4 border-slate-300 pl-4">{p.message}</p>
            </div>

            {isPending && envelopeStatus !== 'closed' && (
              <div className="flex gap-4 items-center justify-end mt-4 pt-4 border-t border-slate-100">
                 <button 
                  onClick={() => handleAccept(p.proposal_id)}
                  disabled={loadingId === p.proposal_id}
                  className="bg-slate-900 text-white font-bold px-8 py-3.5 rounded-xl hover:bg-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] disabled:opacity-50"
                 >
                   {loadingId === p.proposal_id ? '체결 처리 중...' : '🤝 계약 수락 및 진행하기 (DEAL)'}
                 </button>
              </div>
            )}

            {isAccepted && (
              <div className="mt-8 pt-6 border-t border-green-200">
                <h4 className="text-lg font-black text-green-800 flex items-center gap-2 mb-4">
                  <span>✅</span> 딜 수락 완료! 다음 행동(Next Step) 안내
                </h4>
                <div className="bg-green-50 rounded-2xl p-6 border border-green-100 flex flex-col gap-4">
                  
                  {/* Bank Account Info */}
                  <div>
                    <span className="block text-green-700/60 font-bold text-xs uppercase mb-1">계약금(Deposit) 10만원 입금 계좌</span>
                    <div className="flex items-center gap-3">
                      <strong className="text-green-900 font-bold font-mono text-lg bg-white px-3 py-1.5 rounded-lg border border-green-200 shadow-sm flex-1">
                        {p.brand_registry?.bank_account_info || '계좌 정보가 등록되지 않았습니다 (직접 문의)'}
                      </strong>
                      <button 
                        onClick={() => navigator.clipboard.writeText(p.brand_registry?.bank_account_info || '')}
                        className="bg-green-600 text-white font-bold px-4 py-2 rounded-lg hover:bg-green-700 active:scale-95 transition-all text-sm shadow-md"
                      >
                        계좌 복사
                      </button>
                    </div>
                    <p className="text-green-700 text-xs mt-2 font-medium bg-green-100/50 p-2 rounded-lg inline-block">
                      이체 시 입금자명을 반드시 **"견적 신청하신 성함(신랑님/신부님)"** 으로 해주세요.
                    </p>
                  </div>

                  {/* Kakao Channel Link */}
                  {p.brand_registry?.kakao_channel_url && (
                    <div className="mt-2 pt-4 border-t border-green-200/50">
                      <span className="block text-green-700/60 font-bold text-xs uppercase mb-2">프라이빗 1:1 상담 연결</span>
                      <a 
                        href={p.brand_registry.kakao_channel_url} 
                        target="_blank" rel="noreferrer"
                        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-[#FEE500] text-black font-black px-6 py-3.5 rounded-xl hover:brightness-95 active:scale-95 transition-all shadow-md focus:ring-4 focus:ring-[#FEE500]/30"
                      >
                        <span className="text-xl">💬</span> 카카오톡 채널로 미팅 일정 조율하기
                      </a>
                    </div>
                  )}

                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
