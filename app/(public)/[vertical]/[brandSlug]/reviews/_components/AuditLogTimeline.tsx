import React from 'react';

export interface AuditLogItem {
  log_id: string;
  entity_name: string;
  changes: {
    action: string;
    target_brand?: string;
    note?: string;
  };
  created_at: string;
}

export function AuditLogTimeline({ logs }: { logs: AuditLogItem[] }) {
  if (!logs || logs.length === 0) {
    return (
      <div className="w-full text-center py-6">
        <p className="text-gray-400 font-medium">기록된 개정 로그가 없습니다.</p>
      </div>
    );
  }

  const formatDateTime = (dateStr: string) => {
    const d = new Date(dateStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  return (
    <div className="relative border-l-2 border-gray-200 ml-4 md:ml-6 mt-4 pb-8">
      {logs.map((log, index) => (
        <div key={log.log_id} className="mb-10 ml-8 relative group">
          
          {/* Timeline Node Point */}
          <span className="absolute flex items-center justify-center w-5 h-5 bg-[var(--brand-primary)] rounded-full -left-[42px] top-1 ring-4 ring-white shadow-sm transition-transform group-hover:scale-125">
             <div className="w-2 h-2 bg-white rounded-full"></div>
          </span>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-1 gap-2">
            <h3 className="flex items-center text-lg font-bold text-gray-900 leading-tight">
              {log.changes.action.replace(/_/g, ' ')}
            </h3>
            <time className="block text-xs font-semibold text-[var(--brand-primary)] uppercase tracking-wider bg-[var(--brand-surface)] px-2 py-1 rounded">
              {formatDateTime(log.created_at)}
            </time>
          </div>
          
          <div className="text-sm font-medium text-gray-500 mb-3 tracking-wide">
            대상 객체: {log.entity_name}
          </div>
          
          <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 shadow-[inset_0_1px_2px_rgba(0,0,0,0.02)]">
             <p className="text-sm text-gray-700 font-medium leading-relaxed">
               {log.changes.note || '시스템 자동 로깅 처리 완료'}
             </p>
          </div>
          
        </div>
      ))}
    </div>
  );
}
