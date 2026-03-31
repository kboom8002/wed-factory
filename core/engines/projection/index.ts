export type VisibilityLevel = 'L0' | 'L1' | 'L2';
export type ProjectionSurface = 'brand_home' | 'shared_hub' | 'faq_json_ld' | 'answer_feed' | 'admin' | 'deal_room';

// Raw Types 
export interface RawTrustEvidence {
  evidence_id: string;
  target_id: string;
  evidence_url: string | null;
  masked_summary: string | null;
  reviewer_id: string | null;
  status: string;
  updated_at: string;
}

export interface RawAnswerCard {
  card_id: string;
  brand_id: string;
  question: string;
  short_answer: string;
  full_answer: string | null;
  public_status: string;
  updated_at: string;
  trust_evidence?: RawTrustEvidence;
}

export interface ProjectionMeta {
  projected_at: string;
  surface: ProjectionSurface;
  level_applied: VisibilityLevel;
  trust_status?: string;
  trust_updated_at?: string;
}

/**
 * AnswerCard를 주어진 권한과 표면에 맞게 투영합니다.
 */
export function projectAnswerCard(
  card: RawAnswerCard, 
  surface: ProjectionSurface, 
  level: VisibilityLevel
): any {
  // L0 렌더링 시 퍼블리시되지 않은 항목 철저 배제 (Admin 뷰가 아닌 경우)
  if (card.public_status !== 'published' && surface !== 'admin') {
    return null;
  }

  // 기본 DTO 스켈레톤
  const dto: any = {
    id: card.card_id,
    question: card.question,
    updated_at: card.updated_at,
    visibility_level: (card as any).visibility_level || 'L0',
    translations: (card as any).translations || null
  };

  // 1. Level-based Data Truncation
  if (level === 'L0') {
    dto.answer = card.short_answer;
    // L0 에서는 절대 full_answer를 반환하지 않음
  } else {
    // L1, L2에서는 상세/최종 서류 포함
    dto.answer = card.full_answer || card.short_answer;
  }

  // 2. SEO (JSON-LD) Surface Specific Map
  if (surface === 'faq_json_ld') {
    return {
      "@type": "Question",
      "name": card.question,
      "acceptedAnswer": {
        "@type": "Answer",
        "text": card.short_answer // 구글 검색결과를 위해 언제나 short 채택
      }
    };
  }

  // 3. Trust Meta Binding Rule
  if (card.trust_evidence) {
    if (surface === 'admin' || level === 'L2') {
      // 관리자 또는 계약 확정자(L2)인 경우 원본 URL 노출
      dto.evidence = {
        url: card.trust_evidence.evidence_url,
        reviewer_id: card.trust_evidence.reviewer_id,
        status: card.trust_evidence.status
      };
    } else {
      // 퍼블릭 뷰(L0)나 리드 회원(L1)에게는 마스킹 요약만 제공
      dto.evidence = {
        masked_summary: card.trust_evidence.masked_summary,
        status: card.trust_evidence.status
      };
    }
    
    dto._meta = {
      projected_at: new Date().toISOString(),
      surface,
      level_applied: level,
      trust_status: card.trust_evidence.status,
      trust_updated_at: card.trust_evidence.updated_at
    };
  } else {
    dto._meta = {
      projected_at: new Date().toISOString(),
      surface,
      level_applied: level
    };
  }

  return dto;
}
