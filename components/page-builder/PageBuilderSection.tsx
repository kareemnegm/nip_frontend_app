import { getTranslations } from "next-intl/server";
import { EditableCtaBand } from "@/components/sections/EditableCtaBand";
import {
  CuratedCollectionSection,
  FeaturedInsightSection,
  FeaturedSelectionSection,
  HomeCtaSection,
  HomeHeroSection,
  HomeSearchSection,
  MarketPulseSection,
  PrivateOfficeSection,
} from "@/components/sections";
import { CommunitiesSection } from "@/components/sections/CommunitiesSection";
import { buildSectionCms } from "@/components/sections/section-cms";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import type { Locale } from "@/lib/i18n/config";
import type { ResolvedSectionData } from "@/lib/page-builder/data-source";
import { getSectionDefinition } from "@/lib/page-builder/registry";
import type { BuilderPageSection } from "@/types/api/page-builder";

type PageBuilderSectionProps = {
  section: BuilderPageSection;
  relUrl: string;
  locale: Locale;
  data: ResolvedSectionData;
};

export async function PageBuilderSection({
  section,
  relUrl,
  locale,
  data,
}: PageBuilderSectionProps) {
  const definition = getSectionDefinition(section.section_type);
  if (!definition) return null;

  const cms = buildSectionCms(relUrl, section.block_prefix, definition.blockSlots);
  const placeholderNamespace = definition.placeholderNamespace;

  switch (section.section_type) {
    case "hero":
      return <HomeHeroSection cms={cms} placeholderNamespace={placeholderNamespace} />;
    case "search-strip":
      return <HomeSearchSection />;
    case "insight-cards":
      return (
        <FeaturedInsightSection
          insights={data.insights ?? []}
          cms={cms}
          placeholderNamespace={placeholderNamespace}
        />
      );
    case "property-grid":
      return (
        <CuratedCollectionSection
          properties={data.properties ?? []}
          cms={cms}
          placeholderNamespace={placeholderNamespace}
        />
      );
    case "property-carousel":
      return (
        <FeaturedSelectionSection
          properties={data.properties ?? []}
          cms={cms}
          placeholderNamespace={placeholderNamespace}
        />
      );
    case "communities":
      return (
        <CommunitiesSection
          areas={data.areas ?? []}
          cms={cms}
          placeholderNamespace={placeholderNamespace}
          locale={locale}
        />
      );
    case "market-pulse":
      return <MarketPulseSection cms={cms} placeholderNamespace={placeholderNamespace} />;
    case "private-office":
      return (
        <PrivateOfficeSection cms={cms} placeholderNamespace={placeholderNamespace} />
      );
    case "cta":
      return <HomeCtaSection cms={cms} placeholderNamespace={placeholderNamespace} />;
    case "cta-band": {
      const t = await getTranslations({ locale, namespace: "pages.developers" });
      return (
        <EditableCtaBand
          relUrl={relUrl}
          blockKey={`${section.block_prefix}-title`}
          locale={locale}
          eyebrow={t("advisory")}
          placeholderContent={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
        />
      );
    }
    default:
      return null;
  }
}
