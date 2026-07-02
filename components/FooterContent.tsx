import { getTranslations } from "next-intl/server";
import { LocalizedLink } from "@/components/LocalizedLink";
import { NewsletterForm } from "@/components/forms/InquiryForms";
import { cn } from "@/lib/cn";
import { FooterIcon, FooterSocialIcon, type FooterSocialIconName } from "./ui/FooterIcon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

type FooterLink = {
  label: string;
  href: string;
};

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="flex w-[103px] flex-col gap-[14px]">
      <h3 className="text-[12px] font-semibold leading-4 text-white">{title}</h3>
      <ul className="flex flex-col gap-[9px] text-[12px] leading-4 text-basalt-300">
        {links.map((link) => (
          <li key={link.href + link.label}>
            <LocalizedLink
              href={link.href}
              className="transition-colors duration-200 hover:text-white"
            >
              {link.label}
            </LocalizedLink>
          </li>
        ))}
      </ul>
    </div>
  );
}

function FooterContactRow({
  icon,
  children,
  align = "center",
}: {
  icon: "phone" | "mail" | "location";
  children: React.ReactNode;
  align?: "center" | "start";
}) {
  return (
    <li
      className={cn(
        "flex gap-2 p-1",
        align === "start" ? "items-start" : "items-center",
      )}
    >
      <FooterIcon name={icon} className="shrink-0 text-basalt-300" />
      <span dir="auto">{children}</span>
    </li>
  );
}

function NewsletterFormSlot() {
  return <NewsletterForm />;
}

export type FooterContentProps = {
  tagline: React.ReactNode;
  newsletterTitle: React.ReactNode;
  newsletterDesc: React.ReactNode;
  copyright: React.ReactNode;
};

