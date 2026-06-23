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
  mainNavItems,
  offPlanDropdownItems,
  propertiesDropdownItems,
} from "@/lib/i18n/nav-config";

const navLinkClass =
  "inline-flex items-center gap-1 text-[13px] font-medium leading-[18px] text-ink transition-colors hover:text-brand";

function NavCaret() {
  return <Icon name="chevronDown" className="h-2.5 w-2.5 shrink-0" />;
}

export async function Header() {
  const t = await getTranslations("nav");

  return (
    <header
      id="site-header"
      className="relative z-40 w-full border border-line bg-white"
    >
      <div
        className={cn(
          siteChromeClassName,
          "flex items-center justify-between py-6",
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
              const dropdownItems =
                item.dropdown === "properties"
                  ? propertiesDropdownItems
                  : offPlanDropdownItems;

              return (
                <div key={item.key} className="group relative">
                  <LocalizedLink href={item.href} className={navLinkClass}>
                    {t(item.key)}
                    <NavCaret />
                  </LocalizedLink>
                  <div className="pointer-events-none absolute start-1/2 top-full z-30 hidden -translate-x-1/2 pt-3 group-hover:pointer-events-auto group-hover:block rtl:translate-x-1/2">
                    <div className="min-w-[180px] rounded-[var(--radius-field)] border border-line bg-white py-3 shadow-[var(--shadow-card)]">
                      <ul className="flex flex-col gap-1">
                        {dropdownItems.map((link) => (
                          <li key={link.key}>
                            <LocalizedLink
                              href={link.href}
                              className="block px-5 py-2 text-[13px] leading-[18px] text-ink hover:bg-sapphire-50 hover:text-brand"
                            >
                              {t(link.key)}
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
