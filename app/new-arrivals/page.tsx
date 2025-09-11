"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
  Filter,
  Store,
  Tag,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Home,
  Package,
  Calendar,
} from "lucide-react";



import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { NewArrivalFilters } from "@/components/new-arrivals/new-arrival-filters";
import {
  NewArrivalResponse,
  NewArrivalFilters as FilterType,
  NewArrivalsStats,
  NewArrivalsListResponse,
} from "@/lib/types/new-arrivals";
import { Category, Retailer } from "@/lib/types/price-drops";

interface FilterState {
  category: string;
  retailer: string;
  priceRange: number[];
  sortBy:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";
  timeRange: "24h" | "7d" | "30d" | "3m";
  inStockOnly: boolean;
}

export default function NewArrivalsPage() {
  const [newArrivals, setNewArrivals] = useState<NewArrivalResponse[]>([]);
  const [filteredArrivals, setFilteredArrivals] = useState<
    NewArrivalResponse[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stats, setStats] = useState<NewArrivalsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<FilterState>({
    category: "all",
    retailer: "all",
    priceRange: [0, 2000],
    sortBy: "newest",
    timeRange: "30d",
    inStockOnly: false,
  });

  useEffect(() => {
    fetchNewArrivals();
    fetchFiltersData();
  }, [filters]);

  // No need for a separate filter effect as we'll apply filters in the API
  // No applyFilters function needed as we'll use API for filtering

  const fetchFiltersData = async () => {
    try {
      // For now, we'll still use mock data for categories and retailers
      // In a production environment, these would come from separate API endpoints
      const mockCategories: Category[] = [
        { category_id: 1, category_name: "Smartphones" },
        { category_id: 2, category_name: "Laptops" },
        { category_id: 3, category_name: "Audio" },
        { category_id: 4, category_name: "Monitors" },
        { category_id: 5, category_name: "Tablets" },
        { category_id: 6, category_name: "Accessories" },
        { category_id: 7, category_name: "Gaming" },
        { category_id: 8, category_name: "Wearables" },
      ];

      const mockRetailers: Retailer[] = [
        { shop_id: 1, shop_name: "MobileWorld" },
        { shop_id: 2, shop_name: "ComputerHub" },
        { shop_id: 3, shop_name: "AudioStore" },
        { shop_id: 4, shop_name: "TechMart" },
        { shop_id: 5, shop_name: "ElectroShop" },
        { shop_id: 6, shop_name: "GadgetZone" },
      ];

      setCategories(mockCategories);
      setRetailers(mockRetailers);
    } catch (error) {
      console.error("Error fetching filter data:", error);
    }
  };

  const fetchNewArrivals = async () => {
    setLoading(true);
    setError(null);

    try {
      // Build query parameters
      const queryParams = new URLSearchParams();

      // Map filter state to query parameters
      if (filters.timeRange) queryParams.append("timeRange", filters.timeRange);
      if (filters.category !== "all")
        queryParams.append("category", filters.category);
      if (filters.retailer !== "all")
        queryParams.append("retailer", filters.retailer);
      if (filters.priceRange[0] > 0)
        queryParams.append("minPrice", filters.priceRange[0].toString());
      if (filters.priceRange[1] < 2000)
        queryParams.append("maxPrice", filters.priceRange[1].toString());

      // Map the sortBy values to match the backend
      const sortByMap: Record<string, string> = {
        newest: "newest",
        oldest: "oldest",
        price_asc: "price_low",
        price_desc: "price_high",
        name_asc: "name_az",
        name_desc: "name_za",
      };
      queryParams.append("sortBy", sortByMap[filters.sortBy] || "newest");

      // Only add inStockOnly if it's true, otherwise API expects it to be null
      if (filters.inStockOnly) {
        queryParams.append("inStockOnly", "true");
      }

      // Set page and limit
      queryParams.append("limit", "20");
      queryParams.append("page", "1"); // Implement pagination in the future

      // API call to fetch data using our Next.js API routes
      const apiUrl = `/api/v1/new-arrivals/new-arrivals?${queryParams}`;

      console.log("Fetching new arrivals from:", apiUrl);

      // Use fetch with our Next.js API route (which will call the backend)
      const response = await fetch(apiUrl);

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }

      const data = await response.json();

      // Set new arrivals data
      setNewArrivals(data.items);
      setFilteredArrivals(data.items); // No need to filter locally

      // Also fetch stats
      const statsUrl = `/api/v1/new-arrivals/new-arrivals/stats?${queryParams}`;
      const statsResponse = await fetch(statsUrl);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();

        // Just use the API stats directly
        const formattedStats = statsData;

        setStats(formattedStats);
      }
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      setError("Failed to load new arrivals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // We're not using the applyFilters function anymore since filtering is done by the API
  // But if we need to sort locally after getting API results, we can use this
  const sortArrivals = (arrivals: NewArrivalResponse[]) => {
    let sorted = [...arrivals];

    // Sort
    switch (filters.sortBy) {
      case "newest":
        sorted.sort((a, b) => a.days_since_arrival - b.days_since_arrival);
        break;
      case "oldest":
        sorted.sort((a, b) => b.days_since_arrival - a.days_since_arrival);
        break;
      case "price_asc":
        sorted.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price_desc":
        sorted.sort((a, b) => b.current_price - a.current_price);
        break;
      case "name_asc":
        sorted.sort((a, b) => a.product_title.localeCompare(b.product_title));
        break;
      case "name_desc":
        sorted.sort((a, b) => b.product_title.localeCompare(a.product_title));
        break;
    }

    return sorted;
  };

  // Transform NewArrivalResponse to Product interface for ProductCard
  const transformToProduct = (arrival: NewArrivalResponse) => ({
    id: arrival.shop_product_id, // Use shop_product_id instead of variant_id
    name: arrival.product_title,
    brand: arrival.brand,
    category: arrival.category_name,
    price: arrival.current_price,
    originalPrice: arrival.original_price,
    retailer: arrival.shop_name,
    inStock: arrival.is_available,
    image: arrival.image_url,
    isNew: true,
    launchDate: arrival.arrival_date,
    variant_id: arrival.variant_id, // Keep variant_id as an additional property
  });

  return (
    <div className="min-h-screen bg-gray-50">
      
      
      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Beautiful Blue Background */}
          <PageHeader
            title="New Arrivals"
            icon={Sparkles}
            breadcrumbItems={[{ label: "New Arrivals" }]}
          />

          {/* Header */}
          <div className="mb-8">
            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Arrivals</p>
                      <p className="text-2xl font-bold">
                        {stats?.total_new_arrivals || filteredArrivals.length}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <span className="h-5 w-5 text-blue-500 font-bold">₹</span>
                    <div>
                      <p className="text-sm text-gray-600">Avg Price</p>
                      <p className="text-2xl font-bold">
                        Rs{" "}
                        {stats?.average_price
                          ? Math.round(stats.average_price).toLocaleString(
                              "en-US"
                            )
                          : filteredArrivals.length > 0
                          ? Math.round(
                              filteredArrivals.reduce(
                                (sum, product) => sum + product.current_price,
                                0
                              ) / filteredArrivals.length
                            ).toLocaleString("en-US")
                          : 0}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {stats?.in_stock_count ||
                          filteredArrivals.filter((p) => p.is_available).length}
                      </p>
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
                      <p className="text-2xl font-bold">
                        {stats?.category_count ||
                          new Set(filteredArrivals.map((d) => d.category_name))
                            .size}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Filters */}
          <NewArrivalFilters
            filters={filters}
            setFilters={setFilters}
            categories={categories}
            retailers={retailers}
          />

          {/* Results */}
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
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredArrivals.map((arrival) => (
                <div key={arrival.variant_id} className="relative">
                  <ProductCard product={transformToProduct(arrival)} />
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
                      {arrival.days_since_arrival === 0
                        ? "Today"
                        : arrival.days_since_arrival === 1
                        ? "Yesterday"
                        : `${arrival.days_since_arrival}d ago`}
                    </Badge>
                  </div>
                </div>
              ))}
            </div>
          )}

          {!loading && !error && filteredArrivals.length === 0 && (
            <Card className="text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No new arrivals found
                </h3>
                <p className="text-gray-600">
                  Try adjusting your filters to see more results.
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </main>
      
    </div>
  );
}
