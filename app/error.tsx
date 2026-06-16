"use client";

import { SiteShellClient } from "@/components/SiteShellClient";
import { ServerErrorSection } from "@/components/sections/ServerErrorStorySections";
import { LocaleProvider } from "@/lib/i18n/context";
import { defaultLocale } from "@/lib/i18n/config";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <LocaleProvider locale={defaultLocale}>
      <SiteShellClient>
        <ServerErrorSection onRetry={reset} />
      </SiteShellClient>
    </LocaleProvider>
  );
}
