"use client";

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

/** Matches Figma T16c · 500 (1525:27396); adds outline “Try again” for the error boundary. */
export function ServerErrorSectionWithRetry({ onRetry }: ServerErrorSectionWithRetryProps) {
  const localeContext = useOptionalLocale();
  const locale = localeContext?.locale;
  const retrySource = clientT(locale, "forms", "signInFailedRetry");
  const retryLabel = retrySource.includes(". ")
    ? retrySource.split(". ").slice(1).join(". ")
    : retrySource;

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 lg:py-[140px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-[18px] text-center">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-error p-2.5 text-white">
            <Icon name="alertTriangle" className="h-8 w-8" />
          </span>

          <p className="text-overline font-semibold uppercase text-error">
            {clientTPath(locale, "placeholders.serverError.eyebrow")}
          </p>

          <h1 className="font-display font-normal uppercase text-brand text-display-sm sm:text-display-lg">
            {clientTPath(locale, "placeholders.serverError.title")}
          </h1>

          <p className="max-w-[520px] text-body-sm text-ink-tertiary">
            {clientTPath(locale, "placeholders.serverError.description")}
          </p>

          <div className="flex w-full max-w-[400px] flex-row items-stretch gap-3">
            <Button href="/" className="min-w-0 flex-1 basis-0 justify-center">
              {clientT(locale, "common", "backToHome")}
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={onRetry}
              className="min-w-0 flex-1 basis-0 justify-center"
            >
              {retryLabel}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
