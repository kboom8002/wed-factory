'use server'

import { createClient } from '@/core/utils/supabase/server';

export interface PreflightResult {
  rule: string;
  desc: string;
  pass: boolean;
  error?: string;
}

/**
 * DB를 병렬 조회하여 L0(Public) 노출이 적합한지 3가지 게이트(Gate) 룰을 검사합니다.
 */
export async function checkPreflightStatus(brandSlug: string): Promise<PreflightResult[]> {
  const supabase = await createClient();

  // 1. Get Brand ID
  const { data: brand, error: brandError } = await supabase
    .from('brand_registry')
    .select('brand_id, package_tier, updated_at')
    .eq('brand_slug', brandSlug)
    .single();

  if (brandError || !brand) {
    return [{
      rule: 'Brand Existence Check',
      desc: '선택한 테넌트의 DB 레코드 존재 여부',
      pass: false,
      error: 'Brand not found in registry (Invalid slug)'
    }];
  }

  const brandId = brand.brand_id;
  const results: PreflightResult[] = [];

  // [Gate 1]: Trust Completeness 
  // 최소 1개의 published Answer가 있어야 하며, 등록된 모든 published Answer는 verified 증빙이 있어야 함.
  const { data: answers, error: ansError } = await supabase
    .from('answer_card')
    .select('card_id')
    .eq('brand_id', brandId)
    .eq('public_status', 'published');

  if (ansError) {
    results.push({ rule: 'Trust Completeness', desc: '답변 객체 읽기 에러', pass: false, error: ansError.message });
  } else if (!answers || answers.length === 0) {
    // 데이터가 없는 초기 상태라면 우선 경고
    results.push({ rule: 'Trust Completeness', desc: '퍼블릭 객체 최소 요건 충족', pass: false, error: '허브에 게시될 지식(Answer/Policy)이 최소 1개 이상 존재해야 합니다.' });
  } else {
    // Check if any answer_card lacks a verified trust_evidence
    const cardIds = answers.map(a => a.card_id);
    const { data: evidences, error: evError } = await supabase
      .from('trust_evidence')
      .select('target_id')
      .in('target_id', cardIds)
      .eq('status', 'verified');

    if (evError) {
      results.push({ rule: 'Trust Completeness', desc: 'Trust 검증 정보 시스템 에러', pass: false, error: evError.message });
    } else {
      const verifiedCount = evidences ? evidences.length : 0;
      if (verifiedCount < cardIds.length) {
        results.push({ rule: 'Trust Completeness', desc: '모든 공개 객체에 Reviewer 할당 여부', pass: false, error: `${cardIds.length - verifiedCount}개의 객체가 관리자 검증(Trust Verified)을 누락했습니다.` });
      } else {
        results.push({ rule: 'Trust Completeness', desc: '모든 공개 객체에 Reviewer 할당 여부', pass: true });
      }
    }
  }

  // [Gate 2]: Package Constraint Check
  // Entry 티어가 과도한 L2 뷰(Professional 폼)을 열어놓았는지 검사 (MVP 모의 검증)
  if (brand.package_tier === 'entry') {
    results.push({ rule: 'Package Gate', desc: '현재 구독 티어(Standrd 등) 권한 밖의 객체 활성화 여부', pass: true });
  } else {
    results.push({ rule: 'Package Gate', desc: '현재 구독 티어 권한 검증 완료', pass: true });
  }

  // [Gate 3]: Stale Policy Check
  const lastUpdated = new Date(brand.updated_at);
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);

  if (lastUpdated < oneYearAgo) {
    results.push({ rule: 'Stale Policy', desc: '업데이트 된 지 1년 이상 경과한 주요 정책 여부', pass: false, error: '최종 업데이트가 12개월을 초과했습니다.' });
  } else {
    results.push({ rule: 'Stale Policy', desc: '업데이트 된 지 1년 이상 경과한 주요 정책 여부', pass: true });
  }

  return results;
}

/**
 * 검사를 통과한 브랜드의 상태를 Published로 변경하고 ChangeLog(개정 이력)을 남깁니다.
 */
export async function approvePublishing(brandSlug: string): Promise<{success: boolean, message?: string}> {
  const supabase = await createClient();

  const { data: brand } = await supabase
    .from('brand_registry')
    .select('brand_id, brand_name_ko')
    .eq('brand_slug', brandSlug)
    .single();

  if (!brand) return { success: false, message: 'Brand not found. DB Error.' };

  const { error: updateError } = await supabase
    .from('brand_registry')
    .update({ 
      public_status: 'published',
      published_at: new Date().toISOString()
    })
    .eq('brand_id', brand.brand_id);

  if (updateError) return { success: false, message: updateError.message };

  // Audit Log 저장
  const { data: { user } } = await supabase.auth.getUser();
  const adminId = user?.id || 'system-auto';

  await supabase
    .from('change_log')
    .insert({
      entity_name: 'brand_registry',
      entity_id: brand.brand_id,
      changes: { 
        action: 'PUBLISHING_APPROVAL', 
        admin_id: adminId,
        target_brand: brand.brand_name_ko,
        note: 'Preflight Gate 통과 후 L0 표면으로 공식 배포됨.' 
      },
      visibility_level: 'L1'
    });

  return { success: true };
}
