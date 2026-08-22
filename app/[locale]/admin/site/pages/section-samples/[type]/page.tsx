import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BuilderPreviewBridge } from "@/components/page-builder/BuilderPreviewBridge";
import { PageBuilderSection } from "@/components/page-builder/PageBuilderSection";
import { resolveSectionData } from "@/lib/page-builder/data-source";
import {
  buildSampleSection,
  isSampleSectionType,
  SECTION_SAMPLE_REL_URL,
} from "@/lib/page-builder/section-samples";
import { resolveLocale } from "@/lib/i18n/helpers";

export const metadata: Metadata = {
  title: "Section sample",
  robots: { index: false, follow: false },
};

type PageProps = {
  params: Promise<{ locale: string; type: string }>;
};

export default async function SectionSamplePage({ params }: PageProps) {
  const { locale: rawLocale, type } = await params;
  const locale = resolveLocale(rawLocale);

  if (!isSampleSectionType(type)) notFound();

  const section = buildSampleSection(type);
  if (!section) notFound();

  const data = await resolveSectionData(section, locale);

  return (
    <div className="bg-background text-ink">
      <BuilderPreviewBridge />
      <div className="mx-auto w-[1440px] max-w-none overflow-hidden">
        <PageBuilderSection
          section={section}
          relUrl={SECTION_SAMPLE_REL_URL}
          locale={locale}
          data={data}
        />
      </div>
    </div>
  );
}
