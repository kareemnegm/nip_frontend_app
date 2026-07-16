import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Breadcrumbs, Button, Icon } from "@/components/ui";
import type { InsightCardProps } from "@/components/ui/Cards";
import { RelatedInsightCard } from "@/components/ui/RelatedInsightCard";
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
      <div className="mx-auto flex max-w-[916px] flex-col items-center gap-[18px] pb-9 pt-14 text-center lg:pt-[56px]">
        <Breadcrumbs
          format="property"
          className="justify-center text-[12px] leading-4 text-basalt-300"
          items={[
            {
              label: tNav("insights"),
              href: localizedHref(locale, "/insights"),
            },
            { label: category },
          ]}
        />

        <p className="text-[12px] font-semibold uppercase leading-4 tracking-normal text-accent">
          {category}
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-[32px] uppercase leading-[38px] tracking-[-0.88px] text-brand sm:text-[44px] sm:leading-[42px]">
          {title}
        </h1>

        {excerpt ? (
          <p className="max-w-[720px] text-[17px] leading-7 text-ink-secondary">{excerpt}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-[13px] leading-[18px]">
          <span className="font-medium text-ink-secondary">{authorLabel}</span>
          {formattedDate ? (
            <>
              <MetaSeparator />
              <span className="font-normal text-basalt-300">{formattedDate}</span>
            </>
          ) : null}
          {readTime ? (
            <>
              <MetaSeparator />
              <span className="font-normal text-basalt-300">{readTime}</span>
            </>
          ) : null}
        </div>
      </div>
    </section>
  );
}

export type InsightArticleFeaturedImageProps = {
  src?: string | null;
  alt: string;
};

export function InsightArticleFeaturedImage({ src, alt }: InsightArticleFeaturedImageProps) {
  return (
    <section className={cn("mx-auto w-full bg-white pb-12", siteMaxWidth, sitePageGutterX)}>
      <div
        className={cn(
          sitePageInnerClassName,
          "relative h-[280px] overflow-hidden rounded-[var(--radius-card)] sm:h-[380px] lg:h-[480px]",
        )}
      >
        {src ? (
          <Image
            src={src}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 1280px) 100vw, 1080px"
            priority
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-basalt-100">
            <Icon name="home" className="h-[140px] w-[140px] text-white" aria-hidden />
          </div>
        )}
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
      {/* dangerouslySetInnerHTML directly on .insight-article-body so CMS blocks
          are its direct children and the flex-col gap-24 applies to each of them */}
      <div
        className="insight-article-body mx-auto max-w-[720px]"
        dangerouslySetInnerHTML={{ __html: prepared }}
      />
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
          "flex flex-col items-center gap-6 rounded-[12px] bg-sapphire-100 px-6 py-11 text-center",
        )}
      >
        <p className="text-[12px] font-semibold uppercase leading-4 text-accent">
          {t("advisoryEyebrow")}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-[30px] uppercase leading-[38px] tracking-[-1.2px] text-brand">
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
    <section className="w-full bg-sapphire-50">
      <div className={cn("mx-auto w-full pt-16 pb-20", siteMaxWidth, sitePageGutterX)}>
        <div className={cn(sitePageInnerClassName, "flex flex-col items-center gap-7")}>
          <p className="w-full text-center text-overline font-semibold uppercase text-accent">
            {title}
          </p>
          <div className="grid w-full items-stretch gap-6 sm:grid-cols-2 xl:grid-cols-3">
            {cards.map((insight) => (
              <RelatedInsightCard key={insight.href} {...insight} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
