"use client";

import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Input } from "@/components/ui/input";
import {
  TrendingDown,
  TrendingUp,
  Star,
  ShoppingCart,
  ExternalLink,
  Clock,
  Search,
  X,
  Plus,
} from "lucide-react";
import {
  RetailerComparison,
  PriceComparisonData,
} from "@/lib/types/buyer-central";
import { getSearchAutocomplete } from "@/lib/buyer-central-api";
import { debounce } from "lodash";

interface SearchProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  image?: string;
  avgPrice: number;
}

interface PriceComparisonSectionProps {
  comparisonData?: PriceComparisonData[];
  retailerComparisons?: RetailerComparison[];
  loading: boolean;
}

export function PriceComparisonSection({
  comparisonData = [],
  retailerComparisons = [],
  loading,
}: PriceComparisonSectionProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<SearchProduct[]>([]);
  const [autocompleteSuggestions, setAutocompleteSuggestions] = useState<
    string[]
  >([]);
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SearchProduct[]>([]);
  const [isSearching, setIsSearching] = useState(false);

  // Fetch autocomplete suggestions from the API
  const fetchAutocompleteSuggestions = useCallback(async (query: string) => {
    if (query.length < 2) {
      setAutocompleteSuggestions([]);
      setShowSearchResults(false);
      return;
    }

    setIsSearching(true);
    try {
      // Call the autocomplete API
      const suggestions = await getSearchAutocomplete(query);
      setAutocompleteSuggestions(suggestions);

      // Convert suggestions to SearchProduct format
      const productResults: SearchProduct[] = suggestions.map(
        (suggestion, index) => {
          // Extract brand from suggestion if possible (usually before the first space)
          const parts = suggestion.split(" ");
          const brand = parts[0];

          return {
            id: index + 1, // Generate a temp ID
            name: suggestion,
            brand: brand,
            category: "Electronics", // Default category
            avgPrice: Math.floor(Math.random() * 1000) + 500, // Random price for now
            // Would be replaced with actual data in a real implementation
          };
        }
      );

      setSearchResults(productResults);
      setShowSearchResults(suggestions.length > 0);
    } catch (error) {
      console.error("Error fetching search suggestions:", error);
    } finally {
      setIsSearching(false);
    }
  }, []);

  // Debounce the search to prevent too many API calls
  const debouncedSearch = useCallback(
    debounce((query: string) => {
      fetchAutocompleteSuggestions(query);
    }, 300),
    [fetchAutocompleteSuggestions]
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);

    if (query.length >= 2) {
      debouncedSearch(query);
    } else {
      setAutocompleteSuggestions([]);
      setSearchResults([]);
      setShowSearchResults(false);
    }
  };

  const addProductToComparison = (product: SearchProduct) => {
    if (!selectedProducts.find((p) => p.id === product.id)) {
      setSelectedProducts([...selectedProducts, product]);
    }
    setSearchQuery("");
    setShowSearchResults(false);
  };

  const removeProductFromComparison = (productId: number) => {
    setSelectedProducts(selectedProducts.filter((p) => p.id !== productId));
  };

  const clearSearch = () => {
    setSearchQuery("");
    setSearchResults([]);
    setShowSearchResults(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <Skeleton className="h-10 w-full mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Skeleton className="h-60 w-full" />
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getBestPriceIndex = (prices: { price: number }[]) => {
    return prices.reduce(
      (minIndex, current, index) =>
        current.price < prices[minIndex].price ? index : minIndex,
      0
    );
  };

  const formatCurrency = (amount: number) => {
    // Format as Sri Lankan Rupees
    return `Rs. ${amount.toLocaleString()}`;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Price Comparison
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare prices across retailers to find the best deals on the products
          you want. Search for specific products or browse popular comparisons
          below.
        </p>
      </div>

      {/* Product Search Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Search className="h-5 w-5 text-blue-600" />
            Search Products to Compare
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="Search for products (e.g., iPhone 15, Samsung Galaxy, MacBook...)"
              value={searchQuery}
              onChange={handleSearchChange}
              className="pl-10 pr-10"
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            {searchQuery && (
              <button
                onClick={clearSearch}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="h-4 w-4" />
              </button>
            )}

            {/* Search Results */}
            {isSearching && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full bg-blue-600 animate-pulse"></div>
                  <div className="text-sm text-gray-500">Searching...</div>
                </div>
              </div>
            )}

            {!isSearching && showSearchResults && searchResults.length > 0 && (
              <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg max-h-80 overflow-y-auto">
                <ul className="py-1">
                  {searchResults.map((product) => (
                    <li
                      key={product.id}
                      className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center justify-between"
                      onClick={() => addProductToComparison(product)}
                    >
                      <div>
                        <div className="font-medium">{product.name}</div>
                        <div className="text-sm text-gray-500 flex items-center gap-2">
                          <span>{product.brand}</span>
                          <span>•</span>
                          <span>{product.category}</span>
                          <span>•</span>
                          <span>Rs. {product.avgPrice.toLocaleString()}</span>
                        </div>
                      </div>
                      <Plus className="h-4 w-4 text-blue-600" />
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {!isSearching &&
              showSearchResults &&
              searchResults.length === 0 && (
                <div className="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded-md shadow-lg p-4 text-center">
                  <p className="text-gray-500">
                    No products found. Try different keywords.
                  </p>
                </div>
              )}
          </div>

          {/* Selected Products */}
          {selectedProducts.length > 0 && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Products to Compare</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="border rounded-md p-3 relative flex items-center gap-3"
                  >
                    <div
                      className="w-12 h-12 bg-gray-100 rounded flex-shrink-0"
                      style={{
                        backgroundImage: product.image
                          ? `url(${product.image})`
                          : undefined,
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                      }}
                    />
                    <div className="flex-1">
                      <div className="font-medium line-clamp-1">
                        {product.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        Avg: Rs. {product.avgPrice.toLocaleString()}
                      </div>
                    </div>
                    <button
                      onClick={() => removeProductFromComparison(product.id)}
                      className="absolute top-2 right-2 text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Example Products */}
          {selectedProducts.length === 0 && !showSearchResults && (
            <div className="mt-6">
              <h3 className="text-lg font-medium mb-3">Popular Products</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start text-left"
                  onClick={() =>
                    addProductToComparison({
                      id: 1,
                      name: "iPhone 15 Pro Max 256GB",
                      brand: "Apple",
                      category: "Smartphones",
                      avgPrice: 1199,
                    })
                  }
                >
                  <div className="font-medium">iPhone 15 Pro Max</div>
                  <div className="text-sm text-gray-500">Apple • Rs. 1,199</div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start text-left"
                  onClick={() =>
                    addProductToComparison({
                      id: 2,
                      name: "Samsung Galaxy S24 Ultra 512GB",
                      brand: "Samsung",
                      category: "Smartphones",
                      avgPrice: 1399,
                    })
                  }
                >
                  <div className="font-medium">Samsung Galaxy S24 Ultra</div>
                  <div className="text-sm text-gray-500">
                    Samsung • Rs. 1,399
                  </div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start text-left"
                  onClick={() =>
                    addProductToComparison({
                      id: 3,
                      name: "MacBook Pro 14-inch M3 Pro",
                      brand: "Apple",
                      category: "Laptops",
                      avgPrice: 2499,
                    })
                  }
                >
                  <div className="font-medium">MacBook Pro M3 Pro</div>
                  <div className="text-sm text-gray-500">Apple • Rs. 2,499</div>
                </Button>
                <Button
                  variant="outline"
                  className="h-auto py-4 flex flex-col items-start text-left"
                  onClick={() =>
                    addProductToComparison({
                      id: 4,
                      name: "Dell XPS 13 Plus",
                      brand: "Dell",
                      category: "Laptops",
                      avgPrice: 1299,
                    })
                  }
                >
                  <div className="font-medium">Dell XPS 13 Plus</div>
                  <div className="text-sm text-gray-500">Dell • Rs. 1,299</div>
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Price Comparison Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5 text-blue-600" />
            Price Comparison Results
          </CardTitle>
        </CardHeader>
        <CardContent>
          {comparisonData.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-1">
                No price data yet
              </h3>
              <p className="text-gray-500 max-w-md mx-auto">
                Search for products above or select from popular products to see
                price comparisons across retailers.
              </p>
            </div>
          ) : (
            <div className="space-y-8">
              {comparisonData.map((product) => {
                const bestPriceIndex = getBestPriceIndex(
                  product.retailerPrices
                );

                return (
                  <div
                    key={product.productId}
                    className="border rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 p-4 border-b">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-bold text-lg">
                            {product.productName}
                          </h3>
                          <div className="text-sm text-gray-500">
                            Category: {product.categoryName} • Average Price:{" "}
                            Rs. {(product.averagePrice || 0).toLocaleString()}
                          </div>
                        </div>

                        {product.priceHistory && (
                          <Badge
                            className={`flex items-center gap-1 ${
                              product.priceHistory.trend === "decreasing"
                                ? "bg-green-100 text-green-800 hover:bg-green-200"
                                : product.priceHistory.trend === "increasing"
                                ? "bg-red-100 text-red-800 hover:bg-red-200"
                                : "bg-blue-100 text-blue-800 hover:bg-blue-200"
                            }`}
                          >
                            {product.priceHistory.trend === "decreasing" ? (
                              <TrendingDown className="h-3 w-3" />
                            ) : product.priceHistory.trend === "increasing" ? (
                              <TrendingUp className="h-3 w-3" />
                            ) : (
                              <Clock className="h-3 w-3" />
                            )}
                            {product.priceHistory.priceChange > 0
                              ? `+${product.priceHistory.priceChange.toFixed(
                                  1
                                )}%`
                              : `${product.priceHistory.priceChange.toFixed(
                                  1
                                )}%`}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="overflow-x-auto">
                      <table className="w-full min-w-[600px]">
                        <thead>
                          <tr className="bg-gray-50">
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Retailer
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Price
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Stock Status
                            </th>
                            <th className="text-left py-3 px-4 font-medium text-gray-600">
                              Rating
                            </th>
                            <th className="text-center py-3 px-4 font-medium text-gray-600">
                              Action
                            </th>
                          </tr>
                        </thead>
                        <tbody>
                          {product.retailerPrices.map((retailer, index) => (
                            <tr
                              key={retailer.retailerId}
                              className={`border-t ${
                                index === bestPriceIndex ? "bg-green-50" : ""
                              }`}
                            >
                              <td className="py-3 px-4">
                                <div className="font-medium">
                                  {retailer.retailerName}
                                </div>
                                <div className="text-xs text-gray-500">
                                  {retailer.lastUpdated &&
                                    `Updated: ${retailer.lastUpdated}`}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center">
                                  <span
                                    className={`font-bold ${
                                      index === bestPriceIndex
                                        ? "text-green-700"
                                        : ""
                                    }`}
                                  >
                                    Rs. {retailer.price.toLocaleString()}
                                  </span>
                                  {index === bestPriceIndex && (
                                    <Badge className="ml-2 bg-green-100 text-green-800 hover:bg-green-200">
                                      Best Price
                                    </Badge>
                                  )}
                                </div>
                              </td>
                              <td className="py-3 px-4">
                                <Badge
                                  className={
                                    retailer.stockStatus === "in_stock"
                                      ? "bg-green-100 text-green-800 hover:bg-green-200"
                                      : retailer.stockStatus === "low_stock"
                                      ? "bg-yellow-100 text-yellow-800 hover:bg-yellow-200"
                                      : "bg-red-100 text-red-800 hover:bg-red-200"
                                  }
                                >
                                  {retailer.stockStatus === "in_stock"
                                    ? "In Stock"
                                    : retailer.stockStatus === "low_stock"
                                    ? "Low Stock"
                                    : "Out of Stock"}
                                </Badge>
                              </td>
                              <td className="py-3 px-4">
                                <div className="flex items-center gap-1">
                                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                  <span>{retailer.rating.toFixed(1)}</span>
                                </div>
                              </td>
                              <td className="py-3 px-4 text-center">
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="inline-flex items-center gap-1"
                                >
                                  <ShoppingCart className="h-3.5 w-3.5" />
                                  <span>Buy</span>
                                  <ExternalLink className="h-3 w-3 ml-1" />
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
