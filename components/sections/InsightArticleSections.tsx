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
import {
  prepareInsightArticleHtml,
  splitInsightArticleHtml,
} from "@/lib/sanitize/insight-article-html";

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
      data-no-reveal
      className={cn("mx-auto w-full bg-white", siteMaxWidth, sitePageGutterX)}
    >
      <div className="mx-auto flex max-w-[916px] flex-col items-center gap-[18px] pb-9 pt-14 text-center lg:pt-[56px]">
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

        <p className="text-overline font-semibold uppercase text-accent">
          {category}
        </p>

        <h1 className="font-[family-name:var(--font-display)] text-display-sm uppercase text-brand sm:text-display-lg">
          {title}
        </h1>

        {excerpt ? (
          <p className="max-w-[720px] text-body-lg text-ink-secondary">{excerpt}</p>
        ) : null}

        <div className="flex flex-wrap items-center justify-center gap-2.5 text-body-sm">
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
    <section
      data-no-reveal
      className={cn("mx-auto w-full bg-white pb-12", siteMaxWidth, sitePageGutterX)}
    >
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
  /** Standalone mid-article upload — not parsed out of `html`. */
  contentImageSrc?: string | null;
  contentImageCaption?: string | null;
  contentImageAlt: string;
};

export function InsightArticleBody({
  html,
  contentImageSrc,
  contentImageCaption,
  contentImageAlt,
}: InsightArticleBodyProps) {
  const prepared = prepareInsightArticleHtml(html);
  if (!prepared && !contentImageSrc) return null;

  const [beforeImage, afterImage] = contentImageSrc
    ? splitInsightArticleHtml(prepared)
    : [prepared, ""];
  const caption = contentImageCaption?.trim();

  return (
    <section
      data-no-reveal
      className={cn("mx-auto w-full bg-white pb-16", siteMaxWidth, sitePageGutterX)}
    >
      {/* .insight-article-body lays its direct children out with a 24px gap, and
          gives the same treatment to a <div> child so each half of the split CMS
          markup keeps that rhythm internally. The <figure> deliberately stays a
          figure so it opts out of that rule and keeps Figma's tighter 8px gap
          between image and caption.
          data-no-reveal: never hide this behind scroll-reveal — iOS Safari can
          leave opacity:0 sections blank forever. */}
      <div className="insight-article-body mx-auto max-w-[720px]">
        {beforeImage ? (
          <div dangerouslySetInnerHTML={{ __html: beforeImage }} />
        ) : null}

        {contentImageSrc ? (
          /* Figma 1525:27600 — 720x380 cover, 8px radius, 8px gap, caption 12/16 */
          <figure className="flex flex-col gap-2">
            <div className="relative h-[280px] w-full overflow-hidden rounded-[var(--radius-card)] bg-basalt-100 sm:h-[380px]">
              <Image
                src={contentImageSrc}
                alt={caption ? "" : contentImageAlt}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 720px"
              />
            </div>
            {caption ? (
              <figcaption className="text-body-xs text-basalt-300">{caption}</figcaption>
            ) : null}
          </figure>
        ) : null}

        {afterImage ? (
          <div dangerouslySetInnerHTML={{ __html: afterImage }} />
        ) : null}
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
    <section
      data-no-reveal
      className={cn("mx-auto w-full bg-white pb-[72px]", siteMaxWidth, sitePageGutterX)}
    >
      <div
        className={cn(
          sitePageInnerClassName,
          "flex flex-col items-center gap-6 rounded-[12px] bg-sapphire-100 px-6 py-11 text-center",
        )}
      >
        <p className="text-overline font-semibold uppercase text-accent">
          {t("advisoryEyebrow")}
        </p>
        <h2 className="font-[family-name:var(--font-display)] text-heading-h1 uppercase text-brand">
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
    <section data-no-reveal className="w-full bg-sapphire-50">
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
