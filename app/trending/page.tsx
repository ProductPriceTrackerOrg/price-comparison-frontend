"use client";

import { useState } from "react";
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
} from "lucide-react";

const timeRanges = [
  { value: "24h", label: "Last 24 Hours" },
  { value: "7d", label: "Last 7 Days" },
  { value: "30d", label: "Last 30 Days" },
  { value: "90d", label: "Last 3 Months" },
];

const categories = [
  { value: "all", label: "All Categories" },
  { value: "smartphones", label: "Smartphones" },
  { value: "laptops", label: "Laptops" },
  { value: "smartwatches", label: "Smartwatches" },
  { value: "tablets", label: "Tablets" },
  { value: "headphones", label: "Headphones" },
];

const retailers = [
  { value: "all", label: "All Retailers" },
  { value: "mobileworld", label: "MobileWorld" },
  { value: "wearabletech", label: "WearableTech" },
  { value: "techmart", label: "TechMart" },
  { value: "computerstore", label: "ComputerStore" },
  { value: "computerworld", label: "ComputerWorld" },
  { value: "audiotech", label: "AudioTech" },
];

const priceRanges = [
  { value: "all", label: "All Prices" },
  { value: "0-300", label: "Under $300" },
  { value: "300-600", label: "$300 - $600" },
  { value: "600-1000", label: "$600 - $1,000" },
  { value: "1000-1500", label: "$1,000 - $1,500" },
  { value: "1500+", label: "Over $1,500" },
];

const trendingStats = [
  {
    title: "Total Trending Items",
    value: "2,847",
    change: "+12.5%",
    trend: "up",
    icon: TrendingUp,
    color: "text-blue-600",
  },
  {
    title: "Most Viewed Today",
    value: "45.2K",
    change: "+8.3%",
    trend: "up",
    icon: Eye,
    color: "text-green-600",
  },
  {
    title: "New Trending",
    value: "186",
    change: "+23.1%",
    trend: "up",
    icon: Zap,
    color: "text-orange-600",
  },
  {
    title: "Categories Active",
    value: "24",
    change: "0%",
    trend: "neutral",
    icon: BarChart3,
    color: "text-purple-600",
  },
];

const trendingProducts = [
  {
    id: 1,
    name: "iPhone 15 Pro Max",
    brand: "Apple",
    category: "Smartphones",
    price: 1199.99,
    originalPrice: 1299.99,
    retailer: "MobileWorld",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=iPhone+15+Pro",
    discount: 8,
    trendingScore: 98,
    views: "12.5K",
    favorites: "3.2K",
    priceChange: -7.2,
    trendingPosition: 1,
    trendingChange: "up",
    lastWeekPosition: 3,
    daysInTrending: 5,
  },
  {
    id: 2,
    name: "Samsung Galaxy Watch 6",
    brand: "Samsung",
    category: "Smartwatches",
    price: 329.99,
    originalPrice: 399.99,
    retailer: "WearableTech",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=Galaxy+Watch",
    discount: 18,
    trendingScore: 94,
    views: "8.7K",
    favorites: "2.1K",
    priceChange: -12.5,
    trendingPosition: 2,
    trendingChange: "new",
    lastWeekPosition: null,
    daysInTrending: 2,
  },
  {
    id: 3,
    name: "Google Pixel 8 Pro",
    brand: "Google",
    category: "Smartphones",
    price: 799.99,
    originalPrice: 899.99,
    retailer: "TechMart",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=Pixel+8+Pro",
    discount: 11,
    trendingScore: 89,
    views: "6.3K",
    favorites: "1.8K",
    priceChange: 2.3,
    trendingPosition: 3,
    trendingChange: "down",
    lastWeekPosition: 1,
    daysInTrending: 12,
  },
  {
    id: 4,
    name: "Microsoft Surface Pro 9",
    brand: "Microsoft",
    category: "Tablets",
    price: 999.99,
    originalPrice: 1199.99,
    retailer: "ComputerStore",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=Surface+Pro",
    discount: 17,
    trendingScore: 86,
    views: "5.9K",
    favorites: "1.5K",
    priceChange: -15.2,
    trendingPosition: 4,
    trendingChange: "up",
    lastWeekPosition: 7,
    daysInTrending: 8,
  },
  {
    id: 5,
    name: "MacBook Air M3",
    brand: "Apple",
    category: "Laptops",
    price: 1299.99,
    originalPrice: 1399.99,
    retailer: "ComputerWorld",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=MacBook+Air",
    discount: 7,
    trendingScore: 83,
    views: "9.1K",
    favorites: "2.7K",
    priceChange: 1.8,
    trendingPosition: 5,
    trendingChange: "up",
    lastWeekPosition: 8,
    daysInTrending: 15,
  },
  {
    id: 6,
    name: "Sony WH-1000XM5",
    brand: "Sony",
    category: "Headphones",
    price: 349.99,
    originalPrice: 399.99,
    retailer: "AudioTech",
    inStock: true,
    image: "/placeholder.svg?height=200&width=200&text=Sony+WH1000XM5",
    discount: 13,
    trendingScore: 79,
    views: "4.2K",
    favorites: "1.1K",
    priceChange: -8.7,
    trendingPosition: 6,
    trendingChange: "new",
    lastWeekPosition: null,
    daysInTrending: 1,
  },
];

