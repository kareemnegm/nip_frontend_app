import Link from "next/link";
import { Container } from "@/components/ui/Container";
import { Icon } from "@/components/ui/Icon";
import { marketPulseStats } from "./home-data";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";

export async function MarketPulseSection() {
  return (
    <section className="bg-white py-16 sm:py-20">
      <Container className="max-w-[1056px] space-y-10 px-6">
        <SectionHeading
          title="Market Pulse"
          description="Track the Market Signals that matter before they Become Headlines"
          editable={{
            relUrl: homeEditable.relUrl,
            titleKey: homeEditable.marketPulse.titleKey,
            descKey: homeEditable.marketPulse.descKey,
          }}
        />
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {marketPulseStats.map((stat, index) => (
            <div
              key={stat.label}
              className={[
                "rounded-[var(--radius-card)] px-7 py-6 text-white",
                ["bg-sapphire-400", "bg-sapphire-500", "bg-sapphire-600", "bg-sapphire-700"][index],
              ].join(" ")}
            >
              <p className="text-xs leading-4 text-sapphire-100">
                {stat.context}
              </p>
              <p className="mt-4 flex items-center gap-1.5 text-4xl font-bold leading-[42px]">
                {stat.icon ? <Icon name="currency" className="h-6 w-6" /> : null}
                {stat.value}
              </p>
              <p className="mt-4 text-xs font-semibold leading-4 text-white">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
        <p className="text-center">
          <Link
            href="/insights"
            className="inline-flex h-9 items-center justify-center rounded-[var(--radius-field)] border border-sapphire-300 px-6 text-[13px] font-semibold leading-[18px] text-brand hover:bg-sapphire-50"
          >
            View Market Perspective
          </Link>
        </p>
      </Container>
    </section>
  );
}
