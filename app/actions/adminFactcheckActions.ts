'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// Approve Answer
export async function approveAnswerCard(cardId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('answer_card')
    .update({ public_status: 'published', updated_at: new Date().toISOString() })
    .eq('answer_id', cardId);

  if (error) console.error("Error approving answer:", error);
  revalidatePath('/admin/factcheck');
  revalidatePath('/admin');
  return { success: !error };
}

// Reject Answer
export async function rejectAnswerCard(cardId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('answer_card')
    .update({ public_status: 'draft', updated_at: new Date().toISOString() })
    .eq('answer_id', cardId);

  if (error) console.error("Error rejecting answer:", error);
  revalidatePath('/admin/factcheck');
  return { success: !error };
}

// Approve Policy
export async function approvePolicyItem(policyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('policy_item')
    .update({ is_fact_checked: true, updated_at: new Date().toISOString() })
    .eq('policy_id', policyId);

  if (error) console.error("Error approving policy:", error);
  revalidatePath('/admin/factcheck');
  revalidatePath('/admin');
  return { success: !error };
}

// Reject Policy
export async function rejectPolicyItem(policyId: string) {
  const supabase = await createClient();
  const { error } = await supabase
    .from('policy_item')
    .delete() // Depending on design, you might revert it to a "draft" state or delete if there's no draft column for policy_item. Since `is_fact_checked` is boolean, we could also just leave it false. But it stays in the queue.
    .eq('policy_id', policyId);
    
  // Wait, policy_item currently has `is_fact_checked` boolean.
  // Instead of delete, let's just make it false, but then it stays in the "queue".
  // Actually, I should add a "status" column to policy_item like 'reviewing'|'draft'|'published' eventually, but for now we delete or add a rejection note.
  // For simplicity, we just delete the policy if rejected, so the vendor has to rewrite it. 
  // Let's delete it for a strict workflow.
  
  if (error) console.error("Error rejecting policy:", error);
  revalidatePath('/admin/factcheck');
  return { success: !error };
}
