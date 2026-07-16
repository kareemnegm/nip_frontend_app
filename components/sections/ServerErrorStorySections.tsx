import { getTranslations } from "next-intl/server";
import { Button, Icon } from "@/components/ui";
import { EditableStatusCopy } from "@/components/sections/EditableStatusCopy";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

/** T16c · 500 (Figma 1525:27396) — warning badge, ERROR 500, display title, single Back to Home CTA */
export async function ServerErrorSection() {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 lg:py-[140px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-[18px] text-center">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-error p-2.5 text-white">
            <Icon name="alertTriangle" className="h-8 w-8" />
          </span>

          <div className="flex w-full flex-col items-center gap-[18px]">
            <EditableStatusCopy
              page="serverError"
              eyebrowClassName="text-overline font-semibold uppercase text-error"
              titleClassName="font-display font-normal uppercase text-brand text-display-sm sm:text-display-lg"
              descriptionClassName="max-w-[520px] text-body-sm text-ink-tertiary"
            />
          </div>

          <Button href="/" className="justify-center">
            {tc("backToHome")}
          </Button>
        </div>
      </div>
    </section>
  );
}
