import Link from "next/link";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export const faqItems: FaqItem[] = [
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

export function FaqHeroSection() {
  return (
    <section data-site-hero className="bg-white pt-[72px] pb-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-4 text-center">
          <p className="text-overline font-semibold text-accent">HELP &amp; FAQ</p>
          <h1 className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand">
            Frequently Asked Questions
          </h1>
          <p className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary">
            Everything you need to know about working with NIP — buying, off-plan,
            the Golden Visa and our private advisory.
          </p>
        </div>
      </div>
    </section>
  );
}

export function FaqAccordionSection() {
  return (
    <section className="bg-white pb-16 sm:pb-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto w-full max-w-[726px]">
          <FaqAccordion items={faqItems} />
        </div>
      </div>
    </section>
  );
}

export function FaqCtaSection() {
  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand sm:text-[36px] sm:leading-[40px]">
              Still Have Questions?
            </h2>
            <p className="max-w-[464px] text-body-md leading-[22px] text-ink-secondary">
              Ask the Concierge for an instant answer, or speak with a Private Advisor.
            </p>
          </div>
          <div className="flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <Link
              href="/concierge"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
            >
              Ask the Concierge
              <Icon name="arrowRight" className="h-4 w-4 shrink-0" />
            </Link>
            <SpeakWithNipButton href="/contact" className="flex-1 justify-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
