"use client";

import { createContext, useContext, useEffect } from "react";
import {
  getDirection,
  type Locale,
  type LocaleDirection,
} from "./config";

type LocaleContextValue = {
  locale: Locale;
  direction: LocaleDirection;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: React.ReactNode;
}) {
  const direction = getDirection(locale);

  useEffect(() => {
    document.documentElement.lang = locale;
    document.documentElement.dir = direction;
  }, [locale, direction]);

  return (
    <LocaleContext.Provider value={{ locale, direction }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale(): LocaleContextValue {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error("useLocale must be used within LocaleProvider");
  }
  return context;
}

export function useOptionalLocale(): LocaleContextValue | null {
  return useContext(LocaleContext);
}
