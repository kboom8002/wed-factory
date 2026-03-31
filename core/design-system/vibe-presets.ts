import { VibeSpec } from './vibe-registry';
import { Noto_Sans_KR, Noto_Serif_KR, Outfit } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const notoSerifKR = Noto_Serif_KR({ subsets: ['latin'], weight: ['400', '700'] });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '700'] });

const SANS = notoSansKR.className;
const SERIF = notoSerifKR.className;
const OUTFIT = outfit.className;

// We spread this tightly crafted array into the main dictionary.
export const PREMADE_VIBE_PRESETS: VibeSpec[] = [
  // --- 1. DARK & CINEMATIC (스튜디오 / 감성 본식) ---
  {
    id: "midnight-silk", name: "Midnight Silk (Chic Dark Blue)",
    colors: { primary: "#3B82F6", secondary: "#1E3A8A", surface: "#0F172A", background: "#020617", textMain: "#F8FAFC", textMuted: "#94A3B8", accent: "#60A5FA" },
    typography: { fontFamilyClass: OUTFIT, headingStyle: "tracking-tight" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "자세한 시크릿 견적 받기", trust_tone: "원장 직접 승인", banned_signals: ["가성비", "저렴한"], required_evidence: "contract_only" }
  },
  {
    id: "forest-mist", name: "Forest Mist (Rustic Green)",
    colors: { primary: "#10B981", secondary: "#065F46", surface: "#064E3B", background: "#022C22", textMain: "#ECFDF5", textMuted: "#6EE7B7", accent: "#34D399" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-widest" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "야외 스냅 스케줄 확인", trust_tone: "작가 1:1 컨펌", banned_signals: ["공장형"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "royal-crimson", name: "Royal Crimson (Deep Red & Gold)",
    colors: { primary: "#D4AF37", secondary: "#991B1B", surface: "#450A0A", background: "#2A0404", textMain: "#FEF2F2", textMuted: "#FCA5A5", accent: "#F87171" },
    typography: { fontFamilyClass: SERIF, headingStyle: "uppercase" }, shape: { borderRadius: "0.25rem" },
    hooks: { cta_tone: "프리미엄 견적 의뢰", trust_tone: "공식 하이엔드 인증", banned_signals: ["싸게"], required_evidence: "contract_only" }
  },
  {
    id: "charcoal-noir", name: "Charcoal Noir (Extreme Minimal Black)",
    colors: { primary: "#FFFFFF", secondary: "#A3A3A3", surface: "#171717", background: "#0A0A0A", textMain: "#FAFAFA", textMuted: "#737373", accent: "#E5E5E5" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tighter" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "블랙라벨 핏 브리프 의뢰", trust_tone: "대표 작가 승인", banned_signals: ["추가금무료"], required_evidence: "contract_only" }
  },
  {
    id: "obsidian-gold", name: "Obsidian Gold (Jewelry/Dress)",
    colors: { primary: "#EAB308", secondary: "#A16207", surface: "#1C1917", background: "#0C0A09", textMain: "#FFFBEB", textMuted: "#A8A29E", accent: "#FDE047" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-widest" }, shape: { borderRadius: "0.5rem" },
    hooks: { cta_tone: "쇼룸 방문/견적 예약", trust_tone: "오피셜 쇼룸 인증", banned_signals: [], required_evidence: "contract_only" }
  },

  // --- 2. BRIGHT & PURE (맑은 스튜디오 / 화이트 드레스 / 메이크업) ---
  {
    id: "pure-snow", name: "Pure Snow (Ultra Clean White)",
    colors: { primary: "#000000", secondary: "#E5E5E5", surface: "#FFFFFF", background: "#FAFAFA", textMain: "#0A0A0A", textMuted: "#737373", accent: "#171717" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tight" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "투명한 정찰제 견적 받기", trust_tone: "플랫폼 교차 검증", banned_signals: ["공동구매"], required_evidence: "any" }
  },
  {
    id: "cotton-cloud", name: "Cotton Cloud (Soft Gray)",
    colors: { primary: "#64748B", secondary: "#CBD5E1", surface: "#FFFFFF", background: "#F8FAFC", textMain: "#0F172A", textMuted: "#64748B", accent: "#475569" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-normal" }, shape: { borderRadius: "1.5rem" },
    hooks: { cta_tone: "부드럽고 맑은 일정 확인", trust_tone: "검증된 포트폴리오", banned_signals: ["강압적"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "ivory-elegance", name: "Ivory Elegance (Warm White)",
    colors: { primary: "#B45309", secondary: "#FEF3C7", surface: "#FFFAF0", background: "#FFFBF2", textMain: "#451A03", textMuted: "#92400E", accent: "#D97706" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-wide" }, shape: { borderRadius: "0.75rem" },
    hooks: { cta_tone: "클래식 무드 상담 예약", trust_tone: "보증된 브랜드", banned_signals: ["싼티"], required_evidence: "contract_only" }
  },
  {
    id: "blush-petal", name: "Blush Petal (Soft Pink)",
    colors: { primary: "#BE185D", secondary: "#FCE7F3", surface: "#FFFFFF", background: "#FFF1F2", textMain: "#831843", textMuted: "#9D174D", accent: "#DB2777" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tight" }, shape: { borderRadius: "2rem" },
    hooks: { cta_tone: "핑크빛 감성 핏 문의", trust_tone: "신뢰할 수 있는 업체", banned_signals: ["노쇼"], required_evidence: "any" }
  },
  {
    id: "morning-dew", name: "Morning Dew (Light Mint)",
    colors: { primary: "#0D9488", secondary: "#CCFBF1", surface: "#FFFFFF", background: "#F0FDFA", textMain: "#134E4A", textMuted: "#115E59", accent: "#14B8A6" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-normal" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "청량한 견적 서치하기", trust_tone: "신선한 포트폴리오", banned_signals: ["수수료"], required_evidence: "screenshot_allowed" }
  },

  // --- 3. MOODY & ARTISTIC (색감 위탁 스튜디오, 하우스 웨딩) ---
  {
    id: "vintage-sepia", name: "Vintage Sepia (Warm Brown)",
    colors: { primary: "#9A3412", secondary: "#FFEDD5", surface: "#FFF7ED", background: "#FEF3C7", textMain: "#431407", textMuted: "#7C2D12", accent: "#C2410C" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-tighter" }, shape: { borderRadius: "0.5rem" },
    hooks: { cta_tone: "필름 감성 견적 받기", trust_tone: "따뜻한 리뷰 확정", banned_signals: ["디지털적인"], required_evidence: "any" }
  },
  {
    id: "terracotta-warm", name: "Terracotta Warm (Clay Color)",
    colors: { primary: "#C2410C", secondary: "#FFEDD5", surface: "#FFFAF0", background: "#FAF6F0", textMain: "#431407", textMuted: "#9A3412", accent: "#EA580C" },
    typography: { fontFamilyClass: SANS, headingStyle: "uppercase" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "햇살 가득한 스튜디오 문의", trust_tone: "실제 신부님 100% 추천", banned_signals: [], required_evidence: "screenshot_allowed" }
  },
  {
    id: "ocean-breeze", name: "Ocean Breeze (Jeju Snap / Beach)",
    colors: { primary: "#0284C7", secondary: "#E0F2FE", surface: "#FFFFFF", background: "#F0F9FF", textMain: "#082F49", textMuted: "#0369A1", accent: "#0EA5E9" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-wide" }, shape: { borderRadius: "1.5rem" },
    hooks: { cta_tone: "제주/바다 스냅 일정 및 단가", trust_tone: "야외 스냅 스페셜리스트", banned_signals: ["공장"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "lavender-dream", name: "Lavender Dream (Purple Pastel)",
    colors: { primary: "#7C3AED", secondary: "#EDE9FE", surface: "#FFFFFF", background: "#F5F3FF", textMain: "#2E1065", textMuted: "#5B21B6", accent: "#8B5CF6" },
    typography: { fontFamilyClass: OUTFIT, headingStyle: "tracking-normal" }, shape: { borderRadius: "2rem" },
    hooks: { cta_tone: "몽환적인 핏 리포트 받기", trust_tone: "인증된 웨딩 아티스트", banned_signals: ["딱딱한"], required_evidence: "any" }
  },
  {
    id: "sunset-glow", name: "Sunset Glow (Coral & Orange)",
    colors: { primary: "#EA580C", secondary: "#FFEDD5", surface: "#FFFFFF", background: "#FFF7ED", textMain: "#431407", textMuted: "#9A3412", accent: "#F97316" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tight" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "노을 스냅 전문 상담", trust_tone: "골든아워 보장", banned_signals: ["흐린날"], required_evidence: "screenshot_allowed" }
  },

  // --- 4. LUXURY & ELEGANCE (호텔 예식 / 하이엔드 드레스) ---
  {
    id: "platinum-silver", name: "Platinum Silver (Cool Luxury)",
    colors: { primary: "#475569", secondary: "#E2E8F0", surface: "#FAFAFA", background: "#F1F5F9", textMain: "#0F172A", textMuted: "#334155", accent: "#64748B" },
    typography: { fontFamilyClass: SERIF, headingStyle: "uppercase tracking-widest" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "VVIP 브리프 신청", trust_tone: "상위 1% 플랫폼 인증", banned_signals: ["박리다매", "저가"], required_evidence: "contract_only" }
  },
  {
    id: "burgundy-wine", name: "Burgundy Wine (Deep Rich Red)",
    colors: { primary: "#9F1239", secondary: "#FFE4E6", surface: "#FFFFFF", background: "#FFF1F2", textMain: "#4C0519", textMuted: "#881337", accent: "#BE185D" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-tight" }, shape: { borderRadius: "0.25rem" },
    hooks: { cta_tone: "깊이 있는 포트폴리오 감상", trust_tone: "호텔 예식 최적화", banned_signals: ["저가", "캐주얼"], required_evidence: "contract_only" }
  },
  {
    id: "emerald-city", name: "Emerald City (Jewelry/Watch)",
    colors: { primary: "#047857", secondary: "#D1FAE5", surface: "#FFFFFF", background: "#ECFDF5", textMain: "#022C22", textMuted: "#065F46", accent: "#10B981" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-normal" }, shape: { borderRadius: "0.5rem" },
    hooks: { cta_tone: "예물/하이주얼리 상담 예약", trust_tone: "정품/보증서 검증 완료", banned_signals: ["모조품", "가품"], required_evidence: "contract_only" }
  },
  {
    id: "sapphire-blue", name: "Sapphire Blue (Cool Elegant)",
    colors: { primary: "#1D4ED8", secondary: "#DBEAFE", surface: "#FFFFFF", background: "#EFF6FF", textMain: "#1E3A8A", textMuted: "#2563EB", accent: "#3B82F6" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-widest" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "블루라벨 상담 받기", trust_tone: "팩토리 프리미엄 검수", banned_signals: ["보급형"], required_evidence: "contract_only" }
  },
  {
    id: "peach-gold", name: "Peach Gold (Soft Luxury)",
    colors: { primary: "#D97706", secondary: "#FEF3C7", surface: "#FFFFFF", background: "#FFFBEB", textMain: "#451A03", textMuted: "#92400E", accent: "#F59E0B" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-normal" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "부드러운 하이엔드 견적", trust_tone: "수입 드레스 공식 인증", banned_signals: ["국내제작"], required_evidence: "contract_only" }
  },

  // --- 5. TRENDY & VIBRANT (팝한 컬러감, 메이크업, 트렌디 스냅) ---
  {
    id: "neon-cyber", name: "Neon Cyber (Y2K / Trendy Profile)",
    colors: { primary: "#10B981", secondary: "#064E3B", surface: "#111827", background: "#030712", textMain: "#F3F4F6", textMuted: "#9CA3AF", accent: "#34D399" },
    typography: { fontFamilyClass: OUTFIT, headingStyle: "tracking-tighter" }, shape: { borderRadius: "1.5rem" },
    hooks: { cta_tone: "힙한 컨셉 스튜디오 서치", trust_tone: "트렌드 리더스 인증", banned_signals: ["올드한"], required_evidence: "any" }
  },
  {
    id: "magenta-pop", name: "Magenta Pop (Vibrant Beauty)",
    colors: { primary: "#DB2777", secondary: "#FCE7F3", surface: "#FFFFFF", background: "#FDF2F8", textMain: "#831843", textMuted: "#BE185D", accent: "#F43F5E" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-wide" }, shape: { borderRadius: "2rem" },
    hooks: { cta_tone: "메이크업 지정 원장님 예약", trust_tone: "뷰티 전문가 보증", banned_signals: ["촌스러운"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "tangerine-dream", name: "Tangerine Dream (Orange Pop)",
    colors: { primary: "#EA580C", secondary: "#FFEDD5", surface: "#FFFFFF", background: "#FFF7ED", textMain: "#7C2D12", textMuted: "#C2410C", accent: "#F97316" },
    typography: { fontFamilyClass: OUTFIT, headingStyle: "uppercase" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "비비드 톤 상담 받기", trust_tone: "과즙 팡팡 리뷰 확보", banned_signals: ["칙칙한"], required_evidence: "any" }
  },
  {
    id: "electric-indigo", name: "Electric Indigo (Blue/Purple)",
    colors: { primary: "#4F46E5", secondary: "#E0E7FF", surface: "#FFFFFF", background: "#EEF2FF", textMain: "#312E81", textMuted: "#4338CA", accent: "#6366F1" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tighter" }, shape: { borderRadius: "0.5rem" },
    hooks: { cta_tone: "유니크한 스냅 문의", trust_tone: "크리에이티브 검증", banned_signals: ["뻔한"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "lime-fresh", name: "Lime Fresh (Bright Green/Yellow)",
    colors: { primary: "#65A30D", secondary: "#ECFCCB", surface: "#FFFFFF", background: "#F7FEE7", textMain: "#365314", textMuted: "#4D7C0F", accent: "#84CC16" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-normal" }, shape: { borderRadius: "2rem" },
    hooks: { cta_tone: "산뜻한 야외 웨딩 스케줄", trust_tone: "그리너리 스팟 인증", banned_signals: ["어두운"], required_evidence: "any" }
  },

  // --- 6. NEUTRAL & MUTED (무인양품 감성, 차분한 예복, 혼주 한복) ---
  {
    id: "stone-gray", name: "Stone Gray (Balanced Neutral)",
    colors: { primary: "#57534E", secondary: "#E7E5E4", surface: "#FFFFFF", background: "#F5F5F4", textMain: "#1C1917", textMuted: "#78716C", accent: "#A8A29E" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-widest" }, shape: { borderRadius: "0px" },
    hooks: { cta_tone: "정갈한 수트/예복 상담", trust_tone: "테일러 1:1 맞춤 검증", banned_signals: ["대여복", "저렴이"], required_evidence: "contract_only" }
  },
  {
    id: "oatmeal-beige", name: "Oatmeal Beige (Soft Hanbok)",
    colors: { primary: "#9A3412", secondary: "#FFEDD5", surface: "#FFFFFF", background: "#FFFBF2", textMain: "#431407", textMuted: "#B45309", accent: "#D97706" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-normal" }, shape: { borderRadius: "1rem" },
    hooks: { cta_tone: "단아한 한복/혼주 상담", trust_tone: "실크 원단 인증", banned_signals: ["화섬", "폴리"], required_evidence: "contract_only" }
  },
  {
    id: "ash-blue", name: "Ash Blue (Muted Cyan)",
    colors: { primary: "#0369A1", secondary: "#E0F2FE", surface: "#FFFFFF", background: "#F0F9FF", textMain: "#0C4A6E", textMuted: "#0284C7", accent: "#38BDF8" },
    typography: { fontFamilyClass: SANS, headingStyle: "tracking-tight" }, shape: { borderRadius: "0.5rem" },
    hooks: { cta_tone: "플래닝 스케줄 제안 받기", trust_tone: "차분한 플래너 배정", banned_signals: ["불친절"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "rose-ash", name: "Rose Ash (Muted Pink)",
    colors: { primary: "#9F1239", secondary: "#FFE4E6", surface: "#FFFFFF", background: "#FFF1F2", textMain: "#4C0519", textMuted: "#BE185D", accent: "#FB7185" },
    typography: { fontFamilyClass: SERIF, headingStyle: "tracking-widest" }, shape: { borderRadius: "1.5rem" },
    hooks: { cta_tone: "플라워 디렉팅/베뉴 문의", trust_tone: "전담 플로리스트 인증", banned_signals: ["조화", "가짜꽃"], required_evidence: "screenshot_allowed" }
  },
  {
    id: "taupe-brown", name: "Taupe Brown (Deep Earthy)",
    colors: { primary: "#78716C", secondary: "#F5F5F4", surface: "#FFFFFF", background: "#FAFAF9", textMain: "#292524", textMuted: "#57534E", accent: "#A8A29E" },
    typography: { fontFamilyClass: SANS, headingStyle: "uppercase" }, shape: { borderRadius: "0.25rem" },
    hooks: { cta_tone: "프리미엄 본식 DVD 견적", trust_tone: "시네마틱 영상 검증", banned_signals: ["1인2캠", "알바"], required_evidence: "contract_only" }
  }
];
