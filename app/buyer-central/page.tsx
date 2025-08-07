"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { BuyingGuidesSection } from "@/components/buyer-central/buying-guides-section";
import { MarketInsightsSection } from "@/components/buyer-central/market-insights-section";
import { SmartAlertsSection } from "@/components/buyer-central/smart-alerts-section";
import { PriceComparisonSection } from "@/components/buyer-central/price-comparison-section";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ShoppingBag,
  BookOpen,
  TrendingUp,
  Bell,
  BarChart3,
  Home,
  Zap,
  Target,
  Users,
  Award,
} from "lucide-react";
import {
  BuyingGuideCategory,
  MarketIntelligence,
  BuyingAlert,
  RetailerComparison,
  PriceComparisonData,
} from "@/lib/types/buyer-central";
export default function BuyerCentralPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("guides");

  // Data states
  const [guideCategories, setGuideCategories] = useState<BuyingGuideCategory[]>(
    []
  );
  const [marketInsights, setMarketInsights] = useState<MarketIntelligence[]>(
    []
  );
  const [smartAlerts, setSmartAlerts] = useState<BuyingAlert[]>([]);
  const [retailerComparisons, setRetailerComparisons] = useState<
    RetailerComparison[]
  >([]);
  const [comparisonData, setComparisonData] = useState<PriceComparisonData[]>(
    []
  );

  useEffect(() => {
    loadBuyerCentralData();
  }, []);

  const loadBuyerCentralData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadBuyingGuides(),
        loadMarketInsights(),
        loadSmartAlerts(),
        loadRetailerComparisons(),
        loadPriceComparisons(),
      ]);
    } catch (error) {
      console.error("Failed to load buyer central data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBuyingGuides = async () => {
    // Mock data - replace with actual API call
    const mockCategories: BuyingGuideCategory[] = [
      {
        categoryId: 1,
        categoryName: "Smartphones",
        description: "Complete guides for choosing the perfect smartphone",
        icon: "📱",
        guideCount: 12,
        avgProductPrice: 899,
        popularBrands: ["Apple", "Samsung", "Google"],
      },
      {
        categoryId: 2,
        categoryName: "Laptops",
        description: "Expert advice for laptop purchases",
        icon: "💻",
        guideCount: 15,
        avgProductPrice: 1299,
        popularBrands: ["Apple", "Dell", "HP"],
      },
      {
        categoryId: 3,
        categoryName: "Smart Watches",
        description: "Everything you need to know about smart watches",
        icon: "⌚",
        guideCount: 8,
        avgProductPrice: 349,
        popularBrands: ["Apple", "Samsung", "Fitbit"],
      },
    ];
    setGuideCategories(mockCategories);
  };

  const loadMarketInsights = async () => {
    // Mock data - replace with actual API call
    const mockInsights: MarketIntelligence[] = [
      {
        categoryName: "Smartphones",
        bestBuyingPeriod: {
          month: "September",
          discountPercentage: 25,
          reason: "New model releases",
        },
        avgPriceRange: { min: 299, max: 1599 },
        topRetailers: [
          { retailerName: "TechMart", competitiveScore: 9.2, avgDiscount: 15 },
          {
            retailerName: "ElectroHub",
            competitiveScore: 8.8,
            avgDiscount: 12,
          },
        ],
        priceVolatility: 0.18,
        recommendedAction: "wait",
      },
    ];
    setMarketInsights(mockInsights);
  };

  const loadSmartAlerts = async () => {
    // Mock data - replace with actual API call
    const mockAlerts: BuyingAlert[] = [
      {
        alertId: "alert1",
        alertType: "price_drop",
        categoryName: "Smartphones",
        title: "iPhone 15 Pro Max - 15% price drop detected",
        description: "Significant price reduction across multiple retailers",
        urgency: "high",
        validUntil: "2024-08-15",
        actionRequired: true,
        relatedProducts: [1, 2, 3],
      },
    ];
    setSmartAlerts(mockAlerts);
  };

  const loadRetailerComparisons = async () => {
    // Mock data - replace with actual API call
    const mockRetailers: RetailerComparison[] = [
      {
        retailerId: 1,
        retailerName: "TechMart",
        averageRating: 4.8,
        overallRating: 4.8,
        priceCompetitiveness: 9.2,
        competitivenessScore: 92,
        customerService: 4.5,
        customerServiceRating: 4.5,
        shippingSpeed: 4.7,
        returnPolicy: 4.9,
        deliverySpeed: "2-3 days",
        specialties: ["Electronics", "Gaming"],
        strengths: ["Competitive Pricing", "Fast Delivery", "Customer Support"],
        averageDiscount: 15,
        totalProducts: 25840,
      },
      {
        retailerId: 2,
        retailerName: "ElectroHub",
        averageRating: 4.6,
        overallRating: 4.6,
        priceCompetitiveness: 8.8,
        competitivenessScore: 88,
        customerService: 4.2,
        customerServiceRating: 4.2,
        shippingSpeed: 4.5,
        returnPolicy: 4.6,
        deliverySpeed: "1-2 days",
        specialties: ["Mobile", "Accessories"],
        strengths: ["Wide Selection", "Fast Shipping"],
        averageDiscount: 12,
        totalProducts: 18650,
      },
      {
        retailerId: 3,
        retailerName: "MegaStore",
        averageRating: 4.4,
        overallRating: 4.4,
        priceCompetitiveness: 8.5,
        competitivenessScore: 85,
        customerService: 4.0,
        customerServiceRating: 4.0,
        shippingSpeed: 4.3,
        returnPolicy: 4.5,
        deliverySpeed: "3-5 days",
        specialties: ["Appliances", "Electronics"],
        strengths: ["Good Prices", "Reliable"],
        averageDiscount: 10,
        totalProducts: 32100,
      },
    ];
    setRetailerComparisons(mockRetailers);
  };

  const loadPriceComparisons = async () => {
    // Mock data - replace with actual API call
    const mockComparisonData: PriceComparisonData[] = [
      {
        productId: 1,
        productName: "iPhone 15 Pro Max 256GB",
        categoryName: "Smartphones",
        averagePrice: 1199,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 1149,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 1199,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 3,
            retailerName: "MegaStore",
            price: 1229,
            stockStatus: "in_stock",
            rating: 4.4,
            lastUpdated: "2024-08-05",
          },
          {
            retailerId: 4,
            retailerName: "QuickBuy",
            price: 1179,
            stockStatus: "low_stock",
            rating: 4.2,
            lastUpdated: "2024-08-06",
          },
        ],
        priceHistory: {
          priceChange: -3.2,
          trend: "decreasing",
        },
      },
      {
        productId: 2,
        productName: "Samsung Galaxy S24 Ultra 512GB",
        categoryName: "Smartphones",
        averagePrice: 1399,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 1359,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 1399,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 3,
            retailerName: "MegaStore",
            price: 1449,
            stockStatus: "in_stock",
            rating: 4.4,
            lastUpdated: "2024-08-05",
          },
        ],
        priceHistory: {
          priceChange: -1.8,
          trend: "stable",
        },
      },
      {
        productId: 3,
        productName: "MacBook Pro 14-inch M3 Pro",
        categoryName: "Laptops",
        averagePrice: 2499,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 2399,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 2499,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 4,
            retailerName: "QuickBuy",
            price: 2449,
            stockStatus: "in_stock",
            rating: 4.2,
            lastUpdated: "2024-08-06",
          },
        ],
        priceHistory: {
          priceChange: -4.1,
          trend: "decreasing",
        },
      },
    ];
    setComparisonData(mockComparisonData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb */}
          <div className="mb-6">
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink href="/" className="flex items-center gap-1">
                    <Home className="h-4 w-4" />
                    Home
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>Buyer Central</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Hero Section */}
          <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center p-3 bg-blue-100 dark:bg-blue-900/20 rounded-full mb-4">
              <ShoppingBag className="h-8 w-8 text-blue-600" />
            </div>
            <h1 className="text-4xl font-bold text-gray-900 mb-4">
              Buyer Central
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-6">
              Your ultimate resource for smart shopping decisions. Get expert
              guides, market insights, and real-time alerts to make informed
              purchases.
            </p>

            {/* Quick Stats */}
            <div className="flex items-center justify-center gap-6 mb-8">
              <div className="flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-blue-600" />
                <span className="text-sm text-gray-600">35+ Buying Guides</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-600" />
                <span className="text-sm text-gray-600">
                  Real-time Market Data
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-orange-600" />
                <span className="text-sm text-gray-600">Smart Alerts</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                <span className="text-sm text-gray-600">Expert Reviews</span>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="guides" className="flex items-center gap-2">
                <BookOpen className="h-4 w-4" />
                Buying Guides
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Market Insights
              </TabsTrigger>
              <TabsTrigger value="alerts" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Smart Alerts
              </TabsTrigger>
              <TabsTrigger value="compare" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Price Compare
              </TabsTrigger>
            </TabsList>

            <TabsContent value="guides" className="space-y-6">
              <BuyingGuidesSection
                categories={guideCategories}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <MarketInsightsSection
                insights={marketInsights}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="alerts" className="space-y-6">
              <SmartAlertsSection alerts={smartAlerts} loading={loading} />
            </TabsContent>

            <TabsContent value="compare" className="space-y-6">
              <PriceComparisonSection
                comparisonData={comparisonData}
                retailerComparisons={retailerComparisons}
                loading={loading}
              />
            </TabsContent>
          </Tabs>
        </div>
      </main>

      <Footer />
    </div>
  );
}
