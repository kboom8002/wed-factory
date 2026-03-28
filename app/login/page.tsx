'use client'

import { useActionState } from 'react'
import { login } from '@/app/actions/auth'

export default function LoginPage() {
  const [state, formAction, isPending] = useActionState(login, { error: null })

  return (
    <main className="min-h-screen bg-gray-50 flex justify-center items-center px-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-black text-gray-900 mb-2 tracking-tight">Factory Login</h1>
          <p className="text-gray-500 font-medium tracking-tight">슈퍼 어드민(L2) 및 브랜드 마스터 접근 권한 인증</p>
        </div>

        <form action={formAction} className="space-y-6">
          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">이메일 계정 (E-mail ID)</label>
            <input 
              name="email" 
              type="email" 
              required
              disabled={isPending}
              placeholder="admin@example.com"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-gray-700 mb-2">접속 비밀번호 (Password)</label>
            <input 
              name="password" 
              type="password" 
              required
              disabled={isPending}
              placeholder="••••••••"
              className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition text-gray-800 font-medium"
            />
          </div>

          {state.error && (
            <div className="p-3 bg-red-50 text-red-700 text-sm font-bold border border-red-100 rounded-lg text-center animate-pulse">
              {state.error}
            </div>
          )}

          <button 
            type="submit" 
            disabled={isPending}
            className="w-full bg-slate-900 hover:bg-black text-white font-bold py-4 rounded-xl transition shadow-md disabled:bg-slate-400 mt-2"
          >
            {isPending ? '인증 정보 확인 중...' : '안전하게 로그인하기'}
          </button>
        </form>

        <p className="text-center text-xs text-gray-400 mt-8 font-medium">
          새로운 테넌트의 계정 발급은 플랫폼 운영팀 컨시어지로 문의 바랍니다.
        </p>
      </div>
    </main>
  )
}
