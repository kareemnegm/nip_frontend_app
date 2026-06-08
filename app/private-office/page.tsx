import type { Metadata } from "next";
import Link from "next/link";
import { SiteShell } from "@/components/SiteShell";
import { Button, Container, Icon, Logo } from "@/components/ui";
import { TextInput } from "@/components/ui/FormControls";

export const metadata: Metadata = {
  title: "Private Office | NIP Reality",
};

export default function PrivateOfficePage() {
  return (
    <SiteShell>
      <section className="w-full bg-sapphire-50">
        <Container className="flex min-h-[70vh] items-center justify-center py-16">
          <div className="w-full max-w-md rounded-[var(--radius-card)] border border-line bg-white p-8 shadow-[var(--shadow-card)] sm:p-10">
            <div className="flex items-start justify-between">
              <Logo />
              <span className="text-right text-[10px] font-semibold uppercase leading-tight tracking-wide text-ink-tertiary">
                For Those Who
                <br />
                Expect More
              </span>
            </div>

            <div className="mt-8 text-center">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-brand text-white">
                <Icon name="lock" className="h-5 w-5" />
              </span>
              <p className="mt-4 text-[11px] font-semibold uppercase tracking-[0.18em] text-ink-tertiary">
                Private Office
              </p>
              <h1 className="mt-3 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand">
                Your Private Space
              </h1>
              <p className="mx-auto mt-3 max-w-xs text-sm leading-6 text-ink-secondary">
                Access is by invitation. Sign in to view your curated selection, saved
                properties and advisor.
              </p>
            </div>

            <form className="mt-8 space-y-4">
              <TextInput label="Email" type="email" placeholder="you@email.com" />
              <TextInput label="Password" type="password" placeholder="••••••••" />
              <div className="flex justify-center pt-2">
                <Button type="submit">Sign In</Button>
              </div>
            </form>

            <p className="mt-6 text-center text-sm text-brand">
              <Link href="/contact" className="hover:underline">
                Request access
              </Link>
              <span className="mx-2 text-ink-tertiary">|</span>
              <Link href="/contact" className="hover:underline">
                Forgot password?
              </Link>
            </p>
          </div>
        </Container>
      </section>
    </SiteShell>
  );
}
