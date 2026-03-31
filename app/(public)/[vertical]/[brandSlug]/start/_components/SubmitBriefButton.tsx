'use client';

import React from 'react';
import { useFormStatus } from 'react-dom';

export function SubmitBriefButton() {
  const { pending } = useFormStatus();

  return (
    <button 
      type="submit" 
      disabled={pending}
      className={`w-full bg-[var(--brand-text-main)] text-[var(--brand-surface)] font-black text-lg py-5 rounded-2xl shadow-xl transition-all relative overflow-hidden flex justify-center items-center gap-2 group ${pending ? 'opacity-80 cursor-wait' : 'hover:scale-[1.02] hover:shadow-2xl active:scale-95'}`}
    >
      <div className={`absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full transition-transform duration-700 ${!pending && 'group-hover:translate-x-[200%]'}`}></div>
      {pending ? (
        <>
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          매칭 룸 생성 중...
        </>
      ) : (
        <>매칭 룸(Dealroom) 생성 및 브리프 발송</>
      )}
    </button>
  );
}
