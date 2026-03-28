# 05_Wedding_Vertical_Schema.md

## 목적
웨딩 스드메 분야를 Factory가 이해할 수 있도록 객체·관계·질문·정책·공개 수준·전환 구조로 구조화한다.

## 한 줄 정의
Wedding Vertical Schema는 웨딩 스드메 분야의 브랜드, 질문, 정책, 비교, 무드, 신뢰, 문의, 브리프, 공개 수준 구조를 canonical object와 runtime rule로 표준화한 도메인 스키마다.

## 왜 별도 스키마가 필요한가
- 질문 반복성 높음
- 비교 중요성 큼
- 정보 비대칭 존재
- 후회 비용 큼
- 설명 구조와 안심 구조가 전환에 직접 연결됨

## 패밀리 분류
- Generic 기반
- high-trust commerce discipline 포함형

## 범위
### v1 대상
- studio
- dress
- makeup

### 후속 확장
- hall
- jewelry
- honeymoon
- homegoods
- baby
- pet

## 핵심 액터
### 수요자
- Bride / Groom
- Couple
- Family stakeholder
- Planner / coordinator
- Inbound couple

### 공급자
- Studio brand
- Dress brand
- Makeup brand
- Brand operator
- Reviewer
- Trusted curator / consultant

### 플랫폼
- Platform admin
- Meaning ops
- Trust ops
- Disclosure ops
- Observatory ops

## 핵심 canonical object
1. WeddingBrand
2. ServiceOffering
3. AnswerCard
4. PolicyItem
5. PricingBand
6. PortfolioShot
7. MoodTag
8. CombinationType
9. BrideGroomEnvelope
10. VendorEnvelope
11. FitBrief
12. RiskFactor
13. Reviewer / Evidence / ChangeLog
14. InquiryTemplate

## 객체 관계 그래프
- WeddingBrand ↔ ServiceOffering
- WeddingBrand ↔ AnswerCard
- WeddingBrand ↔ PolicyItem
- WeddingBrand ↔ PortfolioShot
- PortfolioShot ↔ MoodTag
- AnswerCard ↔ PolicyItem
- AnswerCard ↔ CombinationType
- AnswerCard ↔ PortfolioShot
- CombinationType ↔ VendorEnvelope
- BrideGroomEnvelope ↔ FitBrief
- FitBrief ↔ CombinationType
- FitBrief ↔ AnswerCard
- PolicyItem ↔ RiskFactor
- InquiryTemplate ↔ WeddingBrand
- Reviewer/Evidence/ChangeLog ↔ 모든 public canonical object

## WeddingBrand
### 필수 필드
- brand_id
- brand_slug
- brand_name
- vertical_type
- brand_summary
- service_region
- price_position
- language_support
- package_tier
- trust_profile_id
- overlay_pack_ids
- vibe_spec_id
- public_status

### 도메인 메타
- brand_keywords
- anti_keywords
- style_axes
- fit_for
- not_fit_for
- headline_claims
- risk_notes

## ServiceOffering
예:
- studio: 실내 촬영 / 야외 결합 / 가족 촬영 / 반려동물 촬영
- dress: 촬영 드레스 / 본식 드레스 / 헬퍼 / 피팅 / 수선
- makeup: 촬영 메이크업 / 본식 메이크업 / 리허설 / 출장 / 혼주 확장

### 필수 필드
- offering_id
- brand_id
- offering_type
- included_summary
- excluded_summary
- price_band_id
- policy_refs
- risk_refs

## BrideGroomEnvelope
### L0
- wedding_time_window
- region_preference
- budget_band
- style_mood_tags
- shoot_preference
- dress_preference_axes
- makeup_preference_axes
- top_priorities
- deal_breakers
- privacy_preference

### L1
- narrowed_schedule_window
- budget_allocation_preference
- photo_usage_purpose
- original_retouch_sensitivity
- mobility_energy_preference
- family_inclusion
- weather_flexibility

### L2
- exact_event_date
- venue
- legal_names
- contact_info
- timeline_constraints
- body_skin_hair_notes
- current_vendor_commitments
- contract_notes

## VendorEnvelope
### 공통
- vendor_envelope_id
- brand_id
- vertical_type
- style_tags
- price_band
- included_summary
- surcharge_sensitivity
- fit_for
- not_fit_for
- availability_flexibility
- policy_refs
- risk_refs

### Studio 특화
- shoot_strength_axes
- indoor_outdoor_mix
- direction_style
- original_delivery_policy
- retouch_philosophy
- family_pet_support
- photographer_designation_option

### Dress 특화
- silhouette_tags
- fabric_tags
- body_cover_strength
- import_line_ratio
- fitting_policy_summary
- upgrade_risk_factors
- wedding_vs_shoot_strategy_support

### Makeup 특화
- tone_tags
- skin_type_strength
- face_shape_support
- travel_support
- rehearsal_support
- hair_variation_support
- groom_makeup_scope

