import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  InsightsHubHero,
  InsightsHubMainSection,
} from "@/components/sections/InsightsHubSections";

export const metadata: Metadata = {
  title: "Insights | NIP Reality",
  description:
    "Considered perspective on the communities, projects and policy shaping long-term value across Dubai.",
};

export default function InsightsPage() {
  return (
    <SiteShell>
      <InsightsHubHero />
      <InsightsHubMainSection />
    </SiteShell>
  );
}
