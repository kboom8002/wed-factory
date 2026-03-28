'use client';

import React, { useState } from 'react';

export interface PolicyItemProps {
  policy_id: string;
  policy_family: string;
  summary: string;
  detailed_rule?: string | null;
  exceptions?: string | null;
  risk_hint?: string | null;
}

export function PolicyFactCheckBlock({ policies, brandId }: { policies: PolicyItemProps[], brandId: string }) {
  if (!policies || policies.length === 0) {
    return null;
  }

  // Grouping by family
  const grouped = policies.reduce((acc, p) => {
    if (!acc[p.policy_family]) acc[p.policy_family] = [];
    acc[p.policy_family].push(p);
    return acc;
  }, {} as Record<string, PolicyItemProps[]>);

  const getFamilyLabel = (family: string) => {
    const labels: Record<string, string> = {
      refund: '환불 규정 (위약금)',
      change: '스케줄 변경/취소',
      retouch: '보정 / 색감 작업',
      original_delivery: '원본 제공 방식',
      select: '셀렉(사진 선택) 지연 패널티',
      schedule: '촬영/본식 당일 스케줄'
    };
    return labels[family] || family.toUpperCase();
  };

  return (
    <div className="w-full space-y-8">
      {Object.entries(grouped).map(([family, items]) => (
        <section key={family} className="bg-white rounded-[var(--brand-radius)] border border-gray-200 overflow-hidden shadow-sm">
          <div className="bg-[var(--brand-surface)] px-6 py-4 border-b border-gray-100 flex items-center gap-3">
             <span className="text-xl">🛡️</span>
             <h3 className="font-bold text-[var(--brand-text-main)] text-lg">
                {getFamilyLabel(family)}
             </h3>
          </div>
          
          <div className="divide-y divide-gray-100">
            {items.map(item => (
              <PolicyRow key={item.policy_id} item={item} brandId={brandId} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}

import { trackEvent } from '@/app/actions/telemetryActions';

function PolicyRow({ item, brandId }: { item: PolicyItemProps, brandId: string }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleToggle = () => {
    const nextState = !isOpen;
    setIsOpen(nextState);

    if (nextState) {
      trackEvent('policy_open', {
        brandId,
        targetId: item.policy_id,
        metadata: { family: item.policy_family, summary: item.summary }
      }).catch(() => {});
    }
  };

  return (
    <div className="flex flex-col relative group transition-colors duration-200">
      <button 
        onClick={handleToggle}
        className="w-full text-left px-6 py-5 flex items-start sm:items-center justify-between hover:bg-slate-50 gap-4"
      >
        <div className="flex-1">
          <h4 className="font-bold text-gray-800 text-base">{item.summary}</h4>
          
          {item.risk_hint && !isOpen && (
            <p className="inline-flex mt-2 text-[11px] font-bold text-red-600 bg-red-50 border border-red-100 px-2 py-1 rounded gap-1 uppercase tracking-tight">
               🚨 결제 전 주의: {item.risk_hint}
            </p>
          )}
        </div>
        
        <div className="shrink-0 text-gray-400">
          {isOpen ? (
            <svg className="w-6 h-6 transform rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          ) : (
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" /></svg>
          )}
        </div>
      </button>

      {/* Accordion Detail */}
      {isOpen && (
        <div className="px-6 pb-6 pt-2 bg-slate-50 text-sm border-t border-gray-100 grid grid-cols-1 sm:grid-cols-[1fr_200px] gap-6 animate-in slide-in-from-top-1 fadeIn">
          <div className="space-y-4">
            {item.detailed_rule && (
              <div>
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1">상세 규정</dt>
                <dd className="text-gray-700 font-medium leading-relaxed whitespace-pre-wrap">{item.detailed_rule}</dd>
              </div>
            )}
            {item.exceptions && (
              <div className="bg-white p-4 border border-gray-200 rounded-xl">
                <dt className="text-xs font-bold text-gray-400 uppercase tracking-widest mb-1 text-[var(--brand-primary)]">✅ 예외 적용 (이럴 땐 다릅니다)</dt>
                <dd className="text-gray-600 font-medium leading-relaxed whitespace-pre-wrap">{item.exceptions}</dd>
              </div>
            )}
          </div>

          <div>
             {item.risk_hint && (
                <div className="h-full bg-red-50/50 p-4 border border-red-100 rounded-xl flex flex-col justify-center">
                  <span className="text-3xl mb-2 text-center">🚨</span>
                  <p className="text-red-700 font-bold text-center leading-tight tracking-tight">
                    {item.risk_hint}
                  </p>
                </div>
             )}
          </div>
        </div>
      )}
    </div>
  );
}
