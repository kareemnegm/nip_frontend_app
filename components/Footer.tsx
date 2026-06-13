import { Icon, type IconName } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

const propertiesLinks = [
  "Buy Properties",
  "Rent Properties",
  "Exclusives",
  "New Launches",
];

const areasLinks = [
  "Palm Jumeirah",
  "Dubai Marina",
  "Downtown",
  "Business Bay",
  "All Areas",
];

const offPlanLinks = [
  "Featured Projects",
  "Upcoming",
  "Payment Plans",
  "Developers",
];

const resourcesLinks = ["FAQ", "AI Concierge", "Submit Article"];

const insightsLinks = [
  "Market Intelligence",
  "Investment Guides",
  "Golden Visa",
  "Journal",
];

const aboutLinks = ["Our Approach", "Why NIP", "Team", "Careers"];

const socialLinks: { label: string; icon: IconName }[] = [
  { label: "Instagram", icon: "instagram" },
  { label: "Facebook", icon: "facebook" },
  { label: "LinkedIn", icon: "linkedin" },
  { label: "Youtube", icon: "youtube" },
];

const legalLinks = [
  "Privacy",
  "Terms",
  "Cookies",
  "Disclaimer",
  "RERA Information",
];

function FooterLinkGroup({
  title,
  links,
}: {
  title: string;
  links: string[];
}) {
  return (
    <div className="flex w-[103px] flex-col gap-3.5">
      <h3 className="text-[12px] font-semibold leading-4 text-white">{title}</h3>
      <ul className="flex flex-col gap-[9px] text-[12px] leading-4 text-basalt-300">
        {links.map((link) => (
          <li key={link}>
            <a href="#" className="transition-colors hover:text-white">
              {link}
            </a>
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

export function Footer() {
  return (
    <footer className="w-full bg-sapphire-800 text-white">
      <div
        className={`flex flex-col items-center gap-12 pb-10 pt-16 lg:pt-20 ${siteChromeClassName}`}
      >
        <div className="flex w-full flex-wrap items-start justify-center gap-x-[142px] gap-y-12">
          <div className="flex w-full max-w-[240px] flex-col gap-12">
            <div className="flex flex-col gap-4">
              <Logo inverted />
              <p className="max-w-[240px] text-[12px] leading-4 text-basalt-300">
                Curated real estate advisory focused on exceptional residences
                and long-term market insight across Dubai.
              </p>
            </div>

            <div className="flex flex-col gap-3.5">
              <h3 className="text-[12px] font-semibold leading-4 text-white">
                Stay Ahead of the Market
              </h3>
              <p className="max-w-[240px] text-[12px] leading-4 text-basalt-300">
                Curated market updates from Dubai&apos;s leading communities.
              </p>
              <form className="flex w-full max-w-[240px] items-center justify-between overflow-hidden rounded-[var(--radius-field)] bg-sapphire-50 py-1 pl-3.5 pr-1">
                <input
                  aria-label="Your email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 bg-transparent text-[12px] leading-4 text-ink outline-none placeholder:text-text-inactive"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="inline-flex shrink-0 items-center justify-center rounded-[var(--radius-field)] bg-sapphire-600 px-1.5 py-[5px] text-white transition-colors hover:bg-accent-hover"
                >
                  <Icon name="arrowRight" className="h-3.5 w-3.5" />
                </button>
              </form>
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
                {socialLinks.map(({ label, icon }) => (
                  <li key={label}>
                    <a
                      href="#"
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

        <div className="flex w-full flex-col gap-5 text-[12px] leading-4 md:flex-row md:items-center md:justify-between">
          <p className="text-basalt-300">
            &copy; 2026 NIP — Novel Insight Property. All rights reserved.
          </p>
          <div className="flex flex-wrap gap-x-5 gap-y-2 text-text-inactive">
            {legalLinks.map((link) => (
              <a
                key={link}
                href="#"
                className="transition-colors hover:text-white"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
