'use server';

import { createClient } from '@/core/utils/supabase/server';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';

export async function batchTranslateBrand(brandSlug: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  // 1. Basic Auth check (Admin or specific role logic should be here)
  if (!user) {
    return { success: false, message: 'Unauthorized' };
  }

  // 2. Resolve Brand ID from Slug
  const { data: brand, error: brandErr } = await supabase
    .from('brand_registry')
    .select('*')
    .eq('brand_slug', brandSlug)
    .single();

  if (brandErr || !brand) {
    return { success: false, message: 'Brand not found' };
  }

  const brandId = brand.brand_id || brand.id;
  let summary = { brand: 0, combinations: 0, policies: 0, answers: 0 };

  try {
    // -----------------------------------------------------
    // A. Translate Brand Registry (Brand Name, Tagline etc)
    // -----------------------------------------------------
    let brandTrans = typeof brand.translations === 'object' && brand.translations !== null ? brand.translations : {};
    
    // We only translate if missing
    if (!brandTrans.en || typeof brandTrans.en.brand_name !== 'string' || !brandTrans.ja || typeof brandTrans.ja.brand_name !== 'string') {
      const { object } = await generateObject({
        model: google('gemini-2.5-pro'),
        schema: z.object({
          en: z.object({ brand_name: z.string() }),
          ja: z.object({ brand_name: z.string() })
        }),
        prompt: `Translate the following Korean brand name into English and Japanese natively. 
        Context: It is a Korean wedding vendor brand name. Keep it premium and natural.
        Korean Brand Name: ${brand.brand_name_ko || brand.brand_name}`
      });

      // Merge and update
      brandTrans = { ...brandTrans, ...object };
      await supabase.from('brand_registry').update({ translations: brandTrans }).eq('id', brandId);
      summary.brand += 1;
    }

    // -----------------------------------------------------
    // B. Translate Combination Types
    // -----------------------------------------------------
    const { data: combinations } = await supabase.from('combination_type').select('*').eq('brand_id', brandId);
    if (combinations) {
      for (const combo of combinations) {
        let trans = typeof combo.translations === 'object' && combo.translations !== null ? combo.translations : {};
        if (!trans.en || !trans.ja) {
          const { object } = await generateObject({
            model: google('gemini-2.5-pro'),
            schema: z.object({
              en: z.object({
                title: z.string(),
                studio_type_summary: z.string().optional(),
                dress_type_summary: z.string().optional(),
                makeup_type_summary: z.string().optional(),
                regret_risks: z.string().optional()
              }),
              ja: z.object({
                title: z.string(),
                studio_type_summary: z.string().optional(),
                dress_type_summary: z.string().optional(),
                makeup_type_summary: z.string().optional(),
                regret_risks: z.string().optional()
              })
            }),
            prompt: `Translate the following high-end wedding planning details into English and Japanese natively.
            Keep the tone professional and slightly luxurious (premium service style).
            Title: ${combo.title}
            Studio: ${combo.studio_type_summary || ''}
            Dress: ${combo.dress_type_summary || ''}
            Makeup: ${combo.makeup_type_summary || ''}
            Risks/Drawbacks: ${combo.regret_risks || ''}
            `
          });
          trans = { ...trans, ...object };
          await supabase.from('combination_type').update({ translations: trans }).eq('combination_id', combo.combination_id);
          summary.combinations += 1;
        }
      }
    }

    // -----------------------------------------------------
    // C. Translate Policy Items
    // -----------------------------------------------------
    const { data: policies } = await supabase.from('policy_item').select('*').eq('brand_id', brandId);
    if (policies) {
      for (const policy of policies) {
        let trans = typeof policy.translations === 'object' && policy.translations !== null ? policy.translations : {};
        if (!trans.en || !trans.ja) {
          const { object } = await generateObject({
            model: google('gemini-2.5-pro'),
            schema: z.object({
              en: z.object({
                summary: z.string(),
                detailed_rule: z.string().optional(),
                exceptions: z.string().optional()
              }),
              ja: z.object({
                summary: z.string(),
                detailed_rule: z.string().optional(),
                exceptions: z.string().optional()
              })
            }),
            prompt: `Translate the following wedding vendor policies (like refund, cancellation, surcharge rules) into English and Japanese.
            Must be extremely precise, polite, but strict regarding legal/money matters.
            Summary: ${policy.summary}
            Detailed Rule: ${policy.detailed_rule || ''}
            Exceptions: ${policy.exceptions || ''}
            `
          });
          trans = { ...trans, ...object };
          await supabase.from('policy_item').update({ translations: trans }).eq('policy_id', policy.policy_id);
          summary.policies += 1;
        }
      }
    }

    // -----------------------------------------------------
    // D. Translate Answer Cards
    // -----------------------------------------------------
    const { data: answers } = await supabase.from('answer_card').select('*').eq('brand_id', brandId);
    if (answers) {
      for (const answer of answers) {
        let trans = typeof answer.translations === 'object' && answer.translations !== null ? answer.translations : {};
        if (!trans.en || !trans.ja) {
          const { object } = await generateObject({
            model: google('gemini-2.5-pro'),
            schema: z.object({
              en: z.object({ question: z.string(), answer: z.string() }),
              ja: z.object({ question: z.string(), answer: z.string() })
            }),
            prompt: `Translate the following Q&A between a customer and a wedding planner/brand into English and Japanese.
            Maintain a helpful, clear, and reassuring tone. Give completely accurate translations of the facts involved.
            Question: ${answer.question}
            Answer: ${answer.short_answer}
            `
          });
          trans = { ...trans, ...object };
          await supabase.from('answer_card').update({ translations: trans }).eq('card_id', answer.card_id);
          summary.answers += 1;
        }
      }
    }

    return { 
      success: true, 
      message: `Batch translation completed successfully! Processed: Brand(${summary.brand}), Combinations(${summary.combinations}), Policies(${summary.policies}), Answers(${summary.answers}).`
    };

  } catch (err: any) {
    console.error('Translation Batch Error:', err);
    return { success: false, message: 'Translation failed: ' + err.message };
  }
}
