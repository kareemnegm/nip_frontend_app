import { Footer } from "./Footer";
import { Header } from "./Header";
import { MotionRoot } from "./motion";
import { StickyCta } from "./StickyCta";

export type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <MotionRoot />
      <StickyCta />
      <Header />
      <main className="flex flex-1 flex-col">{children}</main>
      <Footer />
    </div>
  );
}
