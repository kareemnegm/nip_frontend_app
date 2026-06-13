import Link from "next/link";
import { MobileNav } from "./MobileNav";
import { SpeakWithNipButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/insights" },
  { label: "Properties", href: "/properties" },
  { label: "Off-Plan", href: "/off-plan" },
  { label: "Areas", href: "/areas" },
  { label: "Developers", href: "/developers" },
  { label: "Concierge", href: "/concierge" },
];

export function Header() {
  return (
    <header
      id="site-header"
      className="relative z-40 w-full border border-line bg-white"
    >
      <div className={`flex items-center justify-between py-5 lg:py-6 ${siteChromeClassName}`}>
        <Logo className="shrink-0" />

        <nav className="hidden items-center gap-[28px] text-body-sm font-medium text-ink xl:flex">
          {navItems.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className={
                item.label === "Home"
                  ? "transition-colors hover:text-brand"
                  : "inline-flex items-center gap-1 transition-colors hover:text-brand"
              }
            >
              {item.label}
              {item.label !== "Home" ? (
                <Icon name="chevronDown" className="h-2.5 w-2.5 shrink-0" />
              ) : null}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-4">
          <div className="hidden items-center gap-1.5 rounded-[var(--radius-field)] px-2.5 py-2 md:flex">
            <Icon
              name="globe"
              className="h-[18px] w-[18px] shrink-0 text-brand"
            />
            <span className="text-overline font-semibold leading-4 text-sapphire-600">
              EN
            </span>
            <span className="h-3 w-px bg-ink-secondary" />
            <span className="text-overline font-semibold leading-4 text-ink-secondary">
              AR
            </span>
          </div>
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
