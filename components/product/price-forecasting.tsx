"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart,
  ComposedChart,
} from "recharts";
import {
  TrendingUp,
  Brain,
  AlertTriangle,
  TrendingDown,
  Zap,
  Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface PriceForecastingProps {
  productId: string;
}

interface ForecastDataPoint {
  date: string;
  predicted: number;
  upper: number;
  lower: number;
  isActual: boolean;
}

export function PriceForecasting({ productId }: PriceForecastingProps) {
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);

  // Enhanced mock forecasting data with more points for smoother visualization
  const mockForecastData: ForecastDataPoint[] = [
    {
      date: "2024-03-27",
      predicted: 1199.99,
      upper: 1199.99,
      lower: 1199.99,
      isActual: true,
    },
    {
      date: "2024-03-28",
      predicted: 1195.99,
      upper: 1220.99,
      lower: 1170.99,
      isActual: false,
    },
    {
      date: "2024-03-29",
      predicted: 1189.99,
      upper: 1215.99,
      lower: 1163.99,
      isActual: false,
    },
    {
      date: "2024-03-30",
      predicted: 1185.99,
      upper: 1212.99,
      lower: 1158.99,
      isActual: false,
    },
    {
      date: "2024-03-31",
      predicted: 1179.99,
      upper: 1207.99,
      lower: 1151.99,
      isActual: false,
    },
    {
      date: "2024-04-01",
      predicted: 1175.99,
      upper: 1203.99,
      lower: 1147.99,
      isActual: false,
    },
    {
      date: "2024-04-02",
      predicted: 1169.99,
      upper: 1198.99,
      lower: 1140.99,
      isActual: false,
    },
    {
      date: "2024-04-03",
      predicted: 1165.99,
      upper: 1195.99,
      lower: 1135.99,
      isActual: false,
    },
    {
      date: "2024-04-04",
      predicted: 1160.99,
      upper: 1190.99,
      lower: 1130.99,
      isActual: false,
    },
    {
      date: "2024-04-05",
      predicted: 1158.99,
      upper: 1188.99,
      lower: 1128.99,
      isActual: false,
    },
    {
      date: "2024-04-06",
      predicted: 1155.99,
      upper: 1185.99,
      lower: 1125.99,
      isActual: false,
    },
  ];

  useEffect(() => {
    setForecastData(mockForecastData);
  }, [productId]);

  const currentPrice = 1199.99;
  const predictedPrice =
    forecastData[forecastData.length - 1]?.predicted || currentPrice;
  const priceChange = predictedPrice - currentPrice;
  const priceChangePercentage = (priceChange / currentPrice) * 100;
  const accuracy = 89.5; // Mock accuracy percentage

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <CardTitle className="flex items-center space-x-2 text-lg">
              <Brain className="h-5 w-5 text-purple-600" />
              <span>AI Price Forecasting</span>
              <Badge variant="secondary" className="ml-2">
                7 Days
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Next 7 days prediction powered by machine learning
              </div>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {accuracy}% Accuracy
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {/* Forecast Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                {formatCurrency(currentPrice)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Current Price
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950/50 dark:to-purple-900/50 border-purple-200 dark:border-purple-800">
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-900 dark:text-purple-100">
                {formatCurrency(predictedPrice)}
              </div>
              <div className="text-sm text-purple-700 dark:text-purple-300">
                Predicted Price
              </div>
            </CardContent>
          </Card>

          <Card
            className={`bg-gradient-to-br ${
              priceChange < 0
                ? "from-green-50 to-green-100 dark:from-green-950/50 dark:to-green-900/50 border-green-200 dark:border-green-800"
                : "from-red-50 to-red-100 dark:from-red-950/50 dark:to-red-900/50 border-red-200 dark:border-red-800"
            }`}
          >
            <CardContent className="p-4 text-center">
              <div
                className={`text-2xl font-bold flex items-center justify-center space-x-1 ${
                  priceChange < 0
                    ? "text-green-900 dark:text-green-100"
                    : "text-red-900 dark:text-red-100"
                }`}
              >
                {priceChange < 0 ? (
                  <TrendingDown className="h-5 w-5" />
                ) : (
                  <TrendingUp className="h-5 w-5" />
                )}
                <span>
                  {priceChange > 0 ? "+" : ""}
                  {priceChangePercentage.toFixed(2)}%
                </span>
              </div>
              <div
                className={`text-sm ${
                  priceChange < 0
                    ? "text-green-700 dark:text-green-300"
                    : "text-red-700 dark:text-red-300"
                }`}
              >
                Expected Change
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Forecast Chart */}
        <div className="h-80 w-full mb-6">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={forecastData}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="upperGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#8B5CF6" stopOpacity={0.2} />
                  <stop offset="100%" stopColor="#8B5CF6" stopOpacity={0.05} />
                </linearGradient>
                <linearGradient id="lowerGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#EC4899" stopOpacity={0.1} />
                  <stop offset="100%" stopColor="#EC4899" stopOpacity={0.02} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                className="stroke-muted-foreground/20"
              />
              <XAxis
                dataKey="date"
                className="text-muted-foreground text-xs"
                tickFormatter={formatDate}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                className="text-muted-foreground text-xs"
                tickFormatter={(value) => `$${value.toLocaleString()}`}
                axisLine={false}
                tickLine={false}
                domain={["dataMin - 20", "dataMax + 20"]}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "12px",
                  boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                  fontSize: "14px",
                }}
                formatter={(value: number, name: string) => {
                  const labels: { [key: string]: string } = {
                    predicted: "Predicted Price",
                    upper: "Upper Bound",
                    lower: "Lower Bound",
                  };
                  return [formatCurrency(value), labels[name] || name];
                }}
                labelFormatter={(label) =>
                  new Date(label).toLocaleDateString("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })
                }
              />
              <Area
                type="monotone"
                dataKey="upper"
                stroke="#8B5CF6"
                strokeWidth={1}
                fill="url(#upperGradient)"
                strokeDasharray="5 5"
              />
              <Area
                type="monotone"
                dataKey="lower"
                stroke="#EC4899"
                strokeWidth={1}
                fill="url(#lowerGradient)"
                strokeDasharray="5 5"
              />
              <Line
                type="monotone"
                dataKey="predicted"
                stroke="#8B5CF6"
                strokeWidth={3}
                dot={(props) => {
                  const { cx, cy, payload } = props;
                  return (
                    <circle
                      cx={cx}
                      cy={cy}
                      r={payload?.isActual ? 6 : 4}
                      fill={payload?.isActual ? "#3B82F6" : "#8B5CF6"}
                      stroke="white"
                      strokeWidth={2}
                    />
                  );
                }}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Enhanced AI Insights */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <h4 className="font-semibold text-lg">AI Market Insights</h4>
            <Badge variant="outline" className="text-xs">
              <Target className="h-3 w-3 mr-1" />
              Real-time Analysis
            </Badge>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
              {priceChange < 0 ? (
                <TrendingDown className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              ) : (
                <TrendingUp className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
              )}
              <div className="flex-1">
                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">
                  {priceChange < 0
                    ? "Price Drop Expected"
                    : "Price Increase Expected"}
                </p>
                <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                  Our AI model predicts a{" "}
                  {priceChange < 0
                    ? "gradual price decrease"
                    : "gradual price increase"}{" "}
                  over the next 7 days, with potential{" "}
                  {priceChange < 0 ? "savings" : "cost increase"} of up to{" "}
                  {formatCurrency(Math.abs(priceChange))}.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-950/20 dark:to-emerald-950/20 rounded-lg border border-green-200 dark:border-green-800">
              <Target className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-green-900 dark:text-green-100">
                  Optimal Purchase Time
                </p>
                <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  {priceChange < 0
                    ? "Consider waiting 3-4 days for optimal pricing. Set up price alerts to be notified when the price drops."
                    : "Consider purchasing soon as prices are expected to rise. Current price offers good value."}
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                  Market Confidence
                </p>
                <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                  High confidence prediction based on historical patterns,
                  seasonal trends, and market indicators.
                </p>
              </div>
            </div>

            <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
              <div className="flex-1">
                <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                  Price Volatility
                </p>
                <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                  Moderate volatility expected. Price may fluctuate within the
                  confidence bands shown in the chart.
                </p>
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
