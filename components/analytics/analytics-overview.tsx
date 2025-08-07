"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Store, 
  Activity,
  AlertTriangle,
  BarChart3,
  Target,
  Zap
} from "lucide-react";
import { MarketOverview, MarketAnomalies } from "@/lib/types/analytics";

interface AnalyticsOverviewProps {
  overview: MarketOverview | null;
  anomalies: MarketAnomalies | null;
  loading: boolean;
}

export function AnalyticsOverview({ overview, anomalies, loading }: AnalyticsOverviewProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 8 }).map((_, i) => (
          <Card key={i}>
            <CardHeader className="pb-2">
              <Skeleton className="h-4 w-24" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-8 w-16 mb-2" />
              <Skeleton className="h-3 w-20" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!overview || !anomalies) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <AlertTriangle className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
          <p className="text-gray-600">Failed to load market overview data</p>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };

  const formatPercentage = (num: number) => {
    const sign = num >= 0 ? "+" : "";
    return `${sign}${num.toFixed(1)}%`;
  };

  const overviewCards = [
    {
      title: "Total Products",
      value: formatNumber(overview.totalProducts),
      subtitle: "across all retailers",
      icon: Package,
      color: "blue",
      trend: null
    },
    {
      title: "Active Retailers",
      value: overview.totalRetailers.toString(),
      subtitle: "monitored platforms",
      icon: Store,
      color: "green",
      trend: null
    },
    {
      title: "Product Categories",
      value: overview.totalCategories.toString(),
      subtitle: "tracked categories",
      icon: BarChart3,
      color: "purple",
      trend: null
    },
    {
      title: "Market Volatility",
      value: `${(overview.marketVolatility * 100).toFixed(1)}%`,
      subtitle: "current volatility index",
      icon: Activity,
      color: overview.marketVolatility > 0.3 ? "red" : "orange",
      trend: null
    },
    {
      title: "Price Drops",
      value: formatNumber(overview.totalPriceDrops),
      subtitle: "in selected period",
      icon: TrendingDown,
      color: "green",
      trend: "positive"
    },
    {
      title: "Price Increases",
      value: formatNumber(overview.totalPriceIncreases),
      subtitle: "in selected period",
      icon: TrendingUp,
      color: "red",
      trend: "negative"
    },
    {
      title: "Avg Price Change",
      value: formatPercentage(overview.averagePriceChange),
      subtitle: "market average",
      icon: Target,
      color: overview.averagePriceChange < 0 ? "green" : "red",
      trend: overview.averagePriceChange < 0 ? "positive" : "negative"
    },
    {
      title: "Market Anomalies",
      value: anomalies.totalAnomalies.toString(),
      subtitle: "detected patterns",
      icon: Zap,
      color: "yellow",
      trend: null
    }
  ];

  return (
    <div className="space-y-6">
      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewCards.map((card, index) => {
          const IconComponent = card.icon;
          const colorClasses = {
            blue: "text-blue-600 bg-blue-100 dark:bg-blue-900/20",
            green: "text-green-600 bg-green-100 dark:bg-green-900/20",
            purple: "text-purple-600 bg-purple-100 dark:bg-purple-900/20",
            red: "text-red-600 bg-red-100 dark:bg-red-900/20",
            orange: "text-orange-600 bg-orange-100 dark:bg-orange-900/20",
            yellow: "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20"
          };

          return (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-gray-600">
                  {card.title}
                </CardTitle>
                <div className={`p-2 rounded-lg ${colorClasses[card.color as keyof typeof colorClasses]}`}>
                  <IconComponent className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline space-x-2">
                  <div className="text-2xl font-bold">{card.value}</div>
                  {card.trend && (
                    <Badge 
                      variant={card.trend === "positive" ? "default" : "destructive"}
                      className="text-xs"
                    >
                      {card.trend === "positive" ? "Good" : "Watch"}
                    </Badge>
                  )}
                </div>
                <p className="text-xs text-muted-foreground">{card.subtitle}</p>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Anomalies Insights */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="border-yellow-200 bg-yellow-50/50 dark:bg-yellow-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-yellow-800 dark:text-yellow-200 flex items-center gap-2">
              <AlertTriangle className="h-4 w-4" />
              Significant Drops
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-900 dark:text-yellow-100">
              {anomalies.significantDrops}
            </div>
            <p className="text-xs text-yellow-700 dark:text-yellow-300">
              Major price reductions detected
            </p>
          </CardContent>
        </Card>

        <Card className="border-blue-200 bg-blue-50/50 dark:bg-blue-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-blue-800 dark:text-blue-200 flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Significant Increases
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
              {anomalies.significantIncreases}
            </div>
            <p className="text-xs text-blue-700 dark:text-blue-300">
              Notable price increases found
            </p>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50/50 dark:bg-purple-900/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-purple-800 dark:text-purple-200 flex items-center gap-2">
              <Activity className="h-4 w-4" />
              High Volatility
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
              {anomalies.highVolatilityProducts}
            </div>
            <p className="text-xs text-purple-700 dark:text-purple-300">
              Products with high price fluctuation
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Key Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Market Summary
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-green-900 dark:text-green-100">
                    Buyer's Market
                  </h4>
                  <p className="text-sm text-green-700 dark:text-green-300">
                    {Math.abs(overview.averagePriceChange).toFixed(1)}% average price decrease
                  </p>
                </div>
                <TrendingDown className="h-8 w-8 text-green-600" />
              </div>
            </div>

            <div className="p-4 bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100">
                    Top Category
                  </h4>
                  <p className="text-sm text-blue-700 dark:text-blue-300">
                    {anomalies.topAnomalyCategory} shows most activity
                  </p>
                </div>
                <BarChart3 className="h-8 w-8 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="text-xs text-muted-foreground border-t pt-4">
            Last updated: {new Date(overview.lastUpdated).toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
