import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getRequestLocale } from "@/lib/i18n/server";

export async function HomeSearchSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.search" });

  return (
    <section className="bg-surface-muted py-7">
      <Container>
        <form className="mx-auto max-w-[640px]">
          <p className="mb-3 text-center text-xs font-semibold uppercase leading-4 text-ink-tertiary">
            {t("label")}
          </p>
          <div className="flex flex-col gap-3 rounded-[8px] border border-line bg-white py-1.5 pl-[18px] pr-1.5 sm:flex-row sm:items-center">
            <input
              type="search"
              aria-label={t("ariaLabel")}
              placeholder={t("placeholder")}
              className="min-h-9 flex-1 text-[13px] leading-[18px] text-ink placeholder:text-text-inactive outline-none"
            />
            <Button type="submit" size="md" className="w-full sm:w-auto">
              {t("submit")}
            </Button>
          </div>
        </form>
      </Container>
    </section>
  );
}
