import { DesktopNav } from "./DesktopNav";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { LocalizedLink } from "./LocalizedLink";
import { MobileNav } from "./MobileNav";
import { SpeakWithNipButton } from "./ui/Button";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";
import { cn } from "@/lib/cn";

export function Header() {
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

        <DesktopNav />

        <div className="flex shrink-0 items-center gap-3 lg:justify-self-end xl:gap-4">
          <LanguageSwitcher variant="header" className="hidden lg:flex" />
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
