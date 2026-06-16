import { LocalizedLink } from "@/components/LocalizedLink";
import { EditableText } from "@/components/EditableText";
import { FaqAccordion, type FaqItem } from "@/components/FaqAccordion";
import { SpeakWithNipButton } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getFaqs } from "@/lib/api/faqs";
import { pageBlockKeys } from "@/lib/i18n/block-keys";
import { getRequestLocale } from "@/lib/i18n/server";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

const fallbackFaqItems: FaqItem[] = [
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

const faqBlocks = pageBlockKeys.faq;

export async function FaqHeroSection() {
  const locale = await getRequestLocale();

  return (
    <section data-site-hero className="bg-white pt-[72px] pb-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-4 text-center">
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.eyebrow}
            locale={locale}
            placeholderContent="HELP & FAQ"
            placeholderTag="p"
            className="text-overline font-semibold text-accent"
          />
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.title}
            locale={locale}
            placeholderContent="Frequently Asked Questions"
            placeholderTag="h1"
            className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
          />
          <EditableText
            relUrl={faqBlocks.relUrl}
            blockKey={faqBlocks.hero.description}
            locale={locale}
            placeholderContent="Everything you need to know about working with NIP — buying, off-plan, the Golden Visa and our private advisory."
            placeholderTag="p"
            className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary"
          />
        </div>
      </div>
    </section>
  );
}

export async function FaqAccordionSection() {
  const apiFaqs = await getFaqs().catch(() => []);
  const faqItems: FaqItem[] =
    apiFaqs.length > 0
      ? apiFaqs.map((item) => ({
          question: item.question,
          answer: item.answer,
        }))
      : fallbackFaqItems;

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

export async function FaqCtaSection() {
  const locale = await getRequestLocale();

  return (
    <section className="bg-sapphire-50 py-16 sm:py-20">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-10 text-center">
          <div className="flex flex-col items-center gap-4">
            <EditableText
              relUrl={faqBlocks.relUrl}
              blockKey={faqBlocks.cta.title}
              locale={locale}
              placeholderContent="Still Have Questions?"
              placeholderTag="h2"
              className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand sm:text-[36px] sm:leading-[40px]"
            />
            <EditableText
              relUrl={faqBlocks.relUrl}
              blockKey={faqBlocks.cta.description}
              locale={locale}
              placeholderContent="Ask the Concierge for an instant answer, or speak with a Private Advisor."
              placeholderTag="p"
              className="max-w-[464px] text-body-md leading-[22px] text-ink-secondary"
            />
          </div>
          <div className="flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <LocalizedLink
              href="/concierge"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
            >
              Ask the Concierge
              <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
            </LocalizedLink>
            <SpeakWithNipButton href="/contact" className="flex-1 justify-center" />
          </div>
        </div>
      </div>
    </section>
  );
}
