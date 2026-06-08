import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, SectionHeading } from "@/components/sections";
import {
  Badge,
  Breadcrumbs,
  Button,
  Container,
  FactsStrip,
  Icon,
  ImagePlaceholder,
  OffPlanCard,
} from "@/components/ui";
import type { FactItem } from "@/components/ui/FactsStrip";
import { sampleOffPlan } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Project Story | NIP Reality",
};

const projectFacts: FactItem[] = [
  { label: "Developer", value: "Emaar", icon: "building" },
  { label: "Handover", value: "Q4 2026", icon: "calendar" },
  { label: "Unit Types", value: "1-4 Bed", icon: "bed" },
  { label: "Starting Price", value: "AED 4.71M", icon: "currency" },
  { label: "Status", value: "Off-Plan", icon: "home" },
  { label: "Approval", value: "DLD Registered", icon: "check" },
];

const paymentPlan = [
  { percent: "10%", label: "On Booking" },
  { percent: "20%", label: "During Construction" },
  { percent: "30%", label: "Construction" },
  { percent: "40%", label: "On Handover" },
];

const units = [
  { type: "1 Bedroom", size: "720 - 845", price: "AED 4,710,000" },
  { type: "2 Bedroom", size: "1,250 - 1,520", price: "AED 6,100,000" },
  { type: "3 Bedroom", size: "1,900 - 2,180", price: "AED 9,400,000" },
  { type: "4 Bed Penthouse", size: "3,500+", price: "AED 18,720,000" },
];

const amenities = [
  "Private Beach",
  "Infinity Pools",
  "Signature Spa",
  "Residents' Lounge",
  "Concierge",
  "Marina Access",
];

export default function ProjectStoryPage() {
  return (
    <SiteShell>
      <section className="w-full bg-surface">
        <Container className="py-10 sm:py-12">
          <Breadcrumbs
            items={[
              { label: "Off-Plan", href: "/off-plan" },
              { label: "Palm Jumeirah", href: "/off-plan" },
              { label: "Armani Beach Residences" },
            ]}
          />

          <div className="mt-6 flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <div className="flex flex-wrap gap-2">
                <Badge>Off-Plan</Badge>
                <Badge tone="brand">On 2026 Handover</Badge>
              </div>
              <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
                Armani Beach Residences
              </h1>
              <p className="mt-3 flex items-center gap-1 text-sm text-ink-secondary">
                <Icon name="mapPin" className="h-4 w-4 text-brand" />
                Palm Jumeirah, Dubai | by Emaar
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Starting From
              </p>
              <p className="mt-2 text-2xl font-bold text-brand">AED 4,710,000</p>
              <Button href="/contact" className="mt-4">
                Register Interest
              </Button>
            </div>
          </div>

          <ImagePlaceholder className="mt-8 aspect-[16/7]" />

          <FactsStrip items={projectFacts} className="mt-8" />

          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
              Payment Plan
            </h2>
            <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {paymentPlan.map((stage) => (
                <div
                  key={stage.label}
                  className="rounded-[var(--radius-card)] bg-brand px-6 py-7 text-white"
                >
                  <p className="text-3xl font-bold">{stage.percent}</p>
                  <p className="mt-2 text-xs text-white/70">{stage.label}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
              Available Units
            </h2>
            <div className="mt-5 overflow-x-auto rounded-[var(--radius-card)] border border-line">
              <table className="w-full min-w-[480px] text-left text-sm">
                <thead className="bg-brand text-white">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Unit Type</th>
                    <th className="px-5 py-3 font-semibold">Size (sqft)</th>
                    <th className="px-5 py-3 font-semibold">Starting Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-line bg-white">
                  {units.map((unit) => (
                    <tr key={unit.type}>
                      <td className="px-5 py-4 font-semibold text-ink">{unit.type}</td>
                      <td className="px-5 py-4 text-ink-secondary">{unit.size}</td>
                      <td className="px-5 py-4 text-ink-secondary">{unit.price}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mt-12">
            <h2 className="font-[family-name:var(--font-display)] text-2xl font-semibold text-brand sm:text-3xl">
              Masterplan &amp; Location
            </h2>
            <ImagePlaceholder icon="mapPin" className="mt-5 aspect-[16/7]" />
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
        </Container>
      </section>

      <CtaBand
        eyebrow="Register Your Interest"
        title="Early Access to Units and Payment Plans"
        actions={<Button href="/contact" variant="accent">Speak with NIP</Button>}
      />

      <section className="w-full bg-sapphire-50">
        <Container className="py-16 sm:py-20">
          <SectionHeading title="More Off-Plan Projects" />
          <div className="mt-10 grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {sampleOffPlan.slice(0, 3).map((project, index) => (
              <OffPlanCard key={`more-offplan-${index}`} {...project} />
            ))}
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
