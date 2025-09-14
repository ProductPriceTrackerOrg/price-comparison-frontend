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
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  findCategoryBySlug,
  findCategoryById,
  categoryNameToSlug,
} from "@/lib/category-data";
import { getCategoryProducts } from "@/lib/categories-api";

interface CategoryProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  retailer_id?: number;
  inStock: boolean;
  image: string;
  rating?: number;
  discount?: number;
}

interface CategoryResponse {
  category: {
    category_id: number;
    name: string;
    description: string;
    icon: string;
    color: string;
    parent_category_id: number | null;
    product_count: number;
  };
  products: CategoryProduct[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  filters: {
    brands: BrandFilter[];
  };
}

interface BrandFilter {
  name: string;
  count: number;
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
  const router = useRouter();
  const categorySlug = params.slug as string;

  // Get the category ID from the URL query params if available
  const searchParams = useSearchParams();
  const [categoryId, setCategoryId] = useState<number | undefined>();

  useEffect(() => {
    // Check if we have an ID in the URL query
    const idParam = searchParams.get("id");

    if (idParam && !isNaN(parseInt(idParam, 10))) {
      setCategoryId(parseInt(idParam, 10));
    } else {
      // Fallback to finding by slug
      const foundCategory = findCategoryBySlug(categorySlug);
      setCategoryId(foundCategory?.category_id);
    }
  }, [categorySlug, searchParams]);

  // Get category details for display
  const category = categoryId
    ? findCategoryById(categoryId)
    : findCategoryBySlug(categorySlug);

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
  const [totalItems, setTotalItems] = useState(0);

  // Filter states
  const [selectedRetailer, setSelectedRetailer] = useState<string>("all");
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [sortBy, setSortBy] = useState<SortBy>("price_asc");
  const [inStockOnly, setInStockOnly] = useState(false);
  const [minPrice, setMinPrice] = useState<number | null>(null);
  const [maxPrice, setMaxPrice] = useState<number | null>(null);
  const [brands, setBrands] = useState<BrandFilter[]>([]);

  const retailers: Retailer[] = [
    { id: 1, name: "simplytek" },
    { id: 2, name: "onei.lk" },
    { id: 3, name: "appleme" },
    { id: 4, name: "laptops.lk" },
    { id: 5, name: "lifemobile" },
  ];

  useEffect(() => {
    if (!categoryId && categorySlug) {
      // If category not found by slug, handle error
      setError("Category not found");
      setLoading(false);
      return;
    }

    // Reset state on category change
    setProducts([]);
    setPage(1);
    setHasMore(true);

    fetchCategoryProducts();
  }, [categorySlug, categoryId]);

  useEffect(() => {
    applyFilters();
  }, [
    products,
    selectedRetailer,
    selectedBrand,
    sortBy,
    inStockOnly,
    minPrice,
    maxPrice,
  ]);

  const fetchCategoryProducts = async () => {
    if (!categoryId) return;

    setLoading(true);
    setError(null);

    try {
      // Convert our sortBy to API expected format
      const apiSortBy = sortBy === "name_desc" ? "name_asc" : sortBy;

      // Prepare options for the API call
      const options = {
        page: page,
        limit: 20,
        sortBy: apiSortBy as "price_asc" | "price_desc" | "name_asc",
        brand: selectedBrand !== "all" ? selectedBrand : undefined,
        minPrice: minPrice !== null ? minPrice : undefined,
        maxPrice: maxPrice !== null ? maxPrice : undefined,
      };

      // Call our API client function
      const data = await getCategoryProducts(categoryId, options);

      // Update state with API response
      setProducts((prevProducts) => {
        // If it's the first page, replace products, otherwise append
        return page === 1 ? data.products : [...prevProducts, ...data.products];
      });

      setCategoryName(data.category.name);
      setBrands(data.filters.brands || []);
      setTotalItems(data.pagination.total_items);

      // Update stats
      const statsData: CategoryStats = {
        totalProducts: data.pagination.total_items,
        avgPrice:
          data.products.length > 0
            ? data.products.reduce(
                (sum: number, p: CategoryProduct) => sum + p.price,
                0
              ) / data.products.length
            : 0,
        inStockCount: data.products.filter((p: CategoryProduct) => p.inStock)
          .length,
        minPrice:
          data.products.length > 0
            ? Math.min(...data.products.map((p: CategoryProduct) => p.price))
            : 0,
        maxPrice:
          data.products.length > 0
            ? Math.max(...data.products.map((p: CategoryProduct) => p.price))
            : 0,
        retailerCount:
          data.products.length > 0
            ? new Set(data.products.map((p: CategoryProduct) => p.retailer))
                .size
            : 0,
      };

      setStats(statsData);
      setHasMore(data.pagination.current_page < data.pagination.total_pages);
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

    // Brand filter
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand === selectedBrand);
    }

    // In stock only filter
    if (inStockOnly) {
      filtered = filtered.filter((product) => product.inStock);
    }

    // Price range filter (client-side for immediate feedback)
    if (minPrice !== null) {
      filtered = filtered.filter((product) => product.price >= minPrice);
    }

    if (maxPrice !== null) {
      filtered = filtered.filter((product) => product.price <= maxPrice);
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

  // Handle filter changes with API refresh
  const handleFilterChange = (type: string, value: any) => {
    // Reset to page 1 when filters change
    setPage(1);

    switch (type) {
      case "retailer":
        setSelectedRetailer(value);
        break;
      case "brand":
        setSelectedBrand(value);
        break;
      case "sortBy":
        setSortBy(value as SortBy);
        break;
      case "inStock":
        setInStockOnly(value);
        break;
      case "minPrice":
        setMinPrice(value);
        break;
      case "maxPrice":
        setMaxPrice(value);
        break;
    }

    // Fetch with new filters
    fetchCategoryProducts();
  };

  // Function to get price range for filters
  const getPriceRange = () => {
    if (!products || products.length === 0) return { min: 0, max: 100000 };

    const prices = products.map((p) => p.price);
    return {
      min: Math.floor(Math.min(...prices) / 1000) * 1000, // Round down to nearest thousand
      max: Math.ceil(Math.max(...prices) / 1000) * 1000, // Round up to nearest thousand
    };
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Retailer Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Retailer
                  </label>
                  <Select
                    value={selectedRetailer}
                    onValueChange={(value) =>
                      handleFilterChange("retailer", value)
                    }
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

                {/* Brand Filter */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Brand
                  </label>
                  <Select
                    value={selectedBrand}
                    onValueChange={(value) =>
                      handleFilterChange("brand", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Brands</SelectItem>
                      {brands.map((brand) => (
                        <SelectItem key={brand.name} value={brand.name}>
                          {brand.name} ({brand.count})
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
                    onValueChange={(value: SortBy) =>
                      handleFilterChange("sortBy", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="price_asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name_asc">Name: A-Z</SelectItem>
                      <SelectItem value="name_desc">Name: Z-A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Price Range Controls */}
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Price Range
                  </label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="number"
                      placeholder="Min"
                      value={minPrice || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "minPrice",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                    <span>to</span>
                    <input
                      type="number"
                      placeholder="Max"
                      value={maxPrice || ""}
                      onChange={(e) =>
                        handleFilterChange(
                          "maxPrice",
                          e.target.value ? Number(e.target.value) : null
                        )
                      }
                      className="w-full p-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>

                {/* In Stock Only */}
                <div className="flex items-center space-x-2 pt-6">
                  <Checkbox
                    id="inStock"
                    checked={inStockOnly}
                    onCheckedChange={(checked) =>
                      handleFilterChange("inStock", !!checked)
                    }
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
