import { NavigationBar } from "@/components/layout/navigation-bar";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { ImageGridSection } from "@/components/sections/image-grid-section";
import { FeatureHighlightsSection } from "@/components/sections/feature-highlights-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { RecommendationsSection } from "@/components/sections/recommendations-section";
import { LatestProductsSection } from "@/components/sections/latest-products-section";
import { TopPriceChangesSection } from "@/components/sections/top-price-changes-section";
import { RetailersSection } from "@/components/sections/retailers-section";
import { TrendingSection } from "@/components/sections/trending-section";
import { FeaturedProducts } from "@/components/sections/featured-products";

export default function HomePage() {
  return (
    <div className="bg-gray-50 overflow-x-hidden">
      <NavigationBar />
      <div className="overflow-x-hidden">
        <HeroSection />
        <StatsSection />
        <ImageGridSection />
        <FeatureHighlightsSection />
        <CategoriesSection />
        <RecommendationsSection />
        {/* <div className="container mx-auto px-4 py-12">
          <FeaturedProducts />
        </div> */}
        <TrendingSection />
        <LatestProductsSection />
        <TopPriceChangesSection />
        <RetailersSection />
      </div>
    </div>
  );
}
