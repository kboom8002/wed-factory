'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function submitAnswerDraft(brandSlug: string, formData: FormData) {
  const supabase = await createClient();
  
  const question = formData.get('question') as string;
  const short_answer = formData.get('short_answer') as string;
  
  if (!question || !short_answer) return { success: false, error: '필수 필드를 입력해주세요.' };

  // 1. Get Brand ID from slug
  const { data: brand, error: brandErr } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name')
    .eq('brand_slug', brandSlug)
    .single();
    
  if (brandErr || !brand) return { success: false, error: '브랜드 정보를 찾을 수 없습니다.' };

  // 2. Insert as DRAFT into answer_card
  // The Admin (Publishing Center) will review this and change `public_status` to 'published'.
  const { error: insertErr } = await supabase.from('answer_card').insert({
    brand_id: brand.brand_id,
    question,
    short_answer,
    visibility_level: 'L0',   // Target visibility
    public_status: 'draft',   // Start as draft
    reviewer_name: brand.brand_name + ' (Vendor User)', // Temporary tracking for MVP
  });

  if (insertErr) return { success: false, error: insertErr.message };

  revalidatePath(`/vendor/${brandSlug}`);
  return { success: true };
}

export async function submitPortfolioShot(brandSlug: string, formData: FormData) {
  const supabase = await createClient();
  
  const cdn_url = formData.get('cdn_url') as string;
  const moodTagsStr = formData.get('mood_tags') as string;
  
  if (!cdn_url) return { success: false, error: 'CDN URL을 입력해주세요.' };

  const mood_tags = moodTagsStr ? moodTagsStr.split(',').map(t => t.trim()).filter(Boolean) : [];

  const { data: brand, error: brandErr } = await supabase
    .from('brand_registry')
    .select('brand_id')
    .eq('brand_slug', brandSlug)
    .single();
    
  if (brandErr || !brand) return { success: false, error: '브랜드 정보를 찾을 수 없습니다.' };

  // 3. Insert Portfolio 
  // 포트폴리오의 경우 안전하게 L2 (폐쇄망/어드민만 열람 가능) 상태로 던져넣고,
  // Admin이 승인 시 L0로 격상시켜 B-SSoT 홈 화면에 노출되도록 유도합니다.
  const { error: insertErr } = await supabase.from('portfolio_shot').insert({
    brand_id: brand.brand_id,
    cdn_url,
    mood_tags,
    visibility_level: 'L2', // Draft equivalents for Portfolio
  });

  if (insertErr) return { success: false, error: insertErr.message };

  revalidatePath(`/vendor/${brandSlug}`);
  return { success: true };
}
