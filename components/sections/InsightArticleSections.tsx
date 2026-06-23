import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs, Button, InsightCard } from "@/components/ui";
import type { InsightCardProps } from "@/components/ui/Cards";
import {
  siteMaxWidth,
  sitePageGutterX,
  sitePageInnerClassName,
} from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import type { Locale } from "@/lib/i18n/config";
import { localizedHref } from "@/lib/i18n/helpers";
import { prepareInsightArticleHtml } from "@/lib/sanitize/insight-article-html";

export type InsightArticleHeroProps = {
  locale: Locale;
  category: string;
  title: string;
  excerpt?: string | null;
  author?: string | null;
  publishedAt?: string;
  readTime?: string | null;
};

function formatArticleDate(isoDate: string, locale: Locale): string {
  const date = new Date(isoDate);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat(locale === "ar" ? "ar-AE" : "en-GB", {
    month: "long",
    year: "numeric",
  }).format(date);
}

function MetaSeparator() {
  return <span className="text-border-default">|</span>;
}

export async function InsightArticleHero({
  locale,
  category,
  title,
  excerpt,
  author,
  publishedAt,
  readTime,
}: InsightArticleHeroProps) {
  const tNav = await getTranslations({ locale, namespace: "nav" });
  const t = await getTranslations({ locale, namespace: "pages.insights.article" });

  const authorLabel = t("byAuthor", {
    author: author ?? t("defaultAuthor"),
  });
  const formattedDate = publishedAt ? formatArticleDate(publishedAt, locale) : "";

  return (
    <section
      data-site-hero
      className={cn("mx-auto w-full bg-white", siteMaxWidth, sitePageGutterX)}
    >
      <div
        className={cn(
          "mx-auto flex max-w-[916px] flex-col items-center gap-[18px] pb-9 pt-14 text-center lg:pt-[56px]",
        )}
      >
        <Breadcrumbs
          format="property"
          className="justify-center text-body-xs text-basalt-300"
          items={[
            {
              label: tNav("insights"),
              href: localizedHref(locale, "/insights"),
            },
            { label: category },
          ]}
        />

        <p className="text-overline font-semibold uppercase text-accent">{category}</p>

        <h1 className="font-[family-name:var(--font-display)] text-3xl uppercase leading-tight tracking-[-0.02em] text-brand sm:text-[44px] sm:leading-[42px]">
          {title}
        </h1>

        {excerpt ? (
          <p className="max-w-[720px] text-[17px] leading-7 text-ink-secondary">{excerpt}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-body-sm">
          <span className="font-medium text-ink-secondary">{authorLabel}</span>
          {formattedDate ? (
            <>
              <MetaSeparator />
              <span className="text-basalt-300">{formattedDate}</span>
            </>
          ) : null}
          {readTime ? (
            <>
              <MetaSeparator />
              <span className="text-basalt-300">{readTime}</span>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export type InsightArticleFeaturedImageProps = {
  src: string;
  alt: string;
};

export function InsightArticleFeaturedImage({ src, alt }: InsightArticleFeaturedImageProps) {
  return (
    <section className={cn("mx-auto w-full bg-white", siteMaxWidth, sitePageGutterX, "pb-12")}>
      <div className={cn(sitePageInnerClassName, "relative h-[280px] overflow-hidden rounded-[var(--radius-card)] sm:h-[380px] lg:h-[480px]")}>
        <Image
          src={src}
          alt={alt}
          fill
          className="object-cover"
          sizes="(max-width: 1280px) 100vw, 1080px"
          priority
        />
      </div>
    </section>
  );
}

export type InsightArticleBodyProps = {
  html: string;
};

export function InsightArticleBody({ html }: InsightArticleBodyProps) {
  const prepared = prepareInsightArticleHtml(html);
  if (!prepared) return null;

  return (
    <section className={cn("mx-auto w-full bg-white pb-16", siteMaxWidth, sitePageGutterX)}>
      <div className={cn(sitePageInnerClassName, "insight-article-body")}>
        <div dangerouslySetInnerHTML={{ __html: prepared }} />
      </div>
    </section>
  );
}

export type InsightArticleAdvisoryCtaProps = {
  locale: Locale;
};

export async function InsightArticleAdvisoryCta({ locale }: InsightArticleAdvisoryCtaProps) {
  const t = await getTranslations({ locale, namespace: "pages.insights.article" });
  const tc = await getTranslations({ locale, namespace: "common" });

  return (
    <section className={cn("mx-auto w-full bg-white pb-[72px]", siteMaxWidth, sitePageGutterX)}>
      <div
        className={cn(
          sitePageInnerClassName,
          "flex flex-col items-center gap-6 rounded-xl bg-sapphire-100 px-6 py-11 text-center",
        )}
      >
        <p className="text-overline font-semibold uppercase text-accent">
          {t("advisoryEyebrow")}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[26px] uppercase leading-[34px] tracking-[-0.04em] text-brand sm:text-[30px] sm:leading-[38px]">
          {t("advisoryTitle")}
        </h2>
        <Button href={localizedHref(locale, "/contact")} variant="primary">
          {tc("speakWith")} {tc("nip")}
        </Button>
      </div>
    </section>
  );
}

export type RelatedInsightsSectionProps = {
  title: string;
  cards: InsightCardProps[];
};

export function RelatedInsightsSection({ title, cards }: RelatedInsightsSectionProps) {
  if (cards.length === 0) return null;

  return (
    <section className={cn("bg-sapphire-50 pt-16 pb-20", siteMaxWidth, sitePageGutterX, "mx-auto w-full")}>
      <div className={cn(sitePageInnerClassName, "flex flex-col gap-7")}>
        <p className="text-center text-overline font-semibold uppercase text-accent">{title}</p>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {cards.map((insight) => (
            <InsightCard key={insight.href} className="min-h-[438px]" {...insight} />
          ))}
        </div>
      </div>
    </section>
  );
}
