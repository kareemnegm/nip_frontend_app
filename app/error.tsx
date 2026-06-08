"use client";

import { SiteShell } from "@/components/SiteShell";
import { StatusScreen } from "@/components/sections";
import { Button } from "@/components/ui";

export default function GlobalError({ reset }: { reset: () => void }) {
  return (
    <SiteShell>
      <StatusScreen
        icon="alertTriangle"
        iconTone="error"
        eyebrow="Error 500"
        title="Something Went Wrong"
        description="We're looking into it. Please try again shortly — Your Data is Safe."
        actions={
          <>
            <Button onClick={reset}>Try Again</Button>
            <Button href="/" variant="accent">
              Back to Home
            </Button>
          </>
        }
      />
    </SiteShell>
  );
}
