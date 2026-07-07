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
          "flex h-[82px] items-center justify-between",
          "xl:grid xl:grid-cols-[1fr_auto_1fr] xl:items-center",
        )}
      >
        <LocalizedLink href="/" className="shrink-0 xl:justify-self-start">
          <Logo className="shrink-0" />
        </LocalizedLink>

        <DesktopNav />

        <div className="flex shrink-0 items-center gap-4 xl:justify-self-end">
          <LanguageSwitcher variant="header" className="hidden xl:flex" />
          <SpeakWithNipButton className="hidden sm:inline-flex" />
          <MobileNav />
        </div>
      </div>
    </header>
  );
}
