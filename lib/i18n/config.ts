export const locales = ["en", "ar"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

export const localeNames: Record<Locale, string> = {
  en: "English",
  ar: "العربية",
};

export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ar: "AR",
};

export type LocaleDirection = "ltr" | "rtl";

export const localeDirections: Record<Locale, LocaleDirection> = {
  en: "ltr",
  ar: "rtl",
};

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}

export function getDirection(locale: Locale): LocaleDirection {
  return localeDirections[locale];
}

export const LOCALE_COOKIE = "nip-locale";
