"use client";

import { useState, useEffect } from "react";

import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Spinner } from "@/components/ui/spinner";
import {
  TrendingUp,
  FlameIcon as Fire,
  Eye,
  Heart,
  ShoppingCart,
  Clock,
  Award,
  Zap,
  BarChart3,
  Users,
  Calendar,
  Filter,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  ChevronRight,
  Home,
} from "lucide-react";

import { TrendingProduct, TrendingResponse } from "@/lib/types/trending";

const timeRanges = [
  { value: "day", label: "Last 24 Hours" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "Smartphones", label: "Smartphones" },
  { value: "Laptops", label: "Laptops" },
  { value: "Smartwatches", label: "Smartwatches" },
  { value: "Tablets", label: "Tablets" },
  { value: "Headphones", label: "Headphones" },
  { value: "Uncategorized", label: "Uncategorized" },
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-300", label: "Under $300" },
  { value: "300-600", label: "$300 - $600" },
  { value: "600-1000", label: "$600 - $1,000" },
  { value: "1000-1500", label: "$1,000 - $1,500" },
  { value: "1500+", label: "Over $1,500" },
];

const sortOptions = [
  { value: "trend_score", label: "Trending Score" },
  { value: "price_change", label: "Price Change" },
  { value: "search_volume", label: "Search Volume" },
];

