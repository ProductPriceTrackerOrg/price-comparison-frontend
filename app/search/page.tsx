"use client";

import { useState, useEffect, Suspense, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { SearchFilters, FilterState } from "@/components/search/search-filters";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Filter } from "lucide-react";

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchQuery, setSearchQuery] = useState(query);
  const [products, setProducts] = useState<any[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    priceRange: [0, 2000],
    selectedRetailers: [],
    inStockOnly: false,
    sortBy: "relevance"
  });

  // Mock search results
  const mockResults = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra 256GB",
      brand: "Samsung",
      category: "Smartphones",
      price: 1199.99,
      originalPrice: 1299.99,
      retailer: "TechStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 8,
    },
    {
      id: 2,
      name: "Samsung Galaxy S24 128GB",
      brand: "Samsung",
      category: "Smartphones",
      price: 899.99,
      originalPrice: 999.99,
      retailer: "MobileHub",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 10,
    },
    {
      id: 3,
      name: "Samsung Galaxy Watch 6",
      brand: "Samsung",
      category: "Smartwatches",
      price: 329.99,
      originalPrice: 399.99,
      retailer: "WearableTech",
      inStock: false,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 18,
    },
    {
      id: 4,
      name: "iPhone 15 Pro",
      brand: "Apple",
      category: "Smartphones",
      price: 1099.99,
      originalPrice: 1199.99,
      retailer: "TechStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 8,
    },
    {
      id: 5,
      name: "MacBook Air M2",
      brand: "Apple",
      category: "Laptops",
      price: 1299.99,
      originalPrice: 1399.99,
      retailer: "ElectroMax",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 7,
    },
    {
      id: 6,
      name: "Sony WH-1000XM5",
      brand: "Sony",
      category: "Headphones",
      price: 349.99,
      originalPrice: 399.99,
      retailer: "GadgetWorld",
      inStock: false,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 13,
    },
    {
      id: 31,
      name: "Microsoft Surface Pro 9",
      brand: "Microsoft",
      category: "Tablets",
      price: 999.99,
      originalPrice: 1199.99,
      retailer: "ComputerStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 17,
    },
  ];

  useEffect(() => {
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setProducts(mockResults);
      setLoading(false);
    }, 1000);
  }, [query]);

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
      filtered = filtered.filter((product) => product.inStock);
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
        // Assuming newer products have higher IDs
        filtered.sort((a, b) => b.id - a.id);
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

  const handleSearch = () => {
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="flex space-x-4 mb-4">
            <div className="flex-1 relative">
              <Input
                type="text"
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && handleSearch()}
                className="h-12 pl-4 pr-12"
              />
              <Button
                className="absolute right-2 top-2 h-8 w-8 p-0"
                onClick={handleSearch}
              >
                <Search className="h-4 w-4" />
              </Button>
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
              : `Found ${filteredProducts.length} results for "${query}"`}
          </div>
        </div>

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
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
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
