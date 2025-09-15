"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { SearchFilters, FilterState } from "@/components/search/search-filters";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Search,
  Filter,
  AlertTriangle,
  ChevronRight,
  Home,
  Bug,
} from "lucide-react";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import { SearchDebug } from "@/components/search/search-debug";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// Define interfaces for type safety
interface Product {
  shop_product_id: string;
  name: string;
  brand: string;
  category_name: string;
  category_id: number;
  price: number; // The current price (after discount)
  currentPrice: number; // Alias for price in some API responses
  original_price: number; // The original price before discount
  originalPrice: number; // Alias for original_price in some API responses
  retailer: string;
  retailer_id: number;
  in_stock: boolean;
  image: string;
  discount: number; // Discount percentage
  product_url: string; // Link to the product
  updated_at?: string; // When the product was last updated
  created_at?: string; // When the product was first added
}

interface PaginationInfo {
  current_page: number;
  total_pages: number;
  total_items: number;
  items_per_page: number;
}

interface SearchResponse {
  products: Product[];
  pagination: PaginationInfo;
  query: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam) : 1;

  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [pagination, setPagination] = useState<PaginationInfo>({
    current_page: 1,
    total_pages: 1,
    total_items: 0,
    items_per_page: 20,
  });
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000000],
    selectedRetailers: [],
    inStockOnly: false,
    sortBy: "price-high", // Set default sort to price high to low to match backend
  });

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setProducts([]);
      setFilteredProducts([]);
      setError(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);
      console.log(
        `Fetching search results for query: "${query}" (page ${currentPage})`
      );

      try {
        const response = await api.get<SearchResponse>("/api/v1/search", {
          params: {
            q: query,
            page: currentPage,
            limit: 20,
          },
        });

        console.log("API Response received", {
          query: response.data.query,
          pagination: response.data.pagination,
          productCount: response.data.products?.length || 0,
        });

        // Helper function to analyze API response structure
        const analyzeResponse = (data: any) => {
          if (!data.products || !Array.isArray(data.products)) {
            return "No products array in response";
          }

          if (data.products.length === 0) {
            return "Empty products array";
          }

          // Check the structure of the first product
          const firstProduct = data.products[0];
          const keys = Object.keys(firstProduct);

          // Check for critical fields
          const priceField = keys.includes("price")
            ? "price"
            : keys.includes("currentPrice")
            ? "currentPrice"
            : "missing";

          const originalPriceField = keys.includes("original_price")
            ? "original_price"
            : keys.includes("originalPrice")
            ? "originalPrice"
            : "missing";

          return {
            productCount: data.products.length,
            sampleKeys: keys,
            priceField,
            originalPriceField,
            hasImages: keys.includes("image"),
            firstProductName: firstProduct.name,
          };
        };

        const analysis = analyzeResponse(response.data);
        console.log("API Response Analysis:", analysis);

        if (!response.data.products || response.data.products.length === 0) {
          console.log("No products returned from API");
          setProducts([]);
          setFilteredProducts([]);
        } else {
          console.log(`Received ${response.data.products.length} products`);
          setProducts(response.data.products);
        }

        setPagination(response.data.pagination);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching search results:", err);

        // More detailed error logging
        if (err.response) {
          console.error("Error response:", {
            status: err.response.status,
            data: err.response.data,
          });
        } else if (err.request) {
          console.error("No response received:", err.request);
        } else {
          console.error("Error setting up request:", err.message);
        }

        setError(
          err.response?.data?.detail ||
            "An error occurred while searching. Please try again."
        );
        setProducts([]);
        setFilteredProducts([]);
        setLoading(false);
        toast({
          title: "Search Error",
          description: "Failed to fetch search results. Please try again.",
          variant: "destructive",
        });
      }
    };

    fetchResults();
  }, [query, currentPage]);

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (!target.closest(".search-container")) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Apply filters whenever filters or products change
  useEffect(() => {
    if (!products || products.length === 0) {
      console.log("No products to filter");
      setFilteredProducts([]);
      return;
    }

    console.log(`Products from API: ${products.length}`);

    // Debug the first few products
    if (products.length > 0) {
      const sampleProducts = products.slice(0, Math.min(3, products.length));
      console.log(
        "Sample products:",
        sampleProducts.map((p) => ({
          id: p.shop_product_id,
          name: p.name,
          price: p.price ?? p.currentPrice,
          original: p.original_price ?? p.originalPrice,
          retailer: p.retailer,
        }))
      );
    }

    let filtered = [...products];

    // Apply price filter - handle different field names in API response
    filtered = filtered.filter((product) => {
      const price = product.price ?? product.currentPrice;
      return price >= filters.priceRange[0] && price <= filters.priceRange[1];
    });

    // Apply retailer filter
    if (filters.selectedRetailers.length > 0) {
      filtered = filtered.filter((product) =>
        filters.selectedRetailers.includes(product.retailer)
      );
    }

    // Apply stock filter
    if (filters.inStockOnly) {
      filtered = filtered.filter((product) => product.in_stock);
    }

    // Apply sorting - backend already returns price DESC (high to low) by default
    // Only sort if user explicitly changes the default sort order
    if (filters.sortBy !== "price-high") {
      switch (filters.sortBy) {
        case "price-low":
          filtered.sort((a, b) => {
            const priceA = a.price ?? a.currentPrice ?? 0;
            const priceB = b.price ?? b.currentPrice ?? 0;
            return priceA - priceB;
          });
          break;
        case "discount":
          filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
          break;
        case "newest":
          // Use created_at or updated_at if available, otherwise fallback to ID
          filtered.sort((a, b) => {
            if (a.created_at && b.created_at) {
              return (
                new Date(b.created_at).getTime() -
                new Date(a.created_at).getTime()
              );
            }
            if (a.updated_at && b.updated_at) {
              return (
                new Date(b.updated_at).getTime() -
                new Date(a.updated_at).getTime()
              );
            }
            return b.shop_product_id.localeCompare(a.shop_product_id);
          });
          break;
        case "relevance":
          // For relevance, we won't sort as the API should already return by relevance
          break;
        default:
          // For any other case, maintain the default API sort (price high to low)
          break;
      }
    }

    console.log(`Filtered products: ${filtered.length}`);
    if (filtered.length > 0) {
      console.log("First filtered product:", filtered[0].name);
    }

    setFilteredProducts(filtered);
  }, [products, filters]);

  const handleFiltersChange = useCallback((newFilters: FilterState) => {
    setFilters(newFilters);
  }, []);

  const handleSearch = (suggestionValue?: string) => {
    const finalQuery = suggestionValue || searchQuery;
    if (finalQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(finalQuery)}`;
    }
  };

  // Adapter function to convert backend products to the format expected by ProductCard
  const adaptProductForCard = (product: Product) => {
    // Handle different naming conventions from API responses
    const currentPrice = product.price ?? product.currentPrice;
    const originalPrice = product.original_price ?? product.originalPrice;

    console.log("Adapting product:", {
      id: product.shop_product_id,
      price: currentPrice,
      originalPrice: originalPrice,
    });

    return {
      id: parseInt(product.shop_product_id) || Math.random(),
      name: product.name || "Unknown Product",
      brand: product.brand || "Unknown Brand",
      category: product.category_name || "Uncategorized",
      price: currentPrice,
      originalPrice: originalPrice,
      retailer: product.retailer || "Unknown Store",
      inStock: product.in_stock,
      image: product.image || "/placeholder.jpg",
      discount: product.discount,
      url: product.product_url,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-gray-500 mb-6 bg-gray-50 px-4 py-2 rounded-lg border border-gray-100 shadow-sm">
          <Link
            href="/"
            className="flex items-center hover:text-blue-600 transition-colors"
          >
            <Home className="h-4 w-4 mr-1" />
            <span className="font-medium">Home</span>
          </Link>
          <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
          <span className="text-gray-700 font-medium">Search</span>
          {query && (
            <>
              <ChevronRight className="h-4 w-4 mx-2 text-gray-400" />
              <span className="text-gray-900 font-medium truncate max-w-[300px] md:max-w-none">
                "{query}"
              </span>
            </>
          )}
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative search-container">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSuggestions(e.target.value.length > 0);
                }}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 pl-4 pr-12"
              />
              <Button
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={() => handleSearch()}
              >
                <Search className="h-4 w-4" />
              </Button>

              {/* Search Suggestions */}
              {showSuggestions && searchQuery.trim().length > 0 && (
                <div className="absolute z-50 w-full">
                  <SearchSuggestions
                    query={searchQuery}
                    onSelect={(suggestion: string) => {
                      setSearchQuery(suggestion);
                      setShowSuggestions(false);
                      handleSearch(suggestion);
                    }}
                    onClose={() => setShowSuggestions(false)}
                  />
                </div>
              )}
            </div>
            <Button
              variant="outline"
              onClick={() => setShowFilters(!showFilters)}
              className="h-12"
            >
              <Filter className="mr-2 h-4 w-4" />
              Filters
            </Button>
          </div>

          <div className="text-muted-foreground">
            {loading
              ? "Searching..."
              : error
              ? `Error: ${error}`
              : `Found ${pagination.total_items} results for "${query}"`}
          </div>
        </div>

        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 rounded-lg text-red-800 flex items-center">
            <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
            <div>
              <p className="font-medium">Search Error</p>
              <p className="text-sm">{error}</p>
            </div>
          </div>
        )}

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          {showFilters && (
            <div className="w-80 flex-shrink-0">
              <SearchFilters onFiltersChange={handleFiltersChange} />
            </div>
          )}

          {/* Results */}
          <div className="flex-1">
            {loading ? (
              <div
                className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                  showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4"
                }`}
              >
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="bg-muted h-64 rounded-lg mb-4"></div>
                    <div className="bg-muted h-4 rounded mb-2"></div>
                    <div className="bg-muted h-4 rounded w-2/3"></div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {filteredProducts.length > 0 ? (
                  <div
                    className={`grid grid-cols-1 md:grid-cols-2 gap-6 ${
                      showFilters ? "lg:grid-cols-3" : "lg:grid-cols-4"
                    }`}
                  >
                    {filteredProducts.map((product) => (
                      <ProductCard
                        key={product.shop_product_id}
                        product={adaptProductForCard(product)}
                      />
                    ))}
                  </div>
                ) : !error && query ? (
                  <div className="text-center py-12 border border-gray-200 rounded-lg">
                    <div className="mb-4">
                      <Search className="h-12 w-12 mx-auto text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium mb-2">
                      No products found
                    </h3>
                    <p className="text-gray-500 max-w-md mx-auto">
                      {products.length > 0
                        ? "No products match your current filters. Try adjusting your search criteria."
                        : `We couldn't find any products matching "${query}". Try a different search term.`}
                    </p>
                  </div>
                ) : null}
              </>
            )}

            {/* Debug Information - Only visible in development */}
            {process.env.NODE_ENV === "development" && (
              <div className="mt-8">
                <details>
                  <summary className="cursor-pointer flex items-center text-sm text-gray-500 hover:text-gray-700">
                    <Bug className="h-4 w-4 mr-2" />
                    <span>Show Debug Information</span>
                  </summary>
                  <SearchDebug
                    rawProducts={products}
                    filteredProducts={filteredProducts}
                    loading={loading}
                    pagination={pagination}
                    filters={filters}
                  />
                </details>
              </div>
            )}

            {/* Pagination Controls */}
            {!loading &&
              !error &&
              filteredProducts.length > 0 &&
              pagination.total_pages > 1 && (
                <div className="mt-8 flex justify-center">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Create URL with all existing params, just change the page
                        const url = new URL(window.location.href);
                        url.searchParams.set(
                          "page",
                          (pagination.current_page - 1).toString()
                        );
                        window.location.href = url.toString();
                      }}
                      disabled={pagination.current_page <= 1}
                    >
                      Previous
                    </Button>

                    <div className="flex items-center gap-1">
                      {Array.from(
                        { length: Math.min(5, pagination.total_pages) },
                        (_, i) => {
                          // Show 5 pages at most, centered around current page
                          let pageToShow;
                          if (pagination.total_pages <= 5) {
                            pageToShow = i + 1;
                          } else if (pagination.current_page <= 3) {
                            pageToShow = i + 1;
                          } else if (
                            pagination.current_page >=
                            pagination.total_pages - 2
                          ) {
                            pageToShow = pagination.total_pages - 4 + i;
                          } else {
                            pageToShow = pagination.current_page - 2 + i;
                          }

                          return (
                            <Button
                              key={pageToShow}
                              variant={
                                pageToShow === pagination.current_page
                                  ? "default"
                                  : "outline"
                              }
                              size="sm"
                              className="w-10 h-10 p-0"
                              onClick={() => {
                                // Create URL with all existing params, just change the page
                                const url = new URL(window.location.href);
                                url.searchParams.set(
                                  "page",
                                  pageToShow.toString()
                                );
                                window.location.href = url.toString();
                              }}
                            >
                              {pageToShow}
                            </Button>
                          );
                        }
                      )}
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        // Create URL with all existing params, just change the page
                        const url = new URL(window.location.href);
                        url.searchParams.set(
                          "page",
                          (pagination.current_page + 1).toString()
                        );
                        window.location.href = url.toString();
                      }}
                      disabled={
                        pagination.current_page >= pagination.total_pages
                      }
                    >
                      Next
                    </Button>
                  </div>
                </div>
              )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
