import { SiteShell } from "@/components/SiteShell";
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

export default function HomePage() {
  return (
    <SiteShell>
      <HomeHeroSection />
      <HomeSearchSection />
      <FeaturedInsightSection />
      <CuratedCollectionSection />
      <MarketPulseSection />
      <PrivateOfficeSection />
      <FeaturedSelectionSection />
      <HomeCtaSection />
    </SiteShell>
  );
}
