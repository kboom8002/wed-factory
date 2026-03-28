# 07_Multitenant_Admin_and_Observatory_Spec.md

## 목적
멀티브랜드 웨딩 스드메 AI홈페이지 Factory에서 플랫폼 운영자, 브랜드 운영자, reviewer, disclosure 운영자, observatory 운영자가 어떤 화면과 어떤 큐를 통해 brand surface와 shared hub를 운영하는지 정의한다.

## 한 줄 정의
Multitenant Admin and Observatory는 여러 브랜드 tenant와 shared hub를 하나의 플랫폼에서 운영하기 위해, 질문·정책·신뢰·공개 수준·발행·성과·정동 정렬 상태를 큐와 대시보드 단위로 관리하는 운영 계층이다.

## 왜 필요한가
- 구축 후 방치 방지
- 브랜드 tenant 증가에 따른 중앙 통제 필요
- 질문 자산과 trust 자산의 누적 운영 필요
- 공개 수준 위반과 mixed signal 방지

## 운영 철학
- Admin은 CMS가 아니라 B-SSoT OS
- Observatory는 analytics가 아니라 Fix-It entry point
- 역할 기반 운영 필수
- 공개 수준은 운영 대상

## 최상위 모듈
1. Platform Dashboard
2. Brand Registry Console
3. Review Queue
4. Question Capital Console
5. Policy / Pricing Console
6. Publishing Center
7. Disclosure Control Center
8. Trust / Correction Center
9. Observatory Dashboard
10. Vibe Observatory (optional)

## 역할과 권한
### Platform Admin
- 전체 브랜드 생성/비활성화
- package tier 변경
- global publish/unpublish
- locale/global settings
- hub inclusion rules 관리

### Brand Operator
- 자기 브랜드 content draft 수정
- portfolio 업로드
- pricing/policy draft 제출
- inquiry 템플릿 조정
- observatory 열람

### Reviewer
- AnswerCard / PolicyItem / Guide / Trust object 검수
- boundary, evidence, updated_at 확인
- public-safe summary 승인
- correction 처리 승인

### Disclosure Operator
- L0/L1/L2 설정
- summary_only rule 설정
- feed/sitemap eligibility override
- privileged route audit

### Meaning Ops
- Question Overlay
- IA Overlay
- KPI Overlay
- shared hub question priority 운영

### Design Ops
- Design SSoT Overlay
- VCO Overlay
- theme drift 교정

### Vibe Ops
- VibeSpec 설정
- ARS / MSRI lint 열람
- CTA tone / trust tone 교정 제안

### Observatory Ops
- KPI 대시보드 운영
- zero-result backlog 관리
- stale / void / drift 우선순위 설정

## Platform Dashboard
### 핵심 위젯
- active brand count
- onboarding stage distribution
- package tier distribution
- public tenant count
- shared hub eligible object count
- stale object count
- disclosure warning count
- trust incomplete object count
- zero-result trend
- inquiry conversion trend

## Brand Registry Console
### 기능
- brand 생성/수정/보관
- vertical type 설정
- slug / locale / package tier 관리
- overlay pack 연결
- vibe spec 연결
- disclosure profile 연결
- onboarding stage 추적

## Review Queue
### 검수 대상
- AnswerCard
- PolicyItem
- Pricing summary
- Guide snippet
- Portfolio meta
- Trust snippet
- shared hub projection
- locale variant
- FitBrief summary
- overlay draft

### 검사 항목
- reviewer 존재
- evidence 또는 policy linkage 존재
- updated_at 존재
- boundary note 존재
- CTA 존재
- disclosure level 존재
- package scope 적합
- orphan object 아님

## Question Capital Console
### 모듈
- Question Backlog
- AEO Card Queue
- Q-Bank Queue
- Zero-result Queue
- High-value Priority Board

### 기능
- raw question 수집
- normalized question 생성
- question family/type 분류
- value/risk/coverage score
- related policy/compare/inquiry 연결
- shared hub 우선순위 결정

## Policy / Pricing Console
### 모듈
- PricingBand manager
- Policy family manager
- Surcharge risk manager
- public summary editor
- verified detail prep
- policy change diff viewer

## Publishing Center
### 기능
- preflight check
- publish / unpublish / republish
- preview
- feed eligibility recompute
- sitemap inclusion preview
- structured data validation preview

