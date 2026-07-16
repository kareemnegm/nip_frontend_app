import { getTranslations } from "next-intl/server";
import { LocalizedLink } from "@/components/LocalizedLink";
import {
  NewsletterForm,
  type NewsletterFormLabels,
} from "@/components/forms/InquiryForms";
import { getBlogCategories } from "@/lib/api/blogs";
import { cn } from "@/lib/cn";
import { getRequestLocale } from "@/lib/i18n/server";
import { FooterIcon, FooterSocialIcon, type FooterSocialIconName } from "./ui/FooterIcon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

type FooterLink = {
  label: string;
  href: string;
};

type SocialLink = {
  label: string;
  icon: FooterSocialIconName;
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
    <div className="flex min-w-0 flex-col gap-3 sm:gap-[14px]">
      <h3 className="text-body-xs font-semibold text-white">{title}</h3>
      <ul className="flex flex-col gap-2 text-body-xs text-basalt-300 sm:gap-[9px]">
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
  href,
}: {
  icon: "phone" | "mail" | "location";
  children: React.ReactNode;
  align?: "center" | "start";
  href?: string;
}) {
  const rowClassName = cn(
    "flex gap-2 p-1 transition-colors",
    align === "start" ? "items-start" : "items-center",
  );
  const content = (
    <>
      <FooterIcon
        name={icon}
        className="shrink-0 text-basalt-300 transition-colors group-hover:text-white"
      />
      <span dir="auto">{children}</span>
    </>
  );

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(icon === "location"
            ? { target: "_blank", rel: "noopener noreferrer" }
            : {})}
          className={cn(rowClassName, "group hover:text-white")}
        >
          {content}
        </a>
      ) : (
        <span className={rowClassName}>{content}</span>
      )}
    </li>
  );
}

function NewsletterFormSlot({ labels }: { labels: NewsletterFormLabels }) {
  return <NewsletterForm labels={labels} />;
}

function FooterBrandBlock({
  tagline,
  newsletterTitle,
  newsletterDesc,
  newsletterLabels,
}: {
  tagline: React.ReactNode;
  newsletterTitle: React.ReactNode;
  newsletterDesc: React.ReactNode;
  newsletterLabels: NewsletterFormLabels;
}) {
  return (
    <div className="flex w-full max-w-[240px] flex-col gap-8 lg:gap-12">
      <div className="flex flex-col gap-3 lg:gap-4">
        <LocalizedLink href="/">
          <Logo inverted />
        </LocalizedLink>
        <div dir="auto" className="max-w-[240px] text-body-xs text-basalt-300">
          {tagline}
        </div>
      </div>

      <div className="flex flex-col gap-3 lg:gap-3.5">
        <div className="text-body-xs font-semibold text-white">{newsletterTitle}</div>
        <div className="max-w-[240px] text-body-xs text-basalt-300">{newsletterDesc}</div>
        <NewsletterFormSlot labels={newsletterLabels} />
      </div>
    </div>
  );
}

