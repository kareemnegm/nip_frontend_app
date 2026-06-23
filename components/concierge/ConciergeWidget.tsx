"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LocalizedLink } from "@/components/LocalizedLink";
import { Icon } from "@/components/ui";
import { getConciergeConfig } from "@/lib/api/concierge";
import { cn } from "@/lib/cn";
import { useLocale } from "@/lib/i18n/context";
import { stripLocaleFromPathname } from "@/lib/i18n/helpers";
import type { ConciergeConfig } from "@/types/api/concierge";
import { ConciergeChat } from "./ConciergeChat";

const HIDDEN_PATH_PREFIXES = ["/admin"];
const HIDDEN_EXACT_PATHS = ["/concierge"];

function shouldHideWidget(pathname: string) {
  const path = stripLocaleFromPathname(pathname);
  if (HIDDEN_EXACT_PATHS.includes(path)) return true;
  return HIDDEN_PATH_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  );
}

export function ConciergeWidget() {
  const pathname = usePathname();
  const { locale } = useLocale();
  const t = useTranslations("pages.concierge");
  const [open, setOpen] = useState(false);
  const [config, setConfig] = useState<ConciergeConfig | null>(null);

  const hidden = shouldHideWidget(pathname);

  useEffect(() => {
    let cancelled = false;

    void getConciergeConfig(locale)
      .then((next) => {
        if (!cancelled) setConfig(next);
      })
      .catch(() => {
        if (!cancelled) setConfig(null);
      });

    return () => {
      cancelled = true;
    };
  }, [locale]);

  if (hidden) {
    return null;
  }

  const showLauncher = config?.enabled !== false;

  if (!showLauncher) {
    return (
      <LocalizedLink
        href={config?.speakToAdvisorUrl ?? "/contact"}
        className="fixed bottom-6 end-6 z-[61] inline-flex items-center gap-2 rounded-full border border-line bg-white px-5 py-3 text-body-sm font-semibold text-brand shadow-[var(--shadow-card)] transition hover:border-brand-hover"
      >
        {t("contactFab")}
      </LocalizedLink>
    );
  }

  return (
    <>
      {open ? (
        <div
          className="fixed inset-0 z-[60] bg-black/20 sm:bg-transparent"
          aria-hidden
          onClick={() => setOpen(false)}
        />
      ) : null}

      <div
        className={cn(
          "fixed bottom-6 end-6 z-[61] flex flex-col items-end gap-3",
          open && "w-[min(100vw-2rem,400px)]",
        )}
      >
        {open ? (
          <div className="flex w-full flex-col overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <div className="flex items-center justify-between border-b border-line px-4 py-3">
              <p className="text-body-sm font-semibold text-brand">
                {t("launcherLabel")}
              </p>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="rounded p-1 text-ink-secondary transition-colors hover:bg-surface-muted hover:text-brand"
                aria-label={t("closePanel")}
              >
                <Icon name="close" className="h-5 w-5" />
              </button>
            </div>
            <ConciergeChat
              variant="panel"
              autoStartSession
              className="rounded-none border-0 shadow-none"
            />
          </div>
        ) : null}

        <button
          type="button"
          onClick={() => setOpen((value) => !value)}
          className="inline-flex items-center gap-2 rounded-full bg-brand px-5 py-3 text-body-sm font-semibold text-white shadow-[var(--shadow-card)] transition hover:bg-brand-hover"
          aria-expanded={open}
          aria-label={t("launcherLabel")}
        >
          <Icon name="mail" className="h-5 w-5" />
          <span className="hidden sm:inline">{t("launcherLabel")}</span>
        </button>
      </div>
    </>
  );
}
