# 13_Factory_Document_Consistency_and_Readiness_Checklist.md

## 목적
01~12 문서가 서로 충돌 없이 맞물리는지, 실제 AI-pair coding과 MVP 구현에 들어갈 준비가 되었는지를 점검하는 정합성/준비도 체크리스트를 정의한다.

## 한 줄 정의
웨딩 스드메 AI홈페이지 Factory의 상위 헌법, 런타임, 도메인 스키마, overlay, 발행 구조, 운영 구조, pair-coding 절차가 서로 정합적인지와 실제 구현 착수 준비가 되었는지를 판단하는 문서다.

## readiness 기준
### 1) Factory 정체성 고정
- 하나의 코드베이스 안에서 여러 브랜드 AI홈페이지를 하위 디렉토리로 운영하는 멀티브랜드 Factory라는 정의가 일관적인가

### 2) 질문 자산 중심 구조 유지
- 브랜드 surface, shared hub, admin, observatory 모두가 Question Capital 운영 구조를 전제로 하는가

### 3) 공개 수준과 신뢰 구조 반영
- L0/L1/L2와 trust meta가 routing, schema, projection, admin, gate 문서에 모두 반영되는가

### 4) 운영형 자산 구조
- 브랜드 데이터, 질문 카드, 정책 구조, shared hub 재사용, observatory, 월 운영까지 이어지는가

## 문서 세트 완성도 체크
### 필수 문서
- 00_Factory_Platform_Constitution.md
- 01_MultiBrand_Tenancy_and_Routing_Spec.md
- 02_Core_Site_Engine_Spec.md
- 03_Brand_Registry_and_Onboarding_Spec.md
- 04_Overlay_System_Spec.md
- 05_Wedding_Vertical_Schema.md
- 06_Shared_Hub_and_AEO_Spec.md
- 07_Multitenant_Admin_and_Observatory_Spec.md
- 08_AI_Pair_Coding_SOP_for_Factory.md
- 09_Factory_Repo_and_Runtime_Structure.md
- 10_Factory_MVP_Build_Order_and_First_Sprint_Plan.md
- 11_Factory_MVP_Backlog_and_Task_Breakdown.md
- 12_Factory_Master_Prompt_for_New_AI_Pair_Coding_Session.md

### 체크 기준
- 누락 없는가
- 역할이 겹치지 않는가
- 상위 → 하위 흐름이 자연스러운가
- 문서명이 실제 역할을 반영하는가

## 최상위 개념 정합성
### Factory 정의
- 단일 플랫폼
- 멀티브랜드 tenant
- brand 하위 디렉토리
- shared hub
- 운영형 자산
- AI-pair coding 대상은 Factory 전체

### AI홈페이지 정의
- 질문/비교/정책 중심
- 공식 설명 구조
- AI가 읽고 인용하기 쉬운 구조
- 설명 → 안심 → 문의 흐름
- 지속 업데이트·운영

### 3층 구조
- 1층: 브랜드 AI홈페이지
- 2층: 질문형 웨딩 허브
- 3층: 안심 상담·예약 구조

## Core / Overlay / Surface 경계 정합성
### Core
- Brand Resolution
- Question & Answer Engine
- Policy & Pricing Engine
- Compare & Fit Engine
- Inquiry & Envelope Engine
- Trust & Change Engine
- AEO & Publishing Engine
- Observatory Engine

### Overlay
- IA Overlay
- Question Overlay
- Design SSoT Overlay
- VCO Overlay
- Disclosure Overlay
- KPI Overlay
- VibeSpec Overlay

### Surface
- brand surface = Core + Overlay 결과물
- shared hub = brand-neutral projection 결과물

### 금지 패턴 명시 여부
- brand-specific hardcoding 금지
- page-first 구현 금지
- gallery-first drift 금지
- FAQ site drift 금지
- disclosure-naive coding 금지

## Wedding vertical 정합성
### 범위
- studio
- dress
- makeup

### 핵심 객체
- WeddingBrand
- ServiceOffering
- AnswerCard
- PolicyItem
- PricingBand
- PortfolioShot
- MoodTag
- CombinationType
- BrideGroomEnvelope
- VendorEnvelope
- FitBrief
- RiskFactor
- InquiryTemplate
- Reviewer / Evidence / ChangeLog

### Q-Bank / AEO Card 구분
- AEO 허브 질문 카드 = public 유입용
- Q-Bank = 검증/딜룸 프로토콜

### FitBrief 위치
- public teaser
- L1 summary
- L2 full
문서 간 충돌 없는가

## L0 / L1 / L2 정합성
### 라우팅
- public / verified / privileged route group 분리
- L2 route가 public tree에 섞이지 않음

### 스키마
공개 객체가 아래 필드를 갖는가
- visibility level
- summary/full 구분
- reviewer
- updated_at
- boundary
- CTA

### projection
brand page / shared hub / feed / structured data / admin / verified / privileged로 다르게 투영된다는 원칙이 유지되는가