### preflight 검사
- object trust completeness
- disclosure level validity
- package gate
- locale completeness
- stale status
- no orphan projection
- no mixed-signal blocker

## Disclosure Control Center
### 모듈
- visibility matrix
- summary/full diff viewer
- restricted route audit
- sitemap/feed exclusion monitor
- privileged access log viewer

### 규칙
- L2 detail public page / search index / answer feed / sitemap 금지
- L1 full projection verified context 없이는 금지
- summary_only는 full처럼 보이면 안 됨

## Trust / Correction Center
### 모듈
- reviewer assignment
- evidence library
- change log timeline
- correction intake
- correction triage
- correction resolution
- public note manager

### correction workflow
1. correction 접수
2. 영향 객체 식별
3. reviewer 배정
4. 사실 확인
5. 수정 / 반려
6. changelog 반영
7. 필요 시 public note
8. republish

## Observatory Dashboard
### 플랫폼 KPI
- total answer opens
- hub → brand transitions
- inquiry starts
- brief requests
- search landings

### 브랜드 KPI
- answer_open_rate
- policy_open_rate
- compare_click_rate
- inquiry_start_rate
- inquiry_submit_rate
- trust_expand_rate

### 운영 KPI
- zero_result_count
- stale_count
- review_overdue_count
- trust_incomplete_count
- disclosure_warning_count

## Vibe Observatory
### 입력
- VibeSpec
- ARS Estimator score
- CTA performance
- trust exposure
- copy/share behavior
- feedback / survey / micro-ESM

### 핵심 지표
- ARS alignment
- ICC
- ECE
- MSRI
- VPA
- trust tone mismatch
- CTA arousal mismatch

## 큐 중심 운영 모델
1. Onboarding Queue
2. Review Queue
3. Question Backlog Queue
4. Policy Update Queue
5. Disclosure Warning Queue
6. Correction Queue
7. Stale / Void / Drift Queue

## stale / void / drift
### Stale
- 오래된 업데이트 / 가격 / 정책 / reviewer / locale
- 조치: review queue, hub/feed 제외 검토

### Void
- zero-result search
- compare blind spot
- unanswered policy question
- guide coverage 부족
- 조치: Question Backlog / AEO Card / Guide 후보

### Drift
- overlay drift
- trust density drift
- disclosure drift
- vibe drift
- mixed signal drift
- 조치: overlay review, vibe retuning, CTA retuning, trust block 강화

## 관리자 라우팅
- `/admin`
- `/admin/brands`
- `/admin/onboarding`
- `/admin/questions`
- `/admin/policies`
- `/admin/publishing`
- `/admin/disclosure`
- `/admin/trust`
- `/admin/observatory`

## observability 이벤트
- answer_open
- answer_copy
- policy_open
- compare_click
- brand_surface_view
- hub_to_brand_transition
- inquiry_start
- inquiry_submit
- brief_request
- brief_summary_open
- trust_expand
- lang_switch
- zero_result
- correction_submit

## 운영 우선순위
1. disclosure blocker
2. trust incomplete public object
3. stale pricing/policy
4. high-value zero-result
5. compare blind spot
6. inquiry drop-off hotspot
7. vibe mixed signal hotspot

## HITL 운영 원칙
### 자동화 가능
- intake parsing
- question clustering
- draft overlay generation
- candidate policy summary
- feed eligibility computation
- stale detection
- basic lint

### 사람 승인 필요
- reviewer
- evidence
- boundary
- L0/L1/L2
- public summary wording
- anti-keywords
- VibeSpec final target
- publish approval

## QA 체크리스트
- 플랫폼/브랜드 권한 분리
- reviewer와 operator 분리
- 질문/정책/신뢰/전환 지표 확인
- zero-result와 void backlog 전환
- L2 public leakage 검출
- correction이 changelog/trust 운영으로 연결
- stale 상태 실제 관리
- MSRI/VPA 확장 가능성 확보

## 최종 선언
Multitenant Admin and Observatory는 단순 CMS와 analytics의 조합이 아니라, 여러 브랜드 tenant를 운영하고, 질문 자산과 정책 구조를 계속 축적하며, 공개 수준과 신뢰 구조를 통제하고, 질문 → 비교 → 안심 → 예약 흐름을 성과 지표로 보고, 필요한 수정 항목을 큐 기반으로 밀어 넣으며, 필요하면 vibe와 mixed signal까지 교정하는 Factory의 운영 뇌다.
