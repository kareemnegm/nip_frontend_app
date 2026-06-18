import type { Metadata } from "next";
import { SiteShell } from "@/components/SiteShell";
import { localizedMetadata } from "@/lib/i18n/metadata";
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
import { getBlogs } from "@/lib/api/blogs";
import { getHome } from "@/lib/api/home";
import { mapAreaToCommunityCard } from "@/lib/mappers/area";
import { mapBlogToInsightCard } from "@/lib/mappers/blog";
import { mapPropertyToCard } from "@/lib/mappers/property";
import { resolveLocale } from "@/lib/i18n/helpers";

type HomePageProps = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: HomePageProps): Promise<Metadata> {
  const { locale: rawLocale } = await params;
  return localizedMetadata(resolveLocale(rawLocale), "home");
}

export default async function HomePage({ params }: HomePageProps) {
  const { locale: rawLocale } = await params;
  const locale = resolveLocale(rawLocale);

  const [home, blogs] = await Promise.all([
    getHome(locale),
    getBlogs({ per_page: 3, locale }),
  ]);

  const featuredProperties = home.featured_properties.map((property) =>
    mapPropertyToCard(property, locale),
  );
  const curatedProperties =
    featuredProperties.length > 0
      ? featuredProperties
      : home.areas.length > 0
        ? []
        : [];
  const areaCards = home.areas.map((area) => mapAreaToCommunityCard(area, locale));
  const insightCards = blogs.data.map((blog) => mapBlogToInsightCard(blog, locale));

  return (
    <SiteShell>
      <HomeHeroSection />
      <HomeSearchSection />
      <FeaturedInsightSection insights={insightCards} />
      <CuratedCollectionSection properties={curatedProperties} />
      <MarketPulseSection areas={areaCards} />
      <PrivateOfficeSection />
      <FeaturedSelectionSection properties={featuredProperties} />
      <HomeCtaSection />
    </SiteShell>
  );
}
