import { AppLink as Link } from "@/components/AppLink";
import { getTranslations } from "next-intl/server";
import { Button, Icon } from "@/components/ui";
import { EditableStatusCopy } from "@/components/sections/EditableStatusCopy";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

export async function ServerErrorSection() {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 pb-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error text-white">
            <Icon name="alertTriangle" className="h-7 w-7" />
          </span>

          <div className="mt-6 flex w-full flex-col items-center">
            <EditableStatusCopy
              page="serverError"
              eyebrowClassName="text-overline font-semibold uppercase tracking-[0.18em] text-error"
              titleClassName="mt-3 font-display text-display-sm text-brand sm:text-display-lg"
              descriptionClassName="mt-4 max-w-[680px] text-body-sm text-ink-secondary sm:text-body-lg"
            />
          </div>

          <div className="mt-10 flex w-full max-w-[400px] flex-row items-stretch gap-2 sm:gap-3">
            <Button href="/" className="min-w-0 flex-1 basis-0 justify-center">
              {tc("backToHome")}
            </Button>
            <Link
              href="/contact"
              className="inline-flex min-w-0 flex-1 basis-0 items-center justify-center gap-1 whitespace-nowrap rounded-[var(--radius-field)] bg-accent px-3 py-[9px] text-xs font-semibold leading-4 text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed sm:px-6 sm:text-[13px] sm:leading-[18px]"
            >
              {tc("contactUs")}
              <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
