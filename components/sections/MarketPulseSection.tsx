import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { marketPulseStats } from "./home-data";
import { SectionHeading } from "./SectionHeading";

export function MarketPulseSection() {
  return (
    <section className="bg-background py-16 sm:py-20 lg:py-24">
      <Container className="space-y-10 lg:space-y-12">
        <SectionHeading
          title="Market Pulse"
          description="Track the market signals that matter before they become headlines."
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {marketPulseStats.map((stat) => (
            <div
              key={stat.label}
              className="rounded-[var(--radius-card)] bg-brand px-6 py-8 text-white"
            >
              <p className="text-xs font-medium uppercase tracking-wide text-white/60">
                {stat.label}
              </p>
              <p className="mt-3 text-2xl font-bold sm:text-3xl">{stat.value}</p>
            </div>
          ))}
        </div>
        <p className="text-center">
          <Link
            href="/insights"
            className="text-sm font-semibold text-brand underline underline-offset-4 hover:text-brand-hover"
          >
            View Market Perspective
          </Link>
        </p>
      </Container>
    </section>
  );
}
