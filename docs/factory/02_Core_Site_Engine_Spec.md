# 02_Core_Site_Engine_Spec.md

## 목적
모든 브랜드 tenant와 shared hub가 공통으로 사용하는 Core Site Engine을 정의한다.

## 한 줄 정의
Core Site Engine은 브랜드별 surface와 shared hub가 공통으로 사용하는 질문·정답·정책·비교·문의·신뢰·AEO·관측 엔진의 집합이다.

## 존재 이유
1. 설명 구조 표준화
2. 브랜드 확장을 코드 복제가 아니라 데이터 주입으로 전환
3. 브랜드 surface에서 shared hub, 상담/예약 구조로 전이 가능하게 함

## 최상위 원칙
- Answer-first
- Trust always visible
- Graph, not tree
- Disclosure-aware
- Object-based, not page-based

## 코어 엔진 구성
1. Brand Resolution Engine
2. Question & Answer Engine
3. Policy & Pricing Engine
4. Compare & Fit Engine
5. Inquiry & Envelope Engine
6. Trust & Change Engine
7. AEO & Publishing Engine
8. Observatory Engine

## 1) Brand Resolution Engine
### 역할
- incoming route에서 tenant resolve
- brand registry 조회
- package tier / locale / overlay pack / vibe spec / disclosure profile 로드
- 하위 엔진에 BrandRuntimeContext 전달

### 입력
- route params
- locale
- brand_slug
- vertical_type

### 출력 예시
- brand_id
- brand_slug
- vertical_type
- package_tier
- overlay_pack_ids
- vibe_spec_id
- disclosure_profile_id
- active_modules
- locale

## 2) Question & Answer Engine
### 역할
- 질문 허브 렌더링
- AnswerCard 리스트/상세 렌더링
- AEO 허브 질문 카드 투영
- related object linking
- zero-result recovery

### 입력 객체
- AnswerCard
- Question Atlas
- Related PolicyItem
- Related CombinationType
- Related PortfolioShot
- CTA spec

### 출력
- brand question hub
- shared question hub
- answer detail
- FAQ-lite
- AI feed payload

### 웨딩 특화
- Q-Bank: 검증/딜룸 질문 프로토콜
- AEO Card: 공개 유입용 질문 카드

## 3) Policy & Pricing Engine
### 역할
- 가격 밴드
- 포함/불포함
- 추가금 리스크
- 환불/변경
- 원본/셀렉/보정 범위 구조화

### 입력 객체
- PolicyItem
- PricingBand
- Included/Excluded items
- Surcharge factors
- Evidence
- ChangeLog

### 출력
- pricing summary
- policy hub
- policy detail
- surcharge hint strip
- refund/change summary
- public summary vs gated detail

## 4) Compare & Fit Engine
### 역할
- 조합 유형 비교
- fit guide
- regret risk 설명
- follow-up questions 연결
- Fit Brief public summary 렌더링

### 입력 객체
- CombinationType
- CompareDimension
- RiskFactor
- FitGuide
- Related AnswerCards
- FitBrief summary

### 출력
- compare hub
- compare detail
- fit guide block
- risk summary block
- verified compare
- brief summary

## 5) Inquiry & Envelope Engine
### 역할
- quick inquiry
- inquiry draft generation
- Bride/Groom Envelope intake
- next-step CTA
- brief request initiation

### 입력
- InquiryTemplate
- Bride/Groom Envelope schema
- Mood selections
- Brand context
- Related portfolio/question context

### 출력
- inline inquiry composer
- draft message
- envelope start wizard
- verified brief request
- inquiry CTA strip

### 공개 단계
- L0: basic inquiry + teaser envelope
- L1: verified envelope / brief request
- L2: deal-specific inquiry / quote / schedule handling

## 6) Trust & Change Engine
### 역할
- reviewer surface
- evidence surface
- updated_at
- boundary note
- changelog
- correction entry
- trust hub render

### 입력
- Reviewer
- Evidence
- ChangeLog
- TrustLog
- CorrectionRequest
- Disclosure profile

### 출력
- trust strip
- evidence snapshot
- reviewer block
- latest updates
- correction entry
- trust hub

## 7) AEO & Publishing Engine
### 역할
- metadata generation
- FAQ JSON-LD
- LocalBusiness / brand summary schema
- answer feed
- compare / policy / guide feed
- sitemap eligibility
- canonical / hreflang

### 입력
- canonical objects
- projection rules
- disclosure profile
- locale
- freshness / stale status

### 출력
- public metadata
- FAQ JSON-LD
- answer feed
- sitemap inclusion
- noindex rules
- structured comparison summaries

### 공개 규칙
- L0: 적극 발행
- L1: summary-only 또는 제한 발행
- L2: public feed / sitemap / index 금지

## 8) Observatory Engine
### 역할
- interaction logging
- question value tracking
- CTA conversion tracking
- zero-result collection
- stale alerts
- mixed signal detection
- overlay/vibe correction input 생성

### 기본 이벤트
- answer_open
- answer_copy
- compare_click
- inquiry_start
- inquiry_submit
- zero_result
- trust_expand
- lang_switch
- fit_brief_request
- policy_open

## 엔진 간 데이터 흐름
1. Brand Resolution Engine이 runtime context 로드
2. Question / Policy / Compare / Inquiry / Trust 엔진이 canonical object 로딩
3. Overlay Pack과 VibeSpec이 렌더링/우선순위/톤 조정
4. AEO Engine이 machine-readable projection 발행
5. Observatory가 interaction과 drift 수집
6. 운영팀이 Fix-It 루프로 overlay/content/trust 수정

## Core vs Overlay 경계
### Core
- route resolution
- object fetching
- common render contracts
- search logic
- inquiry state machine
- disclosure enforcement
- AEO publishing
- observatory

### Overlay
- section priority
- question priority
- theme family
- VCO variants
- trust density
- CTA tone
- vibe profile
- KPI emphasis

### 금지
- brand별 bespoke 로직을 core에 하드코딩
- disclosure 표현을 UI 임시 문구로만 처리

## 패키지 인식 원칙
### Entry
- 질문 정리
- 가격/정책 기본 설명
- 문의 연결

### Standard
- 비교 질문 대응
- 옵션 구조화
- 포털/운영 연동

### Professional
- 다국어
- 검증 배지
- 예약 구조

## Vibe-aware Core 원칙
모든 엔진은 VibeSpec input을 받을 준비가 되어 있어야 한다.
- tone rule
- trust rule
- CTA arousal band
- banned signal
- required evidence
- mixed signal lint

## 기술 구현 권장
- Next.js App Router
- Server Components + Server Actions
- Supabase/Postgres
- typed schema contracts

## QA 체크리스트
- 모든 brand surface가 같은 core engine을 쓰는가
- shared hub와 brand surface가 canonical object를 재사용하는가
- search / answer / policy / compare / inquiry / trust / aeo / observatory가 모두 동작하는가
- L0/L1/L2 분기가 engine 레벨에서 강제되는가
- vibe hooks를 받을 수 있는가

## 최종 선언
Core Site Engine은 공통 컴포넌트 묶음이 아니라, 질문을 공식 답으로 바꾸고, 비교와 정책 이해를 구조화하며, 문의를 질 좋은 상담으로 바꾸고, 브랜드 하위 디렉토리와 shared hub를 하나의 플랫폼으로 묶는 Factory의 공통 사고 엔진이다.
