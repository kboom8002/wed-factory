import React from 'react';

export default function TemplatesSchemaPage() {
  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-6 lg:p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">템플릿 / 스키마 관리</h1>
        <p className="text-gray-500 font-medium">B-SSoT (Brand Single Source of Truth) 전시를 위한 블록 스키마와 테마 템플릿을 제어합니다.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Templates Module */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-slate-50">
             <h2 className="text-lg font-bold text-slate-800">프리미엄 테마 템플릿 (Vibe Spec)</h2>
             <p className="text-sm text-slate-500 mt-1">블록들의 배치와 색상 톤앤매너 규칙의 집합체입니다.</p>
          </div>
          <ul className="divide-y divide-gray-100 p-2">
             <TemplateRow title="Cinematic Night" version="v1.2.0" status="Active" color="bg-indigo-500" />
             <TemplateRow title="Lovely Peach" version="v1.1.5" status="Active" color="bg-pink-400" />
             <TemplateRow title="Modern Minimal" version="v2.0 Beta" status="Draft" color="bg-slate-800" />
          </ul>
        </div>

        {/* Schema Registry */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-6 border-b border-gray-100 bg-slate-50">
             <h2 className="text-lg font-bold text-slate-800">스키마 (Data Projections)</h2>
             <p className="text-sm text-slate-500 mt-1">DB의 로우 데이터를 화면에 렌더링하기 위한 투영 블록 스키마입니다.</p>
          </div>
          <ul className="divide-y divide-gray-100 p-2">
             <SchemaRow name="AnswerCardProjection" type="QnA" usedBy="12 Brands" />
             <SchemaRow name="CombinationTypeProjection" type="Spec" usedBy="8 Brands" />
             <SchemaRow name="PolicyItemProjection" type="Legal" usedBy="15 Brands" />
          </ul>
        </div>
      </div>
    </div>
  );
}

function TemplateRow({ title, version, status, color }: { title: string, version: string, status: string, color: string }) {
  return (
    <li className="flex items-center justify-between p-4 hover:bg-slate-50 transition rounded-xl">
      <div className="flex items-center gap-4">
        <div className={`w-8 h-8 rounded-full ${color} shadow-sm border-2 border-white`}></div>
        <div>
          <div className="font-bold text-slate-800">{title}</div>
          <div className="text-xs text-slate-500 font-mono mt-0.5">{version}</div>
        </div>
      </div>
      <span className={`px-3 py-1 text-xs font-bold rounded-full ${status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
        {status}
      </span>
    </li>
  );
}

function SchemaRow({ name, type, usedBy }: { name: string, type: string, usedBy: string }) {
  return (
    <li className="flex flex-col sm:flex-row sm:items-center justify-between p-4 hover:bg-slate-50 transition rounded-xl gap-2">
      <div>
        <div className="font-bold text-slate-800 text-sm font-mono">{name}</div>
        <div className="text-xs text-slate-500 mt-1">블록 타입: {type}</div>
      </div>
      <div className="text-xs font-semibold text-slate-400 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
        활성 의존성: {usedBy}
      </div>
    </li>
  );
}
