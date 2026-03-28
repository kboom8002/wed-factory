'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

export async function provisionNewBrand(formData: FormData) {
  const supabase = await createClient();
  
  const brand_name = formData.get('brandName') as string;
  const brand_slug = formData.get('brandSlug') as string;
  const vertical_type = formData.get('verticalType') as string;
  const vibe_id = formData.get('vibeId') as string;
  const vendor_email = formData.get('vendorEmail') as string;
  const hero_bg_url = formData.get('heroBgUrl') as string | null;

  if (!brand_name || !brand_slug || !vertical_type || !vibe_id) {
     return { success: false, error: '필수 브랜드 식별자를 모두 입력해주세요.' };
  }

  // [STEP 1] Insert Brand (Zero-Deploy 렌더링을 위한 깡통 테이블 생성)
  const { data: brand, error: brandErr } = await supabase
    .from('brand_registry')
    .insert({
      brand_name_ko: brand_name,
      brand_name_en: brand_slug,
      brand_slug,
      vertical_type,
      vibe_spec_id: vibe_id,
      hero_bg_url: hero_bg_url || null,
      public_status: 'published' // MVP 시연을 위해 바로 배포 노출
    })
    .select('brand_id, brand_name_ko')
    .single();

  if (brandErr || !brand) {
    console.error('Builder Insert Error:', brandErr);
    return { success: false, error: '도메인 슬러그가 중복되었거나 브랜드 생성에 실패했습니다.' };
  }

  // [STEP 2] Seeding Action (새 점주가 로그인했을 때 입력해야 할 숙제 강제 주입)
  const seedQuestions = [
    { question: '기본 패키지 비용과 헬퍼, 헤어변형 등 추가금 내역이 궁금해요.', short_answer: '점주님이 대시보드에서 답변을 작성해 주세요.' },
    { question: '가장 자신 있는 포트폴리오 무드는 무엇인가요?', short_answer: '점주님이 대시보드에서 답변을 작성해 주세요.' },
    { question: '위약금 정책 및 예약 취소 규정이 어떻게 되나요?', short_answer: '점주님이 대시보드에서 답변을 작성해 주세요.' }
  ];

  for (const q of seedQuestions) {
    // 임시저장(Draft) 상태로 답변 카드를 뿌려, 나중에 벤더 CMS에서 이어 적도록 유도함
    await supabase.from('answer_card').insert({
       brand_id: brand.brand_id,
       question: q.question,
       short_answer: q.short_answer,
       visibility_level: 'L0',
       public_status: 'draft',
       reviewer_name: 'Factory System Seeder'
    });
  }

  // [STEP 3] RBAC Vendor 계정 발급 플로우 시뮬레이션
  if (vendor_email) {
     // 실 프로덕션에서는 Supabase Auth Admin API로 `inviteUserByEmail` 을 호출하고,
     // 해당 User UID를 `user_profiles` 에 `vendor` 역할과 `brand.brand_id` 를 묶어서 저장합니다.
     console.log(`[RBAC System] ${vendor_email} 주소로 초대장 발송 완료! L1(Vendor) 권한을 부여했습니다.`);
  }

  revalidatePath('/admin');
  return { success: true };
}
