import fs from 'fs';
import path from 'path';
import { generateObject } from 'ai';
import { google } from '@ai-sdk/google';
import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const MESSAGES_DIR = path.join(process.cwd(), 'messages');
const SOURCE_LANG = 'ko';
const TARGET_LANGS = ['en', 'ja'];

async function translateJson() {
  console.log(`🚀 Starting static message batch translation (Source: ${SOURCE_LANG})`);
  
  const sourcePath = path.join(MESSAGES_DIR, `${SOURCE_LANG}.json`);
  if (!fs.existsSync(sourcePath)) {
    console.error(`Source file not found: ${sourcePath}`);
    return;
  }

  const sourceData = JSON.parse(fs.readFileSync(sourcePath, 'utf8'));

  for (const lang of TARGET_LANGS) {
    console.log(`\n⏳ Preparing translation for [${lang}]...`);
    const targetPath = path.join(MESSAGES_DIR, `${lang}.json`);
    let targetData: Record<string, any> = {};

    if (fs.existsSync(targetPath)) {
      targetData = JSON.parse(fs.readFileSync(targetPath, 'utf8'));
    }

    let updatesFound = false;

    // We do a top-level key translation (e.g. Nav, FloatingCta, Fit...)
    for (const [namespace, strings] of Object.entries(sourceData)) {
      const sourceObj = strings as Record<string, string>;
      const targetObj = targetData[namespace] || {};
      
      const keysToTranslate: string[] = [];
      const textsToTranslate: string[] = [];

      for (const [key, text] of Object.entries(sourceObj)) {
        if (!targetObj[key]) {
          keysToTranslate.push(key);
          textsToTranslate.push(text as string);
        }
      }

      if (keysToTranslate.length === 0) continue;

      updatesFound = true;
      console.log(`Namespace: [${namespace}] -> translating ${keysToTranslate.length} missing keys...`);

      // Dynamically build Zod schema for missing keys
      const zodShape: Record<string, any> = {};
      keysToTranslate.forEach(k => { zodShape[k] = z.string() });

      try {
        const { object } = await generateObject({
          model: google('gemini-2.5-pro'),
          schema: z.object(zodShape),
          prompt: `You are an expert software localizer translating a highly premium wedding vendor platform from Korean into ${lang === 'en' ? 'English' : 'Japanese'}.
Maintain the exact variables like {brandName} if they exist. Use formal, trustworthy, and elegant language.
Translate the following short UI strings exactly mapping to the keys:
${keysToTranslate.map((k, idx) => `${k}: ${textsToTranslate[idx]}`).join('\n')}
          `
        });

        // Merge translation
        targetData[namespace] = { ...targetObj, ...object };
        console.log(`✅ [${namespace}] Translated keys: ${keysToTranslate.join(', ')}`);
        
      } catch (err) {
        console.error(`❌ Failed to translate namespace [${namespace}] for ${lang}`, err);
      }
    }

    if (updatesFound) {
      fs.writeFileSync(targetPath, JSON.stringify(targetData, null, 2) + '\n', 'utf8');
      console.log(`🎉 Saved ${lang}.json successfully!`);
    } else {
      console.log(`✨ [${lang}] is already fully synced with source.`);
    }
  }

  console.log('\n🏁 Static batch translation pipeline finished.');
}

translateJson().catch(console.error);
