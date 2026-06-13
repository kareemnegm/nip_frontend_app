import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  AreaAboutSection,
  AreaCardSection,
  AreaExploreCta,
  AreaHero,
  AreaMapSection,
} from "@/components/sections/AreaStorySections";
import { FactsStrip, OffPlanCard, PropertyCard } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { areaFacts, sampleOffPlan, sampleProperties } from "@/components/placeholders";
import { cn } from "@/lib/cn";
import type { IconName } from "@/components/ui/Icon";

export const metadata: Metadata = {
  title: "Palm Jumeirah | Areas | NIP Reality",
  description:
    "Explore Palm Jumeirah — beachfront living, branded residences, off-plan projects and available properties.",
};

const areaName = "Palm Jumeirah";

const aboutCopy =
  "An engineering landmark turned lifestyle benchmark, Palm Jumeirah pairs private beach frontage with branded residences from the world's leading hospitality names. The Crescent holds the resorts; the fronds hold the villas; the trunk carries apartments and the everyday rhythm of island life.";

const areaHighlights: Array<{ label: string; icon: IconName }> = [
  { label: "Private Beaches", icon: "mapPin" },
  { label: "Branded Residences", icon: "building" },
  { label: "Fine Dining", icon: "plus" },
  { label: "Marina Berths", icon: "home" },
  { label: "Five-Star Resorts", icon: "check" },
  { label: "Family Villas", icon: "user" },
];

const connectivity: Array<{ label: string; icon: IconName }> = [
  { label: "Airport · 25 min", icon: "building" },
  { label: "Downtown · 20 min", icon: "building" },
  { label: "Marina · 10 min", icon: "mapPin" },
  { label: "Metro link · 8 min", icon: "grid" },
];

export default function AreaPage() {
  return (
    <SiteShell>
      <AreaHero
        title={areaName}
        description="The world's defining man-made island — Beachfront living, branded residences and a postcard address."
      />

      <section className="bg-white py-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <FactsStrip items={areaFacts} variant="property" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-14">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <AreaAboutSection
            title={`About ${areaName}`}
            body={aboutCopy}
            highlights={areaHighlights}
          />
        </div>
      </section>

      <AreaCardSection
        eyebrow={`OFF-PLAN IN ${areaName.toUpperCase()}`}
        title="Projects in This Area"
        variant="wide"
      >
        {sampleOffPlan.slice(0, 3).map((project, index) => (
          <OffPlanCard key={`area-project-${index}`} {...project} />
        ))}
      </AreaCardSection>

      <AreaCardSection
        eyebrow={`FOR SALE IN ${areaName.toUpperCase()}`}
        title="Available Properties"
        variant="standard"
      >
        {sampleProperties.slice(0, 3).map((property, index) => (
          <PropertyCard key={`area-property-${index}`} {...property} />
        ))}
      </AreaCardSection>

      <section className="bg-white pb-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <AreaMapSection connectivity={connectivity} />
        </div>
      </section>

      <AreaExploreCta areaName={areaName} />
    </SiteShell>
  );
}
