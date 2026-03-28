'use server'

import { createClient } from '@/core/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function submitBrideGroomEnvelope(
  formData: FormData
) {
  const supabase = await createClient()

  // 1. 기본 필드 추출
  const vertical = formData.get('vertical') as string
  const brandSlug = formData.get('brandSlug') as string
  let combinationId = formData.get('combination_id') as string | null
  
  if (combinationId === 'null' || !combinationId) {
    combinationId = null;
  }

  // 2. 마이그레이션 확장 필드 추출
  const legalNames = formData.get('legal_names') as string
  const contactInfo = formData.get('contact_info') as string
  const exactEventDate = formData.get('exact_event_date') as string | null
  const scheduleWindow = formData.get('schedule_window') as string
  const budgetBand = formData.get('budget_band') as string
  const retouchSensitivity = formData.get('original_retouch_sensitivity') as string | null

  // Checkboxes return multiple values
  const priorityTags = formData.getAll('priority_tags') as string[]
  const styleMoodTags = formData.getAll('style_mood_tags') as string[]

  if (!scheduleWindow || !budgetBand || !legalNames || !contactInfo) {
    throw new Error('필수 입력값이 누락되었습니다.')
  }

  // 3. DB Insert (새로운 Schema 반영)
  const { data, error } = await supabase
    .from('bride_groom_envelope')
    .insert({
      target_combination_id: combinationId,
      schedule_window: scheduleWindow,
      budget_band: budgetBand,
      priority_tags: priorityTags,
      status: 'requested',
      // 확장 스키마 맵핑
      legal_names: legalNames,
      contact_info: contactInfo,
      exact_event_date: exactEventDate ? exactEventDate : null,
      style_mood_tags: styleMoodTags,
      original_retouch_sensitivity: retouchSensitivity
    })
    .select('envelope_id')
    .single()

  if (error || !data) {
    console.error('[SubmitEnvelope] DB Insert Error:', error)
    throw new Error('데이터 저장 중 오류가 발생했습니다. 고객센터로 문의 바랍니다.')
  }

  // 4. 리다이렉션 (생성된 Envelope ID를 가진 조회 라우트로)
  // L1 Verified 진입 또는 마이페이지
  redirect(`/${vertical}/${brandSlug}/brief/${data.envelope_id}`)
}

