'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export type ProposalData = {
  envelopeId: string;
  brandId: string;
  proposedPrice: number;
  confirmedSchedule: string;
  perks: string;
  comment: string;
};

export async function submitVendorProposal(data: ProposalData) {
  const supabase = await createClient();

  try {
    // 1. Insert into deal_proposals
    const { data: inserted, error: propError } = await supabase
      .from('deal_proposals')
      .insert({
        client_envelope_id: data.envelopeId,
        brand_id: data.brandId,
        proposed_price: data.proposedPrice,
        message: `[확정 일정] ${data.confirmedSchedule}\n\n[제안 혜택] ${data.perks || '없음'}\n\n[상세 코멘트]\n${data.comment}`,
        status: 'pending' // pending client's acceptance
      })
      .select('proposal_id')
      .single();

    if (propError) throw propError;

    // 2. Update status of the envelope to 'proposed'
    const { error: envError } = await supabase
      .from('bride_groom_envelope')
      .update({ status: 'proposed', updated_at: new Date().toISOString() })
      .eq('envelope_id', data.envelopeId);

    if (envError) throw envError;

    // Refresh pages
    revalidatePath(`/vendor/${process.env.NEXT_PUBLIC_BRAND_SLUG || 'urban-studio'}/deal`);
    revalidatePath('/admin');
    
    return { success: true, message: '견적서가 송신되었습니다.' };

  } catch (err: any) {
    console.error('[DealActions] Submit Error:', err);
    return { success: false, message: err.message };
  }
}

export async function rejectEnvelope(envelopeId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('bride_groom_envelope')
    .update({ status: 'rejected', updated_at: new Date().toISOString() })
    .eq('envelope_id', envelopeId);

  if (error) {
    console.error('[DealActions] Reject Error:', error);
    return { success: false, message: error.message };
  }

  revalidatePath('/admin');
  return { success: true, message: '해당 브리프를 반려(거절)했습니다.' };
}
