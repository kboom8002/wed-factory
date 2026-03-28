'use server';

import { VIBE_DICTIONARY, VibeSpecId } from '@/core/design-system/vibe-registry';

interface VibeLintResult {
  isValid: boolean;
  errors: string[];
}

/**
 * [Phase 7] Optional Vibe Hook Layer
 * 브랜드의 Vibe 톤과 실제 데이터(답변 내용, 증빙 형태)가 서로 모순(Clash)되는지 정적 анали징(Linting) 합니다.
 * 추후 LLM Cohesion Score 기반으로 확장될 토대입니다.
 */
export async function vibeLintCheck(
  vibeId: string, 
  answerContent: string, 
  evidenceType: 'contract' | 'screenshot' | 'none'
): Promise<VibeLintResult> {
  
  const spec = VIBE_DICTIONARY[vibeId] || VIBE_DICTIONARY['default-vibe-target'];
  const rules = spec.hooks;
  const errors: string[] = [];

  // 1. 금지어 (Banned Signals) 스캔
  if (rules.banned_signals && rules.banned_signals.length > 0) {
    const foundSignals = rules.banned_signals.filter(word => answerContent.includes(word));
    if (foundSignals.length > 0) {
      errors.push(`Vibe 위반: '${spec.name}' 테마에서는 금지된 단어가 포함되어 있습니다. (${foundSignals.join(', ')})`);
    }
  }

  // 2. 필요 증거 (Required Evidence) 스캔
  if (rules.required_evidence === 'contract_only' && evidenceType !== 'contract') {
    errors.push(`Vibe 위반: '${spec.name}' 테마는 최고 수준의 신뢰도를 위해 [계약서 원본(contract)] 증빙이 필수입니다. 현재 제출: ${evidenceType}`);
  }

  // TODO: 향후 CTA Tone, Trust Tone 충돌율(LLM Embedding) 분석 파이프라인 확장 로직 삽입 지점

  return {
    isValid: errors.length === 0,
    errors
  };
}
