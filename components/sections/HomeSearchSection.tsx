import { getTranslations } from "next-intl/server";
import { cn } from "@/lib/cn";
import { siteMaxWidth, sitePageGutterX } from "@/components/ui/SiteChrome";
import { getRequestLocale } from "@/lib/i18n/server";
import { HomeSearchForm } from "./HomeSearchForm";

export async function HomeSearchSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.search" });

  return (
    /* Full-width bg — Figma 1525:28273: sapphire-50 strip, 130px tall */
    <section data-reveal className="w-full bg-surface-muted py-7">
      <div className={cn("mx-auto w-full", siteMaxWidth, sitePageGutterX)}>
        <HomeSearchForm
          label={t("label")}
          ariaLabel={t("ariaLabel")}
          placeholder={t("placeholder")}
          submitLabel={t("submit")}
        />
      </div>
    </section>
  );
}
