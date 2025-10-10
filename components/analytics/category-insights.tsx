"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import {
  Activity,
  TrendingDown,
  TrendingUp,
  BarChart3,
  Clock,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface CategoryInsight {
  categoryName: string;
  avgPrice: number;
  priceChange: number; // percentage
  priceVolatility: number; // 0-1 scale
  productCount: number;
  dealCount: number;
}

interface CategoryInsightsProps {
  insights: CategoryInsight[];
  loading: boolean;
}

export function CategoryInsights({ insights, loading }: CategoryInsightsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Skeleton className="h-40 w-full" />
            <div className="space-y-4">
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Sort categories by price change (best deals first)
  const sortedInsights = [...insights].sort(
    (a, b) => a.priceChange - b.priceChange
  );

  const formatPrice = (price: number) => {
    return formatCurrency(price);
  };

  const formatPercentage = (value: number) => {
    const sign = value >= 0 ? "+" : "";
    return `${sign}${value.toFixed(1)}%`;
  };

  // Calculate which category has the best deals
  const bestDealCategory = sortedInsights.length > 0 ? sortedInsights[0] : null;

  // Calculate which category is most stable
  const mostStableCategory = [...insights].sort(
    (a, b) => a.priceVolatility - b.priceVolatility
  )[0];

  // Generate colors based on price change
  const getBarColor = (priceChange: number) => {
    if (priceChange <= -5) return "#10B981"; // significant drop (green)
    if (priceChange < 0) return "#60A5FA"; // small drop (light blue)
    if (priceChange < 5) return "#F59E0B"; // small increase (orange)
    return "#EF4444"; // significant increase (red)
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Category Insights</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <BarChart3 className="h-3 w-3" />
          {insights.length} Categories
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Category Price Change Chart */}
          <div className="h-64">
            <div className="mb-2 text-sm font-medium text-muted-foreground">
              Price Change by Category
            </div>
            <ResponsiveContainer width="100%" height="90%">
              <BarChart
                data={sortedInsights}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid
                  strokeDasharray="3 3"
                  horizontal={true}
                  vertical={false}
                />
                <XAxis 
                  type="number" 
                  tickFormatter={(value) => `${value}%`}
                  tick={{ fontSize: 10 }}
                  tickMargin={5}
                />
                <YAxis
                  dataKey="categoryName"
                  type="category"
                  width={90}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickFormatter={(value) => value.length > 10 ? `${value.substring(0, 9)}...` : value}
                />
                <Tooltip
                  formatter={(value: number) => [
                    `${formatPercentage(value)}`,
                    "Price Change",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
                <Bar
                  dataKey="priceChange"
                  minPointSize={2}
                  barSize={12}
                  radius={[0, 4, 4, 0]}
                >
                  {sortedInsights.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={getBarColor(entry.priceChange)}
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Category Insights Cards */}
          <div className="space-y-4">
            {/* Best Deals Category */}
            {bestDealCategory && (
              <div className="p-4 bg-green-50 border border-green-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <TrendingDown className="h-5 w-5 text-green-600" />
                  <div className="font-medium text-green-800">
                    Best Deals Category
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-lg font-bold text-green-900">
                    {bestDealCategory.categoryName}
                  </div>
                  <div className="text-sm text-green-700 flex items-center gap-2">
                    <span>Avg. price change:</span>
                    <Badge variant="secondary" className="bg-green-100">
                      {formatPercentage(bestDealCategory.priceChange)}
                    </Badge>
                  </div>
                  <div className="text-sm text-green-700 mt-1">
                    {bestDealCategory.dealCount} active deals available
                  </div>
                </div>
              </div>
            )}

            {/* Most Stable Category */}
            {mostStableCategory && (
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Activity className="h-5 w-5 text-blue-600" />
                  <div className="font-medium text-blue-800">
                    Most Stable Prices
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-lg font-bold text-blue-900">
                    {mostStableCategory.categoryName}
                  </div>
                  <div className="text-sm text-blue-700 flex items-center gap-2">
                    <span>Price volatility:</span>
                    <Badge variant="secondary" className="bg-blue-100">
                      {(mostStableCategory.priceVolatility * 100).toFixed(1)}%
                    </Badge>
                  </div>
                  <div className="text-sm text-blue-700 mt-1">
                    Good for planned purchases
                  </div>
                </div>
              </div>
            )}

            {/* Largest Category */}
            {insights.length > 0 && (
              <div className="p-4 bg-purple-50 border border-purple-100 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="h-5 w-5 text-purple-600" />
                  <div className="font-medium text-purple-800">
                    Shopping Tip
                  </div>
                </div>
                <div className="ml-7">
                  <div className="text-sm text-purple-700">
                    {bestDealCategory && bestDealCategory.priceChange < -5
                      ? `Now is a great time to buy ${bestDealCategory.categoryName.toLowerCase()} with prices down ${Math.abs(
                          bestDealCategory.priceChange
                        ).toFixed(1)}% on average.`
                      : mostStableCategory
                      ? `${mostStableCategory.categoryName} prices are very stable - good time for researched purchases.`
                      : "Monitor price trends to find the best time to buy."}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 pt-4 border-t">
          <div className="text-sm text-muted-foreground mb-2">
            Price Change Legend
          </div>
          <div className="flex flex-wrap gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Major Drop (≥5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span>Minor Drop (0-5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
              <span>Minor Increase (0-5%)</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span>Major Increase (≥5%)</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