export default function TrendingPage() {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedRetailer, setSelectedRetailer] = useState("all");
  const [selectedPriceRange, setSelectedPriceRange] = useState("all");

  // Filter products based on selected filters
  const filteredProducts = trendingProducts.filter((product) => {
    // Category filter
    if (
      selectedCategory !== "all" &&
      product.category.toLowerCase() !== selectedCategory
    ) {
      return false;
    }

    // Retailer filter - normalize both values for comparison
    if (selectedRetailer !== "all") {
      const productRetailer = product.retailer
        .toLowerCase()
        .replace(/\s+/g, "");
      const selectedRetailerNormalized = selectedRetailer.toLowerCase();
      if (productRetailer !== selectedRetailerNormalized) {
        return false;
      }
    }

    // Price range filter
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
  });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Beautiful Blue Background */}
          <PageHeader
            title="Trending Products"
            icon={Fire}
            breadcrumbItems={[{ label: "Trending" }]}
          />

          {/* Content Section */}
          <div className="mb-8"></div>

          {/* Filter Results Summary */}
          {(selectedCategory !== "all" ||
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
                    {retailers.find((r) => r.value === selectedRetailer)?.label}
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
                <ShoppingCart className="h-4 w-4 text-gray-500" />
                <Select
                  value={selectedRetailer}
                  onValueChange={setSelectedRetailer}
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

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {trendingStats.map((stat, index) => (
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

          {/* Trending Products Section */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Fire className="h-6 w-6 text-red-500" />
              Trending Now
            </h2>

            {/* Products Grid - 4 columns on desktop */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.slice(0, 4).map((product) => (
                <div key={product.id} className="relative group">
                  <Card className="overflow-hidden hover:shadow-xl transition-all duration-300 group-hover:scale-[1.02]">
                    {/* Trending Badge */}
                    <div className="absolute top-3 left-3 z-20 flex gap-2">
                      <Badge className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600 text-white font-bold shadow-lg flex items-center gap-1">
                        <Fire className="h-3 w-3" />#{product.trendingPosition}
                      </Badge>
                      {product.trendingChange === "new" && (
                        <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold">
                          NEW
                        </Badge>
                      )}
                    </div>

                    {/* Trending Change Indicator */}
                    <div className="absolute top-3 right-3 z-20">
                      <div className="bg-white/90 backdrop-blur-sm rounded-full p-1.5 shadow-md">
                        {getTrendingIcon(product.trendingChange)}
                      </div>
                    </div>

                    {/* Product Card Content */}
                    <ProductCard product={product} />

                    {/* Trending Metrics Overlay */}
                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <div className="grid grid-cols-3 gap-3 text-xs">
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
            {filteredProducts.length > 0 && (
              <div className="text-center">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-red-500 to-orange-500 hover:from-red-600 hover:to-orange-600"
                >
                  <Fire className="h-4 w-4 mr-2" />
                  Load More Trending Products
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
