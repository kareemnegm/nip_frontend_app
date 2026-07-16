import Image from "next/image";
import { AppLink as Link } from "@/components/AppLink";
import { cn } from "@/lib/cn";

export type FeaturedInsightCardProps = {
  category: string;
  title: string;
  excerpt: string;
  readTime?: string;
  href?: string;
  imageUrl?: string;
  featuredPrefix?: string;
  className?: string;
};

export function FeaturedInsightCard({
  category,
  title,
  excerpt,
  readTime = "Read time not available",
  href,
  imageUrl,
  featuredPrefix = "Featured",
  className,
}: FeaturedInsightCardProps) {
  const card = (
    <article
      className={cn(
        "flex flex-col overflow-hidden rounded-[var(--radius-card)] bg-basalt-50 lg:h-[360px] lg:flex-row lg:items-center lg:gap-10",
        href && "cursor-pointer",
        className,
      )}
    >
      {imageUrl ? (
        <div className="relative h-[220px] w-full shrink-0 bg-basalt-100 sm:h-[280px] lg:h-full lg:w-[520px] lg:rounded-l-[var(--radius-card)]">
          <Image
            src={imageUrl}
            alt={title}
            fill
            className="object-cover lg:rounded-l-[var(--radius-card)]"
            sizes="(max-width: 1024px) 100vw, 520px"
            priority
          />
        </div>
      ) : (
        <div className="h-[220px] w-full shrink-0 bg-basalt-100 sm:h-[280px] lg:h-full lg:w-[520px] lg:rounded-l-[var(--radius-card)]" />
      )}
      <div className="flex shrink-0 flex-col items-start justify-center gap-6 overflow-hidden px-6 py-8 lg:py-10 lg:pr-12 lg:pl-0">
        <p className="text-overline font-semibold uppercase text-accent">
          {featuredPrefix} | {category}
        </p>
        <h2 className="line-clamp-2 w-full max-w-[426px] font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-0.04em] text-brand">
          {title}
        </h2>
        <p className="line-clamp-3 w-full max-w-[426px] text-[13px] leading-[18px] text-ink-secondary">
          {excerpt}
        </p>
        <p className="text-body-xs text-basalt-300">
          {readTime} | NIP Advisory
        </p>
      </div>
    </article>
  );

  if (href) {
    return (
      <Link
        href={href}
        className="block focus:outline-none focus-visible:ring-2 focus-visible:ring-brand/30 focus-visible:ring-offset-2"
      >
        {card}
      </Link>
    );
  }

  return card;
}
