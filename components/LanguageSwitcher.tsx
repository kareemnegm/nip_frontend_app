"use client";

import { AppLink as Link } from "@/components/AppLink";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/cn";
import { Icon } from "./ui/Icon";
import {
  localeLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { switchLocalePathname } from "@/lib/i18n/helpers";
import { useLocale } from "@/lib/i18n/context";
import { TEMP_HIDE_AR_LANGUAGE_SWITCH } from "@/lib/temporary-ui-flags";

type LanguageSwitcherProps = {
  className?: string;
  variant?: "header" | "compact";
};

export function LanguageSwitcher({
  className,
  variant = "header",
}: LanguageSwitcherProps) {
  const { locale: currentLocale } = useLocale();
  const pathname = usePathname();
  const switcherLocales = TEMP_HIDE_AR_LANGUAGE_SWITCH
    ? locales.filter((locale) => locale !== "ar")
    : [...locales];

  if (switcherLocales.length <= 1) {
    return null;
  }

  if (variant === "compact") {
    return (
      <div className={cn("flex items-center gap-1.5", className)}>
        {switcherLocales.map((locale, index) => (
          <span key={locale} className="inline-flex items-center gap-1.5">
            {index > 0 ? (
              <span className="text-ink-secondary" aria-hidden>
                |
              </span>
            ) : null}
            <LocaleLink
              locale={locale}
              pathname={pathname}
              currentLocale={currentLocale}
              compact
            />
          </span>
        ))}
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-[var(--radius-field)] px-2.5 py-2",
        className,
      )}
    >
      <Icon name="globe" className="h-[18px] w-[18px] shrink-0 text-sapphire-600" />
      {switcherLocales.map((locale, index) => (
        <span key={locale} className="inline-flex items-center gap-1.5">
          {index > 0 ? (
            <span className="h-3 w-px shrink-0 bg-ink-secondary" aria-hidden />
          ) : null}
          <LocaleLink
            locale={locale}
            pathname={pathname}
            currentLocale={currentLocale}
          />
        </span>
      ))}
    </div>
  );
}

function LocaleLink({
  locale,
  pathname,
  currentLocale,
  compact = false,
}: {
  locale: Locale;
  pathname: string;
  currentLocale: Locale;
  compact?: boolean;
}) {
  const isActive = locale === currentLocale;
  const href = switchLocalePathname(pathname, locale);

  return (
    <Link
      href={href}
      hrefLang={locale}
      lang={locale}
      aria-current={isActive ? "true" : undefined}
      className={cn(
        "text-overline font-semibold leading-4 transition-colors",
        compact
          ? isActive
            ? "text-sapphire-600"
            : "text-ink-secondary hover:text-brand"
          : isActive
            ? "text-sapphire-600"
            : "text-ink-secondary hover:text-brand",
      )}
    >
      {localeLabels[locale]}
    </Link>
  );
}
