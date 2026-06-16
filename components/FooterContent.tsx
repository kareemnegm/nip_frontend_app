import { LocalizedLink } from "@/components/LocalizedLink";
import { NewsletterForm } from "@/components/forms/InquiryForms";
import { Icon, type IconName } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

type FooterLink = {
  label: string;
  href: string;
};

const propertiesLinks: FooterLink[] = [
  { label: "Buy Properties", href: "/properties?listing=sale" },
  { label: "Rent Properties", href: "/properties?listing=rent" },
  { label: "Exclusives", href: "/properties?exclusive=1" },
  { label: "New Launches", href: "/off-plan" },
];

const areasLinks: FooterLink[] = [
  { label: "Palm Jumeirah", href: "/areas/palm-jumeirah" },
  { label: "Dubai Marina", href: "/areas/dubai-marina" },
  { label: "Downtown", href: "/areas/downtown-dubai" },
  { label: "Business Bay", href: "/areas/business-bay" },
  { label: "All Areas", href: "/areas" },
];

const offPlanLinks: FooterLink[] = [
  { label: "Featured Projects", href: "/off-plan?featured=1" },
  { label: "Upcoming", href: "/off-plan?status=launching" },
  { label: "Payment Plans", href: "/off-plan" },
  { label: "Developers", href: "/developers" },
];

const resourcesLinks: FooterLink[] = [
  { label: "FAQ", href: "/faq" },
  { label: "AI Concierge", href: "/concierge" },
  { label: "Submit Article", href: "/contribute" },
];

const insightsLinks: FooterLink[] = [
  { label: "Market Intelligence", href: "/insights?category=market-intelligence" },
  { label: "Investment Guides", href: "/insights?category=investment-guides" },
  { label: "Golden Visa", href: "/insights?category=golden-visa" },
  { label: "Journal", href: "/insights" },
];

const aboutLinks: FooterLink[] = [
  { label: "Our Approach", href: "/about#approach" },
  { label: "Why NIP", href: "/about#why-nip" },
  { label: "Team", href: "/about#team" },
  { label: "Careers", href: "/about#careers" },
];

const socialLinks: { label: string; icon: IconName; href: string }[] = [
  { label: "Instagram", icon: "instagram", href: "https://instagram.com" },
  { label: "Facebook", icon: "facebook", href: "https://facebook.com" },
  { label: "LinkedIn", icon: "linkedin", href: "https://linkedin.com" },
  { label: "Youtube", icon: "youtube", href: "https://youtube.com" },
];

const legalLinks: FooterLink[] = [
  { label: "Privacy", href: "/legal#overview" },
  { label: "Terms", href: "/legal#terms" },
  { label: "Cookies", href: "/legal#cookies" },
  { label: "Disclaimer", href: "/legal#disclaimer" },
  { label: "RERA Information", href: "/legal#rera" },
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: FooterLink[];
}) {
  return (
    <div className="flex w-[103px] flex-col gap-3.5">
      <h3 className="text-[12px] font-semibold leading-4 text-white">{title}</h3>
      <ul className="flex flex-col gap-[9px] text-[12px] leading-4 text-basalt-300">
        {links.map((link) => (
          <li key={link.label}>
            <LocalizedLink
              href={link.href}
              className="transition-colors hover:text-white"
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
}: {
  icon: IconName;
  children: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-2 p-1">
      <Icon name={icon} className="mt-0.5 h-3.5 w-3.5 shrink-0 text-basalt-300" />
      <span>{children}</span>
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
};

export function FooterContent({
  tagline,
  newsletterTitle,
  newsletterDesc,
}: FooterContentProps) {
  return (
    <footer className="w-full bg-sapphire-800 text-white">
      <div
        className={`flex flex-col items-center gap-12 pb-10 pt-16 lg:pt-20 ${siteChromeClassName}`}
      >
        <div className="flex w-full flex-wrap items-start justify-center gap-x-[142px] gap-y-12 rtl:flex-row-reverse">
          <div className="flex w-full max-w-[240px] flex-col gap-12">
            <div className="flex flex-col gap-4">
              <LocalizedLink href="/">
                <Logo inverted />
              </LocalizedLink>
              <div className="max-w-[240px] text-[12px] leading-4 text-basalt-300">
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
            <FooterLinkGroup title="Properties" links={propertiesLinks} />
            <FooterLinkGroup title="Areas" links={areasLinks} />
          </div>

          <div className="flex flex-col gap-12 text-[12px] leading-4">
            <FooterLinkGroup title="Off-Plan" links={offPlanLinks} />
            <FooterLinkGroup title="Resources" links={resourcesLinks} />
          </div>

          <div className="flex flex-col gap-12 text-[12px] leading-4">
            <FooterLinkGroup title="Insights" links={insightsLinks} />
            <FooterLinkGroup title="About NIP" links={aboutLinks} />
          </div>

          <div className="flex flex-col gap-12">
            <div className="flex flex-col gap-3.5">
              <h3 className="text-[12px] font-semibold leading-4 text-white">
                Contact
              </h3>
              <ul className="flex flex-col gap-1 text-[12px] leading-4 text-basalt-300">
                <FooterContactRow icon="phone">+971 50 165 2441</FooterContactRow>
                <FooterContactRow icon="mail">info@niprealty.com</FooterContactRow>
                <FooterContactRow icon="mapPin">
                  113, The Offices 3,
                  <br />
                  One Central, Dubai, UAE
                </FooterContactRow>
              </ul>
            </div>

            <div className="flex flex-col gap-3.5">
              <h3 className="text-[12px] font-semibold leading-4 text-white">
                Follow Us
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
                      <Icon name={icon} className="h-3.5 w-3.5 shrink-0" />
                      {label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="h-px w-full bg-basalt-300" />

        <div className="flex w-full flex-col gap-5 text-[12px] leading-4 md:flex-row md:items-center md:justify-between rtl:md:flex-row-reverse">
          <p className="text-basalt-300">
            &copy; 2026 NIP — Novel Insight Property. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-text-inactive">
            {legalLinks.map((link) => (
              <LocalizedLink
                key={link.label}
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
              Staff login
            </LocalizedLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
