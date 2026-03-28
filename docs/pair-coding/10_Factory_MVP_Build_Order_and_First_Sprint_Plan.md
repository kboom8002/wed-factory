# 10_Factory_MVP_Build_Order_and_First_Sprint_Plan.md

## 목적
웨딩 스드메 AI홈페이지 Factory Platform의 MVP 빌드 순서와 첫 스프린트 실행 계획을 정의한다.

## 한 줄 정의
studio / dress / makeup 3개 샘플 tenant를 하나의 코드베이스 안에서 온보딩하고, 공통 Core Site Engine 위에 brand overlay를 주입해 하위 디렉토리 AI홈페이지를 빌드하며, 그 질문 자산 일부를 shared hub와 AEO feed로 재사용하는 최소 검증 버전이다.

## MVP 성공 정의
1. One Repo, Three Tenants
2. One Core, Different Surfaces
3. Question-first Brand Surface
4. Shared Hub Reuse
5. Basic Observatory

## 범위 밖
- 결제/에스크로
- 실제 예약 확정
- L2 full deal room
- full multilingual
- full Fit Brief generator
- full VTI estimator integration
- 대량 온보딩 자동화
- 고급 추천/랭킹 엔진

## MVP에 반드시 포함
### 플랫폼
- Brand Registry
- 멀티브랜드 라우팅
- Core Site Engine
- Overlay System
- Shared Hub
- Admin 최소형
- Observatory 최소형

### 브랜드
- studio / dress / makeup tenant 각 1
- 질문 카드 12개+
- policy/pricing summary
- portfolio meta
- trust block
- inquiry route

### 허브
- /questions
- /compare
- /search
- /trust

### 웨딩 vertical
- Question Atlas 초안
- Policy family 초안
- CombinationType 3개+
- AEO 허브 질문 카드 일부
- Q-Bank 연결 힌트
- Fit Brief request CTA

## 최상위 빌드 원칙
- Surface보다 Runtime 먼저
- Brand page보다 Shared model 먼저
- Question before Gallery
- Public-safe 먼저
- Observatory는 MVP에도 포함

## 권장 빌드 순서
### 1. Platform Skeleton
- App Router route groups
- brand registry
- BrandRuntimeContext
- public / verified / privileged / admin skeleton
- shared hub skeleton

### 2. Canonical Object & Schema
- WeddingBrand
- AnswerCard
- PolicyItem
- PricingBand
- PortfolioShot
- CombinationType
- InquiryTemplate
- Reviewer/Evidence/ChangeLog
- basic overlay schema

### 3. Core Site Engine
- Brand Resolution Engine
- Question & Answer Engine
- Policy & Pricing Engine
- Trust & Change Engine
- Inquiry Engine
- minimal Compare Engine
- AEO projection hooks

### 4. Brand Surface Recipes
- studio brand home recipe
- dress brand home recipe
- makeup brand home recipe
- brand questions route
- brand policies route
- brand inquiry route

### 5. Shared Hub MVP
- /questions
- /compare
- /search
- /trust

### 6. Observatory MVP
- answer_open
- policy_open
- compare_click
- inquiry_start
- zero_result
- trust_expand

### 7. Gates & Preflight
- package gate
- disclosure gate
- trust completeness gate
- publish preflight
- optional mixed signal lint skeleton

## Sprint 1 목표
같은 레포 안에서 3개 브랜드 tenant를 기본 라우팅으로 띄우고, 공통 AnswerCard/PolicyItem schema와 BrandRuntimeContext를 통해 tenant-aware brand home을 렌더링하며, 최소 observability 이벤트를 수집한다.

## Sprint 1 범위
### 포함
- repo skeleton
- route groups
- brand registry
- sample tenants 3개
- minimal object schema
- minimal overlay schema
- brand home routes 3종
- answer card list block
- policy summary block
- trust strip
- inquiry CTA
- observability events 3~5개

### 제외
- full shared hub
- full admin
- verified/privileged full flow
- fit brief generator
- multilingual
- full VibeSpec compiler

## Sprint 1 산출물
### 코드
- public studio/dress/makeup route
- core contracts/runtime
- brand-resolution/question-answer/policy-pricing 최소 엔진
- factory registry/onboarding
- observatory events

### 데이터
- brand registry seed 3개
- AnswerCard seed 12~18개
- PolicyItem seed 6~9개
- PricingBand seed 3개
- PortfolioShot meta seed 12개
- CombinationType seed 3개

### 문서
- frozen rules
- current phase
- open risks
- sprint QA checklist

## Sprint 1 일정 예시
- Day 1–2: repo skeleton / route groups / registry / runtime context
- Day 3–4: canonical schema / seed / projection contracts
- Day 5–6: Brand Resolution / Question / Policy 엔진 최소형
- Day 7: tenant brand home 렌더
- Day 8: trust strip / inquiry CTA / policy summary 연결
- Day 9: observability event hookup
- Day 10: self-audit / gate 최소형 / sprint demo

## Sprint 1 데모 기준
- `/studio/sample-studio`
- `/dress/sample-dress`
- `/makeup/sample-makeup`
동작
- question-first 구조 visible
- trust strip visible
- observability log 확인 가능

## Sprint 2 목표
brand object를 shared hub projection으로 재사용하고, `/questions`, `/compare`, `/search` 최소 흐름 완성

## Sprint 3 목표
review queue, publishing center, disclosure control, stale/void backlog 운영 가능 상태

## Sprint 4 목표
Q-Bank 연결, brief request, richer compare, verified flow skeleton 추가

## Vibe MVP 방식
### 포함
- vibe_spec_id
- VibeSpec schema 최소형
- banned signal rule
- required evidence rule
- CTA tone label
- mixed signal lint skeleton

### 미룸
- ARS estimator full
- VPA / ICC / ECE dashboard
- 실험 dashboard full

## MVP QA 기준
- One repo, three tenants
- core/overlay 분리
- object-based runtime
- answer-first
- trust always visible
- no dead-end
- public-safe projection만 public 노출
- observability 이벤트 기록
- zero-result backlog 연결

## Sprint 1용 AI-pair coding 규칙
### 구현 전
- 작업 목적
- 관련 문서
- 관련 canonical object
- input/output contract
- package/disclosure 영향
- self-audit 기준

### 구현 후
- brand-specific hardcoding 여부
- overlay 없이 임시 로직 여부
- trust meta 누락 여부
- public-safe projection 위반 여부
- observability hook 누락 여부

## 사업 검증 포인트
- 구축비 지불 의향
- 월관리 전환율
- 핵심 질문 카드 축적
- 문의/예약 전환 개선

## 최종 선언
Factory MVP의 목적은 홈페이지 하나를 빨리 완성하는 것이 아니라, 하나의 코드베이스 안에서 여러 웨딩 브랜드 AI홈페이지를 빌드할 수 있고, 그 결과물이 질문 자산과 정책 구조로 축적되며, shared hub와 AEO로 재사용되고, 운영과 observatory까지 붙는다는 것을 작게 그러나 실제로 증명하는 것이다.
