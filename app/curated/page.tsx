import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { AdvisorCard, Button, Container, Icon } from "@/components/ui";
import { sampleAdvisorSelection } from "@/components/placeholders";

export const metadata: Metadata = {
  title: "Curated for You | NIP Reality",
};

const advisorNotes = [
  {
    title: "Why this Palm Jumeirah residence",
    date: "22 May",
    body: "Pre-launch access secured. Direct frontage and a layout that holds long-term resale strength. Pricing in line with comparable releases — I would not extend beyond the next two phases.",
  },
  {
    title: "A note on the Creek Harbour project",
    date: "18 May",
    body: "Handover Q3 next year, payment plan back-weighted at 60/40 — comfortable structure for your mandate. Worth a private viewing before the next phase opens.",
  },
  {
    title: "Excluded from view",
    date: "15 May",
    body: "Two off-plan launches in Business Bay were considered and set aside. Build quality concerns based on developer's recent deliveries. Available to discuss if of interest.",
  },
];

export default function CuratedPage() {
  return (
    <SiteShell>
      <section className="w-full bg-gradient-to-b from-sapphire-800 to-brand text-white">
        <Container className="py-12 sm:py-16">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-gold">
                Private Office | Curated for You
              </p>
              <p className="mt-2 text-xs uppercase tracking-wide text-white/60">
                By Introduction Only
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-4xl font-semibold tracking-tight sm:text-5xl">
                Selected for You, by Your Advisor
              </h1>
              <p className="mt-4 max-w-2xl text-sm leading-7 text-white/75">
                {
                  "A confidential selection of properties and projects aligned with your mandate. Curated, never catalogued. Released by your advisor as relevant."
                }
              </p>
            </div>
            <div className="lg:text-right">
              <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/60">
                Your Advisor
              </p>
              <p className="mt-2 text-lg font-bold">Sara N.</p>
              <p className="text-xs text-white/60">Responds within hours | Mon–Fri</p>
            </div>
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Your Curated View
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            A Considered Selection
          </h2>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {sampleAdvisorSelection.map((item, index) => (
              <AdvisorCard key={`selection-${index}`} {...item} />
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-sapphire-50">
        <Container className="py-14 sm:py-16">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-brand">
            Advisor Notes
          </p>
          <h2 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl">
            Context Behind the Selection
          </h2>
          <div className="mt-8 space-y-4">
            {advisorNotes.map((note) => (
              <div
                key={note.title}
                className="rounded-[var(--radius-card)] border border-line bg-white p-6"
              >
                <div className="flex items-center justify-between gap-4">
                  <p className="text-sm font-bold text-brand">{note.title}</p>
                  <span className="text-xs text-ink-tertiary">{note.date}</span>
                </div>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-ink-secondary">
                  {note.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="w-full bg-surface">
        <Container className="flex flex-col items-start justify-between gap-4 py-8 sm:flex-row sm:items-center">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <p className="text-sm text-ink-secondary">
              <span className="font-bold text-brand">Have a question on this selection?</span>{" "}
              Message Sara directly — typically responds within hours.
            </p>
          </div>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Button href="/contact">Message your advisor</Button>
            <Button href="/contact" variant="accent">
              Request a private viewing <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
