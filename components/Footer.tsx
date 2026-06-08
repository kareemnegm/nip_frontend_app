import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";

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

const socialLinks = ["Instagram", "Facebook", "LinkedIn", "Youtube"];

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
    <div>
      <h3 className="text-sm font-bold text-white">{title}</h3>
      <ul className="mt-4 space-y-3 text-sm text-text-inactive">
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

export function Footer() {
  return (
    <footer className="w-full bg-sapphire-800 text-white">
      <div className="mx-auto w-full max-w-[1440px] px-5 py-14 sm:px-8 sm:py-16 lg:px-12 lg:py-20 xl:px-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 xl:gap-12">
          <div className="space-y-8 sm:col-span-2 lg:col-span-1">
            <div>
              <Logo inverted />
              <p className="mt-5 max-w-xs text-sm leading-6 text-text-inactive">
                Curated real estate advisory focused on exceptional residences
                and long-term market insight across Dubai.
              </p>
            </div>

            <div>
              <h3 className="text-sm font-bold text-white">
                Stay Ahead of the Market
              </h3>
              <p className="mt-3 text-sm leading-6 text-text-inactive">
                Curated market updates from Dubai&apos;s leading communities.
              </p>
              <form className="mt-4 flex w-full max-w-xs overflow-hidden rounded-[var(--radius-field)] bg-white">
                <input
                  aria-label="Your email"
                  placeholder="Your email"
                  className="min-w-0 flex-1 px-3 py-2.5 text-sm text-ink outline-none placeholder:text-ink-tertiary"
                />
                <button
                  type="submit"
                  aria-label="Subscribe"
                  className="inline-flex shrink-0 items-center justify-center bg-accent px-3 text-white transition-colors hover:bg-accent-hover"
                >
                  <Icon name="arrowRight" className="h-4 w-4" />
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <FooterLinkGroup title="Properties" links={propertiesLinks} />
            <FooterLinkGroup title="Areas" links={areasLinks} />
          </div>

          <div className="space-y-8">
            <FooterLinkGroup title="Off-Plan" links={offPlanLinks} />
            <FooterLinkGroup title="Resources" links={resourcesLinks} />
          </div>

          <div className="space-y-8">
            <FooterLinkGroup title="Insights" links={insightsLinks} />
            <FooterLinkGroup title="About NIP" links={aboutLinks} />
          </div>

          <div className="space-y-8">
            <div>
              <h3 className="text-sm font-bold text-white">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-text-inactive">
                <li className="flex items-start gap-2.5">
                  <Icon name="phone" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span>+971 50 165 2441</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="mail" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span>info@niprealty.com</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <Icon name="mapPin" className="mt-0.5 h-4 w-4 shrink-0 text-white" />
                  <span>113, The Offices 3, One Central, Dubai, UAE</span>
                </li>
              </ul>
            </div>

            <FooterLinkGroup title="Follow Us" links={socialLinks} />
          </div>
        </div>

        <div className="mt-12 border-t border-white/15 pt-8 text-sm text-text-inactive lg:mt-14">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <p>
              &copy; 2026 NIP &mdash; Novel Insight Property. All rights
              reserved.
            </p>
            <div className="flex flex-wrap gap-x-6 gap-y-2">
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
      </div>
    </footer>
  );
}