function FooterContactBlock({
  contactTitle,
  followTitle,
  address,
  socialLinks,
  socialLayout,
  isRtl,
}: {
  contactTitle: string;
  followTitle: string;
  address: string;
  socialLinks: SocialLink[];
  socialLayout: "icons" | "list";
  isRtl: boolean;
}) {
  const phone = "+971 50 165 2441";
  const email = "info@niprealty.com";
  const mapsHref = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
    address.replace(/\n/g, ", "),
  )}`;

  return (
    <div className="flex flex-col gap-8 lg:gap-12" dir={isRtl ? "rtl" : "ltr"}>
      <div className="flex flex-col gap-3 sm:gap-[14px]">
        <h3 className="text-start text-body-xs font-semibold text-white">{contactTitle}</h3>
        <ul className="flex flex-col gap-1 text-body-xs text-basalt-300">
          <FooterContactRow icon="phone" href={`tel:${phone.replace(/\s/g, "")}`}>
            <span dir="ltr">{phone}</span>
          </FooterContactRow>
          <FooterContactRow icon="mail" href={`mailto:${email}`}>
            <span dir="ltr">{email}</span>
          </FooterContactRow>
          <FooterContactRow icon="location" align="start" href={mapsHref}>
            {address.split("\n").map((line, i, arr) => (
              <span key={i}>
                {line}
                {i < arr.length - 1 && <br />}
              </span>
            ))}
          </FooterContactRow>
        </ul>
      </div>

      <div className="flex flex-col gap-3 sm:gap-[14px]">
        <h3 className="text-start text-body-xs font-semibold text-white">{followTitle}</h3>
        {socialLayout === "icons" ? (
          <ul className="flex flex-row flex-wrap gap-3">
            {socialLinks.map(({ label, icon, href }) => (
              <li key={icon}>
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="inline-flex size-9 items-center justify-center rounded-[var(--radius-field)] text-basalt-300 transition-colors hover:bg-white/5 hover:text-white"
                >
                  <FooterSocialIcon name={icon} />
                </a>
              </li>
            ))}
          </ul>
        ) : (
          <ul className="flex flex-col gap-1 text-body-xs text-basalt-300">
            {socialLinks.map(({ label, icon, href }) => (
              <li key={icon}>
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
        )}
      </div>
    </div>
  );
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
  const locale = await getRequestLocale();
  const isRtl = locale === "ar";
  const t = await getTranslations("footer");
  const tNewsletter = await getTranslations("footer.newsletter");

  const newsletterLabels: NewsletterFormLabels = {
    emailPlaceholder: tNewsletter("emailPlaceholder"),
    subscribeLabel: tNewsletter("subscribeLabel"),
    subscriptionFailed: tNewsletter("subscriptionFailed"),
    subscriptionSuccess: tNewsletter("subscriptionSuccess"),
  };

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

  const blogCategories = await getBlogCategories(locale);
  const insightsLinks: FooterLink[] =
    blogCategories.length > 0
      ? blogCategories.map((category) => ({
          label: category.name,
          href: `/insights?category=${encodeURIComponent(category.slug)}`,
        }))
      : [
          {
            label: t("marketIntelligence"),
            href: "/insights?category=market-intelligence",
          },
          {
            label: t("investmentGuides"),
            href: "/insights?category=investment-guides",
          },
          { label: t("goldenVisa"), href: "/insights?category=golden-visa" },
          { label: t("journal"), href: "/insights" },
        ];

  const aboutLinks: FooterLink[] = [{ label: t("aboutUs"), href: "/about" }];

  const socialLinks: SocialLink[] = [
    { label: t("instagram"), icon: "instagram", href: "https://instagram.com" },
    { label: t("facebook"), icon: "facebook", href: "https://facebook.com" },
    { label: t("linkedin"), icon: "linkedin", href: "https://linkedin.com" },
    { label: t("youtube"), icon: "youtube", href: "https://youtube.com" },
  ];

  const legalLinks: FooterLink[] = [
    { label: t("privacy"), href: "/legal#overview" },
    { label: t("terms"), href: "/legal#terms" },
    { label: t("cookies"), href: "/legal#cookies" },
    { label: t("disclaimer"), href: "/legal#disclaimer" },
    { label: t("reraInfo"), href: "/legal#rera" },
  ];

  const brandProps = {
    tagline,
    newsletterTitle,
    newsletterDesc,
    newsletterLabels,
  };

  const contactProps = {
    contactTitle: t("contact"),
    followTitle: t("followUs"),
    address: t("address"),
    socialLinks,
    isRtl,
  };

  return (
    <footer data-site-footer className="w-full bg-sapphire-800 text-white">
      <div
        className={`flex flex-col gap-8 pb-24 pt-12 sm:gap-10 sm:pb-16 lg:gap-12 lg:pb-10 lg:pt-20 ${siteChromeClassName}`}
      >
        {/* —— Mobile & tablet: brand → balanced 2-col links → contact —— */}
        <div dir="ltr" className="flex w-full flex-col gap-8 sm:gap-10 lg:hidden">
          <FooterBrandBlock {...brandProps} />

          <div className="grid w-full grid-cols-2 gap-x-6 gap-y-8 sm:gap-x-8 sm:gap-y-10">
            <FooterLinkGroup title={t("properties")} links={propertiesLinks} />
            <FooterLinkGroup title={t("offPlan")} links={offPlanLinks} />
            <FooterLinkGroup title={t("areas")} links={areasLinks} />
            <FooterLinkGroup title={t("resources")} links={resourcesLinks} />
            <FooterLinkGroup title={t("insights")} links={insightsLinks} />
            <FooterLinkGroup title={t("aboutNip")} links={aboutLinks} />
          </div>

          <FooterContactBlock {...contactProps} socialLayout="icons" />
        </div>

        {/* —— Desktop: Figma five-column row —— */}
        <div
          dir="ltr"
          className="hidden w-full items-start justify-between gap-x-8 lg:flex xl:gap-x-[142px]"
        >
          <div className="shrink-0">
            <FooterBrandBlock {...brandProps} />
          </div>

          <div className="flex min-w-0 flex-col gap-12">
            <FooterLinkGroup title={t("properties")} links={propertiesLinks} />
            <FooterLinkGroup title={t("areas")} links={areasLinks} />
          </div>

          <div className="flex min-w-0 flex-col gap-12">
            <FooterLinkGroup title={t("offPlan")} links={offPlanLinks} />
            <FooterLinkGroup title={t("resources")} links={resourcesLinks} />
          </div>

          <div className="flex min-w-0 flex-col gap-12">
            <FooterLinkGroup title={t("insights")} links={insightsLinks} />
            <FooterLinkGroup title={t("aboutNip")} links={aboutLinks} />
          </div>

          <div className="shrink-0">
            <FooterContactBlock {...contactProps} socialLayout="list" />
          </div>
        </div>

        <div className="h-px w-full bg-basalt-300" />

        <div
          dir="ltr"
          className="flex w-full flex-col gap-4 text-body-xs sm:gap-5 md:flex-row md:items-center md:justify-between"
        >
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
