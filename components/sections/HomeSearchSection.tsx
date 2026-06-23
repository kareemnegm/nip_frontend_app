import { getTranslations } from "next-intl/server";
import { Container } from "@/components/ui/Container";
import { getRequestLocale } from "@/lib/i18n/server";
import { HomeSearchForm } from "./HomeSearchForm";

export async function HomeSearchSection() {
  const locale = await getRequestLocale();
  const t = await getTranslations({ locale, namespace: "home.search" });

  return (
    <section data-reveal className="bg-surface-muted py-7">
      <Container>
        <HomeSearchForm
          label={t("label")}
          ariaLabel={t("ariaLabel")}
          placeholder={t("placeholder")}
          submitLabel={t("submit")}
        />
      </Container>
    </section>
  );
}
