"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { AnalyticsOverview } from "@/components/analytics/analytics-overview";
import { AnalyticsCharts } from "@/components/analytics/analytics-charts";
import { AnalyticsInsights } from "@/components/analytics/analytics-insights";
import { AnalyticsFilters } from "@/components/analytics/analytics-filters";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  Zap,
  Globe,
  TrendingDown,
  AlertTriangle,
  Target,
  Home,
} from "lucide-react";
import {
  MarketOverview,
  PriceTrendData,
  CategoryPerformance,
  RetailerInsights,
  MarketAnomalies,
  AnalyticsFilters as AnalyticsFiltersType,
} from "@/lib/types/analytics";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [marketOverview, setMarketOverview] = useState<MarketOverview | null>(
    null
  );
  const [priceTrends, setPriceTrends] = useState<PriceTrendData[]>([]);
  const [categoryPerformance, setCategoryPerformance] = useState<
    CategoryPerformance[]
  >([]);
  const [retailerInsights, setRetailerInsights] = useState<RetailerInsights[]>(
    []
  );
  const [marketAnomalies, setMarketAnomalies] =
    useState<MarketAnomalies | null>(null);

  const [filters, setFilters] = useState<AnalyticsFiltersType>({
    timeRange: "30d",
    category: "all",
    retailer: "all",
    metric: "price_changes",
  });

  useEffect(() => {
    fetchAnalyticsData();
  }, [filters]);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch all analytics data
      await Promise.all([
        fetchMarketOverview(),
        fetchPriceTrends(),
        fetchCategoryPerformance(),
        fetchRetailerInsights(),
        fetchMarketAnomalies(),
      ]);
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMarketOverview = async () => {
    // Mock data - replace with actual API call
    const mockOverview: MarketOverview = {
      totalProducts: 2547892,
      totalCategories: 156,
      totalRetailers: 47,
      averagePriceChange: -2.3,
      totalPriceDrops: 12847,
      totalPriceIncreases: 8932,
      marketVolatility: 0.23,
      lastUpdated: new Date().toISOString(),
    };
    setMarketOverview(mockOverview);
  };

  const fetchPriceTrends = async () => {
    // Mock data - replace with actual API call
    const mockTrends: PriceTrendData[] = [
      {
        date: "2024-07-01",
        avgPriceChange: -1.2,
        totalChanges: 1240,
        volatility: 0.15,
      },
      {
        date: "2024-07-08",
        avgPriceChange: -2.1,
        totalChanges: 1580,
        volatility: 0.22,
      },
      {
        date: "2024-07-15",
        avgPriceChange: 0.8,
        totalChanges: 980,
        volatility: 0.18,
      },
      {
        date: "2024-07-22",
        avgPriceChange: -3.2,
        totalChanges: 2100,
        volatility: 0.35,
      },
      {
        date: "2024-07-29",
        avgPriceChange: -1.8,
        totalChanges: 1450,
        volatility: 0.28,
      },
      {
        date: "2024-08-05",
        avgPriceChange: -2.3,
        totalChanges: 1820,
        volatility: 0.23,
      },
    ];
    setPriceTrends(mockTrends);
  };

  const fetchCategoryPerformance = async () => {
    // Mock data - replace with actual API call
    const mockCategories: CategoryPerformance[] = [
      {
        categoryName: "Smartphones",
        totalProducts: 45820,
        avgPriceChange: -3.4,
        priceDrops: 2840,
        priceIncreases: 1200,
      },
      {
        categoryName: "Laptops",
        totalProducts: 28950,
        avgPriceChange: -1.8,
        priceDrops: 1890,
        priceIncreases: 1650,
      },
      {
        categoryName: "Smart Watches",
        totalProducts: 18340,
        avgPriceChange: -4.2,
        priceDrops: 1950,
        priceIncreases: 890,
      },
      {
        categoryName: "Gaming",
        totalProducts: 32100,
        avgPriceChange: -2.1,
        priceDrops: 2100,
        priceIncreases: 1800,
      },
      {
        categoryName: "Audio",
        totalProducts: 21670,
        avgPriceChange: -1.5,
        priceDrops: 1340,
        priceIncreases: 1100,
      },
    ];
    setCategoryPerformance(mockCategories);
  };

  const fetchRetailerInsights = async () => {
    // Mock data - replace with actual API call
    const mockRetailers: RetailerInsights[] = [
      {
        retailerName: "TechMart",
        totalProducts: 125840,
        avgPriceChange: -2.1,
        competitiveRating: 8.5,
        marketShare: 18.2,
      },
      {
        retailerName: "ElectroHub",
        totalProducts: 98750,
        avgPriceChange: -1.8,
        competitiveRating: 7.9,
        marketShare: 14.3,
      },
      {
        retailerName: "DigitalWorld",
        totalProducts: 87500,
        avgPriceChange: -2.8,
        competitiveRating: 8.1,
        marketShare: 12.7,
      },
      {
        retailerName: "SmartBuy",
        totalProducts: 76300,
        avgPriceChange: -1.2,
        competitiveRating: 7.2,
        marketShare: 11.1,
      },
      {
        retailerName: "GadgetZone",
        totalProducts: 65400,
        avgPriceChange: -3.1,
        competitiveRating: 8.3,
        marketShare: 9.5,
      },
    ];
    setRetailerInsights(mockRetailers);
  };

  const fetchMarketAnomalies = async () => {
    // Mock data - replace with actual API call
    const mockAnomalies: MarketAnomalies = {
      totalAnomalies: 247,
      significantDrops: 156,
      significantIncreases: 91,
      highVolatilityProducts: 73,
      averageAnomalyScore: 0.78,
      topAnomalyCategory: "Gaming",
    };
    setMarketAnomalies(mockAnomalies);
  };

  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Analytics", href: "/analytics" },
  ];

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
                  <BreadcrumbPage>Analytics</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Page Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Market Analytics
              </h1>
              <p className="text-gray-600 text-lg">
                Comprehensive insights into product pricing trends and market
                dynamics
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Real-time Data
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Globe className="h-4 w-4 mr-2" />
                47 Retailers
              </Badge>
            </div>
          </div>

          {/* Filters */}
          <AnalyticsFilters
            filters={filters}
            onFiltersChange={setFilters}
            loading={loading}
          />

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="trends" className="flex items-center gap-2">
                <TrendingUp className="h-4 w-4" />
                Price Trends
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2"
              >
                <PieChart className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger value="insights" className="flex items-center gap-2">
                <Zap className="h-4 w-4" />
                Market Insights
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <AnalyticsOverview
                overview={marketOverview}
                anomalies={marketAnomalies}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="trends" className="space-y-6">
              <AnalyticsCharts
                priceTrends={priceTrends}
                categoryPerformance={categoryPerformance}
                retailerInsights={retailerInsights}
                loading={loading}
              />
            </TabsContent>

            <TabsContent value="categories" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <PieChart className="h-5 w-5" />
                    Category Performance Analysis
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {/* Category performance content will be in AnalyticsCharts */}
                  <AnalyticsCharts
                    priceTrends={[]}
                    categoryPerformance={categoryPerformance}
                    retailerInsights={[]}
                    loading={loading}
                    viewMode="categories"
                  />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="insights" className="space-y-6">
              <AnalyticsInsights
                marketOverview={marketOverview}
                categoryPerformance={categoryPerformance}
                retailerInsights={retailerInsights}
                anomalies={marketAnomalies}
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