### gate
- L2 leakage blocker
- summary_only/full confusion blocker
- restricted detail feed/sitemap 제외

## Question Capital 정합성
- question-first 구조 유지
- brand surface 질문 카드가 shared hub로 재사용
- Question Backlog / high-value question / zero-result / void queue가 admin/observatory와 연결
- 질문 자산이 business model과 연결

## Trust Layer 정합성
- public object에 reviewer / evidence / updated_at / boundary / changelog / CTA 있는가
- review queue 연결되는가
- correction → changelog → republish 구조 있는가
- 허브 재사용 시 trust meta 유지되는가

## AEO / Shared Hub 정합성
- brand-neutral / question-first / object reuse / disclosure-aware / CTA-preserving 원칙 유지
- page와 machine-readable projection 충돌 없는가
- brand ↔ hub ↔ compare ↔ brief/inquiry 전이 구조가 일관되는가
- public-safe summary 원칙 유지되는가

## Admin / Observatory 정합성
- admin이 CMS로 축소되지 않았는가
- observatory가 analytics로 축소되지 않았는가
- onboarding / review / question backlog / policy update / disclosure warning / correction / stale/void/drift queue가 정의됐는가
- Fix-It 루프가 있는가

## Repo / Runtime 정합성
- One Repo 구조 유지
- docs / core / factory / brands / hub / admin / observatory 역할 분리
- Route → Registry → Context → Objects → Overlay → Projection → Render → Observe 흐름 유지
- projection adapter 원칙 유지

## MVP build order 정합성
- registry → schema → core engine → surface → hub → admin → gate → vibe hook 순서인가
- 3 tenant 구조가 우선인가
- observability가 MVP에 포함되는가
- shared hub 재사용이 MVP에 포함되는가

## backlog readiness
- epic 분해가 구조 논리와 맞는가
- task 크기가 0.5~2일 단위로 적절한가
- Definition of Done이 구조/공개 수준/trust/observability/self-audit 포함하는가

## AI-pair coding readiness
- master prompt 충분한가
- 문서 주입 순서 정의됐는가
- 세션 시작 프로토콜 정의됐는가
- 세션 종료 프로토콜 정의됐는가

## Vibe readiness
- optional layer로 위치하는가
- vibe_spec_id / required evidence / banned signal / CTA tone / trust tone / mixed signal lint skeleton 정의됐는가
- MVP에서 과잉 구현을 뒤로 미뤘는가
- 장기 확장성 남겨두었는가

## readiness 판정
### Ready
- 문서 세트 완성
- 개념 충돌 없음
- schema/core/overlay/hub/admin/gate 정의 완료
- MVP build order와 backlog 연결 완료
- master prompt 완료
- 주요 blocker 없음

### Partial Ready
- 일부 스키마 미확정
- 일부 projection/gate 미정
- observability 일부 미정
- vibe hook 위치 불명확

### Not Ready
- Factory 정의 불일치
- L0/L1/L2 처리 충돌
- Core vs Overlay 경계 충돌
- shared hub 재사용 구조 부재
- admin/observatory 정의 부재
- pair coding SOP 또는 master prompt 부재

## 최종 체크리스트
### 정체성
- [ ] 멀티브랜드 Factory로 정의
- [ ] AI홈페이지 정의가 일반 홈페이지와 구분
- [ ] 3층 구조 유지

### 구조
- [ ] Core / Overlay / Surface / Hub / Admin 경계 명확
- [ ] One Repo 구조 명확
- [ ] Route group이 L0/L1/L2 반영

### 도메인
- [ ] studio / dress / makeup 고정
- [ ] AnswerCard / PolicyItem / CombinationType / Envelope / FitBrief 정의
- [ ] AEO Card와 Q-Bank 분리

### 공개/신뢰
- [ ] disclosure rule 문서 전체 반영
- [ ] trust meta가 public object 기본 요건
- [ ] correction / stale / changelog 흐름 정의

### 발행/허브
- [ ] shared hub가 brand-neutral projection 원칙 보유
- [ ] feed / JSON-LD / sitemap 원칙 있음
- [ ] brand asset이 hub로 재사용

### 운영
- [ ] admin queue 정의
- [ ] observability event 정의
- [ ] zero-result / stale / drift backlog 전환

### 개발
- [ ] MVP build order 정리
- [ ] backlog epic/task 수준 분해
- [ ] master prompt 존재
- [ ] AI-pair coding SOP 존재

### vibe
- [ ] optional layer로 정리
- [ ] banned signal / required evidence rule 존재
- [ ] mixed signal lint 확장 가능성 존재

## 최종 선언
이 문서는 문서 수를 보는 문서가 아니라, 우리가 같은 Factory를 보고 있는지, 질문 자산 중심 구조가 유지되는지, 공개 수준과 신뢰 구조가 안전한지, 멀티브랜드 tenant와 shared hub가 실제로 이어지는지, AI-pair coding으로 바로 구현을 시작해도 되는지를 판단하는 출발선 점검 문서다.
