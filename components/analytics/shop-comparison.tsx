"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, ArrowRight, Store, TrendingDown, DollarSign } from "lucide-react";
import { Progress } from "@/components/ui/progress";

export interface ShopInsight {
  shopName: string;
  productCount: number;
  avgPriceRating: number; // 0-100 scale where 100 is cheapest
  reliabilityScore: number; // 0-100 scale
  availabilityPercentage: number;
  bestCategories: string[];
}

interface ShopComparisonProps {
  insights: ShopInsight[];
  loading: boolean;
}

export function ShopComparison({ insights, loading }: ShopComparisonProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-4 w-16" />
                </div>
                <Skeleton className="h-3 w-full" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort shops by price rating (best prices first)
  const sortedShops = [...insights].sort((a, b) => b.avgPriceRating - a.avgPriceRating);
  
  // Find the shop with the best availability
  const bestAvailabilityShop = [...insights].sort(
    (a, b) => b.availabilityPercentage - a.availabilityPercentage
  )[0];

  const getRatingColor = (rating: number) => {
    if (rating >= 85) return "bg-green-500";
    if (rating >= 70) return "bg-blue-500";
    if (rating >= 50) return "bg-amber-500";
    return "bg-red-500";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Shop Comparison</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Store className="h-3 w-3" />
          {insights.length} Retailers
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-8">
          {/* Best Prices Summary */}
          <div className="bg-green-50 border border-green-100 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-3">
              <DollarSign className="h-5 w-5 text-green-600" />
              <div className="font-medium text-green-800">Best Overall Prices</div>
            </div>
            
            {sortedShops.length > 0 && (
              <div className="flex items-center ml-7">
                <div>
                  <div className="text-lg font-bold text-green-900">
                    {sortedShops[0].shopName}
                  </div>
                  <div className="text-sm text-green-700">
                    Best prices on average across {sortedShops[0].productCount.toLocaleString()} products
                  </div>
                </div>
                <ArrowRight className="ml-2 text-green-500 h-4 w-4" />
                <Badge className="ml-2 bg-green-600">{sortedShops[0].avgPriceRating}/100</Badge>
              </div>
            )}
          </div>

          {/* Best Availability */}
          {bestAvailabilityShop && (
            <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="h-5 w-5 text-blue-600" />
                <div className="font-medium text-blue-800">Best Product Availability</div>
              </div>
              <div className="ml-7">
                <div className="flex items-center">
                  <div className="text-lg font-bold text-blue-900">
                    {bestAvailabilityShop.shopName}
                  </div>
                  <Badge className="ml-2 bg-blue-600">{bestAvailabilityShop.availabilityPercentage}%</Badge>
                </div>
                <div className="text-sm text-blue-700 mt-1">
                  Highest in-stock percentage across tracked products
                </div>
                {bestAvailabilityShop.bestCategories.length > 0 && (
                  <div className="text-sm text-blue-700 mt-1">
                    Specializes in: {bestAvailabilityShop.bestCategories.join(", ")}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Shop Price Ratings */}
          <div>
            <h4 className="text-sm font-medium mb-4">Shop Price Comparison</h4>
            <div className="space-y-6">
              {sortedShops.map((shop, idx) => (
                <div key={idx}>
                  <div className="flex items-center justify-between mb-1">
                    <div className="font-medium">{shop.shopName}</div>
                    <div className="text-sm text-muted-foreground">
                      {shop.productCount.toLocaleString()} products
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={`h-2 ${getRatingColor(shop.avgPriceRating)}`} 
                        style={{ width: `${shop.avgPriceRating}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium">{shop.avgPriceRating}</span>
                  </div>
                  {shop.bestCategories.length > 0 && (
                    <div className="mt-1 flex items-center gap-1">
                      <TrendingDown className="h-3 w-3 text-green-500" />
                      <span className="text-xs text-muted-foreground">
                        Best prices in: {shop.bestCategories.slice(0, 2).join(", ")}
                        {shop.bestCategories.length > 2 && " and more"}
                      </span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Legend */}
          <div className="pt-4 border-t">
            <div className="text-sm text-muted-foreground mb-2">Rating Legend</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span>Excellent (85-100)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                <span>Good (70-84)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                <span>Average (50-69)</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span>Below Average (&lt;50)</span>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}