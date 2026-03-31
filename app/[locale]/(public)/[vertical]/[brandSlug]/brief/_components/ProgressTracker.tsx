import React from 'react';

export function ProgressTracker({ status }: { status: string }) {
  // Enum statuses: 'requested' (요청됨), 'reviewing' (검토중), 'matched' (확정/매칭됨), 'rejected' (거절됨)
  const steps = [
    { title: '요청서 발송됨', id: 'requested', color: 'bg-indigo-500', isDone: true, isFail: false },
    { title: '수석 검토 중', id: 'reviewing', color: 'bg-amber-400', isDone: status !== 'requested', isFail: false },
    { title: '최종 견적 확정', id: 'matched', color: 'bg-emerald-500', isDone: status === 'matched', isFail: status === 'rejected' }
  ];

  return (
    <div className="w-full flex justify-between relative mt-4 mb-2">
      {/* Background Line */}
      <div className="absolute top-[14px] left-[10%] right-[10%] h-[3px] bg-gray-200"></div>

      {steps.map((step, index) => {
        let nodeClasses = "w-8 h-8 rounded-full z-10 flex items-center justify-center font-bold text-white transition-all shadow-md ";
        
        if (step.isFail) {
           nodeClasses += "bg-red-500 ring-4 ring-red-100 scale-110";
        } else if (step.isDone) {
           nodeClasses += step.color + " ring-4 ring-indigo-50/50";
        } else {
           nodeClasses += "bg-gray-200 text-gray-500";
        }

        return (
          <div key={step.id} className="relative flex flex-col items-center">
             <div className={nodeClasses}>
                {step.isFail ? '✕' : (step.isDone ? '✓' : String(index + 1))}
             </div>
             <p className={`mt-3 text-xs font-bold leading-tight uppercase tracking-widest ${step.isDone ? 'text-gray-800' : 'text-gray-400'} ${step.isFail ? 'text-red-600' : ''}`}>
               {step.isFail && index === steps.length - 1 ? '매칭 반려' : step.title}
             </p>
          </div>
        );
      })}

      {/* Foreground Progress Line (Mocking roughly by status) */}
      <div 
        className={`absolute top-[14px] left-[10%] h-[3px] transition-all duration-700 ${status === 'rejected' ? 'bg-red-500' : 'bg-indigo-400'}`} 
        style={{ width: status === 'requested' ? '0%' : (status === 'reviewing' ? '40%' : '80%') }}
      ></div>
    </div>
  );
}
