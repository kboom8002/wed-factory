/**
 * core/utils/color-contrast.ts
 * 
 * WCAG 2.1 접근성 명암비(Contrast Ratio) 계산 유틸리티
 */

// HEX to RGB 변환
export function hexToRgb(hex: string): { r: number, g: number, b: number } | null {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

// Relative Luminance 계산 (인간의 눈 민감도 반영)
// 규칙: R,G,B 각 채널을 255로 나눈 값을 c라 할 때,
// c <= 0.03928 이면 c / 12.92
// 아니면 ((c + 0.055) / 1.055) ^ 2.4
function getLuminance(r: number, g: number, b: number): number {
  const a = [r, g, b].map((v) => {
    v /= 255;
    return v <= 0.03928
      ? v / 12.92
      : Math.pow((v + 0.055) / 1.055, 2.4);
  });
  return a[0] * 0.2126 + a[1] * 0.7152 + a[2] * 0.0722;
}

// 두 색상 간 명암비 계산 (1:1 에서 21:1 까지)
export function getContrastRatio(hex1: string, hex2: string): number {
  const rgb1 = hexToRgb(hex1);
  const rgb2 = hexToRgb(hex2);

  if (!rgb1 || !rgb2) return 1;

  const l1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const l2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);

  const lightest = Math.max(l1, l2);
  const darkest = Math.min(l1, l2);

  // (L1 + 0.05) / (L2 + 0.05)
  return (lightest + 0.05) / (darkest + 0.05);
}

export type WCAGLevel = 'AAA' | 'AA' | 'Large Text Only' | 'FAIL';

export function checkWCAG(ratio: number): { level: WCAGLevel, passed: boolean } {
  if (ratio >= 7) return { level: 'AAA', passed: true };
  if (ratio >= 4.5) return { level: 'AA', passed: true };
  if (ratio >= 3) return { level: 'Large Text Only', passed: false }; // Warning zone
  return { level: 'FAIL', passed: false };
}
