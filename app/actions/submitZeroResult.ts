'use server'

import { createClient } from '@/core/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function submitZeroResult(
  prevState: { success: boolean; error: string | null }, 
  formData: FormData
): Promise<{ success: boolean; error: string | null }> {
  const supabase = await createClient()

  const queryText = formData.get('query_text') as string
  const vertical = formData.get('vertical_context') as string || 'hub'

  if (!queryText || queryText.trim() === '') {
    return { success: false, error: '제보할 질문 내용을 입력해 주세요.' }
  }

  const { error } = await supabase
    .from('zero_result_query')
    .insert({
      query_text: queryText.trim(),
      vertical_context: vertical,
      status: 'pending'
    })

  if (error) {
    console.error('[SubmitZeroResult] Insert Error:', error)
    return { success: false, error: '제보 등록 중 서버 오류가 발생했습니다.' }
  }

  // Admin 대시보드 강제 갱신 트리거
  revalidatePath('/admin')
  
  return { success: true, error: null }
}
