import { getTranslations } from "next-intl/server";
import { EditableText } from "@/components/EditableText";
import { FooterContent } from "@/components/FooterContent";
import { globalBlockKeys } from "@/lib/i18n/block-keys";

export async function Footer() {
  const { relUrl, footer } = globalBlockKeys;
  const t = await getTranslations("placeholders.global.footer");

  return (
    <FooterContent
      tagline={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.tagline}
          placeholderContent={t("tagline")}
          placeholderTag="p"
        />
      }
      newsletterTitle={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.newsletterTitle}
          placeholderContent={t("newsletterTitle")}
          placeholderTag="h3"
        />
      }
      newsletterDesc={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.newsletterDesc}
          placeholderContent={t("newsletterDesc")}
          placeholderTag="p"
        />
      }
      copyright={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.copyright}
          placeholderContent={t("copyright")}
          placeholderTag="p"
        />
      }
    />
  );
}
