import Link from "next/link";
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
    <section className="flex min-h-[60vh] items-center bg-white py-20 pb-[72px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center text-center">
          <span className="flex h-14 w-14 items-center justify-center rounded-full bg-error text-white">
            <Icon name="alertTriangle" className="h-7 w-7" />
          </span>

          <div className="mt-6 flex w-full flex-col items-center">
            <EditableStatusCopy
              page="serverError"
              eyebrowClassName="text-overline font-semibold uppercase tracking-[0.18em] text-error"
              titleClassName="mt-3 font-[family-name:var(--font-display)] text-[44px] leading-[42px] tracking-[-0.02em] text-brand"
              descriptionClassName="mt-4 max-w-[680px] text-body-lg leading-[28px] text-ink-secondary"
            />
          </div>

          <div className="mt-10 flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <Button href="/" className="flex-1 justify-center">
              {tc("backToHome")}
            </Button>
            <Link
              href="/contact"
              className="inline-flex flex-1 items-center justify-center gap-1 rounded-[var(--radius-field)] bg-accent px-6 py-[9px] text-[13px] font-semibold leading-[18px] text-white transition-colors hover:bg-accent-hover active:bg-accent-pressed"
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
