import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { SectionHeading } from "@/components/sections";
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  FactsStrip,
  Icon,
  ImagePlaceholder,
  PropertyCard,
} from "@/components/ui";
import { propertyFacts, sampleProperties } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Property Story | NIP Reality",
};

const amenities = [
  "Infinity Pool",
  "Basketball Court",
  "Concierge",
  "Flower Garden",
  "Fitness Centre",
  "BBQ Area",
  "Kids Area",
  "Cycling Trail",
  "Valet Parking",
];

export default function PropertyStoryPage() {
  return (
    <SiteShell>
      <section className="w-full bg-surface">
        <Container className="py-10 sm:py-12">
          <Breadcrumbs
            items={[
              { label: "Properties", href: "/properties" },
              { label: "Apartments", href: "/properties" },
              { label: "Sheikh Zayed Road" },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>Apartment</Badge>
                <Badge>For Sale</Badge>
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
                Trump International Hotel &amp; Tower
              </h1>
              <p className="mt-3 flex items-center gap-1 text-sm text-ink-secondary">
                <Icon name="mapPin" className="h-4 w-4 text-brand" />
                Sheikh Zayed Road, Dubai
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Guide Price
              </p>
              <p className="mt-2 text-2xl font-bold text-brand">AED 2,658,000</p>
              <Button href="/contact" className="mt-4">
                Request Private Advisory
              </Button>
            </div>
          </div>

          <div className="mt-8 grid gap-4 lg:grid-cols-[2fr_1fr]">
            <ImagePlaceholder className="aspect-[16/10]" />
            <div className="grid gap-4">
              <ImagePlaceholder className="aspect-[16/10]" />
              <ImagePlaceholder className="aspect-[16/10]" />
            </div>
          </div>

          <FactsStrip items={propertyFacts} className="mt-8" />

          <div className="mt-12 grid gap-10 lg:grid-cols-[2fr_1fr]">
            <div className="space-y-10">
              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
                  The Story
                </h2>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-ink-secondary">
                  {
                    "A landmark residence on Sheikh Zayed Road, pairing branded service with skyline views and a position at the centre of the city's commercial spine. Interiors are delivered to a turn-key standard, with floor-to-ceiling glazing and a layout tuned for both living and long-let yield."
                  }
                </p>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
                  Amenities
                </h2>
                <div className="mt-4 flex flex-wrap gap-2">
                  {amenities.map((amenity) => (
                    <span
                      key={amenity}
                      className="inline-flex items-center gap-2 rounded-full border border-line px-3 py-1.5 text-xs text-ink-secondary"
                    >
                      <Icon name="check" className="h-3.5 w-3.5 text-brand" />
                      {amenity}
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
                  Location
                </h2>
                <ImagePlaceholder
                  icon="mapPin"
                  className="mt-4 aspect-[16/7]"
                />
              </div>
            </div>

            <aside className="lg:sticky lg:top-28 lg:self-start">
              <div className="rounded-[var(--radius-card)] border border-line bg-sapphire-50 p-6">
                <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                  Arrange a Viewing
                </p>
                <p className="mt-3 text-sm text-ink-secondary">
                  Speak with the advisor handling this residence.
                </p>
                <div className="mt-5 flex items-center gap-3">
                  <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
                    <Icon name="user" className="h-5 w-5" />
                  </span>
                  <div>
                    <p className="text-sm font-bold text-brand">NIP Private Advisory</p>
                    <p className="text-xs text-ink-tertiary">
                      Responds within 1 business day
                    </p>
                  </div>
                </div>
                <div className="mt-5 space-y-3">
                  <Button href="/contact" className="w-full">
                    Request Details
                  </Button>
                  <Button href="/contact" variant="outline" className="w-full">
                    Speak with NIP
                  </Button>
                </div>
              </div>
            </aside>
          </div>
        </Container>
      </section>

      <section className="w-full bg-sapphire-50">
        <Container className="py-16 sm:py-20">
          <SectionHeading
            title="Similar Properties"
            description="A few residences with a comparable profile and position."
          />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleProperties.slice(0, 3).map((property, index) => (
              <PropertyCard key={`similar-${index}`} {...property} />
            ))}
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
