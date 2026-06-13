import { AdvisorCard, Button, Icon } from "@/components/ui";
import { PrivateOfficeSectionHeading } from "@/components/sections/PrivateOfficeMemberSections";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { sampleAdvisorSelection } from "@/components/placeholders";
import { cn } from "@/lib/cn";

export const curatedAdvisorNotes = [
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

export function CuratedHeroSection() {
  return (
    <section
      data-site-hero
      className="bg-[linear-gradient(166.53deg,#254672_0%,#081a33_71.43%)] py-14 text-white sm:py-16 lg:py-20"
    >
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col gap-8 lg:flex-row lg:items-start lg:justify-between",
          )}
        >
          <div className="flex max-w-[680px] flex-col gap-4">
            <div className="space-y-2">
              <p className="text-overline font-semibold text-gold">
                Private Office | Curated for You
              </p>
              <p className="text-overline font-semibold uppercase tracking-[0.18em] text-platinum-400">
                By Introduction Only
              </p>
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] uppercase leading-[42px] tracking-[-0.02em] text-white sm:text-[52px] sm:leading-[50px]">
              Selected for You, by Your Advisor
            </h1>
            <p className="text-body-lg leading-[28px] text-sapphire-100">
              A confidential selection of properties and projects aligned with your
              mandate. Curated, never catalogued. Released by your advisor as relevant.
            </p>
          </div>
          <div className="shrink-0 lg:text-right">
            <p className="text-overline font-semibold text-platinum-400">
              Your Advisor
            </p>
            <p className="mt-2 text-lg font-bold text-white">Sara N.</p>
            <p className="mt-1 text-body-xs text-sapphire-100">
              Responds within hours | Mon–Fri
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CuratedSelectionSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <PrivateOfficeSectionHeading
            eyebrow="YOUR CURATED VIEW"
            title="A Considered Selection"
            description="Properties and projects released for your mandate — each with advisor context below."
          />
          <div className="grid gap-2 sm:grid-cols-2">
            {sampleAdvisorSelection.map((item, index) => (
              <AdvisorCard key={`curated-selection-${index}`} {...item} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CuratedNotesSection() {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-10")}>
          <PrivateOfficeSectionHeading
            eyebrow="ADVISOR NOTES"
            title="Context Behind the Selection"
            description="Private notes from your advisor explaining why each opportunity was included — or set aside."
          />
          <div className="space-y-4">
            {curatedAdvisorNotes.map((note) => (
              <article
                key={note.title}
                className="rounded-[var(--radius-card)] border border-line bg-white p-6 shadow-[var(--shadow-card)]"
              >
                <div className="flex items-start justify-between gap-4">
                  <p className="text-body-md font-bold leading-[22px] text-brand">
                    {note.title}
                  </p>
                  <span className="shrink-0 text-body-xs leading-4 text-ink-tertiary">
                    {note.date}
                  </span>
                </div>
                <p className="mt-3 max-w-[760px] text-body-sm leading-[18px] text-ink-secondary">
                  {note.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

export function CuratedAdvisorBarSection() {
  return (
    <section className="border-t border-line bg-white">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "flex flex-col items-start justify-between gap-6 py-8 sm:flex-row sm:items-center",
          )}
        >
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand text-white">
              <Icon name="user" className="h-5 w-5" />
            </span>
            <p className="max-w-[520px] text-body-sm leading-[18px] text-ink-secondary">
              <span className="font-bold text-brand">
                Have a question on this selection?
              </span>{" "}
              Message Sara directly — typically responds within hours.
            </p>
          </div>
          <div className="flex w-full flex-col gap-3 sm:w-auto sm:flex-row">
            <Button href="/contact" className="justify-center">
              Message your Advisor
            </Button>
            <Button href="/contact" variant="accent" className="justify-center">
              Request a private viewing
              <Icon name="arrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
