import { EditableText } from "@/components/EditableText";
import { FooterContent } from "@/components/FooterContent";
import { globalBlockKeys } from "@/lib/i18n/block-keys";

export function Footer() {
  const { relUrl, footer } = globalBlockKeys;

  return (
    <FooterContent
      tagline={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.tagline}
          placeholderContent="Curated real estate advisory focused on exceptional residences and long-term market insight across Dubai."
          placeholderTag="p"
        />
      }
      newsletterTitle={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.newsletterTitle}
          placeholderContent="Stay Ahead of the Market"
          placeholderTag="h3"
        />
      }
      newsletterDesc={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.newsletterDesc}
          placeholderContent="Curated market updates from Dubai's leading communities."
          placeholderTag="p"
        />
      }
      copyright={
        <EditableText
          relUrl={relUrl}
          blockKey={footer.copyright}
          placeholderContent="© 2026 NIP — Novel Insight Property. All rights reserved."
          placeholderTag="p"
        />
      }
    />
  );
}
