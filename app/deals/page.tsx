"use client";

import { useState, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { CompactNavigationBar } from "@/components/layout/compact-navigation-bar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Percent,
  TrendingDown,
  Clock,
  Filter,
  Loader2,
  AlertCircle,
  RefreshCw,
  Search,
} from "lucide-react";

// API response interfaces matching your FastAPI backend
interface ApiDeal {
  variant_id: number;
  shop_product_id: number;
  product_id: number;
  product_title: string;
  brand: string;
  category_name: string;
  variant_title: string;
  shop_name: string;
  current_price: number;
  original_price: number;
  image_url: string;
  product_url: string;
  is_available: boolean;
  updated_date: string;
  discount_percentage: number;
  discount_amount: number;
  deal_score: number;
}

// Transformed deal for display (matching ProductCard interface)
interface Deal {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  retailer: string;
  inStock: boolean;
  image: string;
  discount: number;
  dealScore: number;
  discountAmount: number;
  url: string;
  updatedDate: string;
}

interface DealsStats {
  total_deals: number;
  average_discount: number;
  highest_discount: number;
  total_savings: number;
  categories_with_deals: number;
  retailers_with_deals: number;
}

interface DealsResponse {
  items: ApiDeal[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  stats: DealsStats;
}

interface FilterState {
  category: string;
  retailer: string;
  brand: string;
  minDiscount: number;
  maxDiscount: number;
  minPrice: number;
  maxPrice: number;
  sortBy: string;
  inStockOnly: boolean;
  searchTerm: string;
}

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<DealsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [showFilters, setShowFilters] = useState(false);

