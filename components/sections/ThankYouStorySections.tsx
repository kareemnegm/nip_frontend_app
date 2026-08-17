import { getTranslations } from "next-intl/server";
import { Button, Icon } from "@/components/ui";
import { EditableStatusCopy } from "@/components/sections/EditableStatusCopy";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

/**
 * Insight submission references are `INS-{year}-{4+ digits}`. The value arrives
 * from the query string, so anything that is not that exact shape is a hand-
 * edited URL and is dropped rather than echoed back onto the page.
 */
const REFERENCE_PATTERN = /^INS-\d{4}-\d{4,}$/;

/** T16a · Thank-you (Figma 1525:27419) */
export async function ThankYouSection({ reference }: { reference?: string }) {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });
  const validReference = reference && REFERENCE_PATTERN.test(reference) ? reference : null;

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 lg:py-[140px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-[18px] text-center">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-success text-white">
            <Icon name="delivered" className="h-9 w-9" />
          </span>

          <div className="flex w-full flex-col items-center gap-[18px]">
            <EditableStatusCopy
              page="thankYou"
              eyebrowClassName="text-overline font-semibold uppercase text-success"
              titleClassName="font-display font-normal uppercase text-brand text-display-sm sm:text-display-lg"
              descriptionClassName="max-w-[520px] text-body-sm text-ink-tertiary"
            />
          </div>

          {validReference ? (
            <p className="text-body-xs text-ink-tertiary">
              {tc("referenceLabel")}{" "}
              <span className="font-medium text-brand">{validReference}</span>
            </p>
          ) : null}

          <div className="flex w-full max-w-[400px] flex-row items-stretch gap-2 sm:gap-3">
            <Button href="/" className="min-w-0 flex-1 basis-0 justify-center">
              {tc("backToHome")}
            </Button>
            <Button href="/insights" className="min-w-0 flex-1 basis-0 justify-center gap-1">
              {tc("exploreInsights")}
              <Icon name="arrowRight" className="h-4 w-4 shrink-0 rtl:rotate-180" />
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
