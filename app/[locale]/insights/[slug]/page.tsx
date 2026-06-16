import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { SiteShell } from "@/components/SiteShell";
import { CtaBand, SectionHeading } from "@/components/sections";
import { Button, Container, InsightCard } from "@/components/ui";
import { getBlogBySlug, getBlogs } from "@/lib/api/blogs";
import { resolveLocale } from "@/lib/i18n/helpers";
import { mapBlogToInsightCard } from "@/lib/mappers/blog";

type PageProps = {
  params: Promise<{ locale: string; slug: string }>;
};

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);
  if (!blog) return { title: "Insight | NIP Reality" };
  return {
    title: `${blog.title} | NIP Reality`,
    description: blog.excerpt ?? blog.content?.slice(0, 160),
  };
}

export default async function InsightArticlePage({ params }: PageProps) {
  const { locale: rawLocale, slug } = await params;
  const locale = resolveLocale(rawLocale);
  const blog = await getBlogBySlug(slug);
  if (!blog) notFound();

  const related = await getBlogs({ per_page: 3, category: blog.category?.slug });
  const relatedCards = related.data
    .filter((item) => item.slug !== slug)
    .slice(0, 3)
    .map((item) => mapBlogToInsightCard(item, locale));

  const body = blog.body ?? blog.source_code ?? blog.content ?? "";

  return (
    <SiteShell>
      <article className="w-full bg-surface">
        <Container className="py-12 sm:py-16">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-brand">
              {blog.category?.name ?? "Insight"}
            </p>
            <h1 className="mt-4 font-[family-name:var(--font-display)] text-3xl font-semibold tracking-tight text-brand sm:text-4xl lg:text-5xl">
              {blog.title}
            </h1>
            {blog.excerpt ? (
              <p className="mt-4 text-sm leading-7 text-ink-secondary">{blog.excerpt}</p>
            ) : null}
            <p className="mt-5 text-xs text-ink-tertiary">
              {blog.author_name ? `By ${blog.author_name}` : "NIP Advisory"}
              {blog.created_at
                ? ` | ${new Intl.DateTimeFormat("en-GB", { month: "long", year: "numeric" }).format(new Date(blog.created_at))}`
                : ""}
            </p>
          </div>

          {blog.featured_image_url ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={blog.featured_image_url}
              alt={blog.title}
              className="mx-auto mt-10 aspect-[16/8] max-w-4xl rounded-[var(--radius-card)] object-cover"
            />
          ) : null}

          <div
            className="prose prose-sm mx-auto mt-10 max-w-3xl text-ink-secondary"
            dangerouslySetInnerHTML={{ __html: body }}
          />
        </Container>
      </article>

      {relatedCards.length > 0 ? (
        <section className="bg-sapphire-50 py-16">
          <Container className="space-y-8">
            <SectionHeading title="Related Insights" />
            <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
              {relatedCards.map((insight) => (
                <InsightCard key={insight.href} {...insight} />
              ))}
            </div>
          </Container>
        </section>
      ) : null}

      <CtaBand
        title="Ready to discuss your next move?"
        actions={<Button href="/contact">Speak with NIP</Button>}
      />
    </SiteShell>
  );
}
