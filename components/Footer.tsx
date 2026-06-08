import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";

const columns = [
  {
    title: "Properties",
    links: ["Buy Properties", "Rent Properties", "Exclusives", "New Launches"],
  },
  {
    title: "Off-Plan",
    links: ["Featured Projects", "Upcoming", "Payment Plans", "Developers"],
  },
  {
    title: "Insights",
    links: ["Market Intelligence", "Investment Guides", "Golden Visa", "Journal"],
  },
  {
    title: "Areas",
    links: ["Palm Jumeirah", "Dubai Marina", "Downtown", "Business Bay", "All Areas"],
  },
  {
    title: "Resources",
    links: ["FAQ", "AI Concierge", "Submit Article"],
  },
  {
    title: "About NIP",
    links: ["Our Approach", "Why NIP", "Team", "Careers"],
  },
];

const legalLinks = ["Privacy", "Terms", "Cookies", "Disclaimer", "RERA Information"];
const socialLinks = ["Instagram", "Facebook", "LinkedIn", "Youtube"];

export function Footer() {
  return (
    <footer className="bg-background py-10">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-[var(--radius-field)] bg-ink px-8 py-12 text-white lg:px-16">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_2fr_1fr]">
            <div className="space-y-8">
              <div>
                <Logo inverted />
                <p className="mt-5 max-w-64 text-sm leading-6 text-white/60">
                  Curated real estate advisory focused on exceptional residences and
                  long-term market insight across Dubai.
                </p>
              </div>
              <div>
                <h3 className="text-sm font-bold">Stay Ahead of the Market</h3>
                <p className="mt-3 text-sm leading-6 text-white/60">
                  Curated market updates from Dubai&apos;s leading communities.
                </p>
                <form className="mt-4 flex max-w-56 overflow-hidden rounded-[var(--radius-field)] bg-white">
                  <input
                    aria-label="Your email"
                    placeholder="Your email"
                    className="min-w-0 flex-1 px-3 text-sm text-ink outline-none"
                  />
                  <Button type="submit" size="sm" className="rounded-l-none px-3">
                    <Icon name="arrowRight" className="h-4 w-4" />
                  </Button>
                </form>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-x-10 gap-y-8 md:grid-cols-3">
              {columns.map((column) => (
                <div key={column.title}>
                  <h3 className="text-sm font-bold">{column.title}</h3>
                  <ul className="mt-4 space-y-3 text-sm text-white/55">
                    {column.links.map((link) => (
                      <li key={link}>
                        <a href="#" className="hover:text-white">
                          {link}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>

            <div className="space-y-8">
              <div>
                <h3 className="text-sm font-bold">Contact</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/60">
                  <li className="flex gap-2">
                    <Icon name="phone" className="h-4 w-4 text-white" />
                    +971 50 165 2441
                  </li>
                  <li className="flex gap-2">
                    <Icon name="mail" className="h-4 w-4 text-white" />
                    info@niprealty.com
                  </li>
                  <li className="flex gap-2">
                    <Icon name="mapPin" className="h-4 w-4 text-white" />
                    113, The Offices 3, One Central, Dubai, UAE
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-sm font-bold">Follow Us</h3>
                <ul className="mt-4 space-y-3 text-sm text-white/60">
                  {socialLinks.map((link) => (
                    <li key={link}>
                      <a href="#" className="hover:text-white">
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-white/25 pt-8 text-sm text-white/45">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <p>2026 NIP - Novel Insight Property. All rights reserved.</p>
              <div className="flex flex-wrap gap-5">
                {legalLinks.map((link) => (
                  <a key={link} href="#" className="hover:text-white">
                    {link}
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
