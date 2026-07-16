"use client";

import Link from "next/link";
import { Button, Icon } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { clientT, clientTPath } from "@/lib/i18n/client-messages";
import { useOptionalLocale } from "@/lib/i18n/context";

type ServerErrorSectionWithRetryProps = {
  onRetry: () => void;
};

export function ServerErrorSectionWithRetry({ onRetry }: ServerErrorSectionWithRetryProps) {
  const localeContext = useOptionalLocale();
  const locale = localeContext?.locale;
  const retrySource = clientT(locale, "forms", "signInFailedRetry");
  const retryLabel = retrySource.includes(". ")
    ? retrySource.split(". ").slice(1).join(". ")
    : retrySource;

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 pb-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error text-white">
            <Icon name="alertTriangle" className="h-7 w-7" />
          </span>

          <p className="mt-6 text-overline font-semibold uppercase tracking-[0.18em] text-error">
            {clientTPath(locale, "placeholders.serverError.eyebrow")}
          </p>

          <h1 className="mt-3 font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand">
            {clientTPath(locale, "placeholders.serverError.title")}
          </h1>

          <p className="mt-4 max-w-[680px] text-body-lg leading-[28px] text-ink-secondary">
            {clientTPath(locale, "placeholders.serverError.description")}
          </p>

          <div className="mt-10 flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <Button onClick={onRetry} className="flex-1 justify-center">
              {retryLabel}
            </Button>
            <Link
              href="/"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
            >
              {clientT(locale, "common", "backToHome")}
              <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
