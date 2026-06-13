import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export type LegalSection = {
  id: string;
  title: string;
  body: string;
};

export const legalSections: LegalSection[] = [
  {
    id: "overview",
    title: "Overview",
    body: "This policy explains how Novel Insight Property L.L.C (“NIP”) collects, uses and protects your information when you use our website and advisory services. It applies to all visitors and clients.",
  },
  {
    id: "information-we-collect",
    title: "Information we Collect",
    body: "We collect details you provide directly — such as your name, contact details and property preferences — and limited technical data needed to operate the site securely and improve your experience.",
  },
  {
    id: "how-we-use-it",
    title: "How we Use it",
    body: "Your information is used to respond to enquiries, provide advisory services, and share curated opportunities where you have consented. We do not sell your data.",
  },
  {
    id: "sharing-disclosure",
    title: "Sharing & Disclosure",
    body: "We share information only with vetted partners necessary to deliver a service you requested (for example, legal advisers for a Golden Visa), and where required by law.",
  },
  {
    id: "data-retention",
    title: "Data Retention",
    body: "We retain personal data only for as long as necessary to provide our services and meet legal obligations.",
  },
  {
    id: "your-rights",
    title: "Your Rights",
    body: "You may request access to, correction of, or deletion of your personal data at any time by contacting us using the details below.",
  },
  {
    id: "contact",
    title: "Contact",
    body: "Questions about this policy can be directed to info@niprealty.com or to our office at One Central, Dubai, UAE.",
  },
];

export function LegalHeroSection() {
  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-4")}>
          <div className="space-y-2">
            <p className="text-overline font-semibold leading-4 text-accent">LEGAL</p>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand">
              Privacy Policy
            </h1>
          </div>
          <p className="text-body-md leading-[22px] text-ink-tertiary">
            Last Updated | May 2026
          </p>
        </div>
      </div>
    </section>
  );
}

export function LegalContentSection() {
  return (
    <section className="bg-white pb-[72px] pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "grid gap-12 lg:grid-cols-[minmax(0,240px)_minmax(0,1fr)] lg:gap-16",
          )}
        >
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-overline font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
              On This Page
            </p>
            <ul className="mt-4 space-y-3">
              {legalSections.map((section) => (
                <li key={section.id}>
                  <a
                    href={`#${section.id}`}
                    className="text-body-sm font-semibold text-brand transition-colors hover:text-accent"
                  >
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-12">
            {legalSections.map((section) => (
              <article
                key={section.id}
                id={section.id}
                className="scroll-mt-28"
              >
                <h2 className="text-xl font-bold leading-[26px] text-brand">
                  {section.title}
                </h2>
                <p className="mt-4 max-w-[640px] text-body-md leading-[22px] text-ink-secondary">
                  {section.body}
                </p>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
