"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Search,
  Store,
  Filter,
  ChevronDown,
  SlidersHorizontal,
  ShoppingBag,
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import { Spinner } from "@/components/ui/spinner";
import { ProductCard } from "@/components/product/product-card";
import { CustomPagination } from "@/components/ui/custom-pagination";
// Define interfaces for API responses
interface Retailer {
  id: number;
  name: string;
  logo?: string;
  description?: string;
  product_count: number;
  rating: number;
  verified?: boolean;
}

// API product from backend
interface ApiProduct {
  id: number;
  name: string;
  description?: string;
  price: number;
  original_price?: number;
  discount?: number;
  brand: string;
  category_id?: number;
  category_name?: string;
  rating?: number;
  image?: string;
  in_stock: boolean;
  shop_id: number;
  shop_name?: string;
  category?: string;
  // Add retailer field to match backend response
  retailer?: string;
  retailer_id?: number;
  images?: string[];
}

// Product interface matching what ProductCard component expects
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  inStock: boolean;
  image: string;
  discount?: number;
  rating?: number;
  description?: string;
}

interface Category {
  id: number;
  name: string;
  count: number;
}

interface Brand {
  id: number;
  name: string;
  count: number;
}

interface Filters {
  categories: Category[];
  brands: Brand[];
  minPrice: number;
  maxPrice: number;
}

// Define price formatter
const formatPrice = (price: number) => {
  return `Rs ${price.toLocaleString("en-US")}`;
};

