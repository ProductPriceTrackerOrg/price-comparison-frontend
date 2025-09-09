"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
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
  Sparkles,
  Store,
  Tag,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Home,
  Package,
  Calendar,
} from "lucide-react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { NewArrivalFilters } from "@/components/new-arrivals/new-arrival-filters";
import {
  NewArrivalResponse,
  NewArrivalFilters as FilterType,
} from "@/lib/types/new-arrivals";
import { Category, Retailer } from "@/lib/types/price-drops";

// API response interfaces based on your FastAPI backend
interface NewArrivalsStats {
  total_new_arrivals: number;
  average_price: number;
  in_stock_count: number;
  category_count: number;
}

interface NewArrivalsListResponse {
  items: NewArrivalResponse[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

interface FilterState {
  category: string;
  retailer: string;
  priceRange: number[];
  sortBy: FilterType["sortBy"];
  timeRange: FilterType["timeRange"];
  inStockOnly: boolean;
}

export default function NewArrivalsPage() {
  const [newArrivals, setNewArrivals] = useState<NewArrivalResponse[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stats, setStats] = useState<NewArrivalsStats | null>(null);
  const [totalStats, setTotalStats] = useState<NewArrivalsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [hasNext, setHasNext] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    retailer: "all",
    priceRange: [0, 10000000], // Increased to Rs 10,000,000 for LKR currency
    sortBy: "newest",
    timeRange: "90d", // Show all by default
    inStockOnly: false,
  });

  // Get API URL from environment variable
  const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

  useEffect(() => {
    if (!API_BASE_URL) {
      setError(
        "API URL is not configured. Please check environment variables."
      );
      setLoading(false);
      return;
    }
    fetchNewArrivals();
    // Only fetch filtered stats, not total stats
  }, [filters, currentPage, API_BASE_URL]);

  useEffect(() => {
    // Fetch total unfiltered stats only once when component mounts
    if (API_BASE_URL) {
      fetchTotalStats();
    }
  }, [API_BASE_URL]);

  useEffect(() => {
    fetchFiltersData();
  }, [API_BASE_URL]);

  // Function to normalize timeRange values for API compatibility
  const normalizeTimeRange = (timeRange: string): string => {
    const timeRangeMap: { [key: string]: string } = {
      "24h": "24h",
      "1d": "24h",
      "7d": "7d",
      "30d": "30d",
      "90d": "3m",
      "3m": "3m",
    };
    return timeRangeMap[timeRange] || timeRange;
  };

  const fetchFiltersData = async () => {
    if (!API_BASE_URL) return;

    try {
      // Fetch categories and retailers from the debug endpoint or create dedicated endpoints
      const response = await fetch(`${API_BASE_URL}/api/v1/new-arrivals/debug`);
      if (!response.ok) throw new Error("Failed to fetch filter data");

      const debugData = await response.json();

      if (debugData.status === "success" && debugData.sample_data) {
        // Extract unique categories and retailers from sample data
        const uniqueCategories = Array.from(
          new Set(debugData.sample_data.map((item: any) => item.category_name))
        ).map((name, index) => ({
          category_id: index + 1,
          category_name: name as string,
        }));

        const uniqueRetailers = Array.from(
          new Set(debugData.sample_data.map((item: any) => item.shop_name))
        ).map((name, index) => ({
          shop_id: index + 1,
          shop_name: name as string,
        }));

        setCategories(uniqueCategories);
        setRetailers(uniqueRetailers);
      }
    } catch (error) {
      console.error("Error fetching filter data:", error);
      // Set fallback empty arrays
      setCategories([]);
      setRetailers([]);
    }
  };

