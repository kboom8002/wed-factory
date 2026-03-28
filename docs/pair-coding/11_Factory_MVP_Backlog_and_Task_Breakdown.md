# 11_Factory_MVP_Backlog_and_Task_Breakdown.md

## 목적
Factory MVP를 구조 검증 백로그로 전환하고, Core / Overlay / Tenant / Shared Hub / Observatory / Gate를 어떤 순서와 어떤 단위로 구현할지 정의한다.

## 한 줄 정의
Factory MVP Backlog는 studio / dress / makeup 3개 샘플 tenant를 하나의 코드베이스에서 운영하고, 질문 자산을 shared hub와 AEO로 재사용하며, 운영형 매출 구조 검증으로 이어지게 만드는 최소 구현 작업 집합이다.

## 최상위 원칙
- 기능보다 구조를 먼저 검증
- 브랜드 1개보다 멀티테넌시를 먼저 증명
- brand surface와 shared hub 재사용을 같이 봄
- 관측 없는 구현은 미완
- 공개 수준은 처음부터 분리

## 8개 Epic
1. Platform Foundation
2. Canonical Schema Foundation
3. Core Site Engine MVP
4. Brand Surface MVP
5. Shared Hub & AEO MVP
6. Admin & Observatory MVP
7. Gate & QA MVP
8. Vibe Hook MVP

## Epic 1. Platform Foundation
### 목표
멀티브랜드 Factory의 최소 플랫폼 골격 확보

### 포함
- route groups
- Brand Registry
- BrandRuntimeContext
- tenant resolution
- public / verified / privileged / admin skeleton

### 완료 기준
- studio/dress/makeup 라우트가 같은 코드베이스에서 동작
- brand registry row만 바꿔도 tenant resolve 가능

### 세부 태스크
- P1-01 App Router group skeleton
- P1-02 Brand Registry schema
- P1-03 BrandRuntimeContext type
- P1-04 tenant resolver
- P1-05 locale / package / disclosure profile 필드
- P1-06 sample brand registry seed

## Epic 2. Canonical Schema Foundation
### 목표
브랜드·질문·정책·비교·문의·신뢰 객체 문법 확보

### 포함
- WeddingBrand
- AnswerCard
- PolicyItem
- PricingBand
- PortfolioShot
- CombinationType
- InquiryTemplate
- Reviewer / Evidence / ChangeLog
- basic overlay schema
- BrideGroomEnvelope skeleton
- VendorEnvelope skeleton
- FitBrief summary skeleton

### 완료 기준
- migration 가능
- seed 가능
- brand surface와 shared hub projection에 모두 활용 가능

### 세부 태스크
- P2-01 WeddingBrand schema
- P2-02 AnswerCard schema
- P2-03 PolicyItem + PricingBand schema
- P2-04 PortfolioShot + MoodTag schema
- P2-05 CombinationType schema
- P2-06 InquiryTemplate schema
- P2-07 Reviewer / Evidence / ChangeLog schema
- P2-08 BrideGroomEnvelope / VendorEnvelope skeleton
- P2-09 FitBrief summary skeleton
- P2-10 schema migration + seed fixture

## Epic 3. Core Site Engine MVP
### 목표
brand surface와 shared hub가 공통으로 쓰는 최소 엔진 확보

### 포함 엔진
- Brand Resolution Engine
- Question & Answer Engine
- Policy & Pricing Engine
- Trust & Change Engine
- Inquiry & Envelope Engine
- minimal Compare Engine
- minimal AEO projection hooks
- basic Observatory event emitter

### 완료 기준
- object fetch → projection → render 흐름 작동
- brand-specific hardcode 없이 3 tenant 렌더 가능
- question-first surface 가능

### 세부 태스크
- P3-01 Brand Resolution Engine
- P3-02 Question list projection
- P3-03 Answer detail projection
- P3-04 Policy/Pricing summary projection
- P3-05 Trust meta projection
- P3-06 Inquiry CTA / draft composer skeleton
- P3-07 Compare summary block projection
- P3-08 machine-readable projection interface
- P3-09 observability event hook

## Epic 4. Brand Surface MVP
### 목표
studio / dress / makeup 3개 brand surface를 같은 코어 위에 띄우기

### 필수 화면
- brand home
- brand questions
- brand policies
- brand inquiry

### 필수 블록
- Hero
- Trust Strip
- 핵심 질문 카드
- pricing/policy summary
- inquiry CTA
- update/trust hint

### 세부 태스크
- P4-01 studio home recipe
- P4-02 dress home recipe
- P4-03 makeup home recipe
- P4-04 tenant question route
- P4-05 tenant policy/pricing route
- P4-06 tenant inquiry route
- P4-07 trust strip binding
- P4-08 overlay injection test

## Epic 5. Shared Hub & AEO MVP
### 목표
브랜드 객체 일부를 shared hub와 AEO projection으로 재사용

### 포함
- /questions
- /compare
- /search
- /trust
- FAQ JSON-LD 최소형
- answer feed 최소형

### 완료 기준
- brand AnswerCard 일부가 shared question hub에 재사용
- CombinationType summary가 compare hub에 재사용
- public-safe object만 AEO 발행

