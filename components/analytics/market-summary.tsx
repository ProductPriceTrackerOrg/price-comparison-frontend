"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BarChart3, PieChart, Activity, Tag, ShoppingBag } from "lucide-react";
import { formatSLCurrency } from "@/lib/utils";
import {
  PieChart as RechartsChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

export interface MarketSummary {
  totalProducts: number;
  totalShops: number;
  averagePriceChange: number; // percentage
  priceDropPercentage: number; // percentage of products with price drops
  bestBuyingScore: number; // 0-100 rating
  categoryDistribution: Array<{
    name: string;
    value: number;
    color: string;
  }>;
}

interface MarketSummaryProps {
  summary: MarketSummary;
  loading: boolean;
}

export function MarketSummary({ summary, loading }: MarketSummaryProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatNumber = (num: number) => {
    // For product counts and other non-currency values
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num.toString();
  };
  
  const formatCurrency = (amount: number) => {
    // For price values, format as Sri Lankan Rupees
    return formatSLCurrency(amount);
  };

  const getBuyingScoreText = () => {
    if (summary.bestBuyingScore >= 70) return "Great time to buy";
    if (summary.bestBuyingScore >= 50) return "Good time to buy";
    if (summary.bestBuyingScore >= 30) return "Average conditions";
    return "Consider waiting";
  };

  const getBuyingScoreColor = () => {
    if (summary.bestBuyingScore >= 70) return "text-green-600";
    if (summary.bestBuyingScore >= 50) return "text-blue-600";
    if (summary.bestBuyingScore >= 30) return "text-amber-600";
    return "text-red-600";
  };

  const getPriceChangeIndicator = () => {
    if (summary.averagePriceChange <= -5) return "Significant price drops";
    if (summary.averagePriceChange < 0) return "Moderate price drops";
    if (summary.averagePriceChange < 5) return "Slight price increases";
    return "Significant price increases";
  };

  const getPriceChangeColor = () => {
    if (summary.averagePriceChange <= -5) return "text-green-600";
    if (summary.averagePriceChange < 0) return "text-green-600";
    if (summary.averagePriceChange < 5) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Market Overview</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Activity className="h-3 w-3" />
          Real-time Data
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Left Column: Key Stats */}
          <div className="space-y-4">
            <h3 className="text-sm font-medium text-muted-foreground">
              Market Stats
            </h3>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 text-blue-500" />
                <span className="text-sm">Total Products</span>
              </div>
              <span className="font-medium">
                {formatNumber(summary.totalProducts)}
              </span>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-purple-500" />
                <span className="text-sm">Products on Sale</span>
              </div>
              <Badge variant="secondary">
                {summary.priceDropPercentage.toFixed(1)}%
              </Badge>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-amber-500" />
                <span className="text-sm">Price Trend</span>
              </div>
              <div
                className={`font-medium flex items-center gap-1 ${getPriceChangeColor()}`}
              >
                {summary.averagePriceChange < 0 ? (
                  <Activity className="h-4 w-4" />
                ) : (
                  <Activity className="h-4 w-4" />
                )}
                {Math.abs(summary.averagePriceChange).toFixed(1)}%
              </div>
            </div>

            <div className="pt-2 border-t">
              <div className="text-xs text-muted-foreground">
                Market Condition
              </div>
              <div className={`font-medium ${getBuyingScoreColor()}`}>
                {getBuyingScoreText()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                {getPriceChangeIndicator()} across monitored products
              </div>
            </div>
          </div>

          {/* Center Column: Category Distribution */}
          <div>
            <h3 className="text-sm font-medium text-muted-foreground mb-4">
              Category Distribution
            </h3>
            <div className="h-48">
              <ResponsiveContainer width="100%" height="100%">
                <RechartsChart>
                  <Pie
                    data={summary.categoryDistribution}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={1}
                    dataKey="value"
                    // Remove the label to prevent overlapping
                    label={false}
                    labelLine={false}
                  >
                    {summary.categoryDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value: number, name: string) => [
                      `${value.toLocaleString()} products`,
                      name,
                    ]}
                    contentStyle={{
                      backgroundColor: "white",
                      border: "1px solid #e5e7eb",
                      borderRadius: "8px",
                    }}
                  />
                </RechartsChart>
              </ResponsiveContainer>
            </div>

            {/* Legend for pie chart to replace labels */}
            <div className="mt-2 grid grid-cols-2 gap-x-4 gap-y-1 text-xs">
              {summary.categoryDistribution.map((item, index) => (
                <div key={index} className="flex items-center gap-1">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: item.color }}
                  />
                  <span>
                    {item.name} (
                    {(
                      (item.value /
                        summary.categoryDistribution.reduce(
                          (sum, cat) => sum + cat.value,
                          0
                        )) *
                      100
                    ).toFixed(0)}
                    %)
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column: Buying Score */}
          <div className="flex flex-col items-center justify-center">
            <h3 className="text-sm font-medium text-muted-foreground mb-2">
              Current Buying Conditions
            </h3>

            <div className="relative">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#e5e7eb"
                  strokeWidth="12"
                />
                <circle
                  cx="60"
                  cy="60"
                  r="54"
                  fill="none"
                  stroke="#10B981"
                  strokeWidth="12"
                  strokeDasharray="339.3"
                  strokeDashoffset={
                    339.3 - (339.3 * summary.bestBuyingScore) / 100
                  }
                  transform="rotate(-90 60 60)"
                  className="transition-all duration-1000 ease-in-out"
                  strokeLinecap="round"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center flex-col">
                <div className={`text-3xl font-bold ${getBuyingScoreColor()}`}>
                  {summary.bestBuyingScore}
                </div>
                <div className="text-xs text-muted-foreground">
                  Buying Score
                </div>
              </div>
            </div>

            <div className="text-center mt-4">
              <div className={`font-medium ${getBuyingScoreColor()}`}>
                {getBuyingScoreText()}
              </div>
              <div className="text-xs text-muted-foreground mt-1">
                Based on price trends & availability
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
