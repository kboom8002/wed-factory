# 04_Overlay_System_Spec.md

## 목적
공통 Core Site Engine 위에 브랜드별 정보구조, 질문 우선순위, 시각 규칙, 공개 규칙, KPI 우선순위, 정동 사양을 주입하여 서로 다른 brand surface를 컴파일하는 Overlay System을 정의한다.

## 한 줄 정의
Overlay System은 공통 Core Site Engine 위에 브랜드별 정보구조, 질문 우선순위, 시각 규칙, 공개 규칙, KPI 우선순위, 정동 사양을 주입하여 서로 다른 brand surface를 컴파일하는 가변 규칙 계층이다.

## 존재 이유
- core 재사용성과 브랜드 다양성을 동시에 확보
- 의미 구조를 코드에서 분리
- 구축 결과를 플랫폼 자산으로 축적

## 최상위 원칙
- Overlay는 style 옵션이 아니라 meaning 옵션
- Overlay는 Core를 대체하지 않음
- Overlay는 composable 해야 함
- Overlay는 승인 가능한 단위여야 함

## Overlay System 위치
- Factory Platform
- Core Site Engine
- Overlay System
- Dynamic Surface
- Observatory

## Overlay 분류 체계
### 1) IA Overlay
- 홈 섹션 우선순위
- GNB 우선순위
- shared hub 강조 정도
- CTA 순서
- inbound block 여부

### 2) Question Overlay
- high-value question
- high-risk question
- compare question
- conversion question
- inbound question
- zero-result recovery 전략

### 3) Design SSoT Overlay
- theme family
- palette direction
- typography pairing
- trust density
- portfolio density
- CTA tone
- inquiry tone
- anti-keywords

### 4) VCO Overlay
- Hero variant
- Trust Strip density
- Portfolio Card style
- Answer Card tone
- Compare Block emphasis
- Inquiry Composer behavior
- Boundary Note 표현 방식

### 5) Disclosure Overlay
- L0/L1/L2 표현 방식
- summary_only 처리
- restricted cue
- policy visibility
- evidence visibility
- public vs gated projection hint

### 6) KPI Overlay
- 핵심 KPI
- answer → inquiry
- compare → inquiry
- policy → trust
- copy/share/citation
- zero-result recovery
- fit brief request

### 7) VibeSpec Overlay
- target VAD
- target D7
- target SCM/RFT
- target Limbic
- banned signals
- required signals
- trust tone
- CTA arousal band
- mixed signal threshold

## 공통 스키마 필드
- overlay_id
- overlay_type
- tenant_scope
- vertical_scope
- package_scope
- status
- version
- approved_by
- approved_at
- payload
- source_refs
- risk_notes

## Overlay 생성 파이프라인
1. Reference Intake
2. Semantic Extraction
3. Overlay Draft Synthesis
4. Human Review
5. Approval

## Overlay와 Core의 경계
### Core
- engine 로직
- object fetching
- search logic
- inquiry state machine
- disclosure enforcement
- AEO publishing
- observability event contracts

### Overlay
- 우선순위
- 표현 강도
- tone
- visual variant
- category emphasis
- trust density
- package별 표현 차이
- vibe targets

### 금지
- brand-specific business rule을 page component 내부에 하드코딩
- disclosure rule을 UI 카피로만 처리
- package gate를 overlay로 무력화
- overlay로 trust strip 제거

## Overlay merge 순서
1. Global Core Defaults
2. Vertical Defaults
3. Package Defaults
4. Brand-approved Overlay
5. Locale Overlay
6. Campaign override
7. Runtime safety gates

## Overlay와 Package 관계
### Entry
허용: 기본 IA/Question/Design overlay, 간단한 trust density, inquiry CTA tone  
금지: Professional 수준 gated reveal 암시, L1/L2 full UX 시뮬레이션

### Standard
허용: compare emphasis, stronger question atlas, richer trust/portfolio/pricing summary, brief request CTA  
금지: full Fit Brief result surface, privileged compare simulation

### Professional
허용: locale overlays, verified flow overlays, advanced trust overlays, vibe-enabled high-precision tone control, multi-step inquiry/brief/deal transition cues

## Overlay와 Disclosure 관계
### L0
- summary oriented
- open exploration
- low-friction CTA

### L1
- verification cues
- compare depth 증가
- request-based CTA 중심

### L2
- privileged surface
- clarity > decoration
- public 노출 금지

## VibeSpec Overlay 특별 규칙
- optional이지만 강력한 레이어
- ARS target, VGLang guardrails, required evidence, banned signal, MSRI threshold 보유
- mixed signal lint 필수

## Overlay 적용 대상
- Brand Home
- Brand Question Hub
- Brand Policy / Pricing
- Brand Portfolio / Fit
- Shared Hubs
- Inquiry / Brief / Verified Flow

## Shared Hub와의 관계
### Brand overlay
- 해당 브랜드 차별점 강화
- 브랜드 trust tone 반영
- 브랜드-specific CTA 반영

### Shared hub overlay
- brand-neutral / category-balanced
- 질문 해결 우선
- 브랜드 bias 최소화

## 운영과 승인 구조
- Meaning Ops
- Design Ops
- Trust Ops
- Vibe Ops
- Factory Ops

## QA 체크리스트
- overlay가 core를 무력화하지 않는가
- system rule인가
- package scope 위반이 없는가
- L2 누출/암시가 없는가
- trust strip/evidence/reviewer를 약화시키지 않는가
- mixed signal lint를 통과하는가
- shared hub projection과 충돌하지 않는가

## 최종 선언
Overlay System은 단순한 테마 설정이 아니라, 브랜드가 무엇을 먼저 말할지, 어떤 질문을 우선 다룰지, 어떤 신뢰 밀도로 보일지, 어떤 정책을 어디까지 보여줄지, 어떤 vibe로 surface를 설계할지를 공통 코드를 건드리지 않고 제어하는 Factory의 의미 조정 레이어다.
