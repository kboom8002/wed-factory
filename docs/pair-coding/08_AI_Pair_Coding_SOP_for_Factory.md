# 08_AI_Pair_Coding_SOP_for_Factory.md

## 목적
웨딩 스드메 AI홈페이지 Factory Platform을 AI-pair coding으로 설계·구현·검증·배포하기 위한 표준 작업 절차(SOP)를 정의한다.

## 한 줄 정의
문서로 정의된 Factory 헌법·코어 엔진·도메인 스키마·overlay·게이트를 AI에게 단계적으로 주입하고, 구현 전 규칙 선언 → 구현 → self-audit → gate check를 반복하는 문서 주입형 컴파일 방식의 개발 절차다.

## 왜 필요한가
- Factory는 일반 웹사이트 개발과 다름
- AI는 페이지부터 만들려는 경향이 있음
- 웨딩은 disclosure와 fit 검증이 중요
- vibe-enabled surface는 측정과 교정 루프 필요

## 최상위 작업 원칙
- Factory-first
- Core-before-Surface
- Document-injected, not freeform
- Core + Overlay separation
- Disclosure-aware by default
- Trust-first runtime
- Gate before publish

## 표준 작업 단위
1. Spec Unit
2. Schema Unit
3. Engine Unit
4. Surface Unit
5. Gate Unit
6. Observatory Unit

## 필수 문서 팩
### Constitution Pack
- 00_Factory_Platform_Constitution.md
- 01_MultiBrand_Tenancy_and_Routing_Spec.md

### Runtime Pack
- 02_Core_Site_Engine_Spec.md
- 03_Brand_Registry_and_Onboarding_Spec.md

### Overlay Pack
- 04_Overlay_System_Spec.md
- 05_Wedding_Vertical_Schema.md

### Publishing Pack
- 06_Shared_Hub_and_AEO_Spec.md
- 07_Multitenant_Admin_and_Observatory_Spec.md

### Vibe Pack (optional)
- VTI/Vibe OS 관련 문서
- VibeSpec library
- mixed signal rules

## 세션 시작 규칙
1. 이번 작업 대상 선언
2. 필요한 문서 팩 선언
3. 적용 원칙과 금지 범위 선언
4. 구현
5. self-audit
6. release gate 확인

## Phase 기반 절차
### Phase 0. Platform Lock
- 플랫폼 헌법 고정
- tenancy/routing 고정
- global 금지사항 고정

### Phase 1. Object / Schema Foundation
- canonical object
- registry
- envelope / fit brief schema
- disclosure fields
- observability fields

### Phase 2. Core Engine Foundation
- Brand Resolution Engine
- Question & Answer Engine
- Policy & Pricing Engine
- Compare & Fit Engine
- Inquiry & Envelope Engine
- Trust & Change Engine
- AEO Engine
- Observatory Engine

### Phase 3. Overlay & Vibe Layer
- IA / Question / Design / VCO / Disclosure / KPI overlay
- optional VibeSpec compile hooks

### Phase 4. Brand Onboarding Flow
- reference intake
- extraction outputs
- overlay draft synthesis
- review/publish gates

### Phase 5. Shared Hub & AEO
- question hub
- compare hub
- policy hub
- search hub
- feed
- JSON-LD
- sitemap

### Phase 6. Admin & Observatory
- multitenant admin
- queues
- publishing center
- disclosure control
- trust/correction
- observatory dashboards

### Phase 7. Wedding Reference Implementation
- studio/dress/makeup sample tenants 3종
- Q-Bank
- Fit Brief summary flow
- shared hub sample objects

## 작업 유형별 AI 프롬프트 규칙
### Spec
- 개념 정의
- 스키마 정의
- 금지사항
- QA 기준

### Schema
- 필수 필드
- 관계 그래프
- package/disclosure 영향
- migration strategy

### Engine
- input/output contract
- related canonical object
- runtime context
- observability events
- failure modes

### Surface
- core engine output
- overlay 반영
- trust meta
- CTA 흐름

### Admin
- queue
- 권한
- gate
- metric

### Vibe
- target ARS
- VGLang 규칙
- banned signals
- evidence requirement
- mixed signal lint rule

## 구현 전 선언 항목
1. 이번 작업 목적
2. 적용 문서
3. 관련 canonical object
4. runtime input/output
5. package scope
6. disclosure impact
7. observability impact
8. self-audit 포인트

## self-audit 체크리스트
- 새 브랜드가 새 프로젝트 복제로 보이지 않는가
- brand-specific logic 하드코딩 없는가
- L2 detail이 public에 섞이지 않는가
- trust meta 없는 public object 없는가
- brand object가 shared hub로 재사용 가능한가
- zero-result가 backlog로 회수되는가
- AEO Card와 Q-Bank 혼동 없는가
- banned signal 위반 없는가

## release gate
- Schema gate
- Package gate
- Disclosure gate
- Trust gate
- Shared hub gate
- Observatory gate
- Vibe gate

## Anti-patterns
- 브랜드 사이트 하나 완성 사고
- page-first coding
- bespoke hardcoding
- FAQ site drift
- pretty gallery drift
- disclosure-naive coding
- vibe as decoration

## 권장 폴더
- /docs/factory
- /docs/verticals/wedding
- /docs/overlays
- /docs/vibe
- /core/engines
- /core/contracts
- /core/gates
- /factory/registry
- /factory/onboarding
- /factory/compiler
- /hub
- /brands/[vertical]/[brandSlug]
- /admin
- /observatory

## 세션용 pair coding 마스터 프롬프트 기준
- 개별 브랜드 사이트가 아니라 멀티브랜드 Factory
- Core Template와 Overlay System 분리
- AI홈페이지는 질문/비교/정책 중심
- 웨딩 vertical은 L0/L1/L2, Bride/Groom Envelope, Vendor Envelope, Q-Bank, Fit Brief 유지
- Vibe는 optional control layer
- 구현 전 문서 요약과 금지 범위 먼저 출력
- 구현 후 self-audit와 gate check 수행

## reference implementation 원칙
- studio tenant 1
- dress tenant 1
- makeup tenant 1
- shared question hub
- compare hub
- trust hub
- Q-Bank sample
- Fit Brief summary flow

## 최종 선언
이 SOP는 AI에게 화면을 잘 만들어 달라고 부탁하는 방식이 아니라, 문서로 정의된 Factory 헌법과 도메인 문법을 먼저 잠그고, Core / Overlay / Disclosure / Observatory를 분리해 구현하며, 브랜드 surface와 shared hub를 같은 canonical object 위에서 재사용 가능하게 만들고, publish 전에 gate를 통과시키며, 운영 후 observatory로 다시 고치는 문서 주입형 Factory 컴파일 절차다.
