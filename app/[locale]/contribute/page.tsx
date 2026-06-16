import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  ContributeFormSection,
  ContributeHeroSection,
} from "@/components/sections/ContributeStorySections";

export const metadata: Metadata = {
  title: "Contribute an Insight | NIP Reality",
  description:
    "Share market perspective with the NIP audience. Submissions are reviewed by our editorial team before publication.",
};

export default function ContributePage() {
  return (
    <SiteShell>
      <ContributeHeroSection />
      <ContributeFormSection />
    </SiteShell>
  );
}