## CombinationType
### 필수 필드
- combination_type_id
- title
- studio_type_summary
- dress_type_summary
- makeup_type_summary
- best_for
- not_fit_for
- budget_strategy
- regret_risks
- follow_up_questions
- next_action_cta

## FitBrief
### 필수 필드
- brief_id
- couple_snapshot
- style_fit_interpretation
- recommended_combination_types
- cost_structure_interpretation
- risk_summary
- next_questions
- next_72h_actions
- visibility_level
- reviewer
- generated_at

### 모드
- request_only
- summary
- full

## AnswerCard
### family
- aeo
- qbank
- policy
- conversion
- inbound

### type
- explore
- canonical
- trust
- compare
- conversion

### 필수 필드
- question
- short_answer
- full_answer
- related_policy_ids
- related_combination_ids
- related_portfolio_ids
- reviewer_id
- updated_at
- boundary_note
- cta

## PolicyItem
### policy family
- refund
- change
- schedule
- original_delivery
- retouch
- select
- fitting
- helper
- travel
- rehearsal
- family_support
- language_support

### 필수 필드
- policy_id
- policy_family
- summary
- detailed_rule
- exceptions
- risk_hint
- visibility_level
- updated_at
- reviewer_id

## PricingBand
### 필수 필드
- pricing_band_id
- band_label
- min_estimate
- max_estimate
- included_summary
- excluded_summary
- major_surcharge_axes
- visibility_level

### 공개 원칙
- L0: 구간형
- L1: 구조형
- L2: 정확형

## PortfolioShot / MoodTag
### PortfolioShot
- shot_id
- brand_id
- image_asset
- caption
- mood_tags
- style_axes
- fit_hint
- related_question_ids
- related_policy_ids

### MoodTag 예시
- 내추럴
- 청순
- 클래식
- 화려함
- 세련됨
- 영화 같은 느낌
- 로맨틱
- 트렌디
- 하이엔드
- 캐주얼
- 미니멀
- 한국적 단아함

## RiskFactor
### type
- surcharge_risk
- refund_risk
- schedule_risk
- original_delivery_risk
- fitting_risk
- weather_risk
- mobility_risk
- expectation_gap_risk

### 필수 필드
- risk_id
- risk_type
- summary
- severity
- mitigation
- related_policy_id
- related_question_id

## InquiryTemplate
### 필수 필드
- template_id
- brand_id
- purpose_type
- required_inputs
- draft_rules
- language_set
- cta_label
- privacy_note

### purpose_type
- quick_inquiry
- fit_brief_request
- inbound_inquiry
- verified_compare_request

## shared hub 재사용 객체
- AnswerCard
- CombinationType
- Policy summary
- Guide snippet
- Portfolio meta
- Trust snippet

## L0 / L1 / L2 공개 구조
### L0
- 브랜드 요약
- 질문 카드
- 정책 summary
- 가격 밴드
- 무드/포트폴리오
- 조합 유형 summary
- quick inquiry

### L1
- 예산 구조 해석
- 일정 가능 창
- 원본/보정/셀렉 범위 상세
- 추가금 구조
- 더 정밀한 fit 질문
- brief summary

### L2
- 실제 업체명
- 정확 견적
- 상세 패키지
- 계약 규정
- 일정 확정
- 연락처/개인 정보

## 패키지별 vertical 범위
### Entry
- 브랜드 AI홈페이지 기본형
- 핵심 질문 카드
- 가격/정책 기본 설명
- 문의 연결

### Standard
- 비교 질문 대응
- 옵션 구조화
- 포털/운영 연동
- brief request
- stronger trust

### Professional
- 다국어
- 검증 배지
- 예약 구조
- Fit Brief full flow
- stronger disclosure control

## observability 지표
- answer_open_rate
- compare_click_rate
- inquiry_start_rate
- inquiry_submit_rate
- policy_open_rate
- trust_expand_rate
- zero_result_rate
- fit_brief_request_rate
- inbound_lang_switch_rate

### vibe-enabled 추가
- CTA arousal mismatch
- trust tone mismatch
- MSRI warnings
- VPA by surface

## QA 체크리스트
- Studio / Dress / Makeup 각 최소 객체 세트가 있는가
- Bride/Groom Envelope L0/L1/L2 분리되는가
- AEO Card와 Q-Bank가 분리되는가
- refund / change / surcharge / original / fitting / rehearsal 누락 없는가
- 실명 업체보다 조합 유형 우선 비교가 가능한가
- L2가 public projection에 스며들지 않는가

## 최종 선언
Wedding Vertical Schema는 웨딩 시장의 질문·정책·비교·문의·안심 구조를 Factory가 반복 생산할 수 있는 객체 문법으로 고정하는 웨딩형 B-SSoT 도메인 문법이다.
