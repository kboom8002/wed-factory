'use server';

import { createClient } from '@/core/utils/supabase/server';

export async function submitCorrection(answerId: string, customReason?: string) {
  try {
    const supabase = await createClient();
    
    // 1. 세션 확인 (L1 Gate)
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      return { 
        success: false, 
        message: '오류 정정 신고는 로그인한 투명성 검증 회원(L1 이상)만 참여할 수 있습니다. 무분별한 테러를 막기 위한 조치입니다.' 
      };
    }

    // 2. Change Log 기반 임시 리포트 적재 (향후 Trust Queue 연동 가능)
    const { error } = await supabase.from('change_log').insert({
      entity_name: 'answer_card',
      entity_id: answerId,
      changes: {
        action: 'user_correction_report',
        reason: customReason || 'factual_error_suspected',
        reporter_uid: user.id
      }
    });

    if (error) {
      console.error('[SubmitCorrection] DB Insert Error:', error);
      return { success: false, message: '서버 오류로 접수하지 못했습니다.' };
    }

    return { success: true, message: '정밀 교차 검증을 위해 팩토리 에디터 팀에 신고가 접수되었습니다. 참여해 주셔서 감사합니다!' };

  } catch (err: any) {
    console.error('[SubmitCorrection] Exception:', err);
    return { success: false, message: '알 수 없는 서버 오류' };
  }
}
