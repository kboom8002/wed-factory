export function maskAnswerCard(card: any, isAuthenticated: boolean) {
  // L0(Public) 데이터이거나 이미 로그인한 회원인 경우: 변조 없이 그대로 전달
  if (card.visibility_level === 'L0' || isAuthenticated) {
    return {
      ...card,
      _meta: {
        ...card._meta,
        is_locked: false
      }
    };
  }

  // L1(회원 전용) 인데 미로그인인 경우 (비회원/검색 봇): 원문 텍스트를 파괴(Masking)하여 내보냄
  // 실제 텍스트 길이를 추정 못하게 고정 길이로 날리거나, 비슷한 길이 리턴 (여기선 보안상 50~100자 가짜 블라인드)
  const dummyText = '※ 해당 브랜드 정책 원문 정보는 L1(회원 전용) 권한이 필요합니다. ' +
                    '가입/로그인하여 원장님 단독 혜택 및 직통 번호 등 구체적 팩트체크 내역을 확인하세요. ' + 
                    '*'.repeat(100);

  // Evidnece 내역(증명 서류 등)도 민감 정보일 수 있으므로 같이 마스킹
  const originalSummary = card.evidence?.[0]?.masked_summary || '';
  const maskedEvidence = originalSummary ? '🔒 회원 전용 증빙 서류 (로그인 시 열람 가능)' : null;

  return {
    ...card,
    short_answer: dummyText,
    answer: dummyText, // projectAnswerCard를 거친 DTO 호환성
    full_answer: undefined, // L1 미인증시 상세 답변도 절대 파기
    evidence: card.evidence ? [{ ...card.evidence[0], masked_summary: maskedEvidence }] : undefined,
    _meta: {
      ...card._meta,
      is_locked: true,
      original_visibility: card.visibility_level
    }
  };
}
