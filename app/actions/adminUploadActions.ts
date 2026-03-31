'use server';

import { createClient } from '@/core/utils/supabase/server';
import { revalidatePath } from 'next/cache';

/**
 * 관리자가 B-SSoT의 히어로 백그라운드 이미지를 업로드하고 DB를 갱신합니다.
 */
export async function uploadHeroBackground(brandSlug: string, formData: FormData) {
  try {
    const file = formData.get('file') as File;
    if (!file || file.size === 0) {
      return { success: false, error: '파일이 비어있거나 첨부되지 않았습니다.' };
    }

    // 파일 크기 서버 검증 (5MB 한도)
    const MAX_FILE_SIZE = 5 * 1024 * 1024;
    if (file.size > MAX_FILE_SIZE) {
      return { success: false, error: '파일 크기가 5MB를 초과합니다.' };
    }

    // 파일 포맷(확장자) 검증
    if (!file.type.startsWith('image/')) {
      return { success: false, error: '이미지 파일만 업로드할 수 있습니다.' };
    }

    const supabase = await createClient();

    // 관리자 또는 입점사만 업로드 가능해야 하므로 세션 확인
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return { success: false, error: '인증되지 않은 사용자입니다. 관리자 계정으로 로그인해 주세요.' };
    }

    // 1. Storage 버킷에 파일 업로드
    // 파일명 난수화 + 확장자 추출
    const ext = file.name.split('.').pop() || 'jpg';
    const filename = `hero_${brandSlug}_${Date.now()}.${ext}`;
    const filePath = `${brandSlug}/assets/${filename}`;

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('brand_assets')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: true,
      });

    if (uploadError) {
      console.error('[UploadAction] Storage Error:', uploadError);
      return { success: false, error: `스토리지 업로드 실패: ${uploadError.message}` };
    }

    // 2. Public URL 파생
    const { data: urlData } = supabase.storage
      .from('brand_assets')
      .getPublicUrl(uploadData.path);

    const publicUrl = urlData.publicUrl;

    // 3. DB (brand_registry) 업데이트 
    // ※ 주의: brand_registry 테이블에 hero_bg_url 컬럼이 존재해야 함
    const { error: dbError } = await supabase
      .from('brand_registry')
      .update({ hero_bg_url: publicUrl })
      .eq('brand_slug', brandSlug);

    if (dbError) {
      console.error('[UploadAction] DB Error:', dbError);
      return { success: false, error: `DB 업데이트 실패: ${dbError.message}` };
    }

    // 4. B-SSoT 및 어드민 캐시 강제 무효화
    revalidatePath('/', 'layout');

    return { success: true, url: publicUrl };

  } catch (error: any) {
    console.error('[UploadAction] API Error:', error);
    return { success: false, error: `서버 내부 오류: ${error.message || 'Unknown Error'}` };
  }
}
