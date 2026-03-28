'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function resolveZeroResult(
  queryId: string,
  brandId: string,
  questionFormulated: string,
  answerText: string
): Promise<{ success: boolean; message: string }> {
  try {
    const supabase = await createClient();

    // 1. Transaction-like: Create new AnswerCard
    const { data: cardRes, error: insertError } = await supabase
      .from('answer_card')
      .insert({
        brand_id: brandId,
        question: questionFormulated,
        short_answer: answerText,
        visibility_level: 'L0',
        public_status: 'published'
      })
      .select('card_id')
      .single();

    if (insertError) {
      console.error('[resolveZeroResult] Answer insert error:', insertError);
      return { success: false, message: '답변 카드 생성에 실패했습니다.' };
    }

    // 2. Mark Zero-Result Query as resolved
    const { error: updateError } = await supabase
      .from('zero_result_query')
      .update({ status: 'resolved', updated_at: new Date().toISOString() })
      .eq('id', queryId);

    if (updateError) {
      console.error('[resolveZeroResult] Query update error:', updateError);
      return { success: false, message: 'Backlog 상태 갱신에 실패했습니다.' };
    }

    // 3. Log into change_log
    await supabase.from('change_log').insert({
      entity_name: 'answer_card',
      entity_id: cardRes.card_id,
      changes: { 
        action: 'created_from_zero_result',
        zero_result_id: queryId,
        reason: 'Converted from User Inquiry'
      }
    });

    revalidatePath('/admin/inbox');
    revalidatePath('/(public)/page'); 
    
    return { success: true, message: '브랜드 SSoT 답변으로 즉각 배포되었습니다.' };
  } catch (err: any) {
    console.error('[resolveZeroResult] Error:', err);
    return { success: false, message: err.message || '서버 오류' };
  }
}
