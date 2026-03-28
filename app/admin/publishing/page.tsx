'use client';

import { useState } from 'react';
import { checkPreflightStatus, approvePublishing, PreflightResult } from './actions';
import { useRouter } from 'next/navigation';

export default function PublishingCenterPage() {
  const router = useRouter();
  const [selectedBrand, setSelectedBrand] = useState('sample-studio');
  const [isChecking, setIsChecking] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [results, setResults] = useState<PreflightResult[] | null>(null);
  const [toastMsg, setToastMsg] = useState('');

  const handleRunChecks = async () => {
    setIsChecking(true);
    setResults(null);
    setToastMsg('');
    try {
      const res = await checkPreflightStatus(selectedBrand);
      setResults(res);
    } catch (e) {
      console.error(e);
      setToastMsg('Check failed due to network or server error.');
    } finally {
      setIsChecking(false);
    }
  };

  const handleApprove = async () => {
    setIsPublishing(true);
    setToastMsg('');
    try {
      const res = await approvePublishing(selectedBrand);
      if (res.success) {
        setToastMsg('✅ 성공적으로 L0 Public 영역에 배포되었습니다!');
        setTimeout(() => router.push('/admin'), 1500);
      } else {
        setToastMsg(`❌ Publishing failed: ${res.message}`);
      }
    } catch (e) {
      console.error(e);
      setToastMsg('❌ Publish Error occurred.');
    } finally {
      setIsPublishing(false);
    }
  };

  const allPassed = results && results.length > 0 && results.every(r => r.pass);

  return (
    <div className="space-y-8 max-w-5xl mx-auto">
      <div className="flex justify-between items-center pb-4 border-b border-gray-200">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2 tracking-tight">Publishing & Preflight Center</h1>
          <p className="text-gray-500 font-medium">실서버(L0 Public)에 브랜드를 배포하기 전, 필수 Gate를 자동으로 DB 검증합니다.</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden flex flex-col md:flex-row min-h-[500px]">
        {/* Left: Input Selection */}
        <div className="w-full md:w-1/3 bg-slate-50 border-r border-gray-200 p-6 flex flex-col">
          <label className="font-bold text-gray-700 mb-3 block">배포 대상 테넌트 선택</label>
          <select 
            value={selectedBrand}
            onChange={(e) => { setSelectedBrand(e.target.value); setResults(null); }}
            className="w-full p-3 border border-gray-300 rounded-lg bg-white outline-none focus:ring-2 focus:ring-blue-500 shadow-sm font-medium text-gray-800"
          >
            <option value="sample-studio">새샘 스튜디오 (sample-studio)</option>
            <option value="sample-dress">샘플 드레스 (sample-dress)</option>
            <option value="sample-makeup">샘플 메이크업 (sample-makeup)</option>
          </select>

          <div className="mt-auto pt-6 text-sm text-gray-500 leading-relaxed font-medium">
             Preflight(DB 검사기)는 <strong className="text-slate-700">Trust</strong>, <strong className="text-slate-700">Disclosure</strong>, <strong className="text-slate-700">Package</strong> Gate를 통과해야만 허브 노출을 승인합니다.
          </div>
          
          <button 
            onClick={handleRunChecks}
            disabled={isChecking}
            className={`mt-4 w-full font-bold py-3.5 rounded-xl shadow-sm transition flex justify-center items-center gap-2 ${isChecking ? 'bg-blue-300 cursor-wait text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}
          >
            {isChecking ? 'DB 쿼리/검증 중...' : 'Preflight 검사 시작'}
          </button>
        </div>

        {/* Right: Output Results */}
        <div className="w-full md:w-2/3 p-8 bg-white flex flex-col relative">
          <h2 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2">
            <span className="text-xl">🛡️</span> 검증 결과
          </h2>
          
          {toastMsg && (
            <div className={`p-4 rounded-xl mb-4 font-bold border transition-all ${toastMsg.includes('✅') ? 'bg-green-100 text-green-800 border-green-300' : 'bg-red-100 text-red-800 border-red-300'}`}>
              {toastMsg}
            </div>
          )}

          {!results && !isChecking && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-400">
               <span className="text-4xl mb-3">🧪</span>
               <p className="font-medium text-sm">테넌트를 선택하고 검증을 시작해주세요.</p>
            </div>
          )}

          {isChecking && (
            <div className="flex-1 flex flex-col items-center justify-center text-gray-500">
               <div className="w-8 h-8 focus:ring-4 border-2 border-slate-300 border-t-blue-600 rounded-full animate-spin mb-4"></div>
               <p className="font-bold animate-pulse">DB Live Gate Rule 스캔 중...</p>
            </div>
          )}

          {results && (
            <div className="flex-1 overflow-y-auto space-y-4 mb-20">
              {results.map((res, i) => (
                <div key={i} className={`p-5 rounded-2xl border flex gap-4 transition-colors ${res.pass ? 'bg-green-50/50 border-green-100 hover:border-green-200' : 'bg-red-50/80 border-red-200'}`}>
                  <div className="mt-0.5">
                    {res.pass ? <span className="text-green-600 text-lg">✅</span> : <span className="text-red-500 text-lg">❌</span>}
                  </div>
                  <div>
                    <h3 className={`font-bold pb-1 ${res.pass ? 'text-green-900' : 'text-red-900'}`}>{res.rule}</h3>
                    <p className={`text-sm tracking-tight mb-2 ${res.pass ? 'text-green-700' : 'text-red-700'}`}>{res.desc}</p>
                    {!res.pass && res.error && (
                      <div className="bg-white/70 p-3 rounded-lg border border-red-100 mt-2 text-sm text-red-800 break-all">
                        <strong className="text-red-900 px-1">Err DB Check:</strong> {res.error}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results && (
            <div className="absolute bottom-0 left-0 right-0 p-8 pt-6 border-t border-gray-100 bg-white flex justify-between items-center rounded-br-2xl">
               <span className={`font-bold px-4 py-2 rounded-lg text-sm bg-gray-50 border ${allPassed ? 'text-green-700 bg-green-50 border-green-200' : 'text-red-700 bg-red-50 border-red-200'}`}>
                 State: {allPassed ? 'Ready To Publish (L0)' : 'Blocked (Fix Requires)'}
               </span>
               <button 
                disabled={!allPassed || isPublishing}
                onClick={handleApprove}
                className={`font-bold py-3 px-8 rounded-xl transition shadow-sm ${allPassed ? 'bg-slate-900 text-white hover:bg-black' : 'bg-slate-200 text-slate-400 cursor-not-allowed'} ${isPublishing && 'opacity-60 cursor-wait'}`}
               >
                 {isPublishing ? '승인 트랜잭션 도는 중...' : '최종 퍼블리시 승인'}
               </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
