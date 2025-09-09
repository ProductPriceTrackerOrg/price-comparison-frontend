"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  TrendingDown,
  TrendingUp,
  Star,
  ShoppingCart,
  ExternalLink,
  Clock,
  Percent,
  Award,
  Target,
  BarChart3,
  Bell,
  Search,
  X,
  Plus,
} from "lucide-react";
import {
  RetailerComparison,
  PriceComparisonData,
} from "@/lib/types/buyer-central";
import { useState } from "react";

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
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState<SearchProduct[]>([]);

  // Mock search function - replace with actual API call
  const searchProducts = async (query: string) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowSearchResults(false);
      return;
    }

    // Mock search results
    const mockResults: SearchProduct[] = [
      {
        id: 1,
        name: "iPhone 15 Pro Max 256GB",
        brand: "Apple",
        category: "Smartphones",
        avgPrice: 1199,
        image: "/placeholder.jpg",
      },
      {
        id: 2,
        name: "Samsung Galaxy S24 Ultra 512GB",
        brand: "Samsung",
        category: "Smartphones",
        avgPrice: 1399,
        image: "/placeholder.jpg",
      },
      {
        id: 3,
        name: "MacBook Pro 14-inch M3 Pro",
        brand: "Apple",
        category: "Laptops",
        avgPrice: 2499,
        image: "/placeholder.jpg",
      },
      {
        id: 4,
        name: "Dell XPS 13 Plus",
        brand: "Dell",
        category: "Laptops",
        avgPrice: 1299,
        image: "/placeholder.jpg",
      },
      {
        id: 5,
        name: "Sony WH-1000XM5",
        brand: "Sony",
        category: "Headphones",
        avgPrice: 399,
        image: "/placeholder.jpg",
      },
    ].filter(
      (product) =>
        product.name.toLowerCase().includes(query.toLowerCase()) ||
        product.brand.toLowerCase().includes(query.toLowerCase())
    );

    setSearchResults(mockResults);
    setShowSearchResults(true);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    searchProducts(query);
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
        <Tabs defaultValue="compare" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="compare">Price Compare</TabsTrigger>
            <TabsTrigger value="retailers">Retailer Analysis</TabsTrigger>
            <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
          </TabsList>
          <TabsContent value="compare" className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <Card key={i}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div className="space-y-2">
                      <Skeleton className="h-6 w-48" />
                      <Skeleton className="h-4 w-32" />
                    </div>
                    <Skeleton className="h-8 w-24" />
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    {Array.from({ length: 4 }).map((_, j) => (
                      <Card key={j} className="p-4">
                        <div className="space-y-2">
                          <Skeleton className="h-4 w-20" />
                          <Skeleton className="h-6 w-16" />
                          <Skeleton className="h-4 w-24" />
                          <Skeleton className="h-8 w-full" />
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
        </Tabs>
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
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "LKR",
    }).format(amount);
  };

  const calculateSavings = (currentPrice: number, originalPrice: number) => {
    const savings = originalPrice - currentPrice;
    const percentage = ((savings / originalPrice) * 100).toFixed(1);
    return { amount: savings, percentage: parseFloat(percentage) };
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Price Comparison
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Compare prices across retailers, track price history, and get
          intelligent buying recommendations to make the smartest purchasing
          decisions.
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
          {/* Search Input */}
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
              <Button
                variant="ghost"
                size="sm"
                onClick={clearSearch}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 h-6 w-6 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            )}

            {/* Search Results Dropdown */}
            {showSearchResults && searchResults.length > 0 && (
              <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                {searchResults.map((product) => (
                  <div
                    key={product.id}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                    onClick={() => addProductToComparison(product)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                        📱
                      </div>
                      <div>
                        <div className="font-medium text-sm">
                          {product.name}
                        </div>
                        <div className="text-xs text-gray-500">
                          {product.brand} • {product.category}
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-semibold text-sm">
                        {formatCurrency(product.avgPrice)}
                      </div>
                      <div className="text-xs text-gray-500">Avg Price</div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* No Results */}
            {showSearchResults &&
              searchResults.length === 0 &&
              searchQuery.length >= 2 && (
                <div className="absolute top-full left-0 right-0 z-10 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg p-4 text-center text-gray-500">
                  No products found for "{searchQuery}"
                </div>
              )}
          </div>

          {/* Selected Products for Comparison */}
          {selectedProducts.length > 0 && (
            <div>
              <h4 className="font-semibold text-sm mb-3">
                Selected for Comparison ({selectedProducts.length})
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedProducts.map((product) => (
                  <Badge
                    key={product.id}
                    variant="secondary"
                    className="flex items-center gap-2 pr-2"
                  >
                    <span>{product.name}</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeProductFromComparison(product.id)}
                      className="h-4 w-4 p-0 hover:bg-gray-300"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
              <div className="flex gap-2 mt-3">
                <Button size="sm" className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  Compare Selected Products
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedProducts([])}
                >
                  Clear All
                </Button>
              </div>
            </div>
          )}

          {/* Quick Add Suggestions */}
          {selectedProducts.length === 0 && !showSearchResults && (
            <div>
              <h4 className="font-semibold text-sm mb-3">
                Popular Comparisons
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() =>
                    addProductToComparison({
                      id: 1,
                      name: "iPhone 15 Pro Max",
                      brand: "Apple",
                      category: "Smartphones",
                      avgPrice: 1199,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  iPhone 15 Pro Max
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() =>
                    addProductToComparison({
                      id: 2,
                      name: "Samsung Galaxy S24 Ultra",
                      brand: "Samsung",
                      category: "Smartphones",
                      avgPrice: 1399,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Galaxy S24 Ultra
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="justify-start"
                  onClick={() =>
                    addProductToComparison({
                      id: 3,
                      name: "MacBook Pro 14-inch",
                      brand: "Apple",
                      category: "Laptops",
                      avgPrice: 2499,
                    })
                  }
                >
                  <Plus className="h-4 w-4 mr-2" />
                  MacBook Pro 14"
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      <Tabs defaultValue="compare" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="compare" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Price Compare
          </TabsTrigger>
          <TabsTrigger value="retailers" className="flex items-center gap-2">
            <Award className="h-4 w-4" />
            Retailer Analysis
          </TabsTrigger>
          <TabsTrigger
            value="recommendations"
            className="flex items-center gap-2"
          >
            <Target className="h-4 w-4" />
            Buy Recommendations
          </TabsTrigger>
        </TabsList>

        {/* Price Comparison Tab */}
        <TabsContent value="compare" className="space-y-6">
          {comparisonData.length === 0 ? (
            <Card>
              <CardContent className="text-center py-12">
                <BarChart3 className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h4 className="text-lg font-semibold text-gray-600 mb-2">
                  No Comparisons Available
                </h4>
                <p className="text-gray-500 mb-6">
                  Search for products to start comparing prices across
                  retailers.
                </p>
                <Button>Search Products</Button>
              </CardContent>
            </Card>
          ) : (
            comparisonData.map((product) => {
              const bestPriceIndex = getBestPriceIndex(product.retailerPrices);

              return (
                <Card
                  key={product.productId}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg mb-2">
                          {product.productName}
                        </CardTitle>
                        <Badge variant="outline">{product.categoryName}</Badge>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-600">Best Price</div>
                        <div className="text-2xl font-bold text-green-600">
                          {formatCurrency(
                            Math.min(
                              ...product.retailerPrices.map((r) => r.price)
                            )
                          )}
                        </div>
                        {product.averagePrice && (
                          <div className="text-sm text-gray-500">
                            Avg: {formatCurrency(product.averagePrice)}
                          </div>
                        )}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                      {product.retailerPrices.map((retailer, index) => {
                        const isBestPrice = index === bestPriceIndex;
                        const originalPrice =
                          product.averagePrice || retailer.price * 1.2;
                        const savings = calculateSavings(
                          retailer.price,
                          originalPrice
                        );

                        return (
                          <Card
                            key={retailer.retailerId}
                            className={`relative transition-all hover:shadow-md ${
                              isBestPrice
                                ? "ring-2 ring-green-500 bg-green-50 dark:bg-green-900/20"
                                : ""
                            }`}
                          >
                            {isBestPrice && (
                              <Badge className="absolute -top-2 -right-2 bg-green-600 text-white">
                                Best Price
                              </Badge>
                            )}
                            <CardContent className="p-4">
                              <div className="flex items-center justify-between mb-2">
                                <h4 className="font-semibold text-sm">
                                  {retailer.retailerName}
                                </h4>
                                <div className="flex items-center gap-1">
                                  <Star className="h-3 w-3 text-yellow-500 fill-current" />
                                  <span className="text-xs">
                                    {retailer.rating}
                                  </span>
                                </div>
                              </div>

                              <div className="space-y-2">
                                <div className="text-xl font-bold">
                                  {formatCurrency(retailer.price)}
                                </div>

                                {savings.percentage > 0 && (
                                  <div className="flex items-center gap-1 text-green-600">
                                    <TrendingDown className="h-3 w-3" />
                                    <span className="text-xs">
                                      Save {formatCurrency(savings.amount)} (
                                      {savings.percentage}%)
                                    </span>
                                  </div>
                                )}

                                <div className="text-xs text-gray-600">
                                  <div className="flex items-center gap-1 mb-1">
                                    <Clock className="h-3 w-3" />
                                    Updated{" "}
                                    {retailer.lastUpdated
                                      ? new Date(
                                          retailer.lastUpdated
                                        ).toLocaleDateString()
                                      : "Recently"}
                                  </div>
                                  {retailer.stockStatus && (
                                    <div
                                      className={`text-xs ${
                                        retailer.stockStatus === "in_stock"
                                          ? "text-green-600"
                                          : "text-red-600"
                                      }`}
                                    >
                                      {retailer.stockStatus === "in_stock"
                                        ? "✓ In Stock"
                                        : "✗ Out of Stock"}
                                    </div>
                                  )}
                                </div>
                              </div>

                              <Button
                                size="sm"
                                className="w-full mt-3"
                                disabled={
                                  retailer.stockStatus === "out_of_stock"
                                }
                              >
                                <ShoppingCart className="h-4 w-4 mr-2" />
                                Buy Now
                                <ExternalLink className="h-3 w-3 ml-2" />
                              </Button>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>

                    {product.priceHistory && (
                      <div className="border-t pt-4">
                        <h5 className="font-semibold text-sm mb-2">
                          Price Trend
                        </h5>
                        <div className="text-xs text-gray-600">
                          Price has decreased by{" "}
                          {product.priceHistory.priceChange}% in the last 30
                          days.
                          {product.priceHistory.trend === "decreasing" && (
                            <Badge
                              variant="outline"
                              className="ml-2 text-green-600"
                            >
                              <TrendingDown className="h-3 w-3 mr-1" />
                              Trending Down
                            </Badge>
                          )}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>
              );
            })
          )}
        </TabsContent>

        {/* Retailer Analysis Tab */}
        <TabsContent value="retailers" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {retailerComparisons.map((retailer) => (
              <Card
                key={retailer.retailerId}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-lg">
                      {retailer.retailerName}
                    </CardTitle>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-yellow-500 fill-current" />
                      <span className="font-semibold">
                        {retailer.averageRating}
                      </span>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                      <div className="text-lg font-bold text-blue-600">
                        {retailer.competitivenessScore}%
                      </div>
                      <div className="text-xs text-gray-600">
                        Price Competitiveness
                      </div>
                    </div>
                    <div className="text-center p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
                      <div className="text-lg font-bold text-green-600">
                        {retailer.totalProducts.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        Products Available
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Delivery Speed:</span>
                      <span className="font-medium">
                        {retailer.deliverySpeed}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Return Policy:</span>
                      <span className="font-medium">
                        {retailer.returnPolicy}
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Customer Service:</span>
                      <div className="flex items-center gap-1">
                        <Star className="h-3 w-3 text-yellow-500 fill-current" />
                        <span className="font-medium">
                          {retailer.customerServiceRating}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-2 border-t">
                    <h6 className="font-semibold text-sm mb-2">Strengths</h6>
                    <div className="flex flex-wrap gap-1">
                      {retailer.strengths.map((strength, index) => (
                        <Badge
                          key={index}
                          variant="outline"
                          className="text-xs"
                        >
                          {strength}
                        </Badge>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full" variant="outline">
                    View Store
                    <ExternalLink className="h-4 w-4 ml-2" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        {/* Recommendations Tab */}
        <TabsContent value="recommendations" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Best Time to Buy */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-blue-600" />
                  Best Time to Buy
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    Electronics Category
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300 mb-2">
                    Best buying window: November - January
                  </p>
                  <Badge className="bg-blue-600 text-white">
                    Save up to 35%
                  </Badge>
                </div>

                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                    Home & Garden
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300 mb-2">
                    Best buying window: End of Summer
                  </p>
                  <Badge className="bg-green-600 text-white">
                    Save up to 25%
                  </Badge>
                </div>

                <Button className="w-full" variant="outline">
                  <Target className="h-4 w-4 mr-2" />
                  Get Personalized Timing
                </Button>
              </CardContent>
            </Card>

            {/* Price Drop Predictions */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  Price Drop Predictions
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">iPhone 15 Pro</div>
                      <div className="text-xs text-gray-600">
                        Expected drop: 7 days
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                      8% drop likely
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Samsung 4K TV</div>
                      <div className="text-xs text-gray-600">
                        Expected drop: 14 days
                      </div>
                    </div>
                    <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20">
                      5% drop likely
                    </Badge>
                  </div>

                  <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                    <div>
                      <div className="font-medium text-sm">Nike Air Max</div>
                      <div className="text-xs text-gray-600">
                        Expected drop: 3 days
                      </div>
                    </div>
                    <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                      12% drop likely
                    </Badge>
                  </div>
                </div>

                <Button className="w-full" variant="outline">
                  <Bell className="h-4 w-4 mr-2" />
                  Set Price Drop Alerts
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Smart Buying Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Award className="h-5 w-5 text-purple-600" />
                Smart Buying Recommendations
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center p-6 border rounded-lg">
                  <div className="w-12 h-12 bg-green-100 dark:bg-green-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Target className="h-6 w-6 text-green-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Buy Now</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Prices are at their lowest point. Great time to purchase.
                  </p>
                  <Badge className="bg-green-100 text-green-800 dark:bg-green-900/20">
                    23 Products
                  </Badge>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <div className="w-12 h-12 bg-yellow-100 dark:bg-yellow-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Clock className="h-6 w-6 text-yellow-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Wait a Week</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Prices likely to drop soon. Set alerts and wait.
                  </p>
                  <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20">
                    18 Products
                  </Badge>
                </div>

                <div className="text-center p-6 border rounded-lg">
                  <div className="w-12 h-12 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
                    <TrendingUp className="h-6 w-6 text-red-600" />
                  </div>
                  <h4 className="font-semibold mb-2">Prices Rising</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Prices are trending up. Buy soon if needed.
                  </p>
                  <Badge className="bg-red-100 text-red-800 dark:bg-red-900/20">
                    12 Products
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
