"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Target,
  AlertCircle,
  ShoppingCart,
  Clock,
  BarChart3,
} from "lucide-react";
import { MarketIntelligence } from "@/lib/types/buyer-central";

interface MarketInsightsSectionProps {
  insights: MarketIntelligence[];
  loading: boolean;
}

export function MarketInsightsSection({
  insights,
  loading,
}: MarketInsightsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Skeleton className="h-20 w-full" />
                  <Skeleton className="h-16 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  const getActionColor = (action: string) => {
    switch (action) {
      case "buy_now":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      case "wait":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "monitor":
        return "text-blue-600 bg-blue-100 dark:bg-blue-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const getActionIcon = (action: string) => {
    switch (action) {
      case "buy_now":
        return <ShoppingCart className="h-4 w-4" />;
      case "wait":
        return <Clock className="h-4 w-4" />;
      case "monitor":
        return <BarChart3 className="h-4 w-4" />;
      default:
        return <Target className="h-4 w-4" />;
    }
  };

  const getVolatilityLevel = (volatility: number) => {
    if (volatility < 0.1) return { level: "Low", color: "text-green-600" };
    if (volatility < 0.3) return { level: "Medium", color: "text-yellow-600" };
    return { level: "High", color: "text-red-600" };
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Market Intelligence
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Real-time market analysis and buying recommendations based on price
          trends, seasonal patterns, and retailer performance.
        </p>
      </div>

      {/* Market Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 border-green-200 dark:border-green-800">
          <CardContent className="p-6 text-center">
            <TrendingDown className="h-8 w-8 text-green-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-green-900 dark:text-green-100">
              24%
            </h3>
            <p className="text-sm text-green-700 dark:text-green-300">
              Average price decrease this month
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 border-blue-200 dark:border-blue-800">
          <CardContent className="p-6 text-center">
            <Target className="h-8 w-8 text-blue-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              156
            </h3>
            <p className="text-sm text-blue-700 dark:text-blue-300">
              Products with best value ratings
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-900/20 dark:to-violet-900/20 border-purple-200 dark:border-purple-800">
          <CardContent className="p-6 text-center">
            <Calendar className="h-8 w-8 text-purple-600 mx-auto mb-3" />
            <h3 className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              Sept
            </h3>
            <p className="text-sm text-purple-700 dark:text-purple-300">
              Best month for electronics purchases
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Category Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {insights.map((insight, index) => {
          const volatility = getVolatilityLevel(insight.priceVolatility);
          const actionColor = getActionColor(insight.recommendedAction);
          const actionIcon = getActionIcon(insight.recommendedAction);

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{insight.categoryName}</span>
                  <Badge className={actionColor}>
                    {actionIcon}
                    <span className="ml-1 capitalize">
                      {insight.recommendedAction.replace("_", " ")}
                    </span>
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Best Buying Period */}
                <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Best Buying Period
                    </h4>
                    <Badge
                      variant="outline"
                      className="text-green-700 border-green-300"
                    >
                      {insight.bestBuyingPeriod.discountPercentage}% off
                    </Badge>
                  </div>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    <strong>{insight.bestBuyingPeriod.month}</strong> -{" "}
                    {insight.bestBuyingPeriod.reason}
                  </p>
                </div>

                {/* Price Range */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                    <h5 className="text-sm font-semibold text-blue-900 dark:text-blue-100 mb-1">
                      Price Range
                    </h5>
                    <p className="text-lg font-bold text-blue-700 dark:text-blue-300">
                      {formatPrice(insight.avgPriceRange.min)} -{" "}
                      {formatPrice(insight.avgPriceRange.max)}
                    </p>
                  </div>
                  <div className="p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-800">
                    <h5 className="text-sm font-semibold text-orange-900 dark:text-orange-100 mb-1">
                      Volatility
                    </h5>
                    <p className={`text-lg font-bold ${volatility.color}`}>
                      {volatility.level}
                    </p>
                  </div>
                </div>

                {/* Top Retailers */}
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                    <TrendingUp className="h-4 w-4" />
                    Top Competitive Retailers
                  </h4>
                  <div className="space-y-2">
                    {insight.topRetailers.map((retailer, idx) => (
                      <div
                        key={idx}
                        className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg"
                      >
                        <div>
                          <span className="font-medium">
                            {retailer.retailerName}
                          </span>
                          <div className="text-sm text-gray-600">
                            Score: {retailer.competitiveScore}/10
                          </div>
                        </div>
                        <Badge variant="secondary">
                          {retailer.avgDiscount}% avg discount
                        </Badge>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Action Button */}
                <Button
                  className="w-full"
                  variant={
                    insight.recommendedAction === "buy_now"
                      ? "default"
                      : "outline"
                  }
                >
                  {insight.recommendedAction === "buy_now" && "Shop Now"}
                  {insight.recommendedAction === "wait" && "Set Price Alert"}
                  {insight.recommendedAction === "monitor" && "Monitor Trends"}
                </Button>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Market Forecast */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            Market Forecast - Next 30 Days
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <AlertCircle className="h-8 w-8 text-green-600 mx-auto mb-2" />
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-1">
                Price Drops Expected
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Smartphones, tablets, and gaming accessories likely to see
                10-20% drops
              </p>
            </div>
            <div className="text-center p-4 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg border border-yellow-200 dark:border-yellow-800">
              <Clock className="h-8 w-8 text-yellow-600 mx-auto mb-2" />
              <h4 className="font-semibold text-yellow-900 dark:text-yellow-100 mb-1">
                Seasonal Trends
              </h4>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Back-to-school season driving laptop and accessory demand
              </p>
            </div>
            <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <TrendingUp className="h-8 w-8 text-blue-600 mx-auto mb-2" />
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-1">
                Best Categories
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Smart watches and audio equipment showing strong value
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
