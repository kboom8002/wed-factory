# 01_MultiBrand_Tenancy_and_Routing_Spec.md

## 목적
웨딩 스드메 AI홈페이지 Factory Platform의 멀티브랜드 테넌시, URL/라우팅, 상위 허브와 브랜드 하위 디렉토리의 관계, 공개 수준별 라우트 분리 원칙을 정의한다.

## 한 줄 정의
하나의 상위 사이트 안에서 브랜드별 AI홈페이지를 하위 디렉토리 tenant로 운영하고, shared hub는 브랜드별 자산을 집계·재사용하며, 공통 코어 엔진은 모든 tenant에 동일하게 적용되는 구조다.

## 최상위 원칙
- One Platform, Many Brand Surfaces
- Brand Surface와 Shared Hub 역할 분리
- Routing은 page tree가 아니라 object graph를 반영
- Route는 disclosure-aware 해야 함

## 권장 테넌시 모델
### Path-based tenancy
- 방식 A: `/brands/{brandSlug}`
- 방식 B: `/{vertical}/{brandSlug}`

### v1 권장안
- `/{vertical}/{brandSlug}`
- vertical: `studio`, `dress`, `makeup`

### Canonical ID와 URL 분리
- internal: `brand_uuid`
- public: `brandSlug`

## 최상위 라우팅 구조
### Shared Hub Routes
- `/`
- `/questions`
- `/compare`
- `/guides`
- `/search`
- `/trust`
- `/updates`

### Brand Surface Routes
- `/studio/{brandSlug}`
- `/dress/{brandSlug}`
- `/makeup/{brandSlug}`

### Tenant Sub-routes
- overview
- portfolio
- questions
- policies
- pricing
- inquiry
- trust
- updates

## 홈과 허브의 역할
### 플랫폼 홈 `/`
- 질문 진입 허브
- 비교/가이드/검색 허브 진입
- 주요 브랜드 surface 진입점

### 브랜드 홈 `/{vertical}/{brandSlug}`
- hero
- trust strip
- service scope
- 핵심 질문 카드
- policy / pricing summary
- inquiry CTA

## 공개 수준별 라우트 분리
### L0 Public
- `/questions/...`
- `/compare/...`
- `/studio/{brandSlug}`
- `/studio/{brandSlug}/questions`
- `/studio/{brandSlug}/policies`
- `/studio/{brandSlug}/portfolio`

### L1 Verified
- `/brief/request`
- `/brief/{briefId}/summary`
- `/verify/...`
- `/compare/verified/...`

### L2 Privileged
- `/deal/{dealId}`
- `/brief/{briefId}/full`
- `/vendors/{vendorId}/reveal`
- `/quote/{quoteId}`

### 금지
- L2 route sitemap/index/feed 포함 금지
- L1 route public teaser 과장 금지

## 브랜드 기본 route 세트
- `/[vertical]/[brandSlug]`
- `/[vertical]/[brandSlug]/portfolio`
- `/[vertical]/[brandSlug]/questions`
- `/[vertical]/[brandSlug]/policies`
- `/[vertical]/[brandSlug]/pricing`
- `/[vertical]/[brandSlug]/inquiry`
- `/[vertical]/[brandSlug]/trust`
- `/[vertical]/[brandSlug]/updates`

## shared hub 기본 세트
- `/questions`
- `/compare`
- `/guides`
- `/search`
- `/trust`
- `/updates`

## Routing과 Object Model 관계
라우트는 DB row나 CMS page를 직접 반영하지 않는다. 반드시 canonical object 중심으로 설계한다.

### Canonical object 예시
- Brand
- ServiceItem
- AnswerCard
- PolicyItem
- PortfolioShot
- CombinationType
- Evidence
- Reviewer
- ChangeLog
- Bride/Groom Envelope
- Vendor Envelope
- Fit Brief

## Brand Registry와 routing 연결
### Brand Registry 최소 필드
- brand_id
- brand_slug
- vertical_type
- package_tier
- locale_set
- active_status
- public_status
- overlay_pack_id
- vibe_spec_id
- disclosure_profile_id

### 라우팅 해석 방식
1. incoming path에서 vertical, slug 추출
2. brand registry에서 tenant resolve
3. overlay / vibe / package / disclosure 로드
4. core engine에 주입
5. route별 surface compile

## locale routing
- 권장: path-based locale prefix
- 예: `/ko/studio/lumiere-studio`, `/ja/studio/lumiere-studio`

## Admin routing
### 플랫폼 공통 admin
- `/admin`
- `/admin/brands`
- `/admin/questions`
- `/admin/reviews`
- `/admin/publishing`
- `/admin/disclosure`
- `/admin/observatory`

### brand scoped admin
- `/admin/brands/{brandId}`
- `/admin/brands/{brandId}/content`
- `/admin/brands/{brandId}/questions`
- `/admin/brands/{brandId}/policies`
- `/admin/brands/{brandId}/trust`
- `/admin/brands/{brandId}/surface`

## URL naming 원칙
- 사람이 이해할 수 있어야 함
- object title 기반 slug
- stable canonical id 분리
- route semantics가 이름에 드러나야 함

## shared hub 자산 재사용 규칙
### 재사용 가능한 자산
- AnswerCard
- Policy summary
- CombinationType summary
- Guide snippet
- Trust snippet
- Portfolio meta

### shared hub 편입 조건
- reviewer 존재
- stale 아님
- disclosure 허용
- canonical tag/field 정합
- brand-specific 과잉 표현 제거

## 권장 Next.js App Router 예시
```text
app/
  (public)/
    page.tsx
    questions/
    compare/
    guides/
    search/
    trust/
    updates/
    studio/[brandSlug]/
    dress/[brandSlug]/
    makeup/[brandSlug]/
  (verified)/
    brief/
    verify/
  (privileged)/
    deal/
    quote/
  admin/
```

## QA 체크리스트
- 새 브랜드 온보딩 시 새 레포 없이 tenant route만 추가 가능한가
- vertical + slug 조합이 registry와 일치하는가
- 홈이 질문 진입 허브로 보이는가
- L2 route public 노출이 없는가
- brand asset이 shared hub로 재사용 가능한가
- no dead-end 흐름이 살아 있는가

## 최종 선언
멀티브랜드 테넌시와 라우팅은 단순 URL 설계가 아니라 브랜드 surface, 공통 허브, 신뢰 구조, AEO 구조, 운영 구조를 같은 플랫폼 안에서 충돌 없이 돌아가게 만드는 Factory의 핵심 런타임 골격이다.
