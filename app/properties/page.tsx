import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { sampleProperties } from "@/components/placeholders";
import {
  Pagination,
  PropertyCard,
  PropertyFilterBar,
  PropertyResultsToolbar,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Properties | NIP Reality",
  description:
    "Search and discover curated properties across Dubai with NIP Reality.",
};

export default function PropertiesPage() {
  return (
    <SiteShell>
      <section
        data-site-hero
        className="bg-surface-muted pt-16 pb-9"
      >
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-6")}>
            <div className="space-y-2">
              <p className="text-overline font-semibold leading-4 text-accent">
                PROPERTIES | DISCOVERY
              </p>
              <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-brand">
                Find your Place in Dubai
              </h1>
            </div>
            <PropertyFilterBar />
          </div>
        </div>
      </section>

      <section className="bg-white pb-[72px] pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-6")}>
            <PropertyResultsToolbar />

            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sampleProperties.map((property, index) => (
                <PropertyCard key={`property-${index}`} {...property} />
              ))}
            </div>

            <Pagination />
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
