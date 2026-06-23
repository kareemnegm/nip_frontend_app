"use client";

import { LocalizedLink } from "./LocalizedLink";
import { MotionRoot } from "./motion";
import { StickyCta } from "./StickyCta";
import { Logo } from "./ui/Logo";
import { siteChromeClassName } from "./ui/SiteChrome";

export type SiteShellClientProps = {
  children: React.ReactNode;
};

/** Client-safe site shell for error boundaries — no server-only CMS or next-intl provider required. */
export function SiteShellClient({ children }: SiteShellClientProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <MotionRoot />
      <StickyCta />
      <header
        id="site-header"
        className="relative z-40 w-full border border-line bg-white"
      >
        <div className={`flex items-center justify-between py-5 lg:py-6 ${siteChromeClassName}`}>
          <LocalizedLink href="/" className="shrink-0">
            <Logo className="shrink-0" />
          </LocalizedLink>
        </div>
      </header>
      <main className="flex-1">{children}</main>
      <footer className="border-t border-line bg-sapphire-800 py-8 text-center text-sm text-basalt-300">
        © 2026 NIP — Novel Insight Property
      </footer>
    </div>
  );
}
