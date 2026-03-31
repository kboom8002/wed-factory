'use client';

import { useState, useRef, use } from 'react';
import { useRouter } from 'next/navigation';
import { uploadHeroBackground } from '@/app/actions/adminUploadActions';
import Link from 'next/link';

export default function BrandSettingsPage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setMessage({ type: 'error', text: '경고: 5MB 이하의 이미지만 업로드 가능합니다.' });
        e.target.value = '';
        return;
      }
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedFile) {
      setMessage({ type: 'error', text: '업로드할 사진을 선택해주세요.' });
      return;
    }

    setIsUploading(true);
    setMessage(null);

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await uploadHeroBackground(resolvedParams.brandSlug, formData);
      if (response.success) {
        setMessage({ type: 'success', text: '배경 이미지가 성공적으로 변경되었습니다! B-SSoT에 실시간 반영됩니다.' });
        setSelectedFile(null);
        // Clear input
        if (fileInputRef.current) fileInputRef.current.value = '';
      } else {
        setMessage({ type: 'error', text: response.error || '업로드 중 알 수 없는 에러가 발생했습니다.' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || '네트워크 에러' });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto py-8">
      {/* 1. Header & Breadcrumbs */}
      <div className="mb-8">
        <Link href="/admin/brands" className="text-sm font-bold text-gray-400 hover:text-blue-600 mb-2 inline-block">
          &larr; 브랜드 레지스트리로 돌아가기
        </Link>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
          미디어 & 에셋 설정
          <span className="text-xs font-bold bg-blue-100 text-blue-700 px-3 py-1.5 rounded-full uppercase tracking-widest align-middle">
            {resolvedParams.brandSlug}
          </span>
        </h1>
        <p className="text-slate-500 font-medium mt-2">해당 브랜드 미니홈페이지(B-SSoT)의 핵심 디자인 요소들을 제어합니다.</p>
      </div>

      {/* 2. Upload Card */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden p-8">
        <h2 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
          <span className="text-2xl">📸</span> B-SSoT Hero (메인 배경) 관리
        </h2>

        {message && (
          <div className={`p-4 rounded-xl font-bold text-sm mb-6 flex items-start gap-2 ${message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            <span>{message.type === 'success' ? '✅' : '🚨'}</span>
            <span>{message.text}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
             <label className="block text-sm font-bold text-slate-700">백그라운드 이미지 스냅 파일 (최대 5MB, JPG/PNG)</label>
             <div className="flex gap-4 items-center">
                <input 
                  type="file" 
                  ref={fileInputRef}
                  accept="image/png, image/jpeg, image/webp" 
                  onChange={handleFileChange}
                  className="block w-full text-sm text-slate-500
                    file:mr-4 file:py-3 file:px-6
                    file:rounded-xl file:border-0
                    file:text-sm file:font-semibold
                    file:bg-indigo-50 file:text-indigo-700
                    hover:file:bg-indigo-100 transition-all cursor-pointer bg-slate-50 border border-slate-200 rounded-xl"
                />
             </div>
             <p className="text-xs font-medium text-slate-400">권장 사이즈: 1920x1080px 레이아웃 최적화 (다크 오버레이 자동 삽입)</p>
          </div>

          <button 
             type="submit" 
             disabled={isUploading || !selectedFile}
             className="w-full py-4 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold rounded-xl shadow-md transition transform active:scale-[0.98] flex items-center justify-center gap-2"
          >
             {isUploading ? (
               <>
                 <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                 업로드 및 DB 동기화 중...
               </>
             ) : '새 Hero 배경으로 실시간 퍼블리시'}
          </button>
        </form>

        {previewUrl && (
           <div className="mt-8 pt-6 border-t border-slate-100">
             <h3 className="text-sm font-bold text-slate-600 mb-3 tracking-wide">적용 시뮬레이션 (HeroBlock View)</h3>
             <div className="w-full h-64 rounded-2xl overflow-hidden relative shadow-inner border-2 border-slate-200" style={{ backgroundImage: `url(${previewUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
                <div className="absolute inset-0 bg-black/50 pointer-events-none flex flex-col justify-center items-center">
                   <h2 className="text-3xl font-bold text-white mb-2">{resolvedParams.brandSlug}</h2>
                   <p className="text-white/80 font-medium">웨딩 스드메 AI홈페이지 Factory - 스튜디오 공식 테넌트</p>
                </div>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}
