# 03_Brand_Registry_and_Onboarding_Spec.md

## 목적
새 브랜드를 플랫폼의 tenant로 등록하고, reference pack을 구조화해 question/policy/trust/overlay/vibe 산출물로 변환한 뒤, brand surface와 shared hub에 재사용 가능한 공식 설명 구조로 publish하는 절차를 정의한다.

## 한 줄 정의
Brand Registry and Onboarding은 새 웨딩 브랜드를 Factory Platform의 tenant로 등록하고, reference pack을 structure-aware ingestion하여 공식 설명 구조로 publish하는 절차다.

## 온보딩의 본질
- 브랜드명/로고 등록이 아니라 공식 설명 구조 세팅
- 질문 자산 생산
- 운영형 tenant 생성

## Brand Registry 역할
- tenant source of truth
- brand status / vertical / package / overlay / disclosure / locale 관리
- shared hub eligibility 및 observability baseline 관리

## Brand Registry 스키마
### Identity
- brand_id
- brand_slug
- brand_name_ko
- brand_name_en
- vertical_type
- brand_status

### Commercial
- package_tier
- billing_status
- onboarding_stage
- operator_owner

### Runtime
- overlay_pack_ids
- vibe_spec_id
- disclosure_profile_id
- surface_recipe_id
- locale_set
- active_modules

### Publishing
- public_status
- published_at
- last_republished_at
- shared_hub_eligibility

### Trust
- default_reviewer_set
- evidence_completeness_score
- trust_completeness_score
- stale_risk_status

### Observability
- question_count
- policy_count
- portfolio_count
- conversion_tracking_enabled
- zero_result_capture_enabled

## 온보딩 단계 모델
1. Lead / Pre-qualify
2. Intake Accepted
3. Source Ingested
4. Structured Draft Ready
5. Overlay Draft Ready
6. Review Approved
7. Published
8. Managed

## Intake Reference Pack
### Brand Docs
- 소개서
- 서비스 설명서
- 브랜드 차별점 문서
- 기존 홈페이지 URL

### Pricing / Policy Docs
- 가격표
- 옵션표
- 포함/불포함 자료
- 환불/변경 정책
- 원본/보정/셀렉 규정

### Portfolio Assets
- 대표 포트폴리오 이미지
- 무드별 샷
- SNS 대표 게시물
- 캡션/설명

### FAQ / 상담 자료
- 자주 묻는 질문
- 카카오/DM 응대 예시
- 상담 매니저 메모
- 비교 질문 예시

### Trust 자료
- reviewer 후보
- 근거 문서
- 후기/검수 기록
- 운영 기준

### Inbound 자료
- EN/JP/CN 안내문
- 외국인 상담 FAQ
- 예약/결제 설명 자료

## Semantic Extraction 산출물
1. Brand Semantics
2. Question Capital
3. Trust / Disclosure Candidates
4. Visual Signals

## Overlay Pack 생성
- IA Overlay
- Question Overlay
- Design SSoT Overlay
- VCO Overlay
- Disclosure Overlay
- KPI Overlay
- optional VibeSpec

## Wedding Vertical 전용 조건
- vertical_type: studio / dress / makeup
- Wedding-specific Question Set 최소 10개+
- Wedding-specific Policy Set
- Q-Bank linked question map
- Envelope / Fit Brief readiness

## Review 승인 구조
### Reviewer 승인 항목
- high-value question 우선순위
- 정책 summary 적합성
- boundary 문구
- L0/L1/L2 공개 수준
- 과장 여부

### Trust reviewer 승인 항목
- evidence source
- reviewer 표시 방식
- correction entry 여부
- update cadence

### Design/Vibe reviewer 승인 항목
- theme family 적합성
- anti-keywords
- trust surface visibility
- mixed signal 위험
- CTA tone 적정성

## Publish Gate
### Minimum Content Gate
- 핵심 질문 카드 12개 이상
- pricing/policy summary 존재
- trust block 존재
- inquiry flow 존재

### Trust Gate
- reviewer 지정
- evidence 최소 세트
- updated_at
- boundary note
- changelog entry 가능

### Disclosure Gate
- L0/L1/L2 분류 완료
- summary_only 정의
- restricted 항목 public 차단
- feed/sitemap eligibility 분기 가능

### Surface Gate
- overlay pack 완성
- package tier 반영
- locale 처리
- search/graph dead-end 없음

### Observatory Gate
- 핵심 이벤트 수집 설정
- zero-result capture 활성화

## 온보딩 산출물
- Brand Registry row
- BrandRuntimeContext
- canonical object set
- overlay pack
- optional vibe spec
- brand surface routes
- AEO projection baseline
- observability baseline

## 운영 전환 기준
- 질문 추가/수정 SLA
- 정책 변경 반영 루프
- trust/update process 활성화
- zero-result/void backlog 생성
- 월 관리 계약 가능 상태

## Archive 원칙
- public unpublish
- shared hub 재사용 제외
- object/changelog 내부 보존
- observability 비식별 집계 유지

## QA 체크리스트
- 필수 reference pack 확보
- Brand Semantics / Question Capital / Trust/Disclosure / Visual Signals 추출
- IA / Question / Design / VCO / Disclosure / KPI overlay 완성
- reviewer/evidence/boundary 승인 완료
- 운영 모드 전환 가능

## 최종 선언
Brand Registry and Onboarding은 새 브랜드를 플랫폼 tenant로 만들고, 브랜드 자료를 질문 자산과 정책 구조로 바꾸며, trust/disclosure를 잠그고, overlay와 optional vibe spec을 생성하고, brand surface와 shared hub의 원재료를 만드는 Factory의 핵심 입구 프로세스다.
