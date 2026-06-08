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
    <header className="bg-background py-6">
      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex min-h-16 items-center justify-between gap-6 rounded-[var(--radius-field)] border border-line bg-white px-6 shadow-sm">
          <Logo />
          <nav className="hidden items-center gap-6 text-sm font-semibold text-ink lg:flex">
            {navItems.map((item) => (
              <a key={item.label} href={item.href} className="flex items-center gap-1 hover:text-brand">
                {item.label}
                {item.hasMenu ? <Icon name="chevronDown" className="h-3 w-3" /> : null}
              </a>
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="hidden items-center gap-2 text-sm font-semibold text-ink md:flex">
              <Icon name="globe" className="h-4 w-4 text-brand" />
              <span>EN | AR</span>
            </div>
            <Button href="/contact" size="sm">
              Speak with NIP
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
