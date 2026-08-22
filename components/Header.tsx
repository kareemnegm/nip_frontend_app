import { DesktopNav } from "./DesktopNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { MobileNav } from "./MobileNav";
import { SpeakWithNipButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getNavigation } from "@/lib/api/navigation";
import { mainNavItems } from "@/lib/i18n/nav-config";
import { getRequestLocale } from "@/lib/i18n/server";
import { extraNavLinksForZone } from "@/lib/page-builder/nav-placement";
import { NAV_ZONE_KEYS } from "@/lib/navigation/zone-keys";
import { TEMP_HIDE_MAIN_NAV_CONCIERGE } from "@/lib/temporary-ui-flags";

export async function Header() {
  const locale = await getRequestLocale();
  const navigation = await getNavigation(locale);
  const extraLinks = extraNavLinksForZone(
    navigation.items,
    NAV_ZONE_KEYS.HEADER_MAIN,
    mainNavItems.map((item) => item.href),
  ).filter(
    (link) =>
      !(TEMP_HIDE_MAIN_NAV_CONCIERGE && link.href.split("?")[0] === "/concierge"),
  );

  return (
    <header
      id="site-header"
      className="relative z-40 w-full border border-line bg-white"
    >
      <div
        className={cn(
          siteChromeClassName,
          "lg:px-8 xl:px-20",
          "flex h-[82px] items-center justify-between",
          "lg:grid lg:grid-cols-[auto_1fr_auto] lg:items-center xl:grid-cols-[1fr_auto_1fr]",
        )}
      >
        <LocalizedLink href="/" className="shrink-0 lg:justify-self-start">
          <Logo className="shrink-0" />
        </LocalizedLink>

        <DesktopNav extraLinks={extraLinks} />

        <div className="flex shrink-0 items-center gap-3 lg:justify-self-end xl:gap-4">
          <LanguageSwitcher variant="header" className="hidden lg:flex" />
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav extraLinks={extraLinks} />
        </div>
      </div>
    </header>
  );
}
