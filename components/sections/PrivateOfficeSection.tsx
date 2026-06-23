import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { HOME_REL_URL } from "./home-editable";

function OfficeCrest() {
  return (
    <div
      aria-hidden
      className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sapphire-600 p-2 text-accent-on-dark"
    >
      <span className="flex h-11 w-11 items-center justify-center rounded-full border border-accent-on-dark text-xl">
        <span className="sr-only">Private</span>
        &#9671;
      </span>
    </div>
  );
}

export async function PrivateOfficeSection() {
  const locale = await getRequestLocale();
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    <section className="bg-sapphire-800 py-16 text-white sm:py-20">
      <Container className="mx-auto max-w-[520px] text-center">
        <div data-reveal>
          <OfficeCrest />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="private-office-title"
          locale={locale}
          placeholderContent={await getCmsPlaceholder("placeholders.home.privateOffice", "title", locale)}
          placeholderTag="h2"
          className="mt-10 font-[family-name:var(--font-display)] text-[36px] font-normal uppercase leading-[38px] tracking-[-0.02em] sm:text-[44px] sm:leading-[42px]"
        />
        <EditableText
          relUrl={HOME_REL_URL}
          blockKey="private-office-desc"
          locale={locale}
          placeholderContent={await getCmsPlaceholder("placeholders.home.privateOffice", "desc", locale)}
          placeholderTag="p"
          className="mx-auto mt-4 max-w-[464px] text-[13px] leading-[18px] text-[#8fb0dc]"
        />
        <p className="mt-10 flex items-center justify-center gap-1.5 text-xs font-semibold uppercase leading-4 text-white">
          <span className="h-2 w-2 rounded-full bg-accent" />
          {tHome("byIntroductionOnly")}
        </p>
        <div className="mx-auto mt-10 flex max-w-[340px] flex-col items-stretch justify-center gap-3 sm:flex-row">
          <Button href="/contact" variant="accent" size="lg" className="w-full flex-1">
            {tCommon("requestAccess")}
          </Button>
          <Button
            href="/private-office"
            variant="outlineInverse"
            size="lg"
            className="w-full flex-1"
          >
            {tCommon("signIn")}
          </Button>
        </div>
        </div>
      </Container>
    </section>
  );
}
