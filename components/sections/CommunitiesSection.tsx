import type { ComponentProps } from "react";
import { getTranslations } from "next-intl/server";
import { CatalogEmptyState, CenteredCardGrid, CommunityCard } from "@/components/ui";
import { Container } from "@/components/ui/Container";
import { siteCardSectionLayoutClassName, siteSectionY } from "@/components/ui/SiteChrome";
import { cn } from "@/lib/cn";
import { getCmsPlaceholder } from "@/lib/i18n/cms-placeholder";
import type { Locale } from "@/lib/i18n/config";
import { buildSectionCms, toSectionHeadingEditable } from "./section-cms";
import { SectionHeading } from "./SectionHeading";

export async function CommunitiesSection({
  areas = [],
  cms,
  placeholderNamespace = "placeholders.builder.communities",
  locale,
}: {
  areas?: ComponentProps<typeof CommunityCard>[];
  cms: ReturnType<typeof buildSectionCms>;
  placeholderNamespace?: string;
  locale: Locale;
}) {
  const t = await getTranslations({ locale, namespace: "home.empty" });

  return (
    <section className={cn("bg-surface", siteSectionY)}>
      <Container className={siteCardSectionLayoutClassName}>
        <SectionHeading
          title={await getCmsPlaceholder(placeholderNamespace, "title", locale)}
          description={await getCmsPlaceholder(placeholderNamespace, "desc", locale)}
          editable={toSectionHeadingEditable(cms)}
        />
        {areas.length === 0 ? (
          <CatalogEmptyState message={t("areas")} />
        ) : (
          <CenteredCardGrid gap="section" className="w-full" data-reveal-stagger>
            {areas.map((area) => (
              <CommunityCard key={area.href} {...area} />
            ))}
          </CenteredCardGrid>
        )}
      </Container>
    </section>
  );
}
