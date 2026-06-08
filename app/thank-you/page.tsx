import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { StatusScreen } from "@/components/sections";
import { Button, Icon } from "@/components/ui";

export const metadata: Metadata = {
  title: "Thank You | NIP Reality",
};

export default function ThankYouPage() {
  return (
    <SiteShell>
      <StatusScreen
        icon="check"
        iconTone="success"
        eyebrow="Request Received"
        title="Thank You"
        description="We've received your Request. A Private Advisor will be in touch within One Business Day."
        actions={
          <>
            <Button href="/">Back to Home</Button>
            <Button href="/insights" variant="accent">
              Explore Insights <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </>
        }
      />
    </SiteShell>
  );
}
