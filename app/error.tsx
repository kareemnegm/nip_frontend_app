"use client";

import { SiteShell } from "@/components/SiteShell";
import { ServerErrorSection } from "@/components/sections/ServerErrorStorySections";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <SiteShell>
      <ServerErrorSection onRetry={reset} />
    </SiteShell>
  );
}
