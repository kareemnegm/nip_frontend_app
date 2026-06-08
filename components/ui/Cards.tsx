import { cn } from "@/lib/cn";
import { Button } from "./Button";
import { Icon } from "./Icon";

type BaseCardProps = {
  className?: string;
};

type PropertyCardProps = BaseCardProps & {
  title: string;
  location: string;
  price: string;
  imageLabel?: string;
  meta?: string[];
  badges?: string[];
};

type InsightCardProps = BaseCardProps & {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
};

type AdvisorCardProps = BaseCardProps & {
  title: string;
  excerpt: string;
};

type CommunityCardProps = BaseCardProps & {
  title: string;
  facts: string[];
};

function ImagePlaceholder({ dark = false }: { dark?: boolean }) {
  return (
    <div
      className={cn(
        "flex aspect-[1.55] items-center justify-center rounded-t-[var(--radius-card)]",
        dark ? "bg-sapphire-200/30" : "bg-sapphire-100",
      )}
    >
      <Icon
        name="home"
        className={cn("h-16 w-16", dark ? "text-white/70" : "text-white")}
      />
    </div>
  );
}

export function PropertyCard({
  title,
  location,
  price,
  imageLabel,
  meta = ["2 Beds", "3 Baths", "2,315 sq ft"],
  badges = ["Apartment", "For Sale"],
  className,
}: PropertyCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <ImagePlaceholder />
      {imageLabel ? <span className="sr-only">{imageLabel}</span> : null}
      <div className="space-y-4 p-5">
        <div>
          <h3 className="text-xl font-bold text-brand">{title}</h3>
          <p className="mt-2 flex items-center gap-1 text-xs text-ink-secondary">
            <Icon name="mapPin" className="h-4 w-4 text-brand" />
            {location}
          </p>
        </div>
        <div className="flex flex-wrap gap-4 text-xs font-semibold text-ink">
          {meta.map((item) => (
            <span key={item}>{item}</span>
          ))}
        </div>
        <div className="flex items-end justify-between gap-4">
          <div>
            <p className="text-xs text-ink-tertiary">Starting From</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {badges.map((badge) => (
                <span
                  key={badge}
                  className="rounded bg-sapphire-50 px-2 py-1 text-[10px] font-semibold text-ink-secondary"
                >
                  {badge}
                </span>
              ))}
            </div>
          </div>
          <div className="text-right">
            <p className="text-xl font-bold text-brand">{price}</p>
            <Button variant="link">Explore Property <Icon name="arrowRight" className="h-4 w-4" /></Button>
          </div>
        </div>
      </div>
    </article>
  );
}

export function OffPlanCard({
  title,
  location,
  price,
  className,
}: Pick<PropertyCardProps, "title" | "location" | "price" | "className">) {
  return (
    <PropertyCard
      title={title}
      location={location}
      price={price}
      meta={["Handover Q4 2026"]}
      badges={["Off-Plan", "Payment Plan Available"]}
      className={className}
    />
  );
}

export function InsightCard({
  category,
  title,
  excerpt,
  readTime = "6 min read",
  className,
}: InsightCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <ImagePlaceholder />
      <div className="space-y-4 p-6">
        <p className="text-[10px] font-bold uppercase tracking-wide text-brand">
          {category}
        </p>
        <h3 className="text-xl font-bold text-brand">{title}</h3>
        <p className="text-sm leading-6 text-ink-secondary">{excerpt}</p>
        <div className="flex items-center justify-between gap-4 text-xs text-ink-tertiary">
          <span>{readTime}</span>
          <Button variant="link">Read the Insight <Icon name="arrowRight" className="h-4 w-4" /></Button>
        </div>
      </div>
    </article>
  );
}

export function AdvisorCard({ title, excerpt, className }: AdvisorCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] bg-ink text-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <ImagePlaceholder dark />
      <div className="space-y-4 p-6">
        <span className="rounded bg-white/20 px-2 py-1 text-[10px] font-bold uppercase">
          Private
        </span>
        <h3 className="text-xl font-bold">{title}</h3>
        <p className="text-sm leading-6 text-white/75">{excerpt}</p>
        <div className="flex items-center justify-between text-xs text-white/75">
          <span className="flex items-center gap-2">
            <Icon name="clock" className="h-4 w-4" />
            Advisor-Released
          </span>
          <Button variant="secondary" size="sm">
            View <Icon name="arrowRight" className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </article>
  );
}

export function CommunityCard({ title, facts, className }: CommunityCardProps) {
  return (
    <article
      className={cn(
        "overflow-hidden rounded-[var(--radius-card)] border border-line bg-white shadow-[var(--shadow-card)]",
        className,
      )}
    >
      <ImagePlaceholder />
      <div className="space-y-4 p-5">
        <h3 className="flex items-center gap-2 text-xl font-bold text-brand">
          <Icon name="mapPin" className="h-5 w-5" />
          {title}
        </h3>
        <div className="grid grid-cols-2 gap-3 text-xs font-semibold text-ink-secondary">
          {facts.map((fact) => (
            <span key={fact}>{fact}</span>
          ))}
        </div>
        <Button variant="link">Explore Area <Icon name="arrowRight" className="h-4 w-4" /></Button>
      </div>
    </article>
  );
}
