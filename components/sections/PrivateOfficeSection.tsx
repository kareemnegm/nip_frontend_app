import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import { getRequestLocale } from "@/lib/i18n/server";
import { HOME_REL_URL } from "./home-editable";

/**
 * Figma 1525:28321 — 60px circle (sapphire-600), privacy lock 44px inside.
 */
function OfficeCrest() {
  return (
    <div
      aria-hidden
      className="mx-auto flex h-[60px] w-[60px] items-center justify-center rounded-full bg-sapphire-600 p-2 text-white"
    >
      <Icon name="lock" className="h-11 w-11" />
    </div>
  );
}

export async function PrivateOfficeSection() {
  const locale = await getRequestLocale();
  const tHome = await getTranslations({ locale, namespace: "home" });
  const tCommon = await getTranslations({ locale, namespace: "common" });

  return (
    /* Figma: bg sapphire-800 (#071e40), py-80, flex-col gap-40, centered */
    <section className="bg-sapphire-800 py-16 text-white sm:py-20">
      {/*
       * Plain centered wrapper (not the shared Container) — Container's
       * site-wide gutter (px-5 sm:px-8 lg:px-20) was stacking on top of
       * max-w-[520px], squeezing the inner content down to ~360px at
       * desktop widths. That was just barely too narrow for the "PRIVATE
       * OFFICE" Didot title in Safari/Edge (slightly wider glyph metrics
       * than Chrome), wrapping it onto two lines. A fixed 24px inset has
       * plenty of room and matches Figma's centered 520px block.
       */}
      <div className="mx-auto w-full max-w-[520px] px-6 text-center">
        <div data-reveal className="flex flex-col items-center gap-10">
          <OfficeCrest />

          <div className="flex flex-col items-center gap-4">
            {/* Title — Figma: Didot Regular 44/42 -0.02em uppercase white */}
            <EditableText
              relUrl={HOME_REL_URL}
              blockKey="private-office-title"
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.home.privateOffice", "title", locale)}
              placeholderTag="h2"
              className="font-display font-normal uppercase text-white text-display-sm sm:whitespace-nowrap sm:text-display-lg"
            />

            {/* Body — Figma: Archivo Regular 13/18 accent-on-dark (#8fb0dc), w-464 */}
            <EditableText
              relUrl={HOME_REL_URL}
              blockKey="private-office-desc"
              locale={locale}
              placeholderContent={await getCmsPlaceholder("placeholders.home.privateOffice", "desc", locale)}
              placeholderTag="p"
              className="max-w-[464px] text-body-sm font-normal text-accent-on-dark"
            />
          </div>

          {/* By introduction only — Figma: Archivo SemiBold 12/16 white */}
          <p className="flex items-center justify-center gap-1.5 text-overline font-semibold uppercase text-white">
            <span className="h-2 w-2 rounded-full bg-accent" />
            {tHome("byIntroductionOnly")}
          </p>

          {/* CTAs — Figma: gap-12, w-340 */}
          <div className="flex w-full max-w-[400px] flex-row items-stretch justify-center gap-2 sm:max-w-[340px] sm:gap-3">
            <Button href="/contact" variant="accent" size="lg" className="min-w-0 flex-1 basis-0 justify-center">
              {tCommon("requestAccess")}
            </Button>
            <Button href="/private-office" variant="outlineInverse" size="lg" className="min-w-0 flex-1 basis-0 justify-center">
              {tCommon("signIn")}
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
