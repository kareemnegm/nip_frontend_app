import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  PropertyGallery,
  PropertyStoryContent,
  PropertyViewingCard,
} from "@/components/sections/PropertyStorySections";
import {
  Badge,
  Breadcrumbs,
  Button,
  FactsStrip,
  Icon,
  PropertyCard,
} from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { propertyFacts, sampleProperties } from "@/components/placeholders";
import { cn } from "@/lib/cn";

export const metadata: Metadata = {
  title: "Trump International Hotel & Tower | NIP Reality",
  description:
    "Property story for Trump International Hotel & Tower on Sheikh Zayed Road, Dubai.",
};

export default function PropertyStoryPage() {
  return (
    <SiteShell>
      <section className="bg-white pb-6 pt-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <div className="flex flex-col items-start justify-between gap-8 lg:flex-row lg:items-end">
              <div className="flex max-w-[614px] flex-col gap-5">
                <Breadcrumbs
                  format="property"
                  items={[
                    { label: "Properties", href: "/properties" },
                    { label: "Apartments", href: "/properties" },
                    { label: "Sheikh Zayed Road" },
                  ]}
                />
                <div className="flex flex-wrap gap-2">
                  <Badge tone="property">Apartment</Badge>
                  <Badge tone="property">For Sale</Badge>
                </div>
                <h1 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
                  Trump International Hotel &amp; Tower
                </h1>
                <p className="flex items-center gap-1.5 text-body-sm text-ink-tertiary">
                  <Icon
                    name="mapPin"
                    className="h-3.5 w-3.5 shrink-0 text-brand"
                  />
                  Sheikh Zayed Road, Dubai
                </p>
              </div>

              <div className="flex flex-col items-start gap-4 lg:items-end">
                <p className="text-[11px] font-medium leading-[14px] text-basalt-300 lg:text-right">
                  GUIDE PRICE
                </p>
                <p className="flex items-center gap-2 text-[30px] font-bold leading-[38px] text-brand">
                  <Icon name="currency" className="h-6 w-6 shrink-0" />
                  2,658,000
                </p>
                <Button href="/contact" className="w-full sm:w-auto">
                  Request Private Advisory
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white pb-8">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <PropertyGallery />
          </div>
        </div>
      </section>

      <section className="bg-white pb-10">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={sitePageInnerClassName}>
            <FactsStrip items={propertyFacts} variant="property" />
          </div>
        </div>
      </section>

      <section className="bg-white pb-[72px]">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div
            className={cn(
              sitePageInnerClassName,
              "flex flex-col gap-12 lg:flex-row lg:gap-24",
            )}
          >
            <PropertyStoryContent />
            <PropertyViewingCard />
          </div>
        </div>
      </section>

      <section className="bg-surface-muted pb-20 pt-16">
        <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
          <div className={cn(sitePageInnerClassName, "space-y-7")}>
            <p className="text-center text-overline font-semibold leading-4 text-accent">
              SIMILAR PROPERTIES
            </p>
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {sampleProperties.slice(0, 3).map((property, index) => (
                <PropertyCard key={`similar-${index}`} {...property} />
              ))}
            </div>
          </div>
        </div>
      </section>
    </SiteShell>
  );
}
