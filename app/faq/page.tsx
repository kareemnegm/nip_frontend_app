import type { Metadata } from "next";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, PageHero } from "@/components/sections";
import { Button, Container } from "@/components/ui";

export const metadata: Metadata = {
  title: "FAQ | NIP Reality",
};

const faqItems: FaqItem[] = [
  {
    question: "How does NIP's Private Advisory work?",
    answer:
      "We start with your mandate, then privately source and shortlist residences and projects that fit — grounded in market data and developer track record. There are no public shortlists; everything is handled discreetly with a dedicated advisor.",
  },
  {
    question: "Do you Charge buyers a Fee?",
    answer:
      "Our advisory is aligned with your interests. We are transparent about how we are compensated on any transaction before you commit.",
  },
  {
    question: "Can you help with the Golden Visa?",
    answer:
      "Yes. We guide qualifying clients through property-linked Golden Visa requirements and connect you with vetted legal partners where needed.",
  },
  {
    question: "Do you handle Off-Plan and Ready properties?",
    answer:
      "Both. We advise across ready residences, exclusive resales, and off-plan launches with payment plans from leading developers.",
  },
  {
    question: "How Quickly will an Advisor Respond?",
    answer:
      "A private advisor typically responds within one business day, often sooner during business hours.",
  },
];

export default function FaqPage() {
  return (
    <SiteShell>
      <PageHero
        eyebrow="Help & FAQ"
        title="Frequently Asked Questions"
        description="Everything you need to know about working with NIP — buying, off-plan, the Golden Visa and our private advisory."
        align="center"
        tone="light"
        className="bg-surface"
      />

      <section className="w-full bg-surface">
        <Container className="py-6 pb-16 sm:pb-20">
          <FaqAccordion items={faqItems} />
        </Container>
      </section>

      <CtaBand
        tone="light"
        title="Still Have Questions?"
        description="Ask the Concierge for an instant answer, or speak with a Private Advisor."
        actions={
          <>
            <Button href="/concierge" variant="accent">
              Ask the Concierge
            </Button>
            <Button href="/contact">Speak with NIP</Button>
          </>
        }
      />
    </SiteShell>
  );
}