  const fetchTotalStats = async () => {
    if (!API_BASE_URL) return;

    setStatsLoading(true);
    try {
      // Fetch total stats without any filters - this represents ALL products
      const response = await fetch(`${API_BASE_URL}/api/v1/new-arrivals/stats`);

      if (response.ok) {
        const statsData: NewArrivalsStats = await response.json();

        // Ensure stats data has proper structure
        const normalizedStats = {
          total_new_arrivals: statsData.total_new_arrivals || 0,
          average_price: statsData.average_price || 0,
          in_stock_count: statsData.in_stock_count || 0,
          category_count: statsData.category_count || 0,
        };

        setTotalStats(normalizedStats);
      } else {
        setTotalStats(null);
      }
    } catch (error) {
      setTotalStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const fetchNewArrivals = async () => {
    if (!API_BASE_URL) return;

    setLoading(true);
    setError(null);
    setNewArrivals([]); // Clear previous results immediately

    try {
      const params = new URLSearchParams({
        sortBy: filters.sortBy,
        limit: "20",
        page: currentPage.toString(),
      });

      // Add timeRange only if not showing all items (90d/3m)
      if (filters.timeRange !== "90d") {
        params.append("timeRange", normalizeTimeRange(filters.timeRange));
      }

      // Add optional filters
      if (filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.retailer !== "all") {
        params.append("retailer", filters.retailer);
      }
      if (filters.priceRange[0] > 0) {
        params.append("minPrice", filters.priceRange[0].toString());
      }
      if (filters.priceRange[1] < 10000000) {
        params.append("maxPrice", filters.priceRange[1].toString());
      }

      // Handle stock filter properly based on your API logic
      if (filters.inStockOnly === true) {
        params.append("inStockOnly", "true");
      } else if (filters.inStockOnly === false) {
        // Don't add inStockOnly parameter to show all items by default
        // Only add if you specifically want out-of-stock only (uncomment below)
        // params.append("inStockOnly", "false");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/new-arrivals?${params}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.detail || "Failed to fetch new arrivals");
      }

      const data: NewArrivalsListResponse = await response.json();

      setNewArrivals(data.items);
      setCurrentPage(data.page);
      setHasNext(data.has_next);
      setTotalPages(Math.ceil(data.total / data.limit));
    } catch (error: any) {
      setError(
        error.message || "Failed to load new arrivals. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    if (!API_BASE_URL) return;

    setStatsLoading(true);
    try {
      const params = new URLSearchParams();

      // Add timeRange only if not showing all items
      if (filters.timeRange !== "90d") {
        params.append("timeRange", normalizeTimeRange(filters.timeRange));
      }

      // Add optional filters for stats
      if (filters.category !== "all") {
        params.append("category", filters.category);
      }
      if (filters.retailer !== "all") {
        params.append("retailer", filters.retailer);
      }
      if (filters.priceRange[0] > 0) {
        params.append("minPrice", filters.priceRange[0].toString());
      }
      if (filters.priceRange[1] < 500000) {
        params.append("maxPrice", filters.priceRange[1].toString());
      }

      // Add stock filter for stats
      if (filters.inStockOnly === true) {
        params.append("inStockOnly", "true");
      }

      const response = await fetch(
        `${API_BASE_URL}/api/v1/new-arrivals/stats?${params}`
      );

      if (response.ok) {
        const statsData: NewArrivalsStats = await response.json();

        // Ensure stats data has proper structure even if empty
        const normalizedStats = {
          total_new_arrivals: statsData.total_new_arrivals || 0,
          average_price: statsData.average_price || 0,
          in_stock_count: statsData.in_stock_count || 0,
          category_count: statsData.category_count || 0,
        };

        setStats(normalizedStats);
      } else {
        setStats(null);
      }
    } catch (error) {
      // Set stats to null so fallback calculations are used
      setStats(null);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleFilterChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
    setStats(null); // Reset stats to trigger fresh fetch
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Transform NewArrivalResponse to Product interface for ProductCard
  const transformToProduct = (arrival: NewArrivalResponse) => {
    if (!arrival) {
      return null;
    }

    // Use shop_product_id as the main product ID for navigation
    const productId =
      arrival.shop_product_id ||
      arrival.id ||
      arrival.canonical_product_id ||
      arrival.variant_id ||
      0;

    if (!productId || productId === 0) {
      return null;
    }

    const transformedProduct = {
      id: productId,
      name: arrival.product_title || "Unknown Product",
      brand: arrival.brand || "Unknown",
      category: arrival.category_name || "Unknown",
      price: arrival.current_price || 0,
      originalPrice: arrival.original_price || arrival.current_price || 0,
      retailer: arrival.shop_name || "Unknown Store",
      inStock: arrival.is_available !== false, // Default to true unless explicitly false
      image: arrival.image_url || "/placeholder.svg?height=200&width=200",
      isNew: true,
      launchDate: arrival.arrival_date || new Date().toISOString(),
      url: arrival.product_url || "",
    };

    return transformedProduct;
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("en-LK", {
      style: "currency",
      currency: "LKR",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })
      .format(price)
      .replace("LKR", "Rs ");
  };

  const calculateDisplayStats = () => {
    // Always show total unfiltered statistics - independent of current filters
    // This shows the total product statistics, not filtered results
    if (totalStats) {
      return totalStats;
    }

    // Fallback: if totalStats not loaded yet, show reasonable defaults
    const fallbackStats = {
      total_new_arrivals: 0,
      average_price: 0,
      in_stock_count: 0,
      category_count: 0,
    };

    return fallbackStats;
  };

  const displayStats = calculateDisplayStats();

  const getEmptyStateMessage = () => {
    if (filters.timeRange === "1d") {
      return {
        title: "No new products in the last 24 hours",
        description: "No new products have been added in the last 24 hours.",
        showExpandButton: true,
      };
    } else if (filters.timeRange === "7d") {
      return {
        title: "No new products in the last week",
        description: "No new products have been added in the last 7 days.",
        showExpandButton: true,
      };
    } else if (filters.timeRange === "30d") {
      return {
        title: "No new products in the last month",
        description: "No new products have been added in the last 30 days.",
        showExpandButton: true,
      };
    } else {
      return {
        title: "No new arrivals found",
        description: "Try adjusting your filters to see more results.",
        showExpandButton: false,
      };
    }
  };

  const emptyState = getEmptyStateMessage();

  // Show error if API URL is not configured
  if (!API_BASE_URL) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <Alert className="mb-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              API configuration error. Please check that NEXT_PUBLIC_API_URL is
              set in your environment variables.
            </AlertDescription>
          </Alert>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
      <main className="bg-gradient-to-br from-green-50/30 via-white to-blue-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header */}
          <PageHeader
            title="New Arrivals"
            icon={Sparkles}
            breadcrumbItems={[{ label: "New Arrivals" }]}
          />

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Package className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm text-gray-600">Total Arrivals</p>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        displayStats.total_new_arrivals.toLocaleString()
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5 text-blue-500" />
                  <div>
                    <p className="text-sm text-gray-600">Avg Price</p>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-16" />
                      ) : (
                        formatPrice(displayStats.average_price)
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Store className="h-5 w-5 text-purple-500" />
                  <div>
                    <p className="text-sm text-gray-600">In Stock</p>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-12" />
                      ) : (
                        displayStats.in_stock_count.toLocaleString()
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Tag className="h-5 w-5 text-orange-500" />
                  <div>
                    <p className="text-sm text-gray-600">Categories</p>
                    <div className="text-2xl font-bold">
                      {statsLoading ? (
                        <Skeleton className="h-8 w-8" />
                      ) : (
                        displayStats.category_count
                      )}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters */}
          <NewArrivalFilters
            filters={filters}
            setFilters={handleFilterChange}
            categories={categories}
            retailers={retailers}
          />

          {/* Error Alert */}
          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button variant="outline" size="sm" onClick={fetchNewArrivals}>
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Results */}
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
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-4 w-16" />
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
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {(() => {
                  const transformedProducts = newArrivals
                    .map((arrival) => {
                      return transformToProduct(arrival);
                    })
                    .filter(
                      (product): product is NonNullable<typeof product> => {
                        return product !== null;
                      }
                    );

                  return transformedProducts.map((product, index) => (
                    <div key={product.id || index} className="relative">
                      <ProductCard product={product} />
                      <div className="absolute top-2 left-2">
                        <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-1">
                          <Sparkles className="h-3 w-3" />
                          NEW
                        </Badge>
                      </div>
                      <div className="absolute top-2 right-2">
                        <Badge
                          variant="outline"
                          className="bg-white/90 text-gray-600 text-xs"
                        >
                          <Calendar className="h-3 w-3 mr-1" />
                          {/* Get days from original arrival data if available */}
                          {newArrivals.find(
                            (a) =>
                              (a.canonical_product_id || a.variant_id) ===
                              product.id
                          )?.days_since_arrival === 0
                            ? "Today"
                            : newArrivals.find(
                                (a) =>
                                  (a.canonical_product_id || a.variant_id) ===
                                  product.id
                              )?.days_since_arrival === 1
                            ? "Yesterday"
                            : `${
                                newArrivals.find(
                                  (a) =>
                                    (a.canonical_product_id || a.variant_id) ===
                                    product.id
                                )?.days_since_arrival || 0
                              }d ago`}
                        </Badge>
                      </div>
                      {!product.inStock && (
                        <div className="absolute inset-0 bg-gray-900/50 flex items-center justify-center rounded-lg">
                          <Badge
                            variant="destructive"
                            className="font-semibold"
                          >
                            Out of Stock
                          </Badge>
                        </div>
                      )}
                    </div>
                  ));
                })()}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="flex justify-center mt-8 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  {[...Array(Math.min(5, totalPages))].map((_, i) => {
                    const pageNum = i + 1;
                    return (
                      <Button
                        key={pageNum}
                        variant={
                          currentPage === pageNum ? "default" : "outline"
                        }
                        onClick={() => handlePageChange(pageNum)}
                      >
                        {pageNum}
                      </Button>
                    );
                  })}
                  <Button
                    variant="outline"
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!hasNext}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}

          {!loading && !error && newArrivals.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  {emptyState.title}
                </h3>
                <p className="text-gray-600 mb-4">{emptyState.description}</p>
                <div className="flex gap-2 justify-center">
                  {emptyState.showExpandButton && (
                    <Button
                      variant="outline"
                      onClick={() => {
                        setFilters((prev) => ({
                          ...prev,
                          timeRange: "90d", // Show all time
                        }));
                      }}
                    >
                      Show All Time
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    onClick={() => {
                      setFilters({
                        category: "all",
                        retailer: "all",
                        priceRange: [0, 500000],
                        sortBy: "newest",
                        timeRange: "90d",
                        inStockOnly: false,
                      });
                    }}
                  >
                    Clear All Filters
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
