import fs from 'fs';
import path from 'path';
import { VibeSpec, VIBE_DICTIONARY } from './vibe-registry';

const CUSTOM_VIBES_FILE_PATH = path.join(process.cwd(), 'data', 'custom_vibes.json');

export function loadVibeSpec(vibeId: string): VibeSpec {
  let customVibes: Record<string, VibeSpec> = {};
  
  if (fs.existsSync(CUSTOM_VIBES_FILE_PATH)) {
    try {
      const fileData = fs.readFileSync(CUSTOM_VIBES_FILE_PATH, 'utf-8');
      if (fileData.trim()) {
         customVibes = JSON.parse(fileData);
      }
    } catch (err) {
      console.error('Failed to load custom vibes JSON:', err);
    }
  }

  return customVibes[vibeId] || VIBE_DICTIONARY[vibeId] || VIBE_DICTIONARY['default-vibe-target'];
}
