'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function acceptProposal(
  proposalId: string,
  envelopeId: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // 1. 선택된 Proposal을 accepted로 변경
    const { error: accError } = await supabase
      .from('deal_proposals')
      .update({ status: 'accepted', updated_at: new Date().toISOString() })
      .eq('proposal_id', proposalId);

    if (accError) return { success: false, message: '서버 오류 발생' };

    // 2. 다른 Proposal들은 모두 rejected 처리
    await supabase
      .from('deal_proposals')
      .update({ status: 'rejected', updated_at: new Date().toISOString() })
      .eq('client_envelope_id', envelopeId)
      .neq('proposal_id', proposalId);

    // 3. 브리프 요청(bride_groom_envelope) 상태를 'closed/deal'로 변경
    await supabase
      .from('bride_groom_envelope')
      .update({ status: 'closed', updated_at: new Date().toISOString() })
      .eq('envelope_id', envelopeId);

    revalidatePath(`/brief/${envelopeId}`); // public page 갱신
    return { success: true, message: '🎉 공식 계약/미팅 거래가 수락되었습니다!' };
  } catch (err: any) {
    return { success: false, message: err.message || '서버 오류' };
  }
}