  // Filter states
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    retailer: "all",
    brand: "all",
    minDiscount: 0,
    maxDiscount: 100,
    minPrice: 0,
    maxPrice: 1000000,
    sortBy: "discount_desc",
    inStockOnly: true,
    searchTerm: "",
  });

  // Available filter options (you might want to fetch these from API too)
  const categories = [
    "Laptops",
    "Smartphones",
    "Tablets",
    "Audio",
    "Headphones",
    "Cameras",
  ];
  const retailers = [
    "TechStore",
    "AppleStore",
    "AudioHub",
    "TechMart",
    "ComputerHub",
  ];
  const brands = ["Samsung", "Apple", "Sony", "Dell", "HP", "Lenovo"];
  const sortOptions = [
    { value: "discount_desc", label: "Highest Discount" },
    { value: "discount_asc", label: "Lowest Discount" },
    { value: "price_low", label: "Price: Low to High" },
    { value: "price_high", label: "Price: High to Low" },
    { value: "deal_score", label: "Best Deal Score" },
    { value: "newest", label: "Recently Updated" },
  ];

  // Build query parameters
  const buildQueryParams = (
    pageNum: number = 1,
    appendMode: boolean = false
  ) => {
    const params = new URLSearchParams();

    if (filters.category && filters.category !== "all")
      params.append("category", filters.category);
    if (filters.retailer && filters.retailer !== "all")
      params.append("retailer", filters.retailer);
    if (filters.brand && filters.brand !== "all")
      params.append("brand", filters.brand);
    if (filters.minDiscount > 0)
      params.append("min_discount", filters.minDiscount.toString());
    if (filters.maxDiscount < 100)
      params.append("max_discount", filters.maxDiscount.toString());
    if (filters.minPrice > 0)
      params.append("min_price", filters.minPrice.toString());
    if (filters.maxPrice < 1000000)
      params.append("max_price", filters.maxPrice.toString());
    if (filters.sortBy) params.append("sort_by", filters.sortBy);
    if (filters.inStockOnly !== undefined)
      params.append("in_stock_only", filters.inStockOnly.toString());

    params.append("page", pageNum.toString());
    params.append("limit", "20");

    return params.toString();
  };

  // Fetch deals from API
  const fetchDeals = async (
    pageNum: number = 1,
    appendMode: boolean = false
  ) => {
    try {
      if (!appendMode) {
        setLoading(true);
        setError(null);
      } else {
        setLoadingMore(true);
      }

      const queryParams = buildQueryParams(pageNum, appendMode);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/v1/deals?${queryParams}`
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: DealsResponse = await response.json();

      // Transform deals to match ProductCard interface
      const transformedDeals = data.items.map((deal) => ({
        id: deal.shop_product_id, // Use shop_product_id for navigation
        name: deal.product_title,
        brand: deal.brand,
        category: deal.category_name,
        price: deal.current_price,
        originalPrice: deal.original_price,
        retailer: deal.shop_name,
        inStock: deal.is_available,
        image:
          deal.image_url ||
          "/placeholder.svg?height=200&width=200&text=Product",
        discount: Math.round(deal.discount_percentage),
        dealScore: deal.deal_score,
        discountAmount: deal.discount_amount,
        url: deal.product_url,
        updatedDate: deal.updated_date,
      }));

      if (appendMode) {
        setDeals((prev) => [...prev, ...transformedDeals]);
      } else {
        setDeals(transformedDeals);
      }

      setStats(data.stats);
      setHasNext(data.has_next);
      setPage(data.page);
    } catch (err: any) {
      console.error("Error fetching deals:", err);
      setError(err.message || "Failed to fetch deals");
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  };

  // Initial load and when filters change
  useEffect(() => {
    fetchDeals(1, false);
  }, [filters]);

  // Handle filter changes
  const handleFilterChange = (key: keyof FilterState, value: any) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
    setPage(1); // Reset to first page when filters change
  };

  // Load more deals
  const loadMore = () => {
    if (hasNext && !loadingMore) {
      fetchDeals(page + 1, true);
    }
  };

  // Reset filters
  const resetFilters = () => {
    setFilters({
      category: "",
      retailer: "",
      brand: "",
      minDiscount: 0,
      maxDiscount: 100,
      minPrice: 0,
      maxPrice: 1000000,
      sortBy: "discount_desc",
      inStockOnly: true,
      searchTerm: "",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CompactNavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <Loader2 className="h-12 w-12 animate-spin mx-auto mb-4 text-blue-500" />
            <p className="text-gray-600">Loading amazing deals...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <CompactNavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              Something went wrong
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button
              onClick={() => fetchDeals(1, false)}
              className="inline-flex items-center"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CompactNavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <PageHeader
            title="Top Deals"
            icon={Percent}
            breadcrumbItems={[{ label: "Top Deals" }]}
          />

          {/* Stats Bar */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stats.total_deals.toLocaleString()}
                </div>
                <div className="text-gray-600">Active Deals</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                <Percent className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stats.average_discount.toFixed(1)}%
                </div>
                <div className="text-gray-600">Average Discount</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                <Clock className="h-8 w-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  {stats.highest_discount.toFixed(1)}%
                </div>
                <div className="text-gray-600">Highest Discount</div>
              </div>
              <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                <TrendingDown className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold text-gray-900">
                  Rs {stats.total_savings.toLocaleString()}
                </div>
                <div className="text-gray-600">Total Savings</div>
              </div>
            </div>
          )}

          {/* Search and Filter Bar */}
          <div className="bg-white rounded-lg p-4 shadow-sm border mb-8">
            <div className="flex flex-col lg:flex-row gap-4">
              {/* Search */}
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Search deals..."
                    value={filters.searchTerm}
                    onChange={(e) =>
                      handleFilterChange("searchTerm", e.target.value)
                    }
                    className="pl-10"
                  />
                </div>
              </div>

              {/* Quick Filters */}
              <div className="flex flex-wrap gap-2">
                <Select
                  value={filters.category}
                  onValueChange={(value) =>
                    handleFilterChange("category", value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="All Categories" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Categories</SelectItem>
                    {categories.map((cat) => (
                      <SelectItem key={cat} value={cat.toLowerCase()}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <Select
                  value={filters.sortBy}
                  onValueChange={(value) => handleFilterChange("sortBy", value)}
                >
                  <SelectTrigger className="w-[180px]">
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

                <Button
                  variant="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="inline-flex items-center"
                >
                  <Filter className="h-4 w-4 mr-2" />
                  More Filters
                </Button>
              </div>
            </div>

            {/* Advanced Filters */}
            {showFilters && (
              <div className="mt-4 pt-4 border-t grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Retailer
                  </label>
                  <Select
                    value={filters.retailer}
                    onValueChange={(value) =>
                      handleFilterChange("retailer", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Retailers" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Retailers</SelectItem>
                      {retailers.map((retailer) => (
                        <SelectItem
                          key={retailer}
                          value={retailer.toLowerCase()}
                        >
                          {retailer}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Brand
                  </label>
                  <Select
                    value={filters.brand}
                    onValueChange={(value) =>
                      handleFilterChange("brand", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="All Brands" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand} value={brand.toLowerCase()}>
                          {brand}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Discount: {filters.minDiscount}% - {filters.maxDiscount}%
                  </label>
                  <Slider
                    value={[filters.minDiscount, filters.maxDiscount]}
                    onValueChange={([min, max]) => {
                      handleFilterChange("minDiscount", min);
                      handleFilterChange("maxDiscount", max);
                    }}
                    max={100}
                    step={5}
                    className="w-full"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="in-stock"
                    checked={filters.inStockOnly}
                    onCheckedChange={(checked) =>
                      handleFilterChange("inStockOnly", checked)
                    }
                  />
                  <label htmlFor="in-stock" className="text-sm font-medium">
                    In Stock Only
                  </label>
                </div>
              </div>
            )}

            <div className="flex justify-between items-center mt-4">
              <div className="text-sm text-gray-600">
                Showing {deals.length} of {stats?.total_deals || 0} deals
              </div>
              <Button variant="ghost" size="sm" onClick={resetFilters}>
                Reset Filters
              </Button>
            </div>
          </div>

          {/* Deals Grid */}
          {deals.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {deals.map((deal) => (
                <div key={`${deal.id}-${Math.random()}`} className="relative">
                  <ProductCard product={deal} />
                  <div className="absolute top-2 left-2 z-20">
                    <Badge className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold shadow-lg">
                      {deal.discount}% OFF
                    </Badge>
                  </div>
                  {deal.dealScore && deal.dealScore > 80 && (
                    <div className="absolute top-2 right-2 z-20">
                      <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-lg">
                        HOT DEAL
                      </Badge>
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <AlertCircle className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No deals found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your filters to see more results.
              </p>
              <Button onClick={resetFilters}>Reset Filters</Button>
            </div>
          )}

          {/* Load More */}
          {hasNext && (
            <div className="text-center">
              <Button
                size="lg"
                onClick={loadMore}
                disabled={loadingMore}
                className="bg-blue-600 hover:bg-blue-700 min-w-[200px]"
              >
                {loadingMore ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Loading More...
                  </>
                ) : (
                  "Load More Deals"
                )}
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
