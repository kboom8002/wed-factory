import { Noto_Sans_KR, Noto_Serif_KR, Outfit } from 'next/font/google';

const notoSansKR = Noto_Sans_KR({ subsets: ['latin'], weight: ['400', '500', '700', '900'] });
const notoSerifKR = Noto_Serif_KR({ subsets: ['latin'], weight: ['400', '700'] });
const outfit = Outfit({ subsets: ['latin'], weight: ['400', '700'] });

export type VibeSpecId = 'default-vibe-target' | 'lovely-peach' | 'cinematic-night';

export interface VibeSpec {
  id: string;
  name: string;
  colors: {
    primary: string;
    secondary: string;
    surface: string;
    background: string;
    textMain: string;
    textMuted: string;
    accent: string;
  };
  typography: {
    fontFamilyClass: string;
    headingStyle: string; 
  };
  shape: {
    borderRadius: string; 
  };
  // [Phase 7: Optional Vibe Hook Layer]
  hooks: {
    cta_tone: string;
    trust_tone: string;
    banned_signals: string[];
    required_evidence: 'contract_only' | 'screenshot_allowed' | 'any';
  };
}

export const VIBE_DICTIONARY: Record<string, VibeSpec> = {
  'default-vibe-target': {
    id: 'default-vibe-target',
    name: 'Standard Clean',
    colors: {
      primary: '#2563EB', // Blue 600
      secondary: '#60A5FA', // Blue 400
      surface: '#FFFFFF',
      background: '#F9FAFB', // Gray 50
      textMain: '#111827', // Gray 900
      textMuted: '#6B7280', // Gray 500
      accent: '#3B82F6', // Blue 500
    },
    typography: {
      fontFamilyClass: notoSansKR.className,
      headingStyle: 'tracking-tight',
    },
    shape: {
      borderRadius: '0.75rem', // rounded-xl
    },
    hooks: {
      cta_tone: '이 정책으로 핏 브리프 의뢰하기',
      trust_tone: '팩토리 교차 검증 완료',
      banned_signals: ['최저가', '꽁짜', '무료서비스'],
      required_evidence: 'screenshot_allowed'
    }
  },
  'lovely-peach': {
    id: 'lovely-peach',
    name: 'Romantic Pink (Dress/Studio)',
    colors: {
      primary: '#E11D48', // Rose 600
      secondary: '#FDA4AF', // Rose 300
      surface: '#FFF1F2', // Rose 50
      background: '#FFFFFF',
      textMain: '#4C0519', // Rose 950
      textMuted: '#9F1239', // Rose 700
      accent: '#F43F5E', // Rose 500
    },
    typography: {
      fontFamilyClass: notoSerifKR.className,
      headingStyle: 'tracking-normal',
    },
    shape: {
      borderRadius: '1.5rem', // rounded-3xl (soft)
    },
    hooks: {
      cta_tone: '내게 맞는 프라이빗 견적 확인하기',
      trust_tone: '원장님 컨펌/팩트체크 완료',
      banned_signals: ['가성비', '오픈할인'],
      required_evidence: 'contract_only'
    }
  },
  'cinematic-night': {
    id: 'cinematic-night',
    name: 'Champagne Gold Dark (High-end Studio)',
    colors: {
      primary: '#D4AF37',   // Champagne Gold
      secondary: '#F3E5AB', // Soft Gold
      surface: '#111111',   // Deep True Black surface
      background: '#050505',// Abyss Black background
      textMain: '#FDFCF0',  // Off-white for luxury
      textMuted: '#888888', // Graphite gray for subtleness
      accent: '#9A7B4F',    // Antique Bronze/Gold
    },
    typography: {
      fontFamilyClass: outfit.className,
      headingStyle: 'tracking-tight uppercase',
    },
    shape: {
      borderRadius: '0px', // sharp corners for editorial vibe
    },
    hooks: {
      cta_tone: '프라이빗 디렉팅 북명 & 상담 예약',
      trust_tone: '공식 가이드라인 원본 대조필',
      banned_signals: ['싸게', '공구', '서브작가무료'],
      required_evidence: 'contract_only'
    }
  }
};

// LLM 자동화로 생성해둔 프리셋들을 머지(Merge)합니다.
import { PREMADE_VIBE_PRESETS } from './vibe-presets';

PREMADE_VIBE_PRESETS.forEach(preset => {
  VIBE_DICTIONARY[preset.id] = preset;
});
