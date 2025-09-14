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
import { Checkbox } from "@/components/ui/checkbox";
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
  Package,
  Filter,
  Store,
  Tag,
  DollarSign,
  RefreshCw,
  AlertTriangle,
  Home,
  ChevronDown,
} from "lucide-react";

import { ProductCard } from "@/components/product/product-card";
import { useParams } from "next/navigation";

interface CategoryProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  inStock: boolean;
  image: string;
  rating?: number;
  discount?: number;
}

interface CategoryStats {
  totalProducts: number;
  avgPrice: number;
  inStockCount: number;
  minPrice: number;
  maxPrice: number;
  retailerCount: number;
}

interface Retailer {
  id: number;
  name: string;
}

type SortBy = "price_asc" | "price_desc" | "name_asc" | "name_desc";

export default function CategoryProductPage() {
  const params = useParams();
  const categorySlug = params.slug as string;

  const [products, setProducts] = useState<CategoryProduct[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<CategoryProduct[]>(
    []
  );
  const [stats, setStats] = useState<CategoryStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [categoryName, setCategoryName] = useState("");

  // Filter states
  const [selectedRetailer, setSelectedRetailer] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("price_asc");
  const [inStockOnly, setInStockOnly] = useState(false);

  const retailers: Retailer[] = [
    { id: 1, name: "simplytek" },
    { id: 2, name: "onei.lk" },
    { id: 3, name: "appleme" },
    { id: 4, name: "laptops.lk" },
    { id: 5, name: "lifemobile" },
  ];

  useEffect(() => {
    fetchCategoryProducts();
  }, [categorySlug]);

  useEffect(() => {
    applyFilters();
  }, [products, selectedRetailer, sortBy, inStockOnly]);

  const fetchCategoryProducts = async () => {
    setLoading(true);
    setError(null);

    try {
      // In a real implementation:
      // const response = await fetch(`/api/v1/categories/${categorySlug}/products?page=${page}&limit=20`);
      // if (!response.ok) throw new Error('Failed to fetch category products');
      // const data = await response.json();

      // Mock data for demonstration
      const mockProducts: CategoryProduct[] = Array.from(
        { length: 20 },
        (_, index) => ({
          id: index + 1,
          name: `${categoryName} Product ${index + 1}`,
          brand: ["Apple", "Samsung", "Sony", "LG", "Dell", "HP"][
            Math.floor(Math.random() * 6)
          ],
          category: categoryName || getCategoryNameFromSlug(categorySlug),
          price: Math.floor(Math.random() * 100000) + 5000,
          originalPrice: Math.floor(Math.random() * 150000) + 20000,
          retailer:
            retailers[Math.floor(Math.random() * retailers.length)].name,
          inStock: Math.random() > 0.3,
          image: "/placeholder.svg",
          rating: Math.floor(Math.random() * 5) + 1,
          discount: Math.floor(Math.random() * 30) + 5,
        })
      );

      setProducts((prevProducts) => [...prevProducts, ...mockProducts]);
      setCategoryName(getCategoryNameFromSlug(categorySlug));

      // Mock statistics
      const mockStats: CategoryStats = {
        totalProducts: 243,
        avgPrice: 35750,
        inStockCount: 187,
        minPrice: 5000,
        maxPrice: 150000,
        retailerCount: retailers.length,
      };

      setStats(mockStats);
      setHasMore(page < 3); // For demonstration: only 3 pages of products
    } catch (error) {
      console.error("Error fetching category products:", error);
      setError("Failed to load products. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const loadMoreProducts = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCategoryProducts();
  };

  const applyFilters = () => {
    let filtered = [...products];

    // Retailer filter
    if (selectedRetailer !== "all") {
      filtered = filtered.filter(
        (product) => product.retailer === selectedRetailer
      );
    }

    // In stock only filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Sort
    switch (sortBy) {
      case "price_asc":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price_desc":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "name_asc":
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name_desc":
        filtered.sort((a, b) => b.name.localeCompare(a.name));
        break;
    }

    setFilteredProducts(filtered);
  };

  const getCategoryNameFromSlug = (slug: string): string => {
    // Transform slug like "gaming-peripherals" to "Gaming Peripherals"
    return slug
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
                  <BreadcrumbLink href="/categories">Categories</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage>{categoryName}</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>

          {/* Page Header */}
          <div className="mb-10 overflow-hidden relative">
            <div
              className="bg-gradient-to-r from-purple-600 via-purple-500 to-indigo-700 rounded-2xl shadow-xl 
                border border-white/10 backdrop-filter overflow-hidden"
            >
              <div className="absolute inset-0 overflow-hidden">
                <div
                  className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                    transform -skew-y-12 -translate-x-full animate-[shimmer_3s_infinite]"
                ></div>
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
                <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-purple-400/30 to-indigo-500/30 blur-md"></div>
                <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 blur-md"></div>
              </div>

              <div className="relative z-10 py-6 px-8 flex items-center justify-center">
                <div className="flex items-center space-x-4">
                  <div className="relative">
                    <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm"></div>
                    <div
                      className="relative bg-gradient-to-br from-purple-400 to-indigo-600 p-3 rounded-full 
                        shadow-[0_0_15px_rgba(124,58,237,0.5)] animate-pulse border border-white/30"
                    >
                      <Package className="h-8 w-8 text-white drop-shadow-md" />
                    </div>
                  </div>
                  <div>
                    <h1
                      className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md 
                        bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                    >
                      <span className="relative inline-block">
                        {categoryName} Products
                        <span className="absolute bottom-0 left-0 w-full h-1 bg-white/40 rounded"></span>
                      </span>
                    </h1>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Stats */}
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Package className="h-5 w-5 text-purple-500" />
                    <div>
                      <p className="text-sm text-gray-600">Total Products</p>
                      <p className="text-2xl font-bold">
                        {stats.totalProducts}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-sm text-gray-600">Avg Price</p>
                      <p className="text-2xl font-bold">
                        Rs {stats.avgPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Tag className="h-5 w-5 text-blue-500" />
                    <div>
                      <p className="text-sm text-gray-600">In Stock</p>
                      <p className="text-2xl font-bold">{stats.inStockCount}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="text-sm text-gray-600">Min Price</p>
                      <p className="text-2xl font-bold">
                        Rs {stats.minPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-orange-500" />
                    <div>
                      <p className="text-sm text-gray-600">Max Price</p>
                      <p className="text-2xl font-bold">
                        Rs {stats.maxPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-center gap-2">
                    <Store className="h-5 w-5 text-indigo-500" />
                    <div>
                      <p className="text-sm text-gray-600">Retailers</p>
                      <p className="text-2xl font-bold">
                        {stats.retailerCount}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Filters */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Filter className="h-5 w-5" />
                Filters
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Retailer Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Retailer
                  </label>
                  <Select
                    value={selectedRetailer}
                    onValueChange={setSelectedRetailer}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Retailers</SelectItem>
                      {retailers.map((retailer) => (
                        <SelectItem key={retailer.id} value={retailer.name}>
                          {retailer.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Sort By
                  </label>
                  <Select
                    value={sortBy}
                    onValueChange={(value: SortBy) => setSortBy(value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_low">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_high">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name_asc">Name: A-Z</SelectItem>
                      <SelectItem value="name_desc">Name: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="inStock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) => setInStockOnly(!!checked)}
                  />
                  <label
                    htmlFor="inStock"
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    In Stock Only
                  </label>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Error Message */}
          {error && (
            <Alert className="mb-6">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="flex items-center justify-between">
                {error}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={fetchCategoryProducts}
                >
                  <RefreshCw className="h-4 w-4 mr-2" />
                  Retry
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Products Grid */}
          {loading && products.length === 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <Card key={i} className="animate-pulse overflow-hidden">
                  <CardContent className="p-0">
                    <Skeleton className="w-full h-48" />
                    <div className="p-4 space-y-3">
                      <Skeleton className="h-3 w-12" />
                      <Skeleton className="h-5 w-full" />
                      <Skeleton className="h-4 w-24" />
                      <div className="space-y-2">
                        <div className="flex justify-between">
                          <Skeleton className="h-6 w-20" />
                          <Skeleton className="h-5 w-16" />
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Skeleton className="h-8 flex-1" />
                        <Skeleton className="h-8 w-10" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredProducts.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* No Results */}
              {filteredProducts.length === 0 && !loading && (
                <div className="text-center py-12">
                  <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">
                    No products found
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Try adjusting your filters to see more results.
                  </p>
                  <Button
                    onClick={() => {
                      setSelectedRetailer("all");
                      setSortBy("price_asc");
                      setInStockOnly(false);
                    }}
                    variant="outline"
                  >
                    Clear filters
                  </Button>
                </div>
              )}

              {/* Load More */}
              {hasMore && filteredProducts.length > 0 && (
                <div className="flex justify-center mt-8">
                  <Button
                    onClick={loadMoreProducts}
                    className="gap-2"
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <RefreshCw className="h-4 w-4 animate-spin" />
                        Loading...
                      </>
                    ) : (
                      <>
                        Load More <ChevronDown className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
