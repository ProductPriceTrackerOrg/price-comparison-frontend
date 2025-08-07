import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { HeroSection } from "@/components/sections/hero-section";
import { StatsSection } from "@/components/sections/stats-section";
import { CategoriesSection } from "@/components/sections/categories-section";
import { RecommendationsSection } from "@/components/sections/recommendations-section";
import { LatestProductsSection } from "@/components/sections/latest-products-section";
import { TopPriceChangesSection } from "@/components/sections/top-price-changes-section";
import { RetailersSection } from "@/components/sections/retailers-section";
import { TrendingSection } from "@/components/sections/trending-section";
import { Footer } from "@/components/layout/footer";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main>
        <HeroSection />
        <StatsSection />
        <CategoriesSection />
        <RecommendationsSection />
        <TrendingSection />
        <LatestProductsSection />
        <TopPriceChangesSection />
        <RetailersSection />
      </main>
      <Footer />
    </div>
  );
}
