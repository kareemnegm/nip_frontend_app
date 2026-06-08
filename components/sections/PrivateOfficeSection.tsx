import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

function OfficeCrest() {
  return (
    <div
      aria-hidden
      className="mx-auto flex h-16 w-16 items-center justify-center rounded-full border border-gold/40 bg-white/5 text-gold"
    >
      <span className="font-[family-name:var(--font-display)] text-2xl font-semibold">
        N
      </span>
    </div>
  );
}

export function PrivateOfficeSection() {
  return (
    <section className="bg-ink py-16 text-white sm:py-20 lg:py-24">
      <Container className="mx-auto max-w-3xl text-center">
        <OfficeCrest />
        <h2 className="mt-8 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight sm:text-4xl lg:text-5xl">
          Private Office
        </h2>
        <p className="mt-6 text-sm leading-7 text-white/70 sm:text-base">
          An invitation-only advisory experience for clients who require
          discretion, bespoke sourcing, and a dedicated team aligned to a
          private mandate across Dubai&apos;s most exceptional residences.
        </p>
        <p className="mt-6 text-[10px] font-semibold uppercase tracking-[0.24em] text-gold">
          By Invitation Only
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Button href="/contact" variant="accent" size="lg" className="w-full sm:w-auto">
            Request Access
          </Button>
          <Button
            href="/sign-in"
            variant="outlineInverse"
            size="lg"
            className="w-full sm:w-auto"
          >
            Sign In
          </Button>
        </div>
      </Container>
    </section>
  );
}
