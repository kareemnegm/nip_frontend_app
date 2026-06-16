import Link from "next/link";
import { Button, Icon } from "@/components/ui";
import { EditableStatusCopy } from "@/components/sections/EditableStatusCopy";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";

export async function ThankYouSection() {
  return (
    <section className="flex min-h-[60vh] items-center bg-white py-20 pb-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-success text-white">
            <Icon name="check" className="h-7 w-7" />
          </span>

          <div className="mt-6 flex w-full flex-col items-center">
            <EditableStatusCopy
              page="thankYou"
              placeholders={{
                eyebrow: "Request Received",
                title: "Thank You",
                description:
                  "We've received your request. A Private Advisor will be in touch within one business day.",
              }}
              eyebrowClassName="text-overline font-semibold uppercase tracking-[0.18em] text-success"
              titleClassName="mt-3 font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
              descriptionClassName="mt-4 max-w-[680px] text-body-lg leading-[28px] text-ink-secondary"
            />
          </div>

          <div className="mt-10 flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <Button href="/" className="flex-1 justify-center">
              Back to Home
            </Button>
            <Link
              href="/insights"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
            >
              Explore Insights
              <Icon name="arrowRight" className="h-4 w-4 shrink-0" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
