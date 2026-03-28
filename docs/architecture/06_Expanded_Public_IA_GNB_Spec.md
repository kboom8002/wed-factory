# 06. Expanded Public IA & GNB Specification

본 문서는 `wed_AIhompy_def.docx` 기준에 부합하도록 기존 웨딩 팩토리 B-SSoT(Brand Single Source of Truth) 프론트엔드의 IA(Information Architecture), GNB(Global Navigation Bar) 및 라우팅 디렉토리를 확장하고 재정의한 명세서입니다.

## 1. 퍼블릭 사이트 (B-SSoT) 확장 전략
단편적인 "메뉴/연혁 중심"의 전통적 홈페이지를 타파하고, **"질문 → 이해 → 신뢰 → 전환"** 의 4단계 인바운드 사이클이 즉각적으로 굴러가는 **'질문 허브형 진입 포털'** 로 B-SSoT를 확장합니다.

### 1-1. 최상위 GNB 라우팅 개편안
현재 4개 탭(개요, 포트폴리오, 정책, 검증)으로 구성된 B-SSoT GNB를 문서(20.1 퍼블릭 GNB 최소 요소)에 명시된 필수 조건에 맞춰 6개의 탭으로 증축(Expand)합니다.

| 탭 명칭 (GNB Tab) | 목적 (Routing Path) | 설명 (Document Reference) |
| --- | --- | --- |
| **개요 (홈)** | `/[brandSlug]` | Brand Hero, 핏/서비스 요약, 핵심 3대 질문 표시 (Docx 6. 홈 IA) |
| **질문 허브 (QnA)** | `/[brandSlug]/questions` | AnswerCard 기반 다이내믹 질문 탐색, 반복 질문 FAQ 허브 (Docx 12. 질문 허브) |
| **포트폴리오** | `/[brandSlug]/portfolio` | 무드/스타일 기반 Filtered 핀터레스트 갤러리 (Docx 8. 포트폴리오 허브) |
| **조합/비교 (Compare)**| `/[brandSlug]/compare` | 조합 유형카드, 다른 브랜드 혹은 하위 패키지 비교 (Docx 9. 조합/비교 허브) |
| **견적/정책 (Pricing)**| `/[brandSlug]/policies` | 리스크-어웨어 (추가금 폭탄 방지) 견적 밴드 및 위약금/정책 명시 |
| **신뢰/리뷰 (Trust)**  | `/[brandSlug]/reviews` | 조작 불가한 Audit Log, 변경 이력 및 증거(Snapshot) 리포트 룸 |
| *Floating CTA* | `/[brandSlug]/brief/new` | 어떠한 탭에서도 항시 떠 있는 맞춤 '핏' 브리프 인바운드 시작 버튼 |

## 2. 권장 컴포넌트 트리 및 데이터 그래프 연결 (Graph, Not Tree)
단순한 페이지 나열이 아닌, 객체(Object)들이 유기적으로 엮인 그래프를 지향합니다. (Docx 2.4 / 25. 그래프 규칙 반영)

### 2-1. `app/(public)/[vertical]/[brandSlug]/questions/page.tsx`
- **목적**: 고객의 모든 불안(질문)을 해소하는 허브.
- **컴포넌트 트리**:
  - `SearchInput / CategoryFilter` (AEO / 탐색 필터)
  - `AnswerCardList`:
    - `AnswerCard` (질문 + 핵심답변 + 상세답변 + Evidence/Updated + CTA)
    - **Graph Link**: 이 답변은 `관련 정책(Policy)` 과 `포트폴리오(Portfolio)` 를 모달 혹은 Hash Link로 직접 참조해야 함.
  - `ZeroResultFallback`: 빈 검색 시 "이 질문을 백로그에 추가하고 상담 요청하기" 버튼 표출.

### 2-2. `app/(public)/[vertical]/[brandSlug]/compare/page.tsx`
- **목적**: 이 스튜디오가 "자연광/어두운 홀/야외" 등 어떤 조합(Combination)을 잘하는지 비교/추천하는 허브.
- **컴포넌트 트리**:
  - `CombinationGrid`:
    - `CombinationCard` (유형 명칭 + 예산 전략 + fit/not_fit 리스크 태그)
    - **Graph Link**: 이 카드 클릭 시 하위 `[combinationSlug]` 상세 페이지에서 "이 조합으로 찍은 포트폴리오만 필터링 보기" 지원.

## 3. 관리자 (Admin Console) 구성 연계 사양
위의 복잡한 퍼블릭 프론트엔드를 통제하기 위해, 어드민은 단순 '텍스트 에디터'가 아닌 **"B-SSoT 운영 콘솔"** 로서 동작해야 합니다. (Docx 22. Admin IA)

### 3-1. Admin IA 확장 맵 세트
| 라우트 경로 | 기능 요약 (Function) |
| --- | --- |
| `/admin/dashboard` | 플랫폼 전반 Coverage, Inbox, 트래픽 메트릭 (Top Answer/Portfolio). |
| `/admin/inbox` | (기 구현 완료) 고객의 Fit Brief 인바운드 티켓 수신(Inbox) 및 상태 제어(Kanban). |
| `/admin/questions` | **Q-Bank Backlog Control**: 무응답된 Zero-result 질문 수집 및 새 AnswerCard 발행 창구. |
| `/admin/publishing` | **Review Queue**: 수정된 정책이나 포트폴리오를 L0로 내보내기 전 Preflight/Audit 서명. |
| `/admin/trustlog` | **Trust/Correction Center**: 수정 내역(Changelog) 동기화 및 블랙리스트 정책 위반 경고 감시. |

## 4. 모바일 IA 제약사항 및 결론 모멘텀 
- 모바일(Viewport < 768px)에선 방대한 6개의 GNB 탭을 스크롤 메뉴나 패널로 숨기되, **포트폴리오, 질문 허브, 견적 브리프(Floating CTA)** 3가지는 '절대 접근 권한'을 잃어선 안 됩니다. (Docx 24.1)
- 데스크톱의 화려한 3열 배치 대신, 'Accordion'과 'Compact Strip' 형태를 강제하여 사용자 피로도를 낮춥니다.

본 명세는 차기 스프린트인 B-SSoT 라우팅 2차 확장과 Admin 허브 정립의 북극성 바이블로 기능합니다.
