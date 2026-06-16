import Link from "next/link";
import { CommunityCard } from "@/components/ui/Cards";
import { Container } from "@/components/ui/Container";
import { CatalogEmptyState } from "@/components/ui/ApiPagination";
import { marketPulseStats } from "./home-data";
import { homeEditable } from "./home-editable";
import { SectionHeading } from "./SectionHeading";
import type { CommunityCardModel } from "@/lib/mappers/area";

export async function MarketPulseSection({
  areas = [],
}: {
  areas?: CommunityCardModel[];
}) {
  return (
    <>
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
                <p className="text-xs leading-4 text-sapphire-100">{stat.context}</p>
                <p className="mt-4 flex items-center gap-1.5 text-4xl font-bold leading-[42px]">
                  {stat.icon ? <span className="text-2xl">AED</span> : null}
                  {stat.value}
                </p>
                <p className="mt-4 text-xs font-semibold leading-4 text-white">{stat.label}</p>
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

      {areas.length > 0 ? (
        <section className="bg-sapphire-50 py-16 sm:py-20">
          <Container className="space-y-10">
            <SectionHeading title="Featured Areas" description="Communities shaping long-term value across Dubai." />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {areas.slice(0, 3).map((area) => (
                <CommunityCard key={area.href} {...area} />
              ))}
            </div>
          </Container>
        </section>
      ) : (
        <section className="bg-sapphire-50 py-16 sm:py-20">
          <Container>
            <CatalogEmptyState message="Area highlights will appear here once communities are published." />
          </Container>
        </section>
      )}
    </>
  );
}
