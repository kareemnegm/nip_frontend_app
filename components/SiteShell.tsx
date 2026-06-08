import { Footer } from "./Footer";
import { Header } from "./Header";

export type SiteShellProps = {
  children: React.ReactNode;
};

export function SiteShell({ children }: SiteShellProps) {
  return (
    <div className="flex min-h-screen flex-col bg-background text-ink">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
}
