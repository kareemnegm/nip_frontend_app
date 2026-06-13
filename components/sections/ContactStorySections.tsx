import { ConsultationRequestForm } from "@/components/ui/LeadForms";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export function ContactHeroSection() {
  return (
    <section data-site-hero className="bg-surface-muted pt-16 pb-9">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "space-y-4")}>
          <div className="space-y-2">
            <p className="text-overline font-semibold leading-4 text-accent">
              NIP PRIVATE ADVISORY
            </p>
            <h1 className="font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand">
              Speak with NIP
            </h1>
          </div>
          <p className="max-w-[680px] text-body-lg leading-[28px] text-ink-secondary">
            A considered property decision begins with a conversation.
          </p>
        </div>
      </div>
    </section>
  );
}

export function ContactFormSection() {
  return (
    <section className="bg-white pb-[72px] pt-10">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div
          className={cn(
            sitePageInnerClassName,
            "grid gap-10 lg:grid-cols-[minmax(0,400px)_minmax(0,1fr)] lg:gap-16",
          )}
        >
          <div className="max-w-[512px] lg:pt-4">
            <p className="text-overline font-semibold text-accent">
              PRIVATE ADVISORY | BY INVITATION
            </p>
            <p className="mt-5 text-body-lg leading-[28px] text-ink-secondary">
              Whether you are exploring Dubai for residence, investment, relocation,
              portfolio strategy, or a private acquisition, NIP can help you understand
              the market before you commit to a path.
            </p>
          </div>
          <ConsultationRequestForm />
        </div>
      </div>
    </section>
  );
}
