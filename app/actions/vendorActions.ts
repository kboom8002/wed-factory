'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

// AnswerCard Drafting
export async function saveAnswerDraft(
  brandId: string,
  brandSlug: string,
  formData: FormData
) {
  const supabase = await createClient();

  const answerId = formData.get('answer_id') as string | null;
  const question = formData.get('question') as string;
  const shortAnswer = formData.get('short_answer') as string;
  const boundaryNote = formData.get('boundary_note') as string;

  const payload = {
    brand_id: brandId,
    question,
    short_answer: shortAnswer,
    boundary_note: boundaryNote || null,
    public_status: 'reviewing', 
    updated_at: new Date().toISOString(),
  };

  if (answerId) {
    // Update existing
    const { error } = await supabase
      .from('answer_card')
      .update(payload)
      .eq('answer_id', answerId)
      .eq('brand_id', brandId);
      
    if (error) console.error("Update draft error:", error);
  } else {
    // Insert new
    const { error } = await supabase
      .from('answer_card')
      .insert({ ...payload, visibility_level: 'L0' });
      
    if (error) console.error("Insert draft error:", error);
  }

  revalidatePath(`/vendor/${brandSlug}/answers`);
}

// PolicyItem Drafting
export async function savePolicyDraft(
  brandId: string,
  brandSlug: string,
  formData: FormData
) {
  const supabase = await createClient();

  const policyId = formData.get('policy_id') as string | null;
  const family = formData.get('policy_family') as string;
  const title = formData.get('title') as string;
  const summary = formData.get('summary') as string;
  const exceptions = formData.get('exceptions') as string;
  const riskHint = formData.get('risk_hint') as string;

  const payload = {
    brand_id: brandId,
    policy_family: family,
    title,
    summary,
    exceptions: exceptions ? exceptions.split('\n').filter(Boolean) : null,
    risk_hint: riskHint || null,
    is_fact_checked: false, 
  };

  if (policyId) {
    const { error } = await supabase
      .from('policy_item')
      .update(payload)
      .eq('policy_id', policyId)
      .eq('brand_id', brandId);
      
    if (error) console.error("Update policy error:", error);
  } else {
    const { error } = await supabase
      .from('policy_item')
      .insert(payload);
      
    if (error) console.error("Insert policy error:", error);
  }

  revalidatePath(`/vendor/${brandSlug}/policies`);
}

// Stubs for Phase 4 Leftovers
export async function submitPortfolioShot(a: any, b: any) { return { success: true, error: null }; }
export async function submitAnswerDraft(a: any, b: any) { return { success: true, error: null }; }
