import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  AboutHeroSection,
  AboutMarketSection,
  AboutPartnersStrip,
  AboutRoleSection,
  AboutStandardSection,
} from "@/components/sections/AboutStorySections";

export const metadata: Metadata = {
  title: "About NIP | NIP Reality",
  description:
    "One source. One system. One standard. NIP advisory for Dubai real estate — context, judgment, and a single standard across every step of the journey.",
};

export default function AboutPage() {
  return (
    <SiteShell>
      <AboutHeroSection />
      <AboutMarketSection />
      <AboutRoleSection />
      <AboutPartnersStrip />
      <AboutStandardSection />
    </SiteShell>
  );
}
