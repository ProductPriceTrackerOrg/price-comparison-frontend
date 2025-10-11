"use client";

import { useState, useEffect } from "react";

import { CompactNavigationBar } from "@/components/layout/compact-navigation-bar";

import { PageHeader } from "@/components/layout/page-header";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Skeleton } from "@/components/ui/skeleton";
import { CustomPagination } from "@/components/ui/custom-pagination";
import {
  Percent,
  TrendingDown,
  Clock,
  Filter,
  AlertCircle,
  Loader2,
  ChevronRight,
} from "lucide-react";
import { Deal, DealsListResponse, DealsStats } from "@/lib/types/deals";

export default function DealsPage() {
  const [deals, setDeals] = useState<Deal[]>([]);
  const [stats, setStats] = useState<DealsStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasNextPage, setHasNextPage] = useState(false);
  const [totalDeals, setTotalDeals] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  // Filter states
  const [category, setCategory] = useState<string | null>(null);
  const [minDiscount, setMinDiscount] = useState<number | null>(null);
  const [inStockOnly, setInStockOnly] = useState(true);

  const handlePageChange = (pageNum: number) => {
    if (pageNum !== page) {
      setPage(pageNum);
      fetchDeals(pageNum);
      // Scroll to top of results
      window.scrollTo({
        top: document.getElementById("results-section")?.offsetTop || 0,
        behavior: "smooth",
      });
    }
  };

  const fetchDeals = async (pageNum = 1) => {
    try {
      setLoading(true);
      setError(null);

      // Build query parameters
      const queryParams = new URLSearchParams();
      if (category) queryParams.append("category", category);
      if (minDiscount !== null)
        queryParams.append("min_discount", minDiscount.toString());
      if (inStockOnly !== null)
        queryParams.append("in_stock_only", inStockOnly.toString());
      queryParams.append("page", pageNum.toString());
      queryParams.append("limit", "20"); // Show 8 deals per page

      const response = await fetch(`/api/v1/top-deals/deals?${queryParams}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch deals: ${response.status}`);
      }

      const data: DealsListResponse = await response.json();

      // Always set the deals directly since we're using pagination
      setDeals(data.items);

      setStats(data.stats);
      setHasNextPage(data.has_next);
      setTotalDeals(data.stats.total_deals);
      // Calculate total pages based on the limit (20 items per page)
      setTotalPages(Math.ceil(data.stats.total_deals / 20)); // Using 20 as defined in fetchDeals
      setPage(pageNum);
    } catch (error) {
      console.error("Error fetching deals:", error);
      setError("Failed to load deals. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Apply filters
  const applyFilters = () => {
    // Reset to first page when applying filters
    setPage(1);
    fetchDeals(1);
  };

  // Reset filters
  const resetFilters = () => {
    setCategory(null);
    setMinDiscount(null);
    setInStockOnly(true);
    // Reset to first page when clearing filters
    setPage(1);
    fetchDeals(1);
  };

  // Transform deal to product format for ProductCard
  const transformDealToProduct = (deal: Deal) => ({
    id: deal.shop_product_id,
    name: deal.product_title,
    brand: deal.brand,
    category: deal.category_name,
    price: deal.current_price,
    originalPrice: deal.original_price,
    retailer: deal.shop_name,
    inStock: deal.is_available,
    image: deal.image_url,
    discount: Math.round(deal.discount_percentage),
    dealScore: deal.deal_score,
  });

  // Filter by category
  const handleCategoryFilter = () => {
    // Toggle between all categories and null
    setCategory(category ? null : "all");
    applyFilters();
  };

  // Filter by discount
  const handleDiscountFilter = () => {
    // Toggle between 20% minimum and null
    setMinDiscount(minDiscount === 20 ? null : 20);
    applyFilters();
  };

  // Filter by stock
  const handleStockFilter = () => {
    // Toggle in_stock_only
    setInStockOnly(!inStockOnly);
    applyFilters();
  };

  // Initial data fetch
  useEffect(() => {
    fetchDeals();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Compact Navigation Bar instead of full Navigation Bar */}
      {/* <CompactNavigationBar /> */}

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Beautiful Blue Background */}
          <PageHeader
            title="Top Deals"
            icon={Percent}
            breadcrumbItems={[{ label: "Top Deals" }]}
          />

          {/* Stats Bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            {loading ? (
              <>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-8 w-8 rounded-full mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-8 w-8 rounded-full mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <div className="flex flex-col items-center">
                    <Skeleton className="h-8 w-8 rounded-full mb-2" />
                    <Skeleton className="h-8 w-24 mb-2" />
                    <Skeleton className="h-5 w-32" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stats?.total_deals?.toLocaleString("en-US") || "0"}
                  </div>
                  <div className="text-gray-600">Active Deals</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <Percent className="h-8 w-8 text-orange-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">
                    {stats?.average_discount?.toFixed(1) || "0"}%
                  </div>
                  <div className="text-gray-600">Average Discount</div>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
                  <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <div className="text-2xl font-bold text-gray-900">24h</div>
                  <div className="text-gray-600">Updated Every</div>
                </div>
              </>
            )}
          </div>

          {/* Filter Bar */}
          <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-8 bg-white rounded-lg p-4 shadow-sm border">
            <div className="flex flex-wrap items-center gap-4 mb-4 md:mb-0">
              <Button
                variant={category === null ? "outline" : "default"}
                size="sm"
                onClick={handleCategoryFilter}
              >
                <Filter className="h-4 w-4 mr-2" />
                All Categories
              </Button>
              <Button
                variant={minDiscount === 20 ? "default" : "outline"}
                size="sm"
                className={
                  minDiscount === 20 ? "bg-green-600 hover:bg-green-700" : ""
                }
                onClick={handleDiscountFilter}
              >
                {minDiscount === 20 ? "Discount: 20%+ ✓" : "Discount: 20%+"}
              </Button>
              <Button
                variant={inStockOnly ? "default" : "outline"}
                size="sm"
                onClick={handleStockFilter}
              >
                In Stock Only
              </Button>
            </div>
            <div className="text-sm text-gray-600">
              {loading
                ? "Loading deals..."
                : `Showing ${deals.length} of ${totalDeals} deals`}
            </div>
          </div>

          {/* Error message */}
          {error && (
            <Alert className="mb-6 bg-red-50 border-red-200">
              <AlertCircle className="h-4 w-4 text-red-500" />
              <AlertDescription className="text-red-600">
                {error}
              </AlertDescription>
            </Alert>
          )}

          {/* Deals Grid - 4 columns on desktop */}
          <div
            id="results-section"
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
          >
            {loading && !deals.length ? (
              // Skeleton loading
              Array(8)
                .fill(0)
                .map((_, index) => (
                  <div key={index} className="relative">
                    <div className="bg-white rounded-lg shadow-sm border overflow-hidden h-[350px]">
                      <Skeleton className="h-48 w-full" />
                      <div className="p-4 space-y-2">
                        <Skeleton className="h-4 w-3/4" />
                        <Skeleton className="h-4 w-1/2" />
                        <Skeleton className="h-6 w-1/3" />
                      </div>
                    </div>
                  </div>
                ))
            ) : deals.length === 0 ? (
              <div className="col-span-4 text-center py-12">
                <p className="text-gray-500 text-lg">
                  No deals found with the current filters. Try adjusting your
                  filters.
                </p>
              </div>
            ) : (
              deals.map((deal) => (
                <div key={deal.variant_id} className="relative">
                  <ProductCard product={transformDealToProduct(deal)} />
                  <div className="absolute top-2 left-2 z-20">
                    {deal.deal_score >= 80 ? (
                      <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg">
                        HOT DEAL
                      </Badge>
                    ) : (
                      <Badge className="bg-blue-500 hover:bg-blue-600 text-white font-bold shadow-lg">
                        {deal.discount_percentage.toFixed(0)}% OFF
                      </Badge>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Pagination */}
          <div className="text-center mt-12" id="pagination-section">
            {!loading && deals.length > 0 && (
              <CustomPagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
