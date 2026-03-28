# 09_Factory_Repo_and_Runtime_Structure.md

## 목적
웨딩 스드메 AI홈페이지 Factory Platform의 코드 저장소 구조(repo structure)와 런타임 구조(runtime structure)를 정의한다.

## 한 줄 정의
하나의 멀티브랜드 코드베이스 안에서 Brand Registry, Core Site Engine, Overlay System, Shared Hub, AEO, Observatory를 계층적으로 분리하고, 브랜드별 AI홈페이지를 하위 디렉토리 surface로 컴파일·배포·운영하는 실행 구조다.

## 최상위 원칙
- One Repo, Many Brand Surfaces
- Core before Brand
- Object-based runtime
- Disclosure-aware runtime
- Surface is compiled, not handcrafted
- Observatory is first-class

## 권장 기술 스택
- Next.js App Router
- React Server Components
- TypeScript
- Tailwind CSS
- Supabase / Postgres
- Row Level Security
- Server Actions / Route Handlers
- JSON / YAML overlay definitions
- typed schema contracts
- event ingestion / object health metrics / publish gate logs

## 최상위 디렉토리 구조
```text
repo/
  app/
  core/
  factory/
  brands/
  hub/
  admin/
  observatory/
  data/
  docs/
  scripts/
  public/
  tests/
```

## 각 영역 역할
### app
public / verified / privileged / admin route group 진입점

### core
Core Site Engine, contracts, gates, canonical projection logic

### factory
brand registry, onboarding, extraction, overlay compile, publish pipeline

### brands
brand-surface adapters, surface recipes, route bindings

### hub
shared question hub, compare hub, guide hub, trust hub, search hub

### admin
multitenant admin UI, queues, publishing center, disclosure center, trust center

### observatory
event ingestion, KPI computation, stale/void/drift detection, dashboards

### data
schema, migrations, seed, fixtures, import/export specs

### docs
spec 문서, SOP, pair-coding notes, frozen rules

### scripts
import, lint, feed generation, publish helper, QA audit

### tests
engine tests, route tests, gate tests, integration tests

## App Router 구조
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
    vendors/
  admin/
```

## core/ 구조
```text
core/
  contracts/
  engines/
  projections/
  gates/
  search/
  inquiry/
  trust/
  publishing/
  runtime/
```

### engines
- brand-resolution
- question-answer
- policy-pricing
- compare-fit
- inquiry-envelope
- trust-change
- aeo-publishing
- observatory

### gates
- package gate
- disclosure gate
- trust completeness gate
- mixed signal gate
- publish preflight gate

## factory/ 구조
```text
factory/
  registry/
  onboarding/
  extraction/
  overlays/
  compiler/
  publishing/
  lifecycle/
```

### registry
brand registry CRUD, slug resolution, tenant health

### onboarding
brand onboarding wizard, intake status, checklist

### extraction
reference pack parsing, question extraction, policy extraction, visual signal extraction

### overlays
overlay draft generation, approval workflow, versioning

### compiler
Core + Overlay + VibeSpec + BrandRuntimeContext 병합

### publishing
preview, publish, republish, rollback

### lifecycle
stale, correction, archive, offboarding, re-onboarding

## brands/ 구조
```text
brands/
  shared/
    surface-recipes/
    brand-layouts/
    brand-widgets/
  studio/
    adapters/
    defaults/
  dress/
    adapters/
    defaults/
  makeup/
    adapters/
    defaults/
```

## hub/ 구조
```text
hub/
  questions/
  compare/
  guides/
  search/
  trust/
  updates/
  projections/
```

## admin/ 구조
```text
admin/
  dashboard/
  brands/
  reviews/
  questions/
  policies/
  publishing/
  disclosure/
  trust/
  observatory/
  vibe/
```

## observatory/ 구조
```text
observatory/
  events/
  metrics/
  dashboards/
  queues/
  vibe/
  alerts/
```

## data/ 구조
```text
data/
  migrations/
  seeds/
  fixtures/
  schemas/
  imports/
```

## docs/ 구조
```text
docs/
  factory/
  verticals/
  overlays/
  vibe/
  pair-coding/
```

## Runtime Context
### BrandRuntimeContext
- brand_id
- brand_slug
- vertical_type
- package_tier
- overlay_pack_ids
- vibe_spec_id
- disclosure_profile_id
- locale
- active_modules

### AccessRuntimeContext
- access_level
- viewer_role
- verification_state
- locale

### SurfaceRuntimeContext
- route_type
- projection_mode
- render_recipe_id
- hub_or_brand_scope

### ObservabilityContext
- event_namespace
- tenant_scope
- surface_scope
- experiment_flags

## Compile 흐름
1. Route resolve
2. Brand registry lookup
3. BrandRuntimeContext 생성
4. Canonical object fetch
5. Overlay merge
6. VibeSpec 적용(optional)
7. Projection mode 결정
8. Gate pre-check
9. Surface recipe render
10. Observability binding

## Overlay merge 순서
1. Global defaults
2. Vertical defaults
3. Package defaults
4. Brand-approved overlay
5. Locale overlay
6. Campaign override
7. Runtime safety gate

## Projection 구조
- brand surface projection
- shared hub projection
- FAQ JSON-LD projection
- answer feed projection
- compare feed projection
- admin review projection
- verified summary projection
- privileged full projection

## lifecycle
### Publish
public-safe projection 발행

### Republish
overlay/policy/trust/content 변경 후 재발행

### Archive
brand 종료 또는 품질 미달 시 public unpublish + 내부 보존

### Offboarding
shared hub 제외, feed 제외, observability 비식별 집계만 유지

## Vibe-enabled hook
### input
- VibeSpec
- banned signals
- required evidence rules
- CTA arousal band

### render-time
- sentence style
- trust tone
- CTA tone
- evidence density
- layout density hint
- mixed signal lint

### observability
- ARS estimator score
- MSRI warning
- VPA estimate
- trust tone mismatch

## 환경
- local
- preview
- staging
- production

## seed 기준
- studio tenant 1
- dress tenant 1
- makeup tenant 1
- question hub sample
- compare hub sample
- trust hub sample
- AnswerCard 30+
- PolicyItem 12+
- CombinationType 6+
- PortfolioShot 30+
- Q-Bank sample
- FitBrief summary sample

## AI-pair coding용 repo 규칙
- page-first 금지
- hardcoded brand logic 금지
- docs-first branch 권장
- engine contract 먼저
- self-audit 스크립트 필수

## QA 체크리스트
- 새 레포 없이 tenant 추가 가능한가
- Route → Registry → Context → Objects → Overlay → Projection → Render 흐름 유지되는가
- canonical object가 brand/hub/feed/admin에서 재사용되는가
- L2 detail public app 경로로 새지 않는가
- optional vibe hook로 동작하는가

## 최종 선언
Factory Repo and Runtime Structure는 멀티브랜드 AI홈페이지를 하나의 코드베이스에서 운영하고, 브랜드별 하위 디렉토리를 같은 코어 엔진으로 렌더링하며, 브랜드 차이는 overlay와 object로 주입하고, shared hub와 AEO에 자산을 재사용하며, observatory로 다시 수정하는 Factory의 실행 골격이다.
