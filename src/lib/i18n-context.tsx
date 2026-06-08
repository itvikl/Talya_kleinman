'use client';

import { createContext, useContext } from 'react';

type Messages = Record<string, unknown>;

function resolve(obj: Messages, path: string): string {
  const parts = path.split('.');
  let current: unknown = obj;
  for (const part of parts) {
    if (current && typeof current === 'object') {
      current = (current as Messages)[part];
    } else {
      return path;
    }
  }
  return typeof current === 'string' ? current : path;
}

const I18nContext = createContext<{ messages: Messages; locale: string }>({
  messages: {},
  locale: 'he',
});

export function I18nProvider({
  messages,
  locale,
  children,
}: {
  messages: Record<string, unknown>;
  locale: string;
  children: React.ReactNode;
}) {
  return (
    <I18nContext.Provider value={{ messages, locale }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useT() {
  const { messages } = useContext(I18nContext);
  return (key: string) => resolve(messages, key);
}

export function useLocale() {
  return useContext(I18nContext).locale;
}
