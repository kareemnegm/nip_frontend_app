import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  ConciergeChatSection,
  ConciergeHeroSection,
} from "@/components/sections/ConciergeStorySections";

export const metadata: Metadata = {
  title: "Ask the Concierge | NIP Reality",
  description:
    "Instant answers on communities, pricing, off-plan and the Golden Visa — and a direct line to a private advisor whenever you want one.",
};

export default function ConciergePage() {
  return (
    <SiteShell>
      <ConciergeHeroSection />
      <ConciergeChatSection />
    </SiteShell>
  );
}
