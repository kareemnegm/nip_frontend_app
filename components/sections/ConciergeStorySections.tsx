import Link from "next/link";
import { Button, Icon, ImagePlaceholder } from "@/components/ui";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export const conciergeQuickPrompts = [
  "Best areas for investment?",
  "Golden Visa & property",
  "Off-plan vs ready",
  "Payment plans explained",
];

export const conciergeSampleMessages = {
  greeting:
    "Hello — I'm the NIP Concierge. Ask me about communities, pricing, off-plan or the Golden Visa. I can also connect you with a private advisor.",
  userQuestion: "Which areas offer the best long-term value right now?",
  reply:
    "A few stand out for scarcity and infrastructure — Palm Jumeirah, Downtown and the Creek corridor. Here's one that fits a long-hold profile:",
};

export const conciergeSampleProperty = {
  title: "Property Name",
  location: "Sheikh Zayed Road, Dubai",
  meta: ["2 Beds", "3 Baths", "2,315 sq ft"],
  price: "AED 2,658,000",
  href: "/properties/sample",
};

function ConciergePropertyCard() {
  const property = conciergeSampleProperty;

  return (
    <div className="max-w-[320px] overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
      <ImagePlaceholder
        rounded={false}
        className="aspect-[1.7] min-h-[160px] w-full"
      />
      <div className="space-y-3 p-4">
        <h3 className="text-h3 font-bold text-brand">{property.title}</h3>
        <p className="flex items-center gap-1 text-body-sm text-ink-secondary">
          <Icon name="mapPin" className="h-3.5 w-3.5 shrink-0 text-brand" />
          {property.location}
        </p>
        <div className="flex flex-wrap gap-3.5">
          {property.meta.map((item) => (
            <span
              key={item}
              className="inline-flex items-center gap-1.5 text-xs font-semibold leading-4 text-ink"
            >
              <span className="inline-flex h-[22px] w-[22px] items-center justify-center rounded-[2px] bg-basalt-50 p-1">
                <Icon
                  name={
                    item.toLowerCase().includes("bed")
                      ? "bed"
                      : item.toLowerCase().includes("bath")
                        ? "bath"
                        : "grid"
                  }
                  className="h-3.5 w-3.5 text-ink-secondary"
                />
              </span>
              {item}
            </span>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4 pt-1">
          <div>
            <p className="text-xs leading-4 text-ink-tertiary">Starting From</p>
            <p className="mt-1 flex items-center gap-2 text-xl font-bold leading-[26px] text-brand">
              <Icon name="currency" className="h-[18px] w-[18px] shrink-0" />
              {property.price.replace(/^AED\s*/i, "")}
            </p>
          </div>
          <Button
            href={property.href}
            variant="link"
            className="shrink-0 text-body-sm leading-[18px]"
          >
            Explore Property
            <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}

export function ConciergeHeroSection() {
  return (
    <section data-site-hero className="bg-white pt-[72px] pb-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-4 text-center">
          <p className="text-overline font-semibold text-accent">AI CONCIERGE</p>
          <h1 className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand">
            Ask the Concierge
          </h1>
          <p className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary">
            Instant answers on communities, pricing, off-plan and the Golden Visa
            — and a direct line to a private advisor whenever you want one.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ConciergeChatSection() {
  const { greeting, userQuestion, reply } = conciergeSampleMessages;

  return (
    <section className="bg-surface-muted pb-[72px] pt-2">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "mx-auto max-w-[720px]")}>
          <div className="overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]">
            <div className="flex flex-wrap gap-2 border-b border-line bg-white p-4">
              {conciergeQuickPrompts.map((prompt) => (
                <button
                  key={prompt}
                  type="button"
                  className="rounded-full border border-line bg-white px-4 py-2 text-body-xs font-medium leading-4 text-ink-secondary transition-colors hover:border-brand hover:text-brand"
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div className="space-y-4 bg-white p-5 sm:p-6">
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-sapphire-50 px-4 py-3 text-body-sm leading-[18px] text-ink-secondary">
                {greeting}
              </div>
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-brand px-4 py-3 text-body-sm leading-[18px] text-white">
                {userQuestion}
              </div>
              <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-sapphire-50 px-4 py-3 text-body-sm leading-[18px] text-ink-secondary">
                {reply}
              </div>
              <ConciergePropertyCard />
            </div>

            <div className="flex items-center gap-3 border-t border-line bg-white p-4">
              <input
                aria-label="Ask anything about Dubai property"
                placeholder="Ask anything about Dubai property..."
                className="h-11 flex-1 rounded-[var(--radius-field)] border border-line bg-white px-4 text-body-sm text-ink outline-none placeholder:text-ink-tertiary focus:border-brand focus:ring-2 focus:ring-sapphire-100"
              />
              <Button type="button" className="shrink-0">
                Send
                <Icon name="send" className="h-4 w-4" />
              </Button>
            </div>
          </div>

          <p className="mt-6 text-center text-body-sm leading-[18px] text-ink-secondary">
            Prefer a Person?{" "}
            <Link
              href="/contact"
              className="inline-flex items-center gap-1 font-semibold text-brand transition-colors hover:text-brand-hover"
            >
              Speak with a Private Advisor
              <Icon name="arrowRight" className="h-4 w-4" />
            </Link>
          </p>
        </div>
      </div>
    </section>
  );
}
