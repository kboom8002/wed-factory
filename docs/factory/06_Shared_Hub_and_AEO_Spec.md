# 06_Shared_Hub_and_AEO_Spec.md

## 목적
브랜드 하위 디렉토리 surface가 축적한 질문·정책·비교·신뢰 자산을 상위 shared hub로 재사용하고, AEO 친화적 방식으로 발행하는 구조를 정의한다.

## 한 줄 정의
Shared Hub는 브랜드별 AI홈페이지에서 축적된 질문·정책·비교·가이드 자산을 도메인 공통 질문 허브로 재구성하는 층이고, AEO는 그 자산을 AI가 우선 채택하기 쉬운 정답 구조로 기계가독 발행하는 규칙 체계다.

## Shared Hub 존재 이유
1. 브랜드 surface를 넘는 질문 해결 레이어 필요
2. 구축 상품이 곧 플랫폼 자산이어야 함
3. AEO/GEO 시대에 허브형 정답 구조가 중요

## 최상위 원칙
- Brand-neutral, Question-first
- Object reuse, not content rewrite
- Trust-preserving projection
- Disclosure-aware reuse
- CTA is still required

## Shared Hub 표준 모듈
1. Question Hub
2. Compare Hub
3. Policy & Pricing Hub
4. Guide Hub
5. Trust Hub
6. Search Hub

## Shared Hub 입력 자산
- AnswerCard
- PolicyItem summary
- PricingBand summary
- CombinationType summary
- Guide / Checklist
- PortfolioShot metadata
- Trust snippet
- ChangeLog snippet

## 허브 편입 규칙
### Trust 조건
- reviewer 존재
- updated_at 존재
- boundary note 존재
- stale 아님
- CTA 존재

### Disclosure 조건
- L0 또는 public-safe summary
- summary_only 여부 명시
- restricted detail 제거
- exact quote / contract detail / vendor reveal 제외

### Canonical 조건
- canonical id 존재
- object type 정의
- slug/title 정합
- related object linkage 존재

### Reuse 조건
- brand-specific 과장 카피 제거 가능
- 허브용 neutral summary 생성 가능
- related compare / policy / inquiry 연결 가능

## 허브용 projection 원칙
### 브랜드 surface projection
- 브랜드 차별점 유지
- brand trust tone 유지
- 브랜드-specific CTA 허용

### shared hub projection
- brand-neutral tone
- 질문 해결 우선
- cross-brand compare 가능
- policy/brief/inquiry 공통 구조 강화
- 특정 브랜드 bias 최소화

## AEO 정의와 목표
### 정의
AI가 답을 만들 때 공식 정보가 먼저 채택되게 하는 운영 방법론

### 웨딩에서의 목표
- 스드메 가격 차이
- 추가금 발생 구간
- 원본 제공 범위
- 예산 우선순위
같은 질문에 대해 공식 허브가 AI에 먼저 읽히게 한다.

### 사업적 의미
브랜드 surface에서 만든 질문 카드가 shared hub에 축적되고, AI 검색 유입과 compare/brief/inquiry 전환을 만든다.

## AEO 발행 단위
- AnswerCard
- FAQ-lite
- Policy Summary
- CombinationType Summary
- Guide / Checklist
- Trust Snippet

## AEO 발행 채널
- public page
- FAQ JSON-LD
- LocalBusiness / Brand summary JSON-LD
- answer feed
- compare feed
- policy feed
- sitemap
- search index
- privileged detail route

## structured data 원칙
- visible content와 structured data 충돌 금지
- restricted detail structured data 금지
- summary_only는 summary_only로만 발행

## feed 설계
### 권장 feed
- `/api/ai/answers.ndjson`
- `/api/ai/policies.json`
- `/api/ai/compare.json`
- `/api/ai/guides.json`

### answers feed 최소 필드
- canonical_id
- object_type
- title
- short_answer
- public_summary
- related_policy_ids
- related_compare_ids
- reviewer
- updated_at
- visibility_level
- boundary_note
- next_action
- canonical_url
- locale

### feed 포함 조건
- public status
- reviewer 존재
- stale 아님
- L0 허용
- public-safe projection 완료

### feed 제외 조건
- L2 detail
- full FitBrief
- exact quote
- exact vendor reveal
- contract term detail
- reviewer 없는 object
- stale object

## brand surface ↔ shared hub 연결 규칙
### 허브 → 브랜드
질문 허브나 compare 허브는 관련 브랜드 surface로 갈 수 있어야 한다.

### 브랜드 → 허브
브랜드 surface는 shared question hub, compare hub, policy hub로 갈 수 있어야 한다.

### context 유지
question id / compare id / policy id context로 deep link 유지 권장

## shared search 원칙
검색은 브랜드 찾기보다 질문 해결을 우선한다.

### 우선순위
1. AnswerCard
2. Policy summary
3. CombinationType summary
4. Guide / Checklist
5. Brand surface
6. Portfolio metadata

### zero-result recovery
- 유사 질문 제안
- compare hub 제안
- inquiry / envelope CTA
- void backlog 적재

## Q-Bank / Fit Brief 관계
### shared hub
- AEO 허브 질문 카드
- compare summary
- policy summary
- guide

### Q-Bank
- 검증/딜룸 프로토콜
- public에 full 공개하지 않음

### Fit Brief
- shared hub는 full result를 노출하지 않음
- “48시간 비교 브리핑 받기” 같은 CTA로 연결

## Vibe-aware AEO 원칙
- trust tone rule
- CTA arousal band
- evidence requirement
- hyperbole 금지
- blame-shift 금지
- mixed signal lint

## observability 지표
### 허브
- question_open_rate
- compare_click_rate
- guide_open_rate
- brand_surface_transition_rate
- zero_result_rate

### AEO
- feed eligible object count
- structured data valid count
- answer_copy/share rate
- citation-like behavior
- search landing rate

### 운영
- stale object count
- trust incomplete count
- disclosure violation count
- void backlog growth

### vibe-enabled
- MSRI warnings
- VPA by CTA tone
- trust tone mismatch
- ARS alignment drift

## QA 체크리스트
- 질문 허브가 brand-neutral한가
- compare hub가 실명 업체 중심으로 흐르지 않는가
- FAQ JSON-LD가 visible content와 일치하는가
- answer feed에 restricted detail이 없는가
- hub가 dead-end가 아닌가
- L2 detail이 허브나 feed에 스며들지 않는가

## 최종 선언
Shared Hub와 AEO는 브랜드 surface의 부속 기능이 아니라, 브랜드별로 쌓인 질문 자산을 도메인 허브로 전환하고, 공식 답변 구조를 AI가 읽기 쉬운 형태로 발행하며, 질문 → 비교 → 안심 → 문의/브리프 흐름을 확장해 브랜드 AI홈페이지를 플랫폼 자산으로 바꾸는 Factory의 상위 전이 레이어다.