// Function to generate placeholder views and favorites data
const generatePlaceholderStats = (score: number) => {
  // Generate some placeholder data based on the trend score
  const baseViews = Math.floor(score * 100 + Math.random() * 2000);
  const baseFavorites = Math.floor(baseViews * (0.2 + Math.random() * 0.1));

  const formatNumber = (num: number): string => {
    if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return {
    views: formatNumber(baseViews),
    favorites: formatNumber(baseFavorites),
    daysInTrending: Math.max(1, Math.floor(Math.random() * 20)),
    trendingPosition: 0, // Will be set based on the array index
    trendingChange:
      Math.random() > 0.6 ? "up" : Math.random() > 0.3 ? "down" : "new",
    lastWeekPosition:
      Math.random() > 0.2 ? Math.floor(Math.random() * 10) + 1 : null,
  };
};

export default function TrendingPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");
  const [sortBy, setSortBy] = useState("price_change"); // Always default to price_change
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [trendingData, setTrendingData] = useState<TrendingResponse | null>(
    null
  );
  const [retailers, setRetailers] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "All Retailers" }]);
  const [selectedRetailer, setSelectedRetailer] = useState("all");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);

  // Define stats based on API data or defaults
  const trendingStats = [
    {
      title: "Total Trending Items",
      value: trendingData?.products?.length || "0",
      change: "+12.5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-blue-600",
    },
    {
      title: "Most Viewed Today",
      value: "2.5K+",
      change: "+8.3%",
      trend: "up",
      icon: Eye,
      color: "text-green-600",
    },
    {
      title: "Tracking Accuracy",
      value: trendingData?.stats?.accuracy_rate || "95%",
      change: "+2.1%",
      trend: "up",
      icon: Zap,
      color: "text-orange-600",
    },
    {
      title: "Update Frequency",
      value: trendingData?.stats?.update_frequency || "Real-time",
      change: "0%",
      trend: "neutral",
      icon: BarChart3,
      color: "text-purple-600",
    },
  ];

  // Fetch trending products from the API
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // Build the API URL with query parameters
        const apiUrl = new URL(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/trending`
        );

        // Always set these parameters
        apiUrl.searchParams.set("sort", sortBy);
        apiUrl.searchParams.set("type", "trends"); // Always set to trends
        apiUrl.searchParams.set("period", timeRange);
        apiUrl.searchParams.set("limit", limit.toString());

        // Only add category if it's not "all"
        if (selectedCategory !== "all") {
          apiUrl.searchParams.set("category", selectedCategory);
        }

        // Fetch data from API
        const response = await fetch(apiUrl.toString());

        if (!response.ok) {
          throw new Error(`API error: ${response.status}`);
        }

        const data: TrendingResponse = await response.json();
        setTrendingData(data);

        // Extract unique retailers from the data
        if (data.products.length > 0) {
          const uniqueRetailers = [{ value: "all", label: "All Retailers" }];

          // Create a Set to track unique retailer IDs
          const retailerIds = new Set();

          data.products.forEach((product) => {
            if (!retailerIds.has(product.retailer_id)) {
              retailerIds.add(product.retailer_id);
              uniqueRetailers.push({
                value: product.retailer_id.toString(),
                label: product.retailer,
              });
            }
          });

          setRetailers(uniqueRetailers);
        }
      } catch (err) {
        console.error("Failed to fetch trending products:", err);
        setError("Failed to load trending products. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [timeRange, selectedCategory, sortBy, limit]);

  // Filter products based on selected filters (client-side filtering for price and retailer)
  const filteredProducts = trendingData?.products
    ? trendingData.products
        .filter((product) => {
          // Retailer filter
          if (
            selectedRetailer !== "all" &&
            product.retailer_id.toString() !== selectedRetailer
          ) {
            return false;
          }

          // Price range filter (client-side)
          if (selectedPriceRange !== "all") {
            const price = product.price;
            switch (selectedPriceRange) {
              case "0-300":
                if (price >= 300) return false;
                break;
              case "300-600":
                if (price < 300 || price >= 600) return false;
                break;
              case "600-1000":
                if (price < 600 || price >= 1000) return false;
                break;
              case "1000-1500":
                if (price < 1000 || price >= 1500) return false;
                break;
              case "1500+":
                if (price < 1500) return false;
                break;
            }
          }

          return true;
        })
        // Map products to include UI-specific properties
        .map((product, index) => {
          // Generate placeholder metrics for the UI
          const placeholderStats = generatePlaceholderStats(
            product.trend_score || 50
          );

          // Format the product to match the ProductCard component interface
          return {
            id: product.id,
            name: product.name,
            brand: product.brand || "Unknown Brand", // Ensure brand is never undefined
            category: product.category || "Uncategorized",
            price: product.price,
            originalPrice: product.original_price,
            retailer: product.retailer,
            inStock: product.in_stock,
            image: product.image || "/placeholder.svg",
            discount: product.discount,
            trendScore: product.trend_score || 0,
            searchVolume: placeholderStats.views,
            priceChange: product.price_change,
            // Additional UI-specific properties for the trending page
            trendingPosition: index + 1,
            favorites: placeholderStats.favorites,
            trendingChange:
              product.price_change && product.price_change < 0
                ? "down"
                : product.price_change && product.price_change > 0
                ? "up"
                : "neutral",
            lastWeekPosition: placeholderStats.lastWeekPosition,
            daysInTrending: placeholderStats.daysInTrending,
            isNew: index === 0 || Math.random() > 0.7,
          };
        })
    : [];

  const getTrendingIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      case "new":
        return <Zap className="h-3 w-3 text-orange-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getChangeColor = (trend: string) => {
    switch (trend) {
      case "up":
        return "text-green-600";
      case "down":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  // Handle load more functionality
  const handleLoadMore = () => {
    setLimit((prevLimit) => prevLimit + 10);
  };

  return (
    <div className="bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      

      <div className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Beautiful Blue Background */}
          <PageHeader
            title="Trending Products"
            icon={Fire}
            breadcrumbItems={[{ label: "Trending" }]}
          />

          {/* Content Section */}
          <div className="mb-8"></div>

          {/* Error message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}

          {/* Filter Results Summary */}
          {!isLoading &&
            !error &&
            (selectedCategory !== "all" ||
              selectedRetailer !== "all" ||
              selectedPriceRange !== "all") && (
              <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
                <p className="text-sm text-blue-800">
                  <span className="font-medium">Filtered Results:</span> Showing{" "}
                  {filteredProducts.length} products
                  {selectedCategory !== "all" && (
                    <span>
                      {" "}
                      in{" "}
                      {
                        categories.find((c) => c.value === selectedCategory)
                          ?.label
                      }
                    </span>
                  )}
                  {selectedRetailer !== "all" && (
                    <span>
                      {" "}
                      from{" "}
                      {
                        retailers.find((r) => r.value === selectedRetailer)
                          ?.label
                      }
                    </span>
                  )}
                  {selectedPriceRange !== "all" && (
                    <span>
                      {" "}
                      priced{" "}
                      {
                        priceRanges.find((p) => p.value === selectedPriceRange)
                          ?.label
                      }
                    </span>
                  )}
                </p>
              </div>
            )}

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start flex-wrap">
              {/* Time Range Filter */}
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Select
                  value={timeRange}
                  onValueChange={setTimeRange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {timeRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Category Filter */}
              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Sort By */}
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <Select
                  value={sortBy}
                  onValueChange={setSortBy}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {sortOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Retailer Filter */}
              <div className="flex items-center gap-2">
                <ShoppingCart className="h-4 w-4 text-gray-500" />
                <Select
                  value={selectedRetailer}
                  onValueChange={setSelectedRetailer}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {retailers.map((retailer) => (
                      <SelectItem key={retailer.value} value={retailer.value}>
                        {retailer.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Price Range Filter */}
              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">$</span>
                <Select
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                  disabled={isLoading}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {priceRanges.map((range) => (
                      <SelectItem key={range.value} value={range.value}>
                        {range.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Spinner size="lg" className="border-blue-500" />
              <p className="mt-4 text-gray-600">Loading trending products...</p>
            </div>
          )}

          {/* Content when data is loaded */}
          {!isLoading && !error && trendingData && (
            <>
              {/* Statistics Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                {trendingStats.map((stat, index) => (
                  <Card
                    key={index}
                    className="hover:shadow-lg transition-shadow"
                  >
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-gray-600 mb-1">
                            {stat.title}
                          </p>
                          <p className="text-2xl font-bold text-gray-900">
                            {stat.value}
                          </p>
                          <div
                            className={`flex items-center gap-1 text-sm ${getChangeColor(
                              stat.trend
                            )}`}
                          >
                            {stat.trend === "up" && (
                              <ArrowUpRight className="h-3 w-3" />
                            )}
                            {stat.trend === "down" && (
                              <ArrowDownRight className="h-3 w-3" />
                            )}
                            <span>{stat.change}</span>
                          </div>
                        </div>
                        <div
                          className={`p-3 rounded-full bg-gray-100 ${stat.color}`}
                        >
                          <stat.icon className="h-6 w-6" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Trending Products Section */}
              <div className="space-y-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <Fire className="h-6 w-6 text-red-500" />
                  Trending Now
                </h2>

                {/* Products Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="relative group">
                      <Card
                        className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Trending Badge */}
                        <div className="absolute top-3 left-3 z-20 flex gap-2 pointer-events-none">
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg flex items-center gap-1">
                            <Fire className="h-3 w-3" />#
                            {product.trendingPosition}
                          </Badge>
                          {product.trendingChange === "new" && (
                            <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                              NEW
                            </Badge>
                          )}
                        </div>

                        {/* Trending Change Indicator */}
                        <div className="absolute top-3 right-3 z-20 pointer-events-none">
                          <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                            {getTrendingIcon(product.trendingChange)}
                          </div>
                        </div>

                        {/* Product Card Content */}
                        <ProductCard product={product} />

                        {/* Trending Metrics Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                          <div className="grid grid-cols-3 gap-3 text-xs">
                            <div className="flex items-center gap-1">
                              <Eye className="h-3 w-3" />
                              <span>{product.searchVolume}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <Heart className="h-3 w-3" />
                              <span>{product.favorites}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <BarChart3 className="h-3 w-3" />
                              <span>{product.trendScore}%</span>
                            </div>
                          </div>
                          <div className="mt-2 text-xs opacity-80">
                            Trending for {product.daysInTrending} days
                            {product.lastWeekPosition && (
                              <span>
                                {" "}
                                • Was #{product.lastWeekPosition} last week
                              </span>
                            )}
                          </div>
                        </div>
                      </Card>
                    </div>
                  ))}
                </div>

                {/* Show message when no products match filters */}
                {filteredProducts.length === 0 && (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Filter className="h-8 w-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try adjusting your filters to see more trending products.
                    </p>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setSelectedCategory("all");
                        setSelectedRetailer("all");
                        setSelectedPriceRange("all");
                      }}
                    >
                      Clear all filters
                    </Button>
                  </div>
                )}

                {/* Load More Button - only show if there are products */}
                {filteredProducts.length > 0 &&
                  filteredProducts.length >= limit && (
                    <div className="text-center">
                      <Button
                        size="lg"
                        className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                        onClick={handleLoadMore}
                        disabled={isLoading}
                      >
                        <Fire className="h-4 w-4 mr-2" />
                        Load More Trending Products
                      </Button>
                    </div>
                  )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
