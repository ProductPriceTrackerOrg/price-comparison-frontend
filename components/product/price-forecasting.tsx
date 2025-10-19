"use client";

import { useState, useEffect, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
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

import {
  PriceForecastModelInfo,
  PriceForecastResponse,
} from "@/lib/types/product";

interface PriceForecastingProps {
  productId: string;
  currentPrice?: number;
  days?: number;
}

interface ForecastDataPoint {
  date: string;
  predicted: number;
  upper: number;
  lower: number;
  isActual: boolean;
  confidence?: number | null;
}

export function PriceForecasting({
  productId,
  currentPrice,
  days = 7,
}: PriceForecastingProps) {
  const [forecastData, setForecastData] = useState<ForecastDataPoint[]>([]);
  const [modelInfo, setModelInfo] = useState<PriceForecastModelInfo | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchForecast = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/products/${productId}/price-forecast?days=${days}`,
          { signal: controller.signal }
        );

        if (response.status === 404) {
          setForecastData([]);
          setModelInfo(null);
          return;
        }

        if (!response.ok) {
          throw new Error(`Failed to fetch forecast: ${response.status}`);
        }

        const data: PriceForecastResponse = await response.json();
        const transformed = (data.forecasts || []).map((point, index) => ({
          date: point.date,
          predicted: point.predicted_price,
          upper: point.upper_bound ?? point.predicted_price,
          lower: point.lower_bound ?? point.predicted_price,
          isActual: index === 0,
          confidence: point.confidence ?? null,
        }));

        setForecastData(transformed);
        setModelInfo(data.model_info ?? null);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Error loading price forecast", err);
        setError("Unable to load price forecast right now. Please try again later.");
        setForecastData([]);
        setModelInfo(null);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchForecast();
    }

    return () => {
      controller.abort();
    };
  }, [productId, days]);

  const averageConfidence = useMemo(() => {
    const confidences = forecastData
      .map((point) => point.confidence)
      .filter((value): value is number => value !== null && value !== undefined);

    if (confidences.length === 0) {
      return null;
    }

    const sum = confidences.reduce((acc, value) => acc + value, 0);
    return Math.min(100, Math.max(0, sum / confidences.length));
  }, [forecastData]);

  const computedCurrentPrice = useMemo(() => {
    if (typeof currentPrice === "number") {
      return currentPrice;
    }
    if (forecastData.length > 0) {
      return forecastData[0].predicted;
    }
    return null;
  }, [currentPrice, forecastData]);

  const predictedPrice = forecastData.length
    ? forecastData[forecastData.length - 1].predicted
    : computedCurrentPrice ?? 0;

  const priceChange = computedCurrentPrice !== null ? predictedPrice - computedCurrentPrice : 0;
  const priceChangePercentage = computedCurrentPrice
    ? (priceChange / computedCurrentPrice) * 100
    : 0;

  const maxVolatility = useMemo(() => {
    if (forecastData.length === 0) {
      return 0;
    }
    return forecastData.reduce((maxVariance, point) => {
      const variance = Math.abs(point.upper - point.lower) / 2;
      return Math.max(maxVariance, variance);
    }, 0);
  }, [forecastData]);

  const formatCurrency = (value: number | null) => {
    if (value === null || Number.isNaN(value)) {
      return "N/A";
    }
    return `Rs ${value.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
  };
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
                {days} Days
              </Badge>
            </CardTitle>
            <div className="flex items-center space-x-4">
              <div className="text-sm text-muted-foreground">
                Next {days} days prediction powered by machine learning
              </div>
              <Badge variant="outline" className="text-xs">
                <Zap className="h-3 w-3 mr-1" />
                {averageConfidence !== null
                  ? `${averageConfidence.toFixed(0)}% Confidence`
                  : "Confidence N/A"}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2">
        {loading ? (
          <div className="py-10 text-center text-muted-foreground">
            Loading forecast data…
          </div>
        ) : error ? (
          <div className="py-10 text-center text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3" />
            {error}
          </div>
        ) : forecastData.length === 0 ? (
          <div className="py-10 text-center text-muted-foreground">
            <AlertTriangle className="h-10 w-10 mx-auto mb-3" />
            No forecast data available for this product yet.
          </div>
        ) : (
          <>
            {/* Forecast Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950/50 dark:to-blue-900/50 border-blue-200 dark:border-blue-800">
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-blue-900 dark:text-blue-100">
                    {formatCurrency(computedCurrentPrice)}
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
                    tickFormatter={(value) => `Rs ${value.toLocaleString()}`}
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
                      Our AI model predicts a {priceChange < 0 ? "gradual price decrease" : "gradual price increase"}{" "}
                      over the next {days} days, with potential {priceChange < 0 ? "savings" : "cost increase"} of up to {formatCurrency(Math.abs(priceChange))}.
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
                        ? "Consider waiting a few days to capture the predicted savings. Set an alert to lock in the drop."
                        : "Consider purchasing soon as prices are expected to trend upward. Current price remains competitive."}
                    </p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-purple-50 to-violet-50 dark:from-purple-950/20 dark:to-violet-950/20 rounded-lg border border-purple-200 dark:border-purple-800">
                  <Brain className="h-5 w-5 text-purple-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-purple-900 dark:text-purple-100">
                      Model Details
                    </p>
                    <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
                      {modelInfo
                        ? `Forecast generated by ${modelInfo.model_name}${modelInfo.model_version ? ` · v${modelInfo.model_version}` : ""}.`
                        : "Forecast generated by our latest machine learning model."}
                    </p>
                    {modelInfo?.last_trained ? (
                      <p className="text-xs text-purple-600 dark:text-purple-300 mt-1">
                        Last trained on {new Date(modelInfo.last_trained).toLocaleDateString()}
                      </p>
                    ) : null}
                  </div>
                </div>

                <div className="flex items-start space-x-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 rounded-lg border border-amber-200 dark:border-amber-800">
                  <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-amber-900 dark:text-amber-100">
                      Price Volatility
                    </p>
                    <p className="text-sm text-amber-700 dark:text-amber-300 mt-1">
                      Confidence bands indicate potential fluctuations of {formatCurrency(Math.abs(maxVolatility))} around the predicted trend.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
