import { getTranslations } from "next-intl/server";
import { Button, Icon } from "@/components/ui";
import { EditableStatusCopy } from "@/components/sections/EditableStatusCopy";
import {
  siteMaxWidth,
  sitePageGutterX,
} from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { cn } from "@/lib/cn";

/** T16b · 404 (Figma 1525:27407) */
export async function NotFoundSection() {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="flex flex-1 items-center justify-center bg-white py-20 lg:py-[140px]">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <div className="mx-auto flex w-full max-w-[846px] flex-col items-center gap-[18px] text-center">
          <span className="flex h-[52px] w-[52px] items-center justify-center rounded-full bg-accent text-white">
            <Icon name="error404" className="h-7 w-7" />
          </span>

          <div className="flex w-full flex-col items-center gap-[18px]">
            <EditableStatusCopy
              page="notFound"
              eyebrowClassName="text-overline font-semibold uppercase text-accent"
              titleClassName="font-display font-normal uppercase text-brand text-display-lg"
              descriptionClassName="max-w-[520px] text-body-sm text-ink-tertiary"
            />
          </div>

          <div className="flex w-full max-w-[400px] flex-col gap-3 sm:flex-row">
            <Button href="/" className="flex-1 justify-center">
              {tc("backToHome")}
            </Button>
            <Button href="/properties" className="flex-1 justify-center">
              {tc("searchProperties")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
