import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { ThankYouSection } from "@/components/sections/ThankYouStorySections";

export const metadata: Metadata = {
  title: "Thank You | NIP Reality",
  description:
    "Your request has been received. A NIP Private Advisor will be in touch within one business day.",
};

export default function ThankYouPage() {
  return (
    <SiteShell>
      <ThankYouSection />
    </SiteShell>
  );
}
