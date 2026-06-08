import { Button } from "@/components/ui/Button";
import { Container } from "@/components/ui/Container";

export function HomeHeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-sapphire-800 via-brand to-ink py-20 text-white sm:py-24 lg:py-32">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.08),transparent_55%)]" />
      <Container className="relative text-center">
        <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-gold sm:text-xs">
          A Prudent, Knowledge-First Global Real Estate Advisory
        </p>
        <h1 className="mx-auto mt-6 max-w-4xl font-[family-name:var(--font-display)] text-4xl font-semibold leading-tight tracking-tight sm:text-5xl lg:text-6xl">
          For Those Who Expect More
        </h1>
        <p className="mx-auto mt-6 max-w-2xl text-sm leading-7 text-white/75 sm:text-base">
          Discreet advisory for elevated living. We combine market intelligence,
          curated access, and long-term perspective for buyers, investors, and
          families seeking exceptional residences across Dubai.
        </p>
        <div className="mt-10 flex flex-col items-stretch justify-center gap-4 sm:flex-row sm:items-center">
          <Button href="/insights" variant="accent" size="lg" className="w-full sm:w-auto">
            View the Latest Insights
          </Button>
          <Button
            href="/contact"
            variant="outlineInverse"
            size="lg"
            className="w-full sm:w-auto"
          >
            Speak with NIP
          </Button>
        </div>
      </Container>
    </section>
  );
}
