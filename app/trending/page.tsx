"use client";

import { useState, useEffect, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
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
  Loader2,
} from "lucide-react";

const timeRanges = [
  { value: "day", label: "Last 24 Hours" },
  { value: "week", label: "Last 7 Days" },
  { value: "month", label: "Last 30 Days" },
];

const sortOptions = [
  { value: "trend_score", label: "Trending Score" },
  { value: "price_change", label: "Price Change" },
  { value: "search_volume", label: "Search Volume" },
];

const typeOptions = [
  { value: "trends", label: "Trending Products" },
  { value: "launches", label: "New Launches" },
];

interface TrendingProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price?: number;
  originalPrice?: number;
  retailer: string;
  retailer_id: string;
  in_stock: boolean;
  inStock: boolean;
  image?: string;
  discount?: number;
  trend_score: number;
  trendingScore: number;
  search_volume?: string;
  searchVolume?: string;
  price_change: number;
  priceChange: number;
  is_trending?: boolean;
  is_new?: boolean;
  launch_date?: string;
  launchDate?: string;
  pre_orders?: number;
  preOrders?: number;
  rating?: number;
  // Additional UI properties
  trendingPosition: number;
  trendingChange: string;
  lastWeekPosition?: number;
  daysInTrending: number;
  views: string;
  favorites: string;
}

interface TrendingStats {
  trending_searches?: string;
  accuracy_rate?: string;
  update_frequency?: string;
  new_launches?: string;
  tracking_type?: string;
}

