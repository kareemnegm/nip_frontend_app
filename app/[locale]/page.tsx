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
import { mapBlogToInsightCard } from "@/lib/mappers/blog";
import { isOffPlanProperty, mapPropertyToCard } from "@/lib/mappers/property";
import { resolveLocale } from "@/lib/i18n/helpers";

/** ISR — must be a literal (Next.js build requirement). Bust via POST /api/revalidate. */
export const revalidate = 60;

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
    getBlogs({ per_page: 5, locale }),
  ]);

  // Off-plan projects are sold as unit ranges, so the backend sends 0 bedrooms
  // and 0 bathrooms — they render as "0 Beds · 0 Baths" in a property card.
  // The home selections show ready listings only; off-plan has its own pages.
  const featuredProperties = home.featured_properties
    .filter((property) => !isOffPlanProperty(property))
    .map((property) => mapPropertyToCard(property, locale));
  const insightCards = blogs.data.map((blog) => mapBlogToInsightCard(blog, locale));

  return (
    <SiteShell>
      <HomeHeroSection />
      <HomeSearchSection />
      <FeaturedInsightSection insights={insightCards} />
      <CuratedCollectionSection properties={featuredProperties} />
      <MarketPulseSection />
      <PrivateOfficeSection />
      <FeaturedSelectionSection properties={featuredProperties} />
      <HomeCtaSection />
    </SiteShell>
  );
}