export default function RetailerProductsPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const retailerId = params.id as string;

  const [retailer, setRetailer] = useState<Retailer | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [filters, setFilters] = useState<Filters>({
    categories: [],
    brands: [],
    minPrice: 0,
    maxPrice: 2000000, // Increase max price to 2,000,000
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 20; // Products per page

  // Filter states
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedBrand, setSelectedBrand] = useState<string>("");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000000]); // Adjust max to 2,000,000
  const [inStockOnly, setInStockOnly] = useState(false);
  const [hasDiscount, setHasDiscount] = useState(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [showFilters, setShowFilters] = useState(true);

  // Track if this is the first load
  const isFirstLoad = useRef(true);

  // Fetch retailer and products
  useEffect(() => {
    if (retailerId) {
      fetchData();
    }
    // When component unmounts, reset first load flag
    return () => {
      isFirstLoad.current = true;
    };
  }, [
    retailerId,
    currentPage,
    searchQuery,
    selectedCategory,
    selectedBrand,
    // priceRange removed from dependencies to prevent infinite loop
    inStockOnly,
    hasDiscount,
    sortBy,
  ]);

  // Create a reference for the current request to avoid race conditions
  const activeRequestRef = useRef(false);

  const fetchData = async () => {
    // If there's an active request, don't start another one
    if (activeRequestRef.current) {
      console.log("Skipping duplicate request - already fetching data");
      return;
    }

    console.log(
      `Fetching retailer products - retailerId: ${retailerId}, page: ${currentPage}`
    );
    activeRequestRef.current = true;
    setLoading(true);
    setError(null);

    try {
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
        sort: sortBy,
      });

      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      if (selectedCategory) {
        queryParams.append("category", selectedCategory);
      }

      if (selectedBrand) {
        queryParams.append("brand", selectedBrand);
      }

      // Always include current price range from state
      queryParams.append("min_price", priceRange[0].toString());
      queryParams.append("max_price", priceRange[1].toString());

      if (inStockOnly) {
        queryParams.append("in_stock", "true");
      }

      if (hasDiscount) {
        queryParams.append("has_discount", "true");
      }

      // Fetch the products data from our API route
      const apiUrl = `/api/v1/retailers/${retailerId}/products?${queryParams}`;
      console.log(`API Request URL: ${apiUrl}`);

      const response = await fetch(apiUrl);
      console.log(`API Response status: ${response.status}`);

      if (!response.ok) {
        throw new Error(
          `Failed to fetch retailer products: ${response.status}`
        );
      }

      const data = await response.json();
      console.log("API response received", {
        hasRetailer: !!data.retailer,
        productsCount: data.products?.length || 0,
        hasFilters: !!data.filters,
        retailerData: data.retailer,
        paginationData: data.pagination || data.meta, // Support both pagination and meta keys
      });

      // Validate the data structure
      if (!data.retailer) {
        console.warn("API response missing retailer data");
      }

      if (!Array.isArray(data.products)) {
        console.error(
          "API response products is not an array:",
          typeof data.products
        );
        throw new Error("Invalid data format: products is not an array");
      }

      setRetailer(data.retailer);

      console.log("Raw API products sample:", data.products?.[0]);

      // Map API products to our interface to ensure all required fields
      const mappedProducts: Product[] = (data.products || [])
        .map((apiProduct: ApiProduct) => {
          try {
            // Check if the apiProduct is valid
            if (!apiProduct || typeof apiProduct !== "object") {
              console.error("Invalid product data:", apiProduct);
              return null;
            }

            if (apiProduct.id === undefined) {
              console.error("Product missing ID:", apiProduct);
              return null;
            }

            return {
              id: apiProduct.id,
              name: apiProduct.name || "Unnamed Product",
              brand: apiProduct.brand || "Unknown",
              price:
                typeof apiProduct.price === "number" ? apiProduct.price : 0,
              originalPrice:
                typeof apiProduct.original_price === "number"
                  ? apiProduct.original_price
                  : undefined,
              discount:
                typeof apiProduct.discount === "number"
                  ? apiProduct.discount
                  : undefined,
              rating:
                typeof apiProduct.rating === "number"
                  ? apiProduct.rating
                  : undefined,
              description: apiProduct.description,
              // Ensure required fields for ProductCard are present
              category:
                apiProduct.category_name || apiProduct.category || "Unknown",
              // Fix retailer name by using shop_name, retailer or directly from apiProduct.retailer
              retailer:
                apiProduct.shop_name ||
                apiProduct.retailer ||
                data.retailer?.name ||
                "Unknown",
              inStock: Boolean(apiProduct.in_stock),
              // If image is missing, use a placeholder
              image:
                apiProduct.image || "/placeholder.svg?height=200&width=200",
            };
          } catch (err) {
            console.error("Error mapping product:", err, apiProduct);
            return null;
          }
        })
        // Filter out any null values from failed mappings
        .filter(
          (product: Product | null): product is Product => product !== null
        );

      console.log("Mapped products", { count: mappedProducts.length });
      setProducts(mappedProducts);
      setFilters({
        categories: data.filters?.categories || [],
        brands: data.filters?.brands || [],
        minPrice: data.filters?.minPrice || 0,
        maxPrice: data.filters?.maxPrice || 2000000, // Increase max price to 2,000,000
      });

      // Support both pagination and meta keys from API response
      const paginationData = data.pagination || data.meta;
      setTotalPages(
        paginationData?.total_pages || paginationData?.total_pages || 1
      );
      setTotalCount(
        paginationData?.total_items || paginationData?.total_count || 0
      );

      // Only initialize price range on first load
      if (isFirstLoad.current && data.filters) {
        console.log("Initializing price range on first load", {
          min: data.filters.minPrice || 0,
          max: data.filters.maxPrice || 200000,
        });
        isFirstLoad.current = false;
        setPriceRange([
          data.filters.minPrice || 0,
          data.filters.maxPrice || 200000,
        ]);
      }

      setLoading(false);
      activeRequestRef.current = false;
      console.log("Fetch completed successfully");
    } catch (error: any) {
      console.error("Error fetching retailer products:", error);

      // More descriptive error message based on the error type
      let errorMessage = "Failed to load products. Please try again.";

      if (
        error.message?.includes("socket hang up") ||
        error.code === "ECONNRESET"
      ) {
        errorMessage =
          "Connection to server was lost. Please check your internet connection and try again.";
      } else if (error.message?.includes("products is not an array")) {
        errorMessage =
          "The server returned an invalid response format. Please try again later.";
      } else if (error.message?.includes("Failed to fetch")) {
        errorMessage =
          "Unable to connect to the server. Please check your internet connection.";
      }

      setError(errorMessage);
      setLoading(false);
      activeRequestRef.current = false;

      // Set empty products to avoid showing stale data
      setProducts([]);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchData(); // Explicitly trigger data fetch on search submit
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  // Filter reset handler
  const resetFilters = () => {
    setPriceRange([filters.minPrice || 0, filters.maxPrice || 2000000]);
    setInStockOnly(false);
    setHasDiscount(false);
    setSortBy("newest");
    setSearchQuery("");
    setSelectedCategory("");
    setSelectedBrand("");
    setCurrentPage(1);
  };

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center p-8">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error</h1>
          <p className="text-gray-700 mb-6">{error}</p>
          <Button asChild>
            <Link href="/retailers">Return to Retailers</Link>
          </Button>
        </div>
      </div>
    );
  }

  // Show spinner only during initial load, after that we show the page even if loading
  const isInitialLoad = loading && !retailer;

  // Debug information to help identify issues
  console.log("Page render state:", {
    loading,
    hasRetailer: !!retailer,
    productsCount: products.length,
    isInitialLoad,
    hasError: !!error,
  });

  if (isInitialLoad && !error) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <Spinner size="lg" className="text-blue-600 mb-4" />
        <p className="text-gray-600">Loading retailer information...</p>
        <p className="text-gray-400 text-sm mt-2">This may take a moment...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Retailer Header */}
      <div className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb - Fixed to show retailer name */}
          <div className="flex items-center text-sm text-blue-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <Link
              href="/retailers"
              className="hover:text-white transition-colors"
            >
              Retailers
            </Link>
            <span className="mx-2">&gt;</span>
            <span>{retailer?.name || "Loading..."}</span>
          </div>

          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center">
                <Store className="h-8 w-8 text-blue-600" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold">
                  {retailer?.name}
                </h1>
                <p className="text-blue-100">{retailer?.description}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg px-4 py-3">
                <div className="text-xs text-blue-200">Total Products</div>
                <div className="text-2xl font-bold">
                  {retailer && typeof retailer.product_count === "number"
                    ? retailer.product_count.toLocaleString()
                    : totalCount > 0
                    ? totalCount.toLocaleString()
                    : "..."}
                </div>
              </div>

              {retailer?.verified && (
                <Badge className="bg-green-500 text-white border-0 h-auto py-2">
                  Verified Partner
                </Badge>
              )}
            </div>
          </div>

          {/* Search bar */}
          <div className="mt-8 max-w-2xl">
            <form
              onSubmit={handleSearch}
              className="flex rounded-lg overflow-hidden shadow-lg"
            >
              <Input
                type="text"
                placeholder={`Search products from ${retailer?.name}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow h-14 px-6 bg-white/95 border-0 text-gray-900 text-lg focus-visible:ring-blue-500"
                onKeyDown={(e) => {
                  // Prevent form submission on every key press
                  if (e.key === "Enter") {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
              />
              <Button
                type="submit"
                className="bg-blue-600 hover:bg-blue-700 h-14 px-6 rounded-none"
              >
                <Search className="h-5 w-5" />
              </Button>
            </form>
          </div>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 py-12">
        {/* Filters and Results */}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters sidebar */}
          <div
            className={`lg:w-64 space-y-6 ${
              showFilters ? "block" : "hidden lg:block"
            }`}
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-bold text-gray-800 flex items-center">
                <Filter className="h-5 w-5 mr-2" /> Filters
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={resetFilters}
                className="text-blue-600 hover:text-blue-800"
              >
                Reset
              </Button>
            </div>

            <Separator />

            {/* Price Range Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Price Range</h3>
              <div className="px-2">
                <Slider
                  defaultValue={[priceRange[0], priceRange[1]]}
                  min={0}
                  max={2000000}
                  step={5000}
                  value={[priceRange[0], priceRange[1]]}
                  onValueChange={(value) => setPriceRange([value[0], value[1]])}
                  onValueCommit={() => fetchData()} // Only fetch when slider stops moving
                  className="my-6"
                />
                <div className="flex items-center justify-between text-sm">
                  <span>{formatPrice(priceRange[0])}</span>
                  <span>{formatPrice(priceRange[1])}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Availability Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Availability</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="inStock"
                  checked={inStockOnly}
                  onCheckedChange={(checked) => setInStockOnly(!!checked)}
                />
                <Label htmlFor="inStock">In Stock Only</Label>
              </div>
            </div>

            <Separator />

            {/* Discount Filter */}
            <div className="space-y-4">
              <h3 className="font-medium text-gray-800">Discount</h3>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="discount"
                  checked={hasDiscount}
                  onCheckedChange={(checked) => setHasDiscount(!!checked)}
                />
                <Label htmlFor="discount">On Sale</Label>
              </div>
            </div>
          </div>

          {/* Products grid */}
          <div className="flex-1">
            {/* Results header with sorting and filters toggle */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">
                  {searchQuery
                    ? `Results for "${searchQuery}"`
                    : "All Products"}
                </h2>
                <p className="text-gray-600">
                  {totalCount === 0
                    ? "No products found"
                    : `Showing ${products.length} of ${totalCount} products`}
                </p>
              </div>

              <div className="flex flex-col md:flex-row gap-4 w-full md:w-auto">
                {/* Sort dropdown */}
                <div className="flex-1 md:flex-none">
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-full md:w-[180px]">
                      <SelectValue placeholder="Sort by" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest</SelectItem>
                      <SelectItem value="price_asc">
                        Price: Low to High
                      </SelectItem>
                      <SelectItem value="price_desc">
                        Price: High to Low
                      </SelectItem>
                      <SelectItem value="name_asc">Name: A to Z</SelectItem>
                      <SelectItem value="name_desc">Name: Z to A</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Mobile filters toggle */}
                <Button
                  variant="outline"
                  className="lg:hidden flex-1"
                  onClick={() => setShowFilters(!showFilters)}
                >
                  <SlidersHorizontal className="h-4 w-4 mr-2" />
                  {showFilters ? "Hide Filters" : "Show Filters"}
                </Button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="flex justify-center items-center py-20">
                <Spinner size="lg" className="text-blue-600" />
              </div>
            ) : products.length === 0 ? (
              <div className="text-center py-16 bg-white rounded-lg border border-gray-200">
                <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No products found
                </h3>
                <p className="text-gray-600 mb-6">
                  Try adjusting your search or filter criteria
                </p>
                <Button onClick={resetFilters}>Reset Filters</Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}

            {/* Pagination */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center">
                <CustomPagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => {
                    setCurrentPage(page);
                    window.scrollTo(0, 0); // Scroll to top when changing page
                  }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
