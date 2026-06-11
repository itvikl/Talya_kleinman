'use client';

import { createContext, useContext } from 'react';
import type { SiteSettings } from '@/types/database';

const SettingsContext = createContext<SiteSettings | null>(null);

export function SiteSettingsProvider({
  settings,
  children,
}: {
  settings: SiteSettings;
  children: React.ReactNode;
}) {
  return (
    <SettingsContext.Provider value={settings}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSiteSettings(): SiteSettings | null {
  return useContext(SettingsContext);
}
