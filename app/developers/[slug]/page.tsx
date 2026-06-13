import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  DeveloperAboutSection,
  DeveloperAdvisoryCta,
  DeveloperCommunitiesSection,
  DeveloperHero,
  DeveloperPortfolioSection,
} from "@/components/sections/DeveloperStorySections";
import { CommunityCard, FactsStrip, OffPlanCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import {
  developerFacts,
  sampleCommunities,
  sampleOffPlan,
} from "@/components/placeholders";
import { cn } from "@/lib/cn";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Emaar Properties | Developers | NIP Reality",
  description:
    "Emaar Properties — master developer behind Downtown Dubai, Dubai Marina and Dubai Hills.",
};

const developerName = "Emaar";
const developerTitle = "Emaar Properties";

const heroDescription =
  "The developer behind Downtown Dubai, Dubai Marina and Dubai Hills — defining the city's most recognised communities since 1997.";

const aboutCopy =
  "Emaar is the master developer most associated with modern Dubai — from the Burj Khalifa and Downtown to the master-planned communities that set the benchmark for amenity, build quality and resale strength. For NIP clients, an Emaar address typically means liquidity, brand assurance and dependable handover.";

const strengths: Array<{ label: string; icon: IconName }> = [
  { label: "Iconic Master Plans", icon: "building" },
  { label: "Reliable Handover", icon: "calendar" },
  { label: "Strong Resale", icon: "percent" },
  { label: "Branded Partnerships", icon: "check" },
  { label: "Amenity-Led", icon: "user" },
  { label: "Global Track Record", icon: "globe" },
];

export default function DeveloperPage() {
  return (
    <SiteShell>
      <DeveloperHero
        title={developerTitle}
        description={heroDescription}
        logoText="EMAAR"
      />

      <section className="bg-white py-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <FactsStrip items={developerFacts} variant="property" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-14">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <DeveloperAboutSection body={aboutCopy} strengths={strengths} />
        </div>
      </section>

      <DeveloperPortfolioSection developerName={developerName}>
        {sampleOffPlan.map((project, index) => (
          <OffPlanCard key={`dev-project-${index}`} {...project} />
        ))}
      </DeveloperPortfolioSection>

      <DeveloperCommunitiesSection developerName={developerName}>
        {sampleCommunities.map((community, index) => (
          <CommunityCard key={`dev-community-${index}`} {...community} />
        ))}
      </DeveloperCommunitiesSection>

      <DeveloperAdvisoryCta developerName={developerName} />
    </SiteShell>
  );
}