export async function FooterContent({
  tagline,
  newsletterTitle,
  newsletterDesc,
  copyright,
}: FooterContentProps) {
  const t = await getTranslations("footer");

  const propertiesLinks: FooterLink[] = [
    { label: t("buyProperties"), href: "/properties?listing=sale" },
    { label: t("rentProperties"), href: "/properties?listing=rent" },
    { label: t("exclusives"), href: "/properties?exclusive=1" },
    { label: t("newLaunches"), href: "/off-plan" },
  ];

  const areasLinks: FooterLink[] = [
    { label: t("palmJumeirah"), href: "/areas/palm-jumeirah" },
    { label: t("dubaiMarina"), href: "/areas/dubai-marina" },
    { label: t("downtown"), href: "/areas/downtown-dubai" },
    { label: t("businessBay"), href: "/areas/business-bay" },
    { label: t("allAreas"), href: "/areas" },
  ];

  const offPlanLinks: FooterLink[] = [
    { label: t("featuredProjects"), href: "/off-plan?featured=1" },
    { label: t("upcoming"), href: "/off-plan?status=launching" },
    { label: t("paymentPlans"), href: "/off-plan" },
    { label: t("developersLink"), href: "/developers" },
  ];

  const resourcesLinks: FooterLink[] = [
    { label: t("faq"), href: "/faq" },
    { label: t("aiConcierge"), href: "/concierge" },
    { label: t("submitArticle"), href: "/contribute" },
  ];

  const insightsLinks: FooterLink[] = [
    { label: t("marketIntelligence"), href: "/insights?category=market-intelligence" },
    { label: t("investmentGuides"), href: "/insights?category=investment-guides" },
    { label: t("goldenVisa"), href: "/insights?category=golden-visa" },
    { label: t("journal"), href: "/insights" },
  ];

  const aboutLinks: FooterLink[] = [
    { label: t("aboutUs"), href: "/about" },
  ];

  const socialLinks: { label: string; icon: FooterSocialIconName; href: string }[] = [
    { label: "Instagram", icon: "instagram", href: "https://instagram.com" },
    { label: "Facebook", icon: "facebook", href: "https://facebook.com" },
    { label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com" },
    { label: "Youtube", icon: "youtube", href: "https://youtube.com" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("privacy"), href: "/legal#overview" },
    { label: t("terms"), href: "/legal#terms" },
    { label: t("cookies"), href: "/legal#cookies" },
    { label: t("disclaimer"), href: "/legal#disclaimer" },
    { label: t("reraInfo"), href: "/legal#rera" },
  ];

  return (
    <footer className="w-full bg-sapphire-800 text-white">
      <div
        className={`flex flex-col items-center gap-12 pb-10 pt-16 lg:pt-20 ${siteChromeClassName}`}
      >
        <div dir="ltr" className="flex w-full flex-wrap items-start justify-center gap-x-[142px] gap-y-12">
          <div className="flex w-full max-w-[240px] flex-col gap-12">
            <div className="flex flex-col gap-4">
              <LocalizedLink href="/">
                <Logo inverted />
              </LocalizedLink>
              <div
                dir="auto"
                className="max-w-[240px] text-[12px] leading-4 text-basalt-300"
              >
                {tagline}
              </div>
            </div>

            <div className="flex flex-col gap-3.5">
              <div className="text-[12px] font-semibold leading-4 text-white">
                {newsletterTitle}
              </div>
              <div className="max-w-[240px] text-[12px] leading-4 text-basalt-300">
                {newsletterDesc}
              </div>
              <NewsletterFormSlot />
            </div>
          </div>

          <div className="flex flex-col gap-12 text-[12px] leading-4">
            <FooterLinkGroup title={t("properties")} links={propertiesLinks} />
            <FooterLinkGroup title={t("areas")} links={areasLinks} />
          </div>

          <div className="flex flex-col gap-12 text-[12px] leading-4">
            <FooterLinkGroup title={t("offPlan")} links={offPlanLinks} />
            <FooterLinkGroup title={t("resources")} links={resourcesLinks} />
          </div>

          <div className="flex flex-col gap-12 text-[12px] leading-4">
            <FooterLinkGroup title={t("insights")} links={insightsLinks} />
            <FooterLinkGroup title={t("aboutNip")} links={aboutLinks} />
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-[14px]">
              <h3 className="text-[12px] font-semibold leading-4 text-white">
                {t("contact")}
              </h3>
              <ul className="flex flex-col gap-1 text-[12px] leading-4 text-basalt-300">
                <FooterContactRow icon="phone">+971 50 165 2441</FooterContactRow>
                <FooterContactRow icon="mail">info@niprealty.com</FooterContactRow>
                <FooterContactRow icon="location" align="start">
                  {t("address").split("\n").map((line, i, arr) => (
                    <span key={i}>{line}{i < arr.length - 1 && <br />}</span>
                  ))}
                </FooterContactRow>
              </ul>
            </div>

            <div className="flex flex-col gap-[14px]">
              <h3 className="text-[12px] font-semibold leading-4 text-white">
                {t("followUs")}
              </h3>
              <ul className="flex flex-col gap-1 text-[12px] leading-4 text-basalt-300">
                {socialLinks.map(({ label, icon, href }) => (
                  <li key={label}>
                    <a
                      href={href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 p-1 transition-colors hover:text-white"
                    >
                      <FooterSocialIcon name={icon} />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-basalt-300" />

        <div dir="ltr" className="flex w-full flex-col gap-5 text-[12px] leading-4 md:flex-row md:items-center md:justify-between">
          <div className="text-basalt-300">{copyright}</div>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-text-inactive">
            {legalLinks.map((link) => (
              <LocalizedLink
                key={link.href + link.label}
                href={link.href}
                className="transition-colors hover:text-white"
              >
                {link.label}
              </LocalizedLink>
            ))}
            <LocalizedLink
              href="/admin/login"
              className="transition-colors hover:text-white"
            >
              {t("staffLogin")}
            </LocalizedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