### 세부 태스크
- P5-01 shared question hub route
- P5-02 AnswerCard hub projection
- P5-03 compare hub route
- P5-04 CombinationType hub projection
- P5-05 shared search MVP
- P5-06 zero-result recovery
- P5-07 FAQ JSON-LD projection
- P5-08 answers feed MVP
- P5-09 trust hub route

## Epic 6. Admin & Observatory MVP
### 목표
운영형 자산으로 돌릴 수 있는 최소 admin/observatory 확보

### 포함
- Brand Registry Console 최소형
- Review Queue 최소형
- Question Backlog 최소형
- Publishing Center 최소형
- Observatory Dashboard 최소형

### 이벤트
- answer_open
- policy_open
- compare_click
- inquiry_start
- trust_expand
- zero_result

### 세부 태스크
- P6-01 admin dashboard skeleton
- P6-02 brand registry list/detail
- P6-03 review queue list
- P6-04 question backlog list
- P6-05 publishing preflight view
- P6-06 observability event table
- P6-07 observability dashboard cards
- P6-08 zero-result queue

## Epic 7. Gate & QA MVP
### 목표
publish 전에 구조적 오류를 막는 최소 gate 구현

### 필수 gate
- package gate
- disclosure gate
- trust completeness gate
- publish preflight
- no orphan projection check

### 세부 태스크
- P7-01 trust completeness validator
- P7-02 disclosure validator
- P7-03 package scope validator
- P7-04 projection integrity validator
- P7-05 publish preflight aggregator
- P7-06 QA checklist 문서화

## Epic 8. Vibe Hook MVP
### 목표
이후 확장을 위한 최소 hook 심기

### 포함
- vibe_spec_id 연결
- VibeSpec minimal schema
- banned signal rule
- required evidence rule
- mixed signal lint skeleton
- CTA tone label
- trust tone label

### 세부 태스크
- P8-01 VibeSpec schema minimal
- P8-02 vibe field in Brand Registry
- P8-03 required evidence lint
- P8-04 banned signal lint
- P8-05 CTA tone metadata hook
- P8-06 trust tone metadata hook

## 우선순위
### P0
- Brand Registry
- route groups
- BrandRuntimeContext
- canonical schema
- Question & Answer Engine 최소형
- Policy summary projection
- 3 tenant seed
- basic observability events

### P1
- tenant home 3종
- shared question hub
- compare hub
- inquiry composer 최소형
- trust strip
- publish preflight
- zero-result backlog
- FAQ JSON-LD 최소형

### P2
- review queue 심화
- disclosure center
- verified flow skeleton
- brief request
- Q-Bank 연결
- richer compare summary
- multilingual skeleton

## Sprint 1 백로그
- S1-01 app route groups
- S1-02 Brand Registry schema + seed
- S1-03 BrandRuntimeContext
- S1-04 WeddingBrand / AnswerCard / PolicyItem / PricingBand schema
- S1-05 Brand Resolution Engine
- S1-06 Question list projection
- S1-07 Policy summary projection
- S1-08 Trust strip projection
- S1-09 3개 brand home
- S1-10 inquiry_start / answer_open event hook

## Sprint 2 백로그
- shared question hub
- AnswerCard hub projection
- compare hub
- CombinationType schema + seed
- compare summary block
- search MVP
- zero-result recovery
- hub → brand transition event
- FAQ JSON-LD + answer feed MVP

## Sprint 3 백로그
- admin dashboard
- brand registry console
- review queue
- question backlog
- publish preflight
- trust completeness gate
- disclosure gate 최소형
- stale / trust incomplete widget

## Sprint 4 백로그
- BrideGroomEnvelope teaser
- VendorEnvelope basic mapping
- Q-Bank summary linkage
- brief request flow
- FitBrief summary skeleton
- verified route group skeleton
- richer compare / regret risk block

## 백로그 카드 템플릿
- task_id
- epic
- title
- goal
- input_docs
- related_objects
- runtime_scope
- package_scope
- disclosure_impact
- events_impact
- definition_of_done
- self_audit_points

## Definition of Done 공통 규칙
- core / overlay / data 책임 분리
- hardcoded brand logic 없음
- public-safe projection 확인
- L2 leakage 없음
- trust meta 누락 없음
- 최소 1개 observability event 연결
- hub / compare / inquiry 연결 가능
- 구현 전 규칙 선언 완료
- 구현 후 self-audit 완료

## 백로그 운영 기준
- 구조적 blocker
- 공개 수준 blocker
- trust blocker
- shared reuse blocker
- observability blocker
- business validation proximity

## 태스크 크기 기준
- 0.5~2일 단위
- route 1개 + projection 1개 + event 1개 수준
- “compare 전체 완성” 같은 거대 태스크 금지

## 최종 선언
이 백로그는 기능 목록이 아니라, 멀티브랜드 tenant 구조를 먼저 세우고, 질문 자산을 canonical object로 만들고, brand surface와 shared hub를 같은 자산 위에 올리고, observability와 publish gate를 초기에 심고, 결국 “질문이 매출이 되는 구조”를 검증하는 방향으로 개발을 정렬하는 구조 검증용 실행 백로그다.
