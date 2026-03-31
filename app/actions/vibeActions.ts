'use server';

import { revalidatePath } from 'next/cache';
import fs from 'fs';
import path from 'path';
import { VibeSpec } from '@/core/design-system/vibe-registry';

const CUSTOM_VIBES_FILE_PATH = path.join(process.cwd(), 'data', 'custom_vibes.json');

export async function saveCustomVibeSpec(spec: VibeSpec): Promise<{ success: boolean; error?: string }> {
  try {
    // 1. 디렉토리 존재 확인 및 생성
    const dataDir = path.dirname(CUSTOM_VIBES_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }

    // 2. 기존 JSON 데이터 읽기
    let customVibes: Record<string, VibeSpec> = {};
    if (fs.existsSync(CUSTOM_VIBES_FILE_PATH)) {
      const fileData = fs.readFileSync(CUSTOM_VIBES_FILE_PATH, 'utf-8');
      if (fileData.trim()) {
         customVibes = JSON.parse(fileData);
      }
    }

    // 3. 새 스펙 덮어쓰기 및 저장
    customVibes[spec.id] = spec;
    fs.writeFileSync(CUSTOM_VIBES_FILE_PATH, JSON.stringify(customVibes, null, 2), 'utf-8');

    // 4. 캐시 무효화 (Vibe 적용 전체)
    revalidatePath('/', 'layout');

    return { success: true };
  } catch (error: any) {
    console.error('Error saving custom vibe:', error);
    return { success: false, error: error.message };
  }
}
