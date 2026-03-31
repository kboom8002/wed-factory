import { GoogleGenAI } from '@google/genai';

export interface TranslatedContent {
  en?: string;
  ja?: string;
  'zh-TW'?: string;
  'zh-CN'?: string;
}

export async function translateContent(sourceKw: string, text: string): Promise<TranslatedContent> {
  if (!process.env.GEMINI_API_KEY) {
    console.warn('GEMINI_API_KEY is not set. Skipping AI translation.');
    return {};
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  const prompt = `
당신은 한국 웨딩 산업의 B2B 플랫폼 '웨딩팩토리'의 다국어 번역 전문 AI 에이전트입니다.
테넌트(스튜디오, 드레스샵 등)가 입력한 한국어 팩트체크/운영정책 텍스트를 글로벌 유저를 위해 다음 4가지 언어로 각각 번역해주세요:
1. "en" (영어 - 글로벌 AEO 최적화, Wedding Photoshoot in Korea 등의 컨텍스트 고려)
2. "ja" (일본어 - 일본 신랑신부 대상)
3. "zh-TW" (번체 중국어 - 대만/홍콩 타겟)
4. "zh-CN" (간체 중국어 - 중국 대륙 타겟)

원본 카테고리/컨텍스트: ${sourceKw}
원본 텍스트:
"""
${text}
"""

결과는 오직 아래의 JSON 포맷으로만 반환하세요.
{
  "en": "...",
  "ja": "...",
  "zh-TW": "...",
  "zh-CN": "..."
}
`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      }
    });

    const resultText = response.text || '{}';
    return JSON.parse(resultText) as TranslatedContent;
  } catch (error) {
    console.error('AI 다국어 번역 실패:', error);
    return {};
  }
}