export default function TrendingPage() {
  const [timeRange, setTimeRange] = useState("week");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSort, setSelectedSort] = useState("trend_score");
  const [selectedType, setSelectedType] = useState("trends");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // API state
  const [products, setProducts] = useState<TrendingProduct[]>([]);
  const [stats, setStats] = useState<TrendingStats>({});
  const [categories, setCategories] = useState<
    { value: string; label: string }[]
  >([{ value: "all", label: "All Categories" }]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch categories for filter dropdown
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?include_subcategories=false`
        );
        if (response.ok) {
          const data = await response.json();
          const categoryOptions = [
            { value: "all", label: "All Categories" },
            ...(data.categories || []).map((cat: any) => ({
              value: cat.name,
              label: cat.name,
            })),
          ];
          setCategories(categoryOptions);
        }
      } catch (err) {
        console.error("Failed to fetch categories:", err);
      }
    };

    fetchCategories();
  }, []);

  // Fetch trending products
  useEffect(() => {
    const fetchTrendingProducts = async () => {
      try {
        setLoading(true);
        setError(null);

        const params = new URLSearchParams({
          limit: "20",
          period: timeRange,
          sort: selectedSort,
          type: selectedType,
        });

        if (selectedCategory !== "all") {
          params.append("category", selectedCategory);
        }

        console.log(
          "Fetching trending products with params:",
          params.toString()
        );

        const response = await fetch(
          `${
            process.env.NEXT_PUBLIC_API_URL
          }/api/v1/trending?${params.toString()}`
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log("Trending API response:", data);

        // Map API data to frontend format
        const mappedProducts = (data.products || []).map(
          (product: any, index: number) => ({
            id: product.id || index + 1,
            name: product.name || "Unknown Product",
            brand: product.brand || "Unknown Brand",
            category: product.category || "Other",
            price: product.price || 0,
            original_price: product.original_price || product.price,
            originalPrice: product.original_price || product.price,
            retailer: product.retailer || "Unknown Store",
            retailer_id: product.retailer_id,
            in_stock: product.in_stock !== false,
            inStock: product.in_stock !== false,
            image:
              product.image ||
              "/placeholder.svg?height=200&width=200&text=Product",
            discount: product.discount || 0,
            trend_score: product.trend_score || 0,
            trendingScore: product.trend_score || 0,
            search_volume: product.search_volume,
            searchVolume: product.search_volume,
            price_change: product.price_change || 0,
            priceChange: product.price_change || 0,
            trendingPosition: index + 1,
            trendingChange: index === 0 ? "up" : index < 3 ? "new" : "neutral",
            lastWeekPosition: Math.floor(Math.random() * 10) + 1,
            daysInTrending: Math.floor(Math.random() * 30) + 1,
            views: `${(Math.random() * 20 + 1).toFixed(1)}K`,
            favorites: `${(Math.random() * 5 + 0.5).toFixed(1)}K`,
            // New launch specific fields
            launch_date: product.launch_date,
            launchDate: product.launch_date,
            pre_orders: product.pre_orders,
            preOrders: product.pre_orders,
            rating: product.rating,
            isNew: product.is_new || false,
            isTrending: product.is_trending || false,
            is_new: product.is_new || false,
            is_trending: product.is_trending || false,
          })
        );

        setProducts(mappedProducts);
        setStats(data.stats || {});
      } catch (err: any) {
        console.error("Error fetching trending products:", err);
        setError(err.message || "Failed to fetch trending products");
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingProducts();
  }, [timeRange, selectedCategory, selectedSort, selectedType]);

  // Filter products by price range (client-side filtering)
  const filteredProducts = useMemo(() => {
    if (selectedPriceRange === "all") return products;

    return products.filter((product) => {
      const price = product.price;
      switch (selectedPriceRange) {
        case "0-300":
          return price < 300;
        case "300-600":
          return price >= 300 && price < 600;
        case "600-1000":
          return price >= 600 && price < 1000;
        case "1000-1500":
          return price >= 1000 && price < 1500;
        case "1500+":
          return price >= 1500;
        default:
          return true;
      }
    });
  }, [products, selectedPriceRange]);

  // Calculate dynamic stats based on loaded data
  const calculatedStats = useMemo(() => {
    const baseStats = [
      {
        title:
          selectedType === "trends" ? "Total Trending Items" : "New Launches",
        value: filteredProducts.length.toLocaleString(),
        change: "+12.5%",
        trend: "up" as "up" | "down" | "neutral",
        icon: selectedType === "trends" ? TrendingUp : Zap,
        color: "text-blue-600",
      },
      {
        title: selectedType === "trends" ? "Most Viewed Today" : "Pre-orders",
        value:
          selectedType === "trends"
            ? stats.trending_searches || "45.2K"
            : `${Math.floor(
                filteredProducts.reduce(
                  (sum, p) => sum + (p.preOrders || 0),
                  0
                ) / 1000
              )}K`,
        change: "+8.3%",
        trend: "up" as "up" | "down" | "neutral",
        icon: selectedType === "trends" ? Eye : Users,
        color: "text-green-600",
      },
      {
        title: selectedType === "trends" ? "Accuracy Rate" : "Avg Rating",
        value:
          selectedType === "trends"
            ? stats.accuracy_rate || "95%"
            : (
                filteredProducts.reduce(
                  (sum, p) => sum + (p.rating || 4.5),
                  0
                ) / filteredProducts.length || 4.5
              ).toFixed(1),
        change: selectedType === "trends" ? "0%" : "+0.2",
        trend: "neutral" as "up" | "down" | "neutral",
        icon: selectedType === "trends" ? BarChart3 : Award,
        color: "text-orange-600",
      },
      {
        title: "Categories Active",
        value: new Set(filteredProducts.map((p) => p.category)).size.toString(),
        change: "0%",
        trend: "neutral" as "up" | "down" | "neutral",
        icon: BarChart3,
        color: "text-purple-600",
      },
    ];

    return baseStats;
  }, [filteredProducts, stats, selectedType]);

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

  const clearAllFilters = () => {
    setSelectedCategory("all");
    setSelectedPriceRange("all");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title={
              selectedType === "trends"
                ? "Trending Products"
                : "New Product Launches"
            }
            icon={selectedType === "trends" ? Fire : Zap}
            breadcrumbItems={[
              {
                label: selectedType === "trends" ? "Trending" : "New Launches",
              },
            ]}
          />

          <div className="mb-8"></div>

          {/* Filter Results Summary */}
          {(selectedCategory !== "all" || selectedPriceRange !== "all") && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg max-w-2xl">
              <p className="text-sm text-blue-800">
                <span className="font-medium">Filtered Results:</span> Showing{" "}
                {filteredProducts.length} products
                {selectedCategory !== "all" && (
                  <span> in {selectedCategory}</span>
                )}
                {selectedPriceRange !== "all" && (
                  <span>
                    {" "}
                    priced{" "}
                    {selectedPriceRange.replace("-", " - $").replace("+", "+")}
                  </span>
                )}
              </p>
            </div>
          )}

          {/* Filters Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row gap-4 justify-start items-start flex-wrap">
              <div className="flex items-center gap-2">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Select value={selectedType} onValueChange={setSelectedType}>
                  <SelectTrigger className="w-48">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {typeOptions.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        {type.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-gray-500" />
                <Select value={timeRange} onValueChange={setTimeRange}>
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

              <div className="flex items-center gap-2">
                <Filter className="h-4 w-4 text-gray-500" />
                <Select
                  value={selectedCategory}
                  onValueChange={setSelectedCategory}
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

              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-gray-500" />
                <Select value={selectedSort} onValueChange={setSelectedSort}>
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

              <div className="flex items-center gap-2">
                <span className="text-sm font-medium text-gray-500">$</span>
                <Select
                  value={selectedPriceRange}
                  onValueChange={setSelectedPriceRange}
                >
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Prices</SelectItem>
                    <SelectItem value="0-300">Under Rs 50,000</SelectItem>
                    <SelectItem value="300-600">
                      Rs 50,000 - Rs 100,000
                    </SelectItem>
                    <SelectItem value="600-1000">
                      Rs 100,000 - Rs 200,000
                    </SelectItem>
                    <SelectItem value="1000-1500">
                      Rs 200,000 - Rs 300,000
                    </SelectItem>
                    <SelectItem value="1500+">Over Rs 300,000</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {calculatedStats.map((stat, index) => (
              <Card key={index} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
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

          {/* Content Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              {selectedType === "trends" ? (
                <Fire className="h-6 w-6 text-red-500" />
              ) : (
                <Zap className="h-6 w-6 text-blue-500" />
              )}
              {selectedType === "trends" ? "Trending Now" : "New Launches"}
            </h2>

            {/* Loading State */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <Card key={index} className="h-96">
                    <CardContent className="p-6 text-center h-full flex flex-col justify-center">
                      <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-gray-400" />
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded animate-pulse"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Fire className="h-8 w-8 text-red-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Failed to load trending products
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button
                  onClick={() => window.location.reload()}
                  variant="outline"
                >
                  Try again
                </Button>
              </div>
            )}

            {/* Products Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredProducts.map((product, index) => (
                  <div key={product.id} className="relative group">
                    <Card
                      className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {/* Trending/New Badge */}
                      <div className="absolute top-3 left-3 z-20 flex gap-2 pointer-events-none">
                        {selectedType === "trends" ? (
                          <Badge className="bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold shadow-lg flex items-center gap-1">
                            <Fire className="h-3 w-3" />#
                            {product.trendingPosition}
                          </Badge>
                        ) : (
                          <Badge className="bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold shadow-lg flex items-center gap-1">
                            <Zap className="h-3 w-3" />
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
                      <ProductCard
                        product={{
                          ...product,
                          image:
                            product.image ||
                            "/placeholder.svg?height=200&width=200&text=Product",
                        }}
                      />

                      {/* Metrics Overlay */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                        <div className="grid grid-cols-3 gap-3 text-xs">
                          {selectedType === "trends" ? (
                            <>
                              <div className="flex items-center gap-1">
                                <Eye className="h-3 w-3" />
                                <span>{product.views}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="h-3 w-3" />
                                <span>{product.favorites}</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <BarChart3 className="h-3 w-3" />
                                <span>{product.trendingScore}%</span>
                              </div>
                            </>
                          ) : (
                            <>
                              <div className="flex items-center gap-1">
                                <Users className="h-3 w-3" />
                                <span>
                                  {product.preOrders?.toLocaleString() || "0"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Award className="h-3 w-3" />
                                <span>
                                  {product.rating?.toFixed(1) || "4.5"}
                                </span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3" />
                                <span>New</span>
                              </div>
                            </>
                          )}
                        </div>
                        <div className="mt-2 text-xs opacity-80">
                          {selectedType === "trends" ? (
                            <>
                              Trending for {product.daysInTrending} days
                              {product.lastWeekPosition && (
                                <span>
                                  {" "}
                                  • Was #{product.lastWeekPosition} last week
                                </span>
                              )}
                            </>
                          ) : product.launchDate ? (
                            `Launched ${product.launchDate}`
                          ) : (
                            "Recently launched"
                          )}
                        </div>
                      </div>
                    </Card>
                  </div>
                ))}
              </div>
            )}

            {/* Show message when no products match filters */}
            {!loading && !error && filteredProducts.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Filter className="h-8 w-8 text-gray-400" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-4">
                  Try adjusting your filters to see more{" "}
                  {selectedType === "trends" ? "trending" : "new"} products.
                </p>
                <Button variant="outline" onClick={clearAllFilters}>
                  Clear all filters
                </Button>
              </div>
            )}

            {/* Load More Button */}
            {!loading && !error && filteredProducts.length > 0 && (
              <div className="text-center">
                <Button
                  size="lg"
                  className={`bg-gradient-to-r ${
                    selectedType === "trends"
                      ? "from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                      : "from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                  }`}
                >
                  {selectedType === "trends" ? (
                    <Fire className="h-4 w-4 mr-2" />
                  ) : (
                    <Zap className="h-4 w-4 mr-2" />
                  )}
                  Load More{" "}
                  {selectedType === "trends"
                    ? "Trending Products"
                    : "New Launches"}
                </Button>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
