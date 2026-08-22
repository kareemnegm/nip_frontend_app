import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { BuilderPreviewBridge } from "@/components/page-builder/BuilderPreviewBridge";
import { BuilderPreviewToolbar } from "@/components/page-builder/BuilderPreviewToolbar";
import { PageBuilderSection } from "@/components/page-builder/PageBuilderSection";
import { getBuilderPageAdminById } from "@/lib/api/pages";
import { getCmsToken } from "@/lib/cms/auth.server";
import { localizedHref, resolveLocale } from "@/lib/i18n/helpers";
import { resolveSectionData } from "@/lib/page-builder/data-source";
import { getSectionDefinition } from "@/lib/page-builder/registry";
import type { BuilderPageSection } from "@/types/api/page-builder";

export const metadata: Metadata = {
  title: "Page preview",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ section?: string }>;
};

function PreviewNotice({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-[40vh] items-center justify-center bg-surface-muted p-8">
      <p className="text-body-sm text-ink-secondary">{children}</p>
    </div>
  );
}

async function renderSection(
  section: BuilderPageSection,
  relUrl: string,
  locale: ReturnType<typeof resolveLocale>,
) {
  const definition = getSectionDefinition(section.section_type);
  const data = await resolveSectionData(section, locale);

  return (
    <div
      key={section.id}
      data-builder-section={section.id}
      data-focus="false"
      className="relative transition-shadow duration-300 data-[focus=true]:shadow-[inset_0_0_0_3px_var(--color-accent)]"
    >
      {section.is_visible ? null : (
        <p className="absolute start-4 top-4 z-10 rounded-[var(--radius-field)] bg-basalt-600 px-2 py-1 text-label-semibold font-semibold uppercase text-white">
          Hidden on live page
        </p>
      )}
      {definition ? (
        <div className={section.is_visible ? undefined : "opacity-40"}>
          <PageBuilderSection section={section} relUrl={relUrl} locale={locale} data={data} />
        </div>
      ) : (
        <PreviewNotice>Unknown section type “{section.section_type}”.</PreviewNotice>
      )}
    </div>
  );
}

export default async function BuilderPreviewPage({ params, searchParams }: PageProps) {
  const { locale: rawLocale, id } = await params;
  const { section: sectionId } = await searchParams;
  const locale = resolveLocale(rawLocale);

  const token = await getCmsToken();
  if (!token) {
    return <PreviewNotice>Sign in as staff to preview this page.</PreviewNotice>;
  }

  const page = await getBuilderPageAdminById(id, locale, token);
  if (!page) {
    return <PreviewNotice>This page no longer exists.</PreviewNotice>;
  }

  const sections = [...page.sections].sort((a, b) => a.sort_order - b.sort_order);

  if (sectionId) {
    const single = sections.find((row) => row.id === sectionId);
    if (!single) {
      return <PreviewNotice>This section was removed.</PreviewNotice>;
    }
    return (
      <div className="bg-background text-ink">
        <BuilderPreviewBridge />
        {await renderSection(single, page.path, locale)}
      </div>
    );
  }

  if (sections.length === 0) {
    return <PreviewNotice>Add your first section to see the page preview.</PreviewNotice>;
  }

  return (
    <>
      <BuilderPreviewBridge />
      <BuilderPreviewToolbar
        title={page.title}
        published={page.is_published}
        editHref={localizedHref(locale, `/admin/site/pages/${page.id}`)}
        pagesHref={localizedHref(locale, "/admin/site/pages")}
      />
      <SiteShell>
        {await Promise.all(sections.map((row) => renderSection(row, page.path, locale)))}
      </SiteShell>
    </>
  );
}
