"use client";

import { FooterStatic } from "./FooterStatic";
import { Header } from "./Header";
import { StickyCta } from "./StickyCta";

export type SiteShellClientProps = {
  children: React.ReactNode;
};

/** Client-safe site shell for error boundaries — no server-only CMS components. */
export function SiteShellClient({ children }: SiteShellClientProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <StickyCta />
      <Header />
      <main className="flex-1">{children}</main>
      <FooterStatic />
    </div>
  );
}
