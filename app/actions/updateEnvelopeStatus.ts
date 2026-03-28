'use server'

import { createClient } from '@/core/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateEnvelopeStatus(envelopeId: string, newStatus: string) {
  const supabase = await createClient()

  // 상태 업데이트 트리거
  const { error } = await supabase
    .from('bride_groom_envelope')
    .update({ status: newStatus })
    .eq('envelope_id', envelopeId)

  if (error) {
    console.error('[UpdateEnvelopeStatus] DB Update Error:', error)
    return { success: false, error: '상태 업데이트에 실패했습니다.' }
  }

  // 어드민 Inbox 리스트와 고객 프라이빗 딜룸(`brief/[id]`) 캐시를 무효화하여 즉시 렌더링 동기화
  revalidatePath('/admin/inbox')
  revalidatePath(`/brief/${envelopeId}`, 'page') // Global brief path
  
  // 만약 [vertical]/[brandSlug]/brief/[id] 계층 캐시도 날려야 한다면 와일드카드나 parent route revalidate 권장
  // Next 15 revalidatePath('/[vertical]/[brandSlug]/brief/[id]', 'page') - dynamic segments handled manually if needed

  return { success: true }
}
