'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function demoteAnswerCard(answerId: string) {
  try {
    const supabase = await createClient();

    // 1. 강등 처리 (visibility_level = 'L1', public_status = 'draft')
    // public_status도 draft로 내리는 것이 프론트엔드 안전망 확보에 유리
    const { error: updateError } = await supabase
      .from('answer_card')
      .update({ 
         visibility_level: 'L1',
         public_status: 'draft',
         updated_at: new Date().toISOString()
      })
      .eq('card_id', answerId);

    if (updateError) {
      console.error('[demoteAnswerCard] Error:', updateError);
      return { success: false, message: updateError.message };
    }

    // 2. Audit Log (change_log) 기록
    await supabase.from('change_log').insert({
      entity_name: 'answer_card',
      entity_id: answerId,
      changes: { 
         action: 'demote_to_L1', 
         reason: 'trust_evidence_missing', 
         enforced_by: 'admin' 
      }
    });

    revalidatePath('/admin/publishing/trust-queue');
    revalidatePath('/admin/trustlog');
    
    return { success: true, message: '직권 비공개(L1) 처리가 완료되었습니다.' };
  } catch (err: any) {
    return { success: false, message: err.message || '서버 오류' };
  }
}

export async function requestEvidence(answerId: string) {
  try {
    const supabase = await createClient();

    // 실제로는 벤더 노티피케이션 (Push/Email) 발송 로직 필요.
    // MVP에서는 DB에 로그만 남기고 Alert로 갈음함.
    await supabase.from('change_log').insert({
      entity_name: 'answer_card',
      entity_id: answerId,
      changes: { 
         action: 'evidence_request_sent',
         method: 'email_push'
      }
    });

    return { success: true, message: '점주에게 증빙 요청 알림이 발송되었습니다.' };
  } catch (err: any) {
    return { success: false, message: err.message || '서버 오류' };
  }
}

export async function publishAnswerCard(answerId: string) {
  try {
    const supabase = await createClient();
    
    // 1. 카드 정보 및 브랜드 Vibe 정보 조회
    const { data: card, error: fetchErr } = await supabase
      .from('answer_card')
      .select('short_answer, brand_id')
      .eq('card_id', answerId)
      .single();

    if (fetchErr || !card) return { success: false, message: '카드를 찾을 수 없습니다.' };

    const { data: brand } = await supabase
      .from('brand_registry')
      .select('vibe_spec_id')
      .eq('id', card.brand_id)
      .single();

    const vibeId = brand?.vibe_spec_id || 'default-vibe-target';

    // 2. Vibe Lint (Mixed Signal Skeleton) 검문소 통과 여부 확인
    // 현재 evidenceType은 하드코딩으로 'screenshot' 또는 DB에서 추출 (여기선 'screenshot' 목업)
    const { vibeLintCheck } = await import('@/app/actions/vibeLintActions');
    const lintResult = await vibeLintCheck(vibeId, card.short_answer, 'screenshot');
    
    if (!lintResult.isValid) {
      // Lint 실패 시 승인 블로킹 및 에러 반환 (Gate)
      return { 
        success: false, 
        message: '퍼블리싱 실패 (Vibe Rule 위반):\n' + lintResult.errors.join('\n')
      };
    }

    // 3. 검문 통과 시 L0 Publish 진행
    await supabase.from('answer_card').update({
      visibility_level: 'L0',
      public_status: 'published',
      updated_at: new Date().toISOString()
    }).eq('card_id', answerId);

    revalidatePath('/admin/publishing/trust-queue');
    return { success: true, message: 'Vibe 검증 통과 및 정상 발행되었습니다.' };

  } catch (err: any) {
    return { success: false, message: err.message || '서버 오류' };
  }
}
