"use client";

import { useState, useEffect } from "react";
import {
  BarChart3,
  Activity,
  PieChart,
  Tag,
  TrendingUp,
  TrendingDown,
  Store,
} from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  fetchPriceHistoryData,
  fetchMarketSummaryData,
  fetchCategoryInsights,
  fetchShopComparison,
  mapPriceHistoryResponse,
  mapMarketSummaryResponse,
  mapCategoryInsightsResponse,
  mapShopComparisonResponse,
  AnalyticsFilters,
} from "@/lib/analytics-api";

// New User-Centric Analytics Components
import {
  PriceTrends,
  type PriceHistoryPoint,
} from "@/components/analytics/price-trends";
import {
  CategoryInsights,
  type CategoryInsight,
} from "@/components/analytics/category-insights";
import {
  ShopComparison,
  type ShopInsight,
} from "@/components/analytics/shop-comparison";
import {
  PriceAlerts,
  type PriceAlert,
} from "@/components/analytics/price-alerts";
import {
  UserFilters,
  type UserFiltersType,
} from "@/components/analytics/user-filters";
import {
  MarketSummary,
  type MarketSummary as MarketSummaryType,
} from "@/components/analytics/market-summary";

export default function AnalyticsPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User-centric data models
  const [priceHistory, setPriceHistory] = useState<PriceHistoryPoint[]>([]);
  const [categoryInsights, setCategoryInsights] = useState<CategoryInsight[]>(
    []
  );
  const [shopInsights, setShopInsights] = useState<ShopInsight[]>([]);
  const [priceAlerts, setPriceAlerts] = useState<PriceAlert[]>([]);
  const [marketSummary, setMarketSummary] = useState<MarketSummaryType | null>(
    null
  );
  const [selectedCategory, setSelectedCategory] = useState<string>(""); // For displaying selected category name
  const [bestTimeToBuy, setBestTimeToBuy] = useState<
    | {
        recommendation: string;
        confidence: number;
      }
    | undefined
  >(undefined);

  // Categories and retailers for filtering
  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
    { value: "smart-watches", label: "Smart Watches" },
    { value: "gaming", label: "Gaming" },
    { value: "audio", label: "Audio" },
    { value: "tablets", label: "Tablets" },
    { value: "accessories", label: "Accessories" },
  ];

  const retailerOptions = [
    { value: "all", label: "All Retailers" },
    { value: "techmart", label: "TechMart" },
    { value: "electrohub", label: "ElectroHub" },
    { value: "digitalworld", label: "DigitalWorld" },
    { value: "smartbuy", label: "SmartBuy" },
    { value: "gadgetzone", label: "GadgetZone" },
  ];

  // Simplified user filters
  const [filters, setFilters] = useState<UserFiltersType>({
    timeRange: "30d",
    category: "all",
    retailer: "all",
  });

  useEffect(() => {
    fetchUserAnalyticsData();
  }, [filters]);

  const fetchUserAnalyticsData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Make parallel API calls to fetch real data
      const [
        priceHistoryResponse,
        marketSummaryResponse,
        categoryInsightsResponse,
        shopComparisonResponse,
      ] = await Promise.all([
        fetchPriceHistoryData(filters),
        fetchMarketSummaryData(filters),
        fetchCategoryInsights(filters),
        fetchShopComparison(filters),
        // We still use this mock function for data that doesn't have a real API yet
        fetchPriceAlerts(),
      ]);

      // Map API responses to component prop formats
      const { priceHistory: newPriceHistory, bestTimeToBuy: newBestTimeToBuy } =
        mapPriceHistoryResponse(priceHistoryResponse);

      setPriceHistory(newPriceHistory);
      setBestTimeToBuy(newBestTimeToBuy);

      // Set the market summary data from the API
      setMarketSummary(mapMarketSummaryResponse(marketSummaryResponse));

      // Set the category insights and shop insights data from the API
      setCategoryInsights(
        mapCategoryInsightsResponse(categoryInsightsResponse)
      );
      setShopInsights(mapShopComparisonResponse(shopComparisonResponse));

      // Update selected category name for display
      if (filters.category !== "all") {
        const category = categoryOptions.find(
          (c) => c.value === filters.category
        );
        setSelectedCategory(category?.label || "");
      } else {
        setSelectedCategory("");
      }
    } catch (err) {
      setError("Failed to load analytics data. Please try again.");
      console.error("Analytics fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  // Mock data functions - would be replaced with real API calls
  const fetchPriceHistory = async () => {
    // This would use filters to get appropriate data from the backend
    const mockPriceHistory: PriceHistoryPoint[] = [
      {
        date: "2025-09-07",
        avgPrice: 899,
        lowestPrice: 849,
        priceDrops: 12,
        isGoodTimeToBuy: false,
      },
      {
        date: "2025-09-14",
        avgPrice: 879,
        lowestPrice: 829,
        priceDrops: 18,
        isGoodTimeToBuy: false,
      },
      {
        date: "2025-09-21",
        avgPrice: 849,
        lowestPrice: 799,
        priceDrops: 24,
        isGoodTimeToBuy: true,
      },
      {
        date: "2025-09-28",
        avgPrice: 819,
        lowestPrice: 789,
        priceDrops: 31,
        isGoodTimeToBuy: true,
      },
      {
        date: "2025-10-05",
        avgPrice: 799,
        lowestPrice: 769,
        priceDrops: 38,
        isGoodTimeToBuy: true,
      },
    ];
    setPriceHistory(mockPriceHistory);
  };

  // Note: fetchCategoryInsights and fetchShopInsights are now imported from @/lib/analytics-api

  const fetchPriceAlerts = async () => {
    const mockAlerts: PriceAlert[] = [
      {
        id: "alert-1",
        productTitle: "Samsung Galaxy S26 Ultra - 512GB - Phantom Black",
        imageUrl: "/placeholder.jpg",
        originalPrice: 1299,
        currentPrice: 1099,
        percentageChange: -15.4,
        shopName: "TechMart",
        detectedDate: "2025-10-06",
        productUrl: "/product/samsung-galaxy-s26-ultra",
        type: "price_drop",
      },
      {
        id: "alert-2",
        productTitle: "MacBook Air M4 - 16GB RAM - 512GB SSD - Space Gray",
        imageUrl: "/placeholder.jpg",
        originalPrice: 1499,
        currentPrice: 1349,
        percentageChange: -10,
        shopName: "ElectroHub",
        detectedDate: "2025-10-05",
        productUrl: "/product/macbook-air-m4",
        type: "flash_sale",
      },
      {
        id: "alert-3",
        productTitle: "Sony WH-1100XM6 Noise Cancelling Headphones - Black",
        imageUrl: "/placeholder.jpg",
        originalPrice: 349,
        currentPrice: 279,
        percentageChange: -20.1,
        shopName: "DigitalWorld",
        detectedDate: "2025-10-04",
        productUrl: "/product/sony-wh-1100xm6",
        type: "price_drop",
      },
      {
        id: "alert-4",
        productTitle: "PlayStation 6 Digital Edition - 2TB",
        imageUrl: "/placeholder.jpg",
        originalPrice: 499,
        currentPrice: 469,
        percentageChange: -6,
        shopName: "GadgetZone",
        detectedDate: "2025-10-03",
        productUrl: "/product/playstation-6-digital",
        type: "unusual_discount",
      },
    ];
    setPriceAlerts(mockAlerts);
  };

  const fetchMarketSummary = async () => {
    const mockSummary: MarketSummaryType = {
      totalProducts: 450000,
      totalShops: 47,
      averagePriceChange: -3.2,
      priceDropPercentage: 38,
      bestBuyingScore: 72,
      categoryDistribution: [
        { name: "Smartphones", value: 45000, color: "#3B82F6" },
        { name: "Laptops", value: 32000, color: "#10B981" },
        { name: "Audio", value: 38000, color: "#F59E0B" },
        { name: "Gaming", value: 41000, color: "#EF4444" },
        { name: "Other", value: 294000, color: "#8B5CF6" },
      ],
    };
    setMarketSummary(mockSummary);
  };

  const generateBuyingRecommendation = () => {
    // This would be based on real data analytics in a production environment
    // Here we're just using a simple algorithm based on the mock data

    // Check if we have price history and it shows a downward trend
    if (priceHistory.length > 0) {
      const firstPrice = priceHistory[0].avgPrice;
      const lastPrice = priceHistory[priceHistory.length - 1].avgPrice;
      const priceChange = ((lastPrice - firstPrice) / firstPrice) * 100;

      if (priceChange < -10) {
        setBestTimeToBuy({
          recommendation:
            "Now is an excellent time to buy! Prices have dropped significantly in the last month.",
          confidence: 85,
        });
      } else if (priceChange < -5) {
        setBestTimeToBuy({
          recommendation:
            "Consider buying now. Prices have been trending downward recently.",
          confidence: 75,
        });
      } else if (priceChange < 0) {
        setBestTimeToBuy({
          recommendation:
            "Prices are slowly decreasing. You may want to monitor for a few more days.",
          confidence: 60,
        });
      } else {
        setBestTimeToBuy({
          recommendation:
            "Prices are currently increasing. Consider waiting for a better opportunity.",
          confidence: 70,
        });
      }
    }
  };

  const viewAllPriceAlerts = () => {
    // In a real application, this would navigate to a dedicated alerts page
    console.log("Navigate to all price alerts");
  };

  const breadcrumbItems = [{ label: "Market Analytics", href: "/analytics" }];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30 dark:from-gray-900 dark:via-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <PageHeader
            title="Market Analytics"
            icon={BarChart3}
            breadcrumbItems={breadcrumbItems}
          />

          {/* Filters */}
          <UserFilters
            filters={filters}
            onFiltersChange={setFilters}
            categories={categoryOptions}
            retailers={retailerOptions}
            loading={loading}
          />

          {/* Main Content */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <Activity className="h-4 w-4" />
                Market Overview
              </TabsTrigger>
              <TabsTrigger
                value="price-trends"
                className="flex items-center gap-2"
              >
                <TrendingUp className="h-4 w-4" />
                Price Trends
              </TabsTrigger>
              <TabsTrigger
                value="categories"
                className="flex items-center gap-2"
              >
                <Tag className="h-4 w-4" />
                Categories
              </TabsTrigger>
              <TabsTrigger
                value="retailers"
                className="flex items-center gap-2"
              >
                <Store className="h-4 w-4" />
                Retailers
              </TabsTrigger>
            </TabsList>

            {/* Overview Tab */}
            <TabsContent value="overview" className="space-y-6">
              {marketSummary && (
                <MarketSummary summary={marketSummary} loading={loading} />
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2">
                  <PriceTrends
                    priceHistory={priceHistory}
                    categoryName={selectedCategory}
                    loading={loading}
                    bestTimeToBuy={bestTimeToBuy}
                  />
                </div>

                <div>
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <Tag className="h-4 w-4" />
                        Top Price Alerts
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {loading ? (
                        <div className="space-y-3">
                          {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="flex gap-2">
                              <Skeleton className="h-10 w-10 rounded-md" />
                              <div className="space-y-1 flex-1">
                                <Skeleton className="h-4 w-full" />
                                <Skeleton className="h-3 w-3/4" />
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : priceAlerts.length === 0 ? (
                        <div className="text-center py-4">
                          <div className="text-sm text-muted-foreground">
                            No active alerts
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {priceAlerts.slice(0, 3).map((alert, idx) => (
                            <div key={idx} className="flex gap-2 items-center">
                              <div className="shrink-0 h-10 w-10 border rounded-md overflow-hidden">
                                <img
                                  src={alert.imageUrl}
                                  alt=""
                                  className="h-full w-full object-contain"
                                  onError={(e) => {
                                    e.currentTarget.src = "/placeholder.jpg";
                                  }}
                                />
                              </div>
                              <div className="flex-1">
                                <p className="text-xs line-clamp-1">
                                  {alert.productTitle}
                                </p>
                                <div className="flex items-center gap-1 text-xs text-green-600 font-medium">
                                  <TrendingDown className="h-3 w-3" />
                                  {alert.percentageChange.toFixed(1)}%
                                </div>
                              </div>
                            </div>
                          ))}

                          <button
                            onClick={viewAllPriceAlerts}
                            className="text-xs text-blue-600 hover:underline w-full text-center pt-2"
                          >
                            View all alerts
                          </button>
                        </div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>

            {/* Price Trends Tab */}
            <TabsContent value="price-trends" className="space-y-6">
              <PriceTrends
                priceHistory={priceHistory}
                categoryName={selectedCategory}
                loading={loading}
                bestTimeToBuy={bestTimeToBuy}
              />

              {/* Additional insights for price trends, not duplicating content */}
              {marketSummary && (
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">
                      Price Change Analysis
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center justify-between p-4 rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800">
                      <div className="flex flex-col items-center sm:items-start mb-4 sm:mb-0">
                        <span className="text-sm text-muted-foreground">
                          Market Buying Condition
                        </span>
                        <span
                          className={`text-xl font-bold ${
                            marketSummary.bestBuyingScore >= 70
                              ? "text-green-600"
                              : marketSummary.bestBuyingScore >= 50
                              ? "text-blue-600"
                              : "text-amber-600"
                          }`}
                        >
                          {marketSummary.bestBuyingScore}/100
                        </span>
                      </div>
                      <div className="flex flex-col items-center sm:items-start">
                        <span className="text-sm text-muted-foreground">
                          Products on Sale
                        </span>
                        <span className="text-xl font-bold text-purple-600">
                          {marketSummary.priceDropPercentage.toFixed(1)}%
                        </span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            {/* Categories Tab */}
            <TabsContent value="categories" className="space-y-6">
              <CategoryInsights insights={categoryInsights} loading={loading} />

              {/* Category-specific stats card instead of duplicating content */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Category Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-800 rounded-lg">
                      <h3 className="font-medium mb-2">Total Categories</h3>
                      <div className="text-2xl font-bold">
                        {categoryInsights.length}
                      </div>
                    </div>
                    <div className="p-4 bg-green-50 dark:bg-green-900/20 border border-green-100 dark:border-green-800 rounded-lg">
                      <h3 className="font-medium mb-2">Avg Price Change</h3>
                      <div className="text-2xl font-bold">
                        {categoryInsights.length > 0
                          ? (
                              categoryInsights.reduce(
                                (sum, cat) => sum + cat.priceChange,
                                0
                              ) / categoryInsights.length
                            ).toFixed(1) + "%"
                          : "0%"}
                      </div>
                    </div>
                    <div className="p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800 rounded-lg">
                      <h3 className="font-medium mb-2">Total Products</h3>
                      <div className="text-2xl font-bold">
                        {categoryInsights
                          .reduce((sum, cat) => sum + cat.productCount, 0)
                          .toLocaleString()}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Retailers Tab */}
            <TabsContent value="retailers" className="space-y-6">
              <ShopComparison insights={shopInsights} loading={loading} />

              {/* Retailer-specific stats instead of duplicating alerts */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Retailer Insights</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Top Categories by Retailer
                      </h3>
                      <div className="space-y-4">
                        {shopInsights.slice(0, 3).map((shop, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium">{shop.shopName}</span>
                            <div className="flex flex-wrap gap-2">
                              {shop.bestCategories.map((cat, j) => (
                                <Badge key={j} variant="outline">
                                  {cat}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h3 className="text-sm font-medium mb-3">
                        Product Availability
                      </h3>
                      <div className="space-y-4">
                        {shopInsights.slice(0, 5).map((shop, i) => (
                          <div
                            key={i}
                            className="flex justify-between items-center"
                          >
                            <span className="font-medium">{shop.shopName}</span>
                            <span
                              className={`${
                                shop.availabilityPercentage > 90
                                  ? "text-green-600"
                                  : shop.availabilityPercentage > 80
                                  ? "text-blue-600"
                                  : "text-amber-600"
                              }`}
                            >
                              {shop.availabilityPercentage}%
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
