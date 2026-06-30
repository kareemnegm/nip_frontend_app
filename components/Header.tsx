import { getTranslations } from "next-intl/server";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { MobileNav } from "./MobileNav";
import { SpeakWithNipButton } from "./ui/Button";
import { Icon } from "./ui/Icon";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";
import { cn } from "@/lib/cn";
import {
  getNavDropdownItems,
  mainNavItems,
  type NavDropdownKey,
} from "@/lib/i18n/nav-config";

const navLinkClass =
  "nav-link inline-flex items-center gap-1 text-[13px] font-medium leading-[18px] text-ink transition-colors duration-200 hover:text-brand";

function NavCaret() {
  return (
    <Icon
      name="chevronDown"
      className="nav-caret h-2.5 w-2.5 shrink-0 transition-transform duration-300 ease-[var(--motion-ease-lux)]"
    />
  );
}

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header
      id="site-header"
      className="relative z-40 w-full border border-line bg-white"
    >
      <div
        dir="ltr"
        className={cn(
          siteChromeClassName,
          "flex h-[82px] items-center justify-between",
          "xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center",
        )}
      >
        <LocalizedLink href="/" className="shrink-0 xl:justify-self-start">
          <Logo className="shrink-0" />
        </LocalizedLink>

        <nav
          className="hidden items-center gap-[28px] xl:flex xl:justify-self-center"
          aria-label="Main"
        >
          {mainNavItems.map((item) => {
            if ("dropdown" in item) {
              const dropdownItems = getNavDropdownItems(
                item.dropdown as NavDropdownKey,
              );

              return (
                <div key={item.key} className="nav-dropdown group relative">
                  <LocalizedLink href={item.href} className={navLinkClass}>
                    {t(item.key)}
                    <NavCaret />
                  </LocalizedLink>
                  <div className="nav-dropdown-panel pointer-events-none absolute start-1/2 top-full z-30 -translate-x-1/2 pt-3 opacity-0 transition-[opacity,transform] duration-300 ease-[var(--motion-ease-lux)] group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100 rtl:translate-x-1/2">
                    <div className="min-w-[180px] translate-y-1 rounded-[var(--radius-field)] border border-line bg-white py-3 shadow-[var(--shadow-card)] transition-transform duration-300 ease-[var(--motion-ease-lux)] group-hover:translate-y-0 group-focus-within:translate-y-0">
                      <ul className="flex flex-col gap-1">
                        {dropdownItems.map((link) => (
                          <li key={link.key}>
                            <LocalizedLink
                              href={link.href}
                              className="block px-5 py-2 text-[13px] leading-[18px] text-ink transition-colors duration-200 hover:bg-sapphire-50 hover:text-brand"
                            >
                              {t(link.key as never)}
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
              <LocalizedLink key={item.key} href={item.href} className={navLinkClass}>
                {t(item.key)}
              </LocalizedLink>
            );
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-4 xl:justify-self-end">
          <LanguageSwitcher variant="header" className="hidden xl:flex" />
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
