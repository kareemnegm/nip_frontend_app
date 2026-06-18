import { getTranslations } from "next-intl/server";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function HomeCtaSection() {
  const locale = await getRequestLocale();
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="space-y-10">
        <SectionHeading
          title={await getCmsPlaceholder("placeholders.home.cta", "title", locale)}
          description={await getCmsPlaceholder("placeholders.home.cta", "desc", locale)}
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.homeCta.titleKey,
            descKey: homeEditable.homeCta.descKey,
          }}
        />
        <div className="mx-auto flex max-w-[356px] flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button href="/contact" size="lg" className="w-full flex-1 gap-[3px]">
            <span className="font-semibold">{tc("speakWith")}</span>
            <span className="font-[family-name:var(--font-logo)] font-medium">{tc("nip")}</span>
          </Button>
          <Button href="/concierge" variant="accent" size="lg" className="w-full flex-1">
            {tc("askConcierge")}
          </Button>
        </div>
      </Container>
    </section>
  );
}
