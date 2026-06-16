import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { MobileNav } from "./MobileNav";
import { SpeakWithNipButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

const navItems = [
  { label: "Home", href: "/" as const },
  { label: "Sale", href: "/properties" as const },
  { label: "Off-Plan", href: "/off-plan" as const },
  { label: "Developers", href: "/developers" as const },
  { label: "Areas", href: "/areas" as const },
  { label: "Insights", href: "/insights" as const },
  { label: "Concierge", href: "/concierge" as const },
] as const;

const saleDropdownItems = [
  { label: "Apartments", href: "/properties?type=Apartment" as const },
  { label: "Townhouses", href: "/properties?type=Townhouse" as const },
  { label: "Villas", href: "/properties?type=Villa" as const },
] as const;

const offPlanDropdownItems = [
  { label: "Apartments", href: "/off-plan?type=Apartment" as const },
  { label: "Townhouses", href: "/off-plan?type=Townhouse" as const },
  { label: "Villas", href: "/off-plan?type=Villa" as const },
] as const;

export function Header() {
  return (
    <header
      id="site-header"
      className="relative z-40 w-full border border-line bg-white"
    >
      <div
        className={`flex items-center justify-between py-5 lg:py-6 ${siteChromeClassName}`}
      >
        <LocalizedLink href="/" className="shrink-0">
          <Logo className="shrink-0" />
        </LocalizedLink>

        <nav className="hidden items-center gap-[28px] text-body-sm font-medium text-ink xl:flex">
          {navItems.map((item) => {
            if (item.label === "Sale" || item.label === "Off-Plan") {
              const dropdownItems =
                item.label === "Sale" ? saleDropdownItems : offPlanDropdownItems;
              return (
                <div key={item.label} className="relative group">
                  <LocalizedLink
                    href={item.href}
                    className="inline-flex items-center gap-1 transition-colors hover:text-brand"
                  >
                    {item.label}
                    <Icon name="chevronDown" className="h-2.5 w-2.5 shrink-0" />
                  </LocalizedLink>
                  <div className="pointer-events-none absolute left-1/2 top-full z-30 hidden -translate-x-1/2 pt-3 group-hover:pointer-events-auto group-hover:block">
                    <div className="min-w-[180px] rounded-[var(--radius-card)] border border-line bg-white py-3 shadow-[var(--shadow-card)]">
                      <ul className="flex flex-col gap-1">
                        {dropdownItems.map((link) => (
                          <li key={link.label}>
                            <LocalizedLink
                              href={link.href}
                              className="block px-5 py-2 text-[13px] leading-[18px] text-ink hover:bg-sapphire-50 hover:text-brand"
                            >
                              {link.label}
                            </LocalizedLink>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </div>
              );
            }

            return (
              <LocalizedLink
                key={item.label}
                href={item.href}
                className={
                  item.label === "Home"
                    ? "transition-colors hover:text-brand"
                    : "inline-flex items-center gap-1 transition-colors hover:text-brand"
                }
              >
                {item.label}
              </LocalizedLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <LanguageSwitcher variant="header" />
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
