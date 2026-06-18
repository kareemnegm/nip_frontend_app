import { FooterContent } from "./FooterContent";

const DEFAULT_TAGLINE =
  "Curated real estate advisory focused on exceptional residences and long-term market insight across Dubai.";
const DEFAULT_NEWSLETTER_TITLE = "Stay Ahead of the Market";
const DEFAULT_NEWSLETTER_DESC =
  "Curated market updates from Dubai's leading communities.";
const DEFAULT_COPYRIGHT =
  "© 2026 NIP — Novel Insight Property. All rights reserved.";

export function FooterStatic() {
  return (
    <FooterContent
      tagline={DEFAULT_TAGLINE}
      newsletterTitle={DEFAULT_NEWSLETTER_TITLE}
      newsletterDesc={DEFAULT_NEWSLETTER_DESC}
      copyright={DEFAULT_COPYRIGHT}
    />
  );
}
