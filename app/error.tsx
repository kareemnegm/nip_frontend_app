"use client";

import { SiteShellClient } from "@/components/SiteShellClient";
import { ServerErrorSectionWithRetry } from "@/components/sections/ServerErrorStorySections.client";
import { LocaleProvider } from "@/lib/i18n/context";
import { defaultLocale } from "@/lib/i18n/config";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <LocaleProvider locale={defaultLocale}>
      <SiteShellClient>
        <ServerErrorSectionWithRetry onRetry={reset} />
      </SiteShellClient>
    </LocaleProvider>
  );
}
