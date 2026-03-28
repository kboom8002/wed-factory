'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitProposal(
  clientEnvelopeId: string,
  brandId: string,
  proposedPrice: number,
  message: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // 1. 역제안 (Deal Proposal) 로우 생성
    const { error: insertError } = await supabase
      .from('deal_proposals')
      .insert({
        client_envelope_id: clientEnvelopeId,
        brand_id: brandId,
        proposed_price: proposedPrice,
        message: message,
        status: 'pending' // 고객 수락 대기
      });

    if (insertError) {
      console.error('[submitProposal] Error:', insertError);
      return { success: false, message: '역제안 발송에 실패했습니다 (DB 오류).' };
    }

    // 2. 브리프 요청(BrideGroomEnvelope)의 상태를 'matched'로 변경
    await supabase
      .from('bride_groom_envelope')
      .update({ status: 'matched', updated_at: new Date().toISOString() })
      .eq('envelope_id', clientEnvelopeId);

    // 3. 로그 기록
    await supabase.from('change_log').insert({
      entity_name: 'deal_proposals',
      entity_id: clientEnvelopeId, // tracking key
      changes: { action: 'proposal_sent', brandId, proposedPrice }
    });

    revalidatePath('/admin/dealroom');
    return { success: true, message: '성공적으로 역제안서를 발송했습니다.' };
  } catch (err: any) {
    return { success: false, message: err.message || '서버 액션 오류' };
  }
}
