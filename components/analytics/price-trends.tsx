"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { TrendingDown, TrendingUp, Calendar, AlertCircle } from "lucide-react";
import { formatSLCurrency } from "@/lib/utils";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export interface PriceHistoryPoint {
  date: string;
  avgPrice: number;
  lowestPrice: number;
  priceDrops: number;
  isGoodTimeToBuy: boolean;
}

interface PriceTrendsProps {
  priceHistory: PriceHistoryPoint[];
  categoryName: string;
  loading: boolean;
  bestTimeToBuy?: {
    recommendation: string;
    confidence: number;
  };
}

export function PriceTrends({
  priceHistory,
  categoryName,
  loading,
  bestTimeToBuy,
}: PriceTrendsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <Skeleton className="h-64 w-full" />
        </CardContent>
      </Card>
    );
  }

  // Format helpers
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const formatPrice = (price: number) => {
    // Format the price as Sri Lankan Rupees
    return formatSLCurrency(price);
  };

  // Find the max drop (for scaling the bars)
  const maxDrop = Math.max(...priceHistory.map((point) => point.priceDrops));

  // Calculate price change percentage
  const calculatePriceChange = () => {
    if (priceHistory.length < 2) return 0;

    const firstPrice = priceHistory[0].avgPrice;
    const lastPrice = priceHistory[priceHistory.length - 1].avgPrice;

    return ((lastPrice - firstPrice) / firstPrice) * 100;
  };

  const priceChange = calculatePriceChange();
  const isPriceDown = priceChange < 0;

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">
          Price Trends{" "}
          <span className="font-normal text-muted-foreground">
            {categoryName && `for ${categoryName}`}
          </span>
        </CardTitle>
        <div className="flex items-center gap-2">
          <Badge
            variant={isPriceDown ? "default" : "destructive"}
            className="flex items-center gap-1"
          >
            {isPriceDown ? (
              <TrendingDown className="h-3 w-3" />
            ) : (
              <TrendingUp className="h-3 w-3" />
            )}
            {Math.abs(priceChange).toFixed(1)}%
          </Badge>
          <Badge variant="outline">
            <Calendar className="h-3 w-3 mr-1" />
            30 Days
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceHistory}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.2} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
                tick={{ fontSize: 10 }}
                tickMargin={8}
                tickCount={5}
                minTickGap={15}
              />
              <YAxis
                yAxisId="left"
                tickFormatter={formatPrice}
                className="text-xs"
                tick={{ fontSize: 10 }}
                tickMargin={8}
                width={60}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value}`}
                domain={[0, maxDrop * 1.2]}
                hide
              />
              <Tooltip
                formatter={(value: number, name: string) => {
                  if (name === "avgPrice")
                    return [formatPrice(value), "Average Price"];
                  if (name === "lowestPrice")
                    return [formatPrice(value), "Lowest Price"];
                  if (name === "priceDrops")
                    return [value, "Number of Price Drops"];
                  return [value, name];
                }}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPrice"
                stroke="#3B82F6"
                fillOpacity={1}
                fill="url(#priceGradient)"
                strokeWidth={2}
                yAxisId="left"
              />
              <Area
                type="monotone"
                dataKey="lowestPrice"
                stroke="#10B981"
                fillOpacity={0}
                strokeDasharray="5 5"
                strokeWidth={2}
                yAxisId="left"
              />
              <Bar
                dataKey="priceDrops"
                fill="#F59E0B"
                yAxisId="right"
                radius={[4, 4, 0, 0]}
                fillOpacity={0.6}
                barSize={20}
                name="Price Drops"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {bestTimeToBuy && (
          <div className="mt-6 p-4 bg-blue-50 border border-blue-100 rounded-md flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
            <div>
              <div className="font-medium text-sm text-blue-800">
                Best Time to Buy
              </div>
              <p className="text-sm text-blue-700">
                {bestTimeToBuy.recommendation}
                {bestTimeToBuy.confidence > 0 && (
                  <span className="text-xs text-blue-600 ml-2">
                    Confidence: {bestTimeToBuy.confidence}%
                  </span>
                )}
              </p>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-4 mt-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
            <span>Average Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 border-2 border-green-500 rounded-full"></div>
            <span>Lowest Price</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
            <span>Price Drops</span>
          </div>
          {priceHistory.some((point) => point.isGoodTimeToBuy) && (
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span>Good Time to Buy</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
