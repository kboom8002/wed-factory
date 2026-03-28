'use server'

import { createClient } from '@/core/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function login(prevState: { error: string | null }, formData: FormData): Promise<{ error: string | null }> {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  if (!email || !password) {
    return { error: '이메일과 비밀번호를 모두 입력해 주세요.' }
  }

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  // 에러 발생 시 사용자 폼에 피드백
  if (error) {
    console.error('Login Failed:', error.message)
    return { error: '로그인에 실패했습니다. 이메일 또는 비밀번호를 다시 확인해 주세요.' }
  }

  // 성공 시 Admin Dashboard로 이동
  redirect('/admin')
}

export async function logout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  redirect('/login')
}
