import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  CuratedAdvisorBarSection,
  CuratedHeroSection,
  CuratedNotesSection,
  CuratedSelectionSection,
} from "@/components/sections/CuratedStorySections";

export const metadata: Metadata = {
  title: "Curated for You | NIP Reality",
  description:
    "A confidential selection of properties and projects aligned with your mandate. Curated, never catalogued. Released by your advisor as relevant.",
};

export default function CuratedPage() {
  return (
    <SiteShell>
      <CuratedHeroSection />
      <CuratedSelectionSection />
      <CuratedNotesSection />
      <CuratedAdvisorBarSection />
    </SiteShell>
  );
}
