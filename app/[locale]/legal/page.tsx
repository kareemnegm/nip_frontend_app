import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  LegalContentSection,
  LegalHeroSection,
} from "@/components/sections/LegalStorySections";

export const metadata: Metadata = {
  title: "Privacy Policy | NIP Reality",
  description:
    "How Novel Insight Property collects, uses and protects your information when you use our website and advisory services.",
};

export default function LegalPage() {
  return (
    <SiteShell>
      <LegalHeroSection />
      <LegalContentSection />
    </SiteShell>
  );
}
