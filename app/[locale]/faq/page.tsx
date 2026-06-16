import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  FaqAccordionSection,
  FaqCtaSection,
  FaqHeroSection,
} from "@/components/sections/FaqStorySections";

export const metadata: Metadata = {
  title: "FAQ | NIP Reality",
  description:
    "Everything you need to know about working with NIP — buying, off-plan, the Golden Visa and our private advisory.",
};

export default async function FaqPage() {
  return (
    <SiteShell>
      <FaqHeroSection />
      <FaqAccordionSection />
      <FaqCtaSection />
    </SiteShell>
  );
}
