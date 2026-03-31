'use client';

import React, { createContext, useContext } from 'react';
import { VibeSpec, VIBE_DICTIONARY } from './vibe-registry';

const VibeContext = createContext<VibeSpec>(VIBE_DICTIONARY['default-vibe-target']);

export function useVibe() {
  return useContext(VibeContext);
}

interface Props {
  vibeId: string;
  children: React.ReactNode;
}

export function VibeProvider({ vibeId, children }: Props) {
  const spec = VIBE_DICTIONARY[vibeId] || VIBE_DICTIONARY['default-vibe-target'];

  // 테넌트 고유의 CSS Variables(토큰) 조립
  const cssVariables = `
    html, body {
      background-color: ${spec.colors.background} !important;
      color: ${spec.colors.textMain} !important;
    }
    .vibe-theme {
      --brand-primary: ${spec.colors.primary};
      --brand-secondary: ${spec.colors.secondary};
      --brand-surface: ${spec.colors.surface};
      --brand-bg: ${spec.colors.background};
      --brand-text-main: ${spec.colors.textMain};
      --brand-text-muted: ${spec.colors.textMuted};
      --brand-accent: ${spec.colors.accent};
      --brand-radius: ${spec.shape.borderRadius};
    }
  `;

  return (
    <VibeContext.Provider value={spec}>
      <style suppressHydrationWarning>{cssVariables}</style>
      <div className={`vibe-theme min-h-screen bg-[var(--brand-bg)] text-[var(--brand-text-main)] ${spec.typography.fontFamilyClass}`}>
        {children}
      </div>
    </VibeContext.Provider>
  );
}
