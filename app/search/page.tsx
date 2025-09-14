"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { SearchFilters, FilterState } from "@/components/search/search-filters";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter, AlertTriangle } from "lucide-react";
import { SearchSuggestions } from "@/components/search/search-suggestions";
import api from "@/lib/api";
import { toast } from "@/hooks/use-toast";

// Define interfaces for type safety
interface Product {
  shop_product_id: string;
  name: string;
  brand: string;
  category_name: string;
  category_id: number;
  price: number;
  original_price: number;
  retailer: string;
  retailer_id: number;
  in_stock: boolean;
  image: string;
  discount: number;
  product_url: string;
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
    priceRange: [0, 2000],
    selectedRetailers: [],
    inStockOnly: false,
    sortBy: "relevance",
  });

  useEffect(() => {
    if (!query) {
      setLoading(false);
      setProducts([]);
      setError(null);
      return;
    }

    const fetchResults = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await api.get<SearchResponse>("/api/v1/search", {
          params: {
            q: query,
            page: currentPage,
            limit: 20,
          },
        });

        setProducts(response.data.products);
        setPagination(response.data.pagination);
        setLoading(false);
      } catch (err: any) {
        console.error("Error fetching search results:", err);
        setError(
          err.response?.data?.detail ||
            "An error occurred while searching. Please try again."
        );
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
    if (products.length === 0) {
      setFilteredProducts([]);
      return;
    }

    let filtered = [...products];

    // Apply price filter
    filtered = filtered.filter(
      (product) =>
        product.price >= filters.priceRange[0] &&
        product.price <= filters.priceRange[1]
    );

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

    // Apply sorting
    switch (filters.sortBy) {
      case "price-low":
        filtered.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        filtered.sort((a, b) => b.price - a.price);
        break;
      case "discount":
        filtered.sort((a, b) => (b.discount || 0) - (a.discount || 0));
        break;
      case "newest":
        // Sort by shop_product_id as a fallback (not ideal but will work for now)
        filtered.sort((a, b) =>
          b.shop_product_id.localeCompare(a.shop_product_id)
        );
        break;
      default:
        // relevance - keep original order
        break;
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
    return {
      id: parseInt(product.shop_product_id) || Math.random(),
      name: product.name,
      brand: product.brand,
      category: product.category_name,
      price: product.price,
      originalPrice: product.original_price,
      retailer: product.retailer,
      inStock: product.in_stock,
      image: product.image || "/placeholder.jpg",
      discount: product.discount,
    };
  };

  return (
    <div className="min-h-screen bg-background">
      <main className="container mx-auto px-4 py-8">
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
                      onClick={() =>
                        (window.location.href = `/search?q=${encodeURIComponent(
                          query
                        )}&page=${pagination.current_page - 1}`)
                      }
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
                              onClick={() =>
                                (window.location.href = `/search?q=${encodeURIComponent(
                                  query
                                )}&page=${pageToShow}`)
                              }
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
                      onClick={() =>
                        (window.location.href = `/search?q=${encodeURIComponent(
                          query
                        )}&page=${pagination.current_page + 1}`)
                      }
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
