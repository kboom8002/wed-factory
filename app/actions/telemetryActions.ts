'use server';

import { createClient } from '@/core/utils/supabase/server';
import { headers } from 'next/headers';

export type EventType = 'answer_open' | 'policy_open' | 'compare_click' | 'trust_expand' | 'deal_accepted';

export async function trackEvent(
  eventType: EventType,
  payload: { brandId?: string; targetId?: string; metadata?: any }
) {
  try {
    const supabase = await createClient();
    const headersList = await headers();
    
    // IP와 UserAgent를 조합하여 단순 익명 세션 식별자를 생성 (악의적 로깅 방어 및 연속 클릭 필터링용)
    const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || '127.0.0.1';
    const ua = headersList.get('user-agent') || 'unknown';
    const rawSession = `${ip}-${ua}`;
    
    // 매우 단순한 32bit 정수 해시 함수 생성
    let hash = 0;
    for (let i = 0; i < rawSession.length; i++) {
        const char = rawSession.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    const sessionHash = Math.abs(hash).toString(16);

    const { error } = await supabase.from('event_telemetry').insert({
      event_type: eventType,
      brand_id: payload.brandId || null,
      target_id: payload.targetId || null,
      metadata: payload.metadata || {},
      session_hash: sessionHash
    });

    if (error) {
      console.error('[Telemetry Error]', error.message);
      return { success: false };
    }
    
    return { success: true };
  } catch (err) {
    console.error('[Telemetry Exception]', err);
    return { success: false };
  }
}
