"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  TrendingDown,
  Filter,
  Store,
  Tag,
  Percent,
  RefreshCw,
  AlertTriangle,
  Home,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import {
  PriceDropResponse,
  PriceDropFilters,
  PriceDropStats,
  Category,
  Retailer,
} from "@/lib/types/price-drops";

interface FilterState {
  category: string;
  retailer: string;
  minDiscount: number[];
  sortBy: PriceDropFilters["sortBy"];
  timeRange: PriceDropFilters["timeRange"];
}

export default function PriceDropsPage() {
  const [priceDrops, setPriceDrops] = useState<PriceDropResponse[]>([]);
  const [filteredDrops, setFilteredDrops] = useState<PriceDropResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stats, setStats] = useState<PriceDropStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    retailer: "all",
    minDiscount: [0],
    sortBy: "percentage_desc",
    timeRange: "7d",
  });

  useEffect(() => {
    fetchPriceDrops();
    fetchFiltersData();
  }, [filters.timeRange]);

  useEffect(() => {
    applyFilters();
  }, [priceDrops, filters]);

  const fetchFiltersData = async () => {
    try {
      // In real implementation, these would be separate API calls:
      // const [categoriesRes, retailersRes] = await Promise.all([
      //   fetch('/api/categories'),
      //   fetch('/api/retailers')
      // ])

      // Mock data matching our new products
      const mockCategories: Category[] = [
        { category_id: 1, category_name: "Printers" },
        { category_id: 2, category_name: "Tablets" },
        { category_id: 3, category_name: "Audio" },
        { category_id: 4, category_name: "Accessories" },
      ];

      const mockRetailers: Retailer[] = [
        { shop_id: 1, shop_name: "lifemobile.lk" },
      ];

      setCategories(mockCategories);
      setRetailers(mockRetailers);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchPriceDrops = async () => {
    setLoading(true);
    setError(null);

    try {
      // In real implementation:
      // const params = new URLSearchParams({
      //   timeRange: filters.timeRange,
      //   limit: '50'
      // })
      // const response = await fetch(`/api/price-drops?${params}`)
      // if (!response.ok) throw new Error('Failed to fetch price drops')
      // const data = await response.json()

      // Use the provided real price changes data
      const mockData: PriceDropResponse[] = [
        {
          variant_id: 3257986037,
          canonical_product_id: 3257986037,
          product_title: "UGREEN 90576 USB 3.2 Male to Male 3M Cable",
          brand: "UGreen",
          category_name: "Accessories",
          variant_title: "UGREEN 90576 USB 3.2 Male to Male 3M Cable",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 3028.57,
          previous_price: 13142,
          price_change: -10113.43,
          percentage_change: -76.96,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2023/11/ugreen-1-600x600.jpg",
          product_url: "https://lifemobile.lk/product/ugreen-90576",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 1098782875,
          canonical_product_id: 1098782875,
          product_title: "HP Laser MFP 1188W (715A3A) Printer",
          brand: "HP",
          category_name: "Printers",
          variant_title: "HP Laser MFP 1188W (715A3A) Printer",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 41090.51,
          previous_price: 70845.71,
          price_change: -29755.2,
          percentage_change: -42,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2024/10/hp-2.jpg",
          product_url: "https://lifemobile.lk/product/hp-laser-mfp-1188w",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 511466660,
          canonical_product_id: 511466660,
          product_title: "HP Laser MFP 135a Printer",
          brand: "HP",
          category_name: "Printers",
          variant_title: "HP Laser MFP 135a Printer",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 21685.62,
          previous_price: 37389,
          price_change: -15703.38,
          percentage_change: -42,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2021/05/HP-Laser-MFP-135a-Printer-600x600.jpg",
          product_url: "https://lifemobile.lk/product/hp-laser-mfp-135a",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 3634275927,
          canonical_product_id: 3634275927,
          product_title: "HP Laser MFP 135w Printer",
          brand: "HP",
          category_name: "Printers",
          variant_title: "HP Laser MFP 135w Printer",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 30512.86,
          previous_price: 52608.38,
          price_change: -22095.52,
          percentage_change: -42,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2021/05/HP-Laser-MFP-135w-Printer-1-600x600.jpg",
          product_url: "https://lifemobile.lk/product/hp-laser-mfp-135w",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 2056994278,
          canonical_product_id: 2056994278,
          product_title: "HP DeskJet Ink Advantage 4175 All-in-One Printer",
          brand: "HP",
          category_name: "Printers",
          variant_title: "HP DeskJet Ink Advantage 4175 All-in-One Printer",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 21680.01,
          previous_price: 37379.32,
          price_change: -15699.31,
          percentage_change: -42,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2021/04/HP-DeskJet-Ink-Advantage-4175-All-in-One-Printer-100x100.jpg",
          product_url:
            "https://lifemobile.lk/product/hp-deskjet-ink-advantage-4175",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 3525602173,
          canonical_product_id: 3525602173,
          product_title:
            "Microsoft Surface Book 3 SKY-00001 13.5″ Core i7 16GB 256GB Platinum",
          brand: "Microsoft",
          category_name: "Tablets",
          variant_title:
            "Microsoft Surface Book 3 SKY-00001 13.5″ Core i7 16GB 256GB Platinum",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 371351.1,
          previous_price: 538190,
          price_change: -166838.90000000002,
          percentage_change: -31,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2020/09/Microsoft-Surface-Book-3-SKR-00001-13.5-Core-i5-8GB-256GB-Platinum-5-600x600.jpg",
          product_url: "https://lifemobile.lk/product/microsoft-surface-pro-7",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 3314937326,
          canonical_product_id: 3314937326,
          product_title: "Remax RPL-20 Avenger Series 10000mAh Power bank",
          brand: "Remax",
          category_name: "Accessories",
          variant_title: "Remax RPL-20 Avenger Series 10000mAh Power bank",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 2056.2,
          previous_price: 2980,
          price_change: -923.8,
          percentage_change: -31,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2020/08/Remax-RPL-20-Avenger-Series-10000mAh-Power-bank-Batman-600x600.jpg",
          product_url: "https://lifemobile.lk/product/remax-rpl-20-power-bank",
          is_available: true,
          days_since_drop: 0,
        },
        {
          variant_id: 3269743901,
          canonical_product_id: 3269743901,
          product_title: "Remax WK Design Y18 In-Ear Earphones",
          brand: "WK",
          category_name: "Audio",
          variant_title: "Remax WK Design Y18 In-Ear Earphones",
          shop_name: "lifemobile.lk",
          shop_id: 1,
          current_price: 1317.9,
          previous_price: 1910,
          price_change: -592.1,
          percentage_change: -31,
          drop_date: "2025-09-11",
          image_url:
            "https://lifemobile.lk/wp-content/uploads/2021/09/Remax-WK-Design-Y18-In-Ear-Earphones-600x600.jpg",
          product_url: "https://lifemobile.lk/product/remax-wk-y18-earphones",
          is_available: true,
          days_since_drop: 0,
        },
      ];

      setPriceDrops(mockData);

      // Calculate stats
      const mockStats: PriceDropStats = {
        totalDrops: mockData.length,
        avgDiscount:
          mockData.reduce(
            (sum, drop) => sum + Math.abs(drop.percentage_change),
            0
          ) / mockData.length,
        retailerCount: new Set(mockData.map((d) => d.shop_name)).size,
        categoryCount: new Set(mockData.map((d) => d.category_name)).size,
        biggestDrop: mockData.reduce((biggest, current) =>
          Math.abs(current.percentage_change) >
          Math.abs(biggest.percentage_change)
            ? current
            : biggest
        ),
        topCategory: "Smartphones",
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching price drops:", error);
      setError("Failed to load price drops. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...priceDrops];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (drop) => drop.category_name === filters.category
      );
    }

    // Retailer filter
    if (filters.retailer !== "all") {
      filtered = filtered.filter((drop) => drop.shop_name === filters.retailer);
    }

    // Minimum discount filter
    filtered = filtered.filter(
      (drop) => Math.abs(drop.percentage_change) >= filters.minDiscount[0]
    );

    // Sort
    switch (filters.sortBy) {
      case "percentage_desc":
        filtered.sort(
          (a, b) =>
            Math.abs(b.percentage_change) - Math.abs(a.percentage_change)
        );
        break;
      case "percentage_asc":
        filtered.sort(
          (a, b) =>
            Math.abs(a.percentage_change) - Math.abs(b.percentage_change)
        );
        break;
      case "amount_desc":
        filtered.sort(
          (a, b) => Math.abs(b.price_change) - Math.abs(a.price_change)
        );
        break;
      case "amount_asc":
        filtered.sort(
          (a, b) => Math.abs(a.price_change) - Math.abs(b.price_change)
        );
        break;
      case "recent":
        filtered.sort((a, b) => a.days_since_drop - b.days_since_drop);
        break;
    }

    setFilteredDrops(filtered);
  };

  // Transform PriceDropResponse to Product interface for ProductCard
  const transformToProduct = (drop: PriceDropResponse) => ({
    id: drop.variant_id,
    name: drop.product_title,
    brand: drop.brand,
    category: drop.category_name,
    price: drop.current_price,
    originalPrice: drop.previous_price,
    retailer: drop.shop_name,
    inStock: drop.is_available,
    image: drop.image_url || "/placeholder.svg",
    discount: Math.abs(drop.percentage_change),
    priceChange: drop.price_change,
  });

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
                  <BreadcrumbPage>Price Drops</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Beautiful Header with blue background */}
          <div className="mb-10 overflow-hidden relative">
            {/* Background with gradient and glass effect */}
            <div
              className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 rounded-2xl shadow-xl 
                border border-white/10 backdrop-filter overflow-hidden"
            >
              {/* Decorative patterns */}
              <div className="absolute inset-0 overflow-hidden">
                {/* Animated light streaks */}
                <div
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    transform -skew-y-12 -translate-x-full animate-[shimmer_3s_infinite]"
                ></div>

                {/* Dots pattern */}
                <div className="absolute inset-0 opacity-15">
                  <svg width="100%" height="100%" className="opacity-20">
                    <defs>
                      <pattern
                        id="dotPattern"
                        x="0"
                        y="0"
                        width="20"
                        height="20"
                        patternUnits="userSpaceOnUse"
                      >
                        <circle cx="2" cy="2" r="1" fill="white" />
                      </pattern>
                    </defs>
                    <rect width="100%" height="100%" fill="url(#dotPattern)" />
                  </svg>
                </div>

                {/* Circular decorations */}
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-500/30 blur-md"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 blur-md"></div>
              </div>

              {/* Content section with enhanced styling */}
              <div className="relative z-10 py-6 px-8 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  {/* Icon with glow effect */}
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm"></div>
                    <div
                      className="relative bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-full 
                        shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse border border-white/30"
                    >
                      <TrendingDown className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>

                  {/* Text with enhanced styling */}
                  <div>
                    <h1
                      className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md 
                        bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                    >
                      <span className="relative inline-block">
                        Price Drops
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-white/40 rounded"></span>
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-red-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Drops</p>
                    <p className="text-2xl font-bold">
                      {stats?.totalDrops || filteredDrops.length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Percent className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Discount</p>
                    <p className="text-2xl font-bold">
                      {stats?.avgDiscount
                        ? Math.round(stats.avgDiscount)
                        : filteredDrops.length > 0
                        ? Math.round(
                            filteredDrops.reduce(
                              (sum, drop) =>
                                sum + Math.abs(drop.percentage_change),
                              0
                            ) / filteredDrops.length
                          )
                        : 0}
                      %
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Retailers</p>
                    <p className="text-2xl font-bold">
                      {stats?.retailerCount ||
                        new Set(filteredDrops.map((d) => d.shop_name)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <p className="text-2xl font-bold">
                      {stats?.categoryCount ||
                        new Set(filteredDrops.map((d) => d.category_name)).size}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                {/* Time Range */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Time Range
                  </label>
                  <Select
                    value={filters.timeRange}
                    onValueChange={(value: PriceDropFilters["timeRange"]) =>
                      setFilters({ ...filters, timeRange: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1d">Last 24 hours</SelectItem>
                      <SelectItem value="7d">Last 7 days</SelectItem>
                      <SelectItem value="30d">Last 30 days</SelectItem>
                      <SelectItem value="90d">Last 3 months</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Category
                  </label>
                  <Select
                    value={filters.category}
                    onValueChange={(value) =>
                      setFilters({ ...filters, category: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      {categories.map((cat) => (
                        <SelectItem
                          key={cat.category_id}
                          value={cat.category_name}
                        >
                          {cat.category_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Retailer */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Retailer
                  </label>
                  <Select
                    value={filters.retailer}
                    onValueChange={(value) =>
                      setFilters({ ...filters, retailer: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Retailers</SelectItem>
                      {retailers.map((retailer) => (
                        <SelectItem
                          key={retailer.shop_id}
                          value={retailer.shop_name}
                        >
                          {retailer.shop_name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Min Discount */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Min Discount: {filters.minDiscount[0]}%
                  </label>
                  <Slider
                    value={filters.minDiscount}
                    onValueChange={(value) =>
                      setFilters({ ...filters, minDiscount: value })
                    }
                    max={50}
                    step={5}
                    className="mt-2"
                  />
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={filters.sortBy}
                    onValueChange={(value: PriceDropFilters["sortBy"]) =>
                      setFilters({ ...filters, sortBy: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="percentage_desc">
                        Highest % Discount
                      </SelectItem>
                      <SelectItem value="percentage_asc">
                        Lowest % Discount
                      </SelectItem>
                      <SelectItem value="amount_desc">
                        Highest Rs Discount
                      </SelectItem>
                      <SelectItem value="amount_asc">
                        Lowest Rs Discount
                      </SelectItem>
                      <SelectItem value="recent">Most Recent</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Results */}
          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="outline" size="sm" onClick={fetchPriceDrops}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="relative">
                  <Card className="animate-pulse overflow-hidden">
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-48" />
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-3 w-12" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                        <Skeleton className="h-5 w-full" />
                        <Skeleton className="h-4 w-24" />
                        <div className="space-y-2">
                          <div className="flex justify-between">
                            <Skeleton className="h-6 w-20" />
                            <Skeleton className="h-5 w-16" />
                          </div>
                          <div className="flex justify-between">
                            <Skeleton className="h-4 w-16" />
                            <Skeleton className="h-4 w-20" />
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Skeleton className="h-8 flex-1" />
                          <Skeleton className="h-8 w-10" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                  <div className="absolute top-2 left-2">
                    <Skeleton className="h-6 w-12 rounded-full" />
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredDrops.map((drop) => (
                <div key={drop.variant_id} className="relative">
                  <ProductCard product={transformToProduct(drop)} />
                  <div className="absolute top-2 left-2">
                    <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold flex items-center gap-1">
                      <TrendingDown className="h-3 w-3" />-
                      {Math.abs(drop.percentage_change).toFixed(1)}%
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredDrops.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <TrendingDown className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No price drops found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
