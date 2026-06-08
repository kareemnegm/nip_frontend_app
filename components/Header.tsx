import { MobileNav } from "./MobileNav";
import { Button } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";

const navItems = [
  { label: "Home", href: "/" },
  { label: "Insights", href: "/insights", hasMenu: true },
  { label: "Properties", href: "/properties", hasMenu: true },
  { label: "Off-Plan", href: "/off-plan", hasMenu: true },
  { label: "Areas", href: "/areas", hasMenu: true },
  { label: "Developers", href: "/developers", hasMenu: true },
  { label: "Concierge", href: "/concierge", hasMenu: true },
];

export function Header() {
  return (
    <header className="sticky top-0 z-40 border-b border-line/60 bg-white/95 py-4 backdrop-blur-sm sm:py-5">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-14 items-center justify-between gap-4 sm:min-h-16 sm:gap-6">
          <Logo className="shrink-0" />
          <nav className="hidden items-center gap-5 text-sm font-semibold text-ink xl:flex">
            {navItems.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="flex items-center gap-1 hover:text-brand"
              >
                {item.label}
                {item.hasMenu ? (
                  <Icon name="chevronDown" className="h-3 w-3" />
                ) : null}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden items-center gap-2 text-sm font-semibold text-ink md:flex">
              <Icon name="globe" className="h-4 w-4 text-brand" />
              <span>EN | AR</span>
            </div>
            <Button href="/contact" size="sm" className="hidden sm:inline-flex">
              Speak with NIP
            </Button>
            <MobileNav />
          </div>
        </div>
      </div>
    </header>
  );
}
