import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { PageHero } from "@/components/sections";
import { Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "Privacy Policy | NIP Reality",
};

const sections = [
  {
    id: "overview",
    title: "Overview",
    body: "This policy explains how Novel Insight Property L.L.C (\u201cNIP\u201d) collects, uses and protects your information when you use our website and advisory services. It applies to all visitors and clients.",
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

export default function LegalPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        description="Last Updated | May 2026"
      />

      <section className="w-full bg-surface">
        <Container className="grid gap-12 py-14 sm:py-16 lg:grid-cols-[0.3fr_0.7fr] lg:py-20">
          <aside className="lg:sticky lg:top-28 lg:self-start">
            <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
              On This Page
            </p>
            <ul className="mt-4 space-y-3 text-sm text-brand">
              {sections.map((section) => (
                <li key={section.id}>
                  <a href={`#${section.id}`} className="hover:underline">
                    {section.title}
                  </a>
                </li>
              ))}
            </ul>
          </aside>

          <div className="space-y-10">
            {sections.map((section) => (
              <div key={section.id} id={section.id} className="scroll-mt-28">
                <h2 className="text-xl font-bold text-brand">{section.title}</h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-ink-secondary">
                  {section.body}
                </p>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
