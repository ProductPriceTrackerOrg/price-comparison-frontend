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
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { NewArrivalFilters } from "@/components/new-arrivals/new-arrival-filters";
import {
  NewArrivalResponse,
  NewArrivalFilters as FilterType,
  NewArrivalStats,
} from "@/lib/types/new-arrivals";
import { Category, Retailer } from "@/lib/types/price-drops";

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
  const [filteredArrivals, setFilteredArrivals] = useState<
    NewArrivalResponse[]
  >([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [stats, setStats] = useState<NewArrivalStats | null>(null);
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
  }, [filters.timeRange]);

  useEffect(() => {
    applyFilters();
  }, [newArrivals, filters]);

  const fetchFiltersData = async () => {
    try {
      // Mock data for now - would come from API
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
      // In real implementation:
      // const params = new URLSearchParams({
      //   timeRange: filters.timeRange,
      //   limit: '50'
      // })
      // const response = await fetch(`/api/new-arrivals?${params}`)
      // if (!response.ok) throw new Error('Failed to fetch new arrivals')
      // const data = await response.json()

      // Mock data based on your schema structure
      const mockData: NewArrivalResponse[] = [
        {
          variant_id: 101,
          canonical_product_id: 201,
          product_title: "iPhone 16 Pro",
          brand: "Apple",
          category_name: "Smartphones",
          variant_title: "iPhone 16 Pro 128GB Blue Titanium",
          shop_name: "MobileWorld",
          shop_id: 1,
          current_price: 1199.99,
          original_price: 1199.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product101",
          is_available: true,
          arrival_date: "2025-08-05",
          days_since_arrival: 1,
        },
        {
          variant_id: 102,
          canonical_product_id: 202,
          product_title: "MacBook Pro M4",
          brand: "Apple",
          category_name: "Laptops",
          variant_title: "MacBook Pro 14-inch M4 Chip 512GB Space Black",
          shop_name: "ComputerHub",
          shop_id: 2,
          current_price: 2199.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product102",
          is_available: true,
          arrival_date: "2025-08-04",
          days_since_arrival: 2,
        },
        {
          variant_id: 103,
          canonical_product_id: 203,
          product_title: "Samsung Galaxy Watch 7",
          brand: "Samsung",
          category_name: "Wearables",
          variant_title: "Samsung Galaxy Watch 7 44mm Silver",
          shop_name: "GadgetZone",
          shop_id: 6,
          current_price: 329.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product103",
          is_available: true,
          arrival_date: "2025-08-03",
          days_since_arrival: 3,
        },
        {
          variant_id: 104,
          canonical_product_id: 204,
          product_title: "Sony PlayStation 5 Pro",
          brand: "Sony",
          category_name: "Gaming",
          variant_title: "Sony PlayStation 5 Pro 2TB Digital Edition",
          shop_name: "ElectroShop",
          shop_id: 5,
          current_price: 699.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product104",
          is_available: false,
          arrival_date: "2025-08-02",
          days_since_arrival: 4,
        },
        {
          variant_id: 105,
          canonical_product_id: 205,
          product_title: "ASUS ROG Strix G18",
          brand: "ASUS",
          category_name: "Laptops",
          variant_title: "ASUS ROG Strix G18 RTX 4080 32GB Gaming Laptop",
          shop_name: "ComputerHub",
          shop_id: 2,
          current_price: 2899.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product105",
          is_available: true,
          arrival_date: "2025-08-01",
          days_since_arrival: 5,
        },
        {
          variant_id: 106,
          canonical_product_id: 206,
          product_title: "Meta Quest 4",
          brand: "Meta",
          category_name: "Gaming",
          variant_title: "Meta Quest 4 256GB VR Headset",
          shop_name: "TechMart",
          shop_id: 4,
          current_price: 499.99,
          image_url: "/placeholder.svg?height=200&width=200",
          product_url: "https://example.com/product106",
          is_available: true,
          arrival_date: "2025-07-31",
          days_since_arrival: 6,
        },
      ];

      setNewArrivals(mockData);

      // Calculate stats
      const inStockProducts = mockData.filter(
        (product) => product.is_available
      );
      const mockStats: NewArrivalStats = {
        totalArrivals: mockData.length,
        avgPrice:
          mockData.reduce((sum, product) => sum + product.current_price, 0) /
          mockData.length,
        retailerCount: new Set(mockData.map((d) => d.shop_name)).size,
        categoryCount: new Set(mockData.map((d) => d.category_name)).size,
        newestProduct: mockData.reduce((newest, current) =>
          current.days_since_arrival < newest.days_since_arrival
            ? current
            : newest
        ),
        topCategory: "Smartphones",
        inStockCount: inStockProducts.length,
      };
      setStats(mockStats);
    } catch (error) {
      console.error("Error fetching new arrivals:", error);
      setError("Failed to load new arrivals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = [...newArrivals];

    // Category filter
    if (filters.category !== "all") {
      filtered = filtered.filter(
        (product) => product.category_name === filters.category
      );
    }

    // Retailer filter
    if (filters.retailer !== "all") {
      filtered = filtered.filter(
        (product) => product.shop_name === filters.retailer
      );
    }

    // Price range filter
    filtered = filtered.filter(
      (product) =>
        product.current_price >= filters.priceRange[0] &&
        product.current_price <= filters.priceRange[1]
    );

    // In stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.is_available);
    }

    // Sort
    switch (filters.sortBy) {
      case "newest":
        filtered.sort((a, b) => a.days_since_arrival - b.days_since_arrival);
        break;
      case "oldest":
        filtered.sort((a, b) => b.days_since_arrival - a.days_since_arrival);
        break;
      case "price_asc":
        filtered.sort((a, b) => a.current_price - b.current_price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.current_price - a.current_price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.product_title.localeCompare(b.product_title));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.product_title.localeCompare(a.product_title));
        break;
    }

    setFilteredArrivals(filtered);
  };

  // Transform NewArrivalResponse to Product interface for ProductCard
  const transformToProduct = (arrival: NewArrivalResponse) => ({
    id: arrival.variant_id,
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
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />
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
                        {stats?.totalArrivals || filteredArrivals.length}
                      </p>
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
                      <p className="text-2xl font-bold">
                        $
                        {stats?.avgPrice
                          ? Math.round(stats.avgPrice)
                          : filteredArrivals.length > 0
                          ? Math.round(
                              filteredArrivals.reduce(
                                (sum, product) => sum + product.current_price,
                                0
                              ) / filteredArrivals.length
                            )
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
                        {stats?.inStockCount ||
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
                        {stats?.categoryCount ||
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
      <Footer />
    </div>
  );
}
