import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import {
  Container,
  Icon,
  Pagination,
  PropertyCard,
} from "@/components/ui";
import { PropertyFilterBar } from "@/components/ui/SearchBars";
import { sampleProperties } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Properties | NIP Reality",
};

export default function PropertiesPage() {
  return (
    <SiteShell>
      <section className="w-full bg-sapphire-50">
        <Container className="py-12 sm:py-14 lg:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Properties | Discovery
          </p>
          <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight text-brand sm:text-5xl lg:text-6xl">
            Find Your Place in Dubai
          </h1>
          <div className="mt-8">
            <PropertyFilterBar />
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <p className="text-sm text-ink-secondary">128 properties | Dubai</p>
            <div className="flex items-center gap-3">
              <span className="text-sm text-ink-tertiary">Sort: Newest</span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)] bg-brand text-white">
                <Icon name="grid" className="h-4 w-4" />
              </span>
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-field)] border border-line text-ink-secondary">
                <Icon name="list" className="h-4 w-4" />
              </span>
            </div>
          </div>

          <div className="mt-8 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleProperties.map((property, index) => (
              <PropertyCard key={`property-${index}`} {...property} />
            ))}
          </div>

          <Pagination className="mt-12" />
        </Container>
      </section>
    </SiteShell>
  );
}
