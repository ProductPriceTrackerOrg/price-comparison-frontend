"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Store,
  Target,
} from "lucide-react";
import {
  PriceTrendData,
  CategoryPerformance,
  RetailerInsights,
} from "@/lib/types/analytics";

interface AnalyticsChartsProps {
  priceTrends: PriceTrendData[];
  categoryPerformance: CategoryPerformance[];
  retailerInsights: RetailerInsights[];
  loading: boolean;
  viewMode?: "all" | "trends" | "categories" | "retailers";
}

export function AnalyticsCharts({
  priceTrends,
  categoryPerformance,
  retailerInsights,
  loading,
  viewMode = "all",
}: AnalyticsChartsProps) {
  if (loading) {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i}>
            <CardHeader>
              <Skeleton className="h-5 w-32" />
            </CardHeader>
            <CardContent>
              <Skeleton className="h-64 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  const formatCurrency = (value: number) => `Rs ${value.toLocaleString()}`;
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const COLORS = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#06B6D4",
  ];

  const PriceTrendsChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-blue-600" />
          Price Trend Analysis
          <Badge variant="outline" className="ml-2">
            Last 30 Days
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={priceTrends}>
              <defs>
                <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3B82F6" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#3B82F6" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(2)}%`,
                  "Avg Price Change",
                ]}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Area
                type="monotone"
                dataKey="avgPriceChange"
                stroke="#3B82F6"
                strokeWidth={2}
                fill="url(#priceGradient)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const VolatilityChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Activity className="h-5 w-5 text-orange-600" />
          Market Volatility
          <Badge variant="secondary" className="ml-2">
            Real-time
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={priceTrends}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="date"
                tickFormatter={formatDate}
                className="text-xs"
              />
              <YAxis
                tickFormatter={(value) => value.toFixed(2)}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => [
                  value.toFixed(3),
                  "Volatility Index",
                ]}
                labelFormatter={(label) => `Date: ${formatDate(label)}`}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="volatility"
                stroke="#F59E0B"
                strokeWidth={3}
                dot={{ fill: "#F59E0B", strokeWidth: 2, r: 4 }}
                activeDot={{ r: 6, stroke: "#F59E0B", strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const CategoryPerformanceChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BarChart3 className="h-5 w-5 text-purple-600" />
          Category Performance
          <Badge variant="outline" className="ml-2">
            Top 5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={categoryPerformance} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                type="number"
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <YAxis
                type="category"
                dataKey="categoryName"
                className="text-xs"
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Avg Price Change",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="avgPriceChange"
                fill="#8B5CF6"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const CategoryDistributionChart = () => {
    const pieData = categoryPerformance.map((category, index) => ({
      name: category.categoryName,
      value: category.totalProducts,
      fill: COLORS[index % COLORS.length],
    }));

    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <PieChartIcon className="h-5 w-5 text-green-600" />
            Product Distribution
            <Badge variant="secondary" className="ml-2">
              By Category
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent ?? 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [
                    value.toLocaleString(),
                    "Products",
                  ]}
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid #e5e7eb",
                    borderRadius: "8px",
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    );
  };

  const RetailerComparisonChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Store className="h-5 w-5 text-blue-600" />
          Retailer Market Share
          <Badge variant="outline" className="ml-2">
            Top 5
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retailerInsights}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis
                dataKey="retailerName"
                className="text-xs"
                angle={-45}
                textAnchor="end"
                height={60}
              />
              <YAxis
                tickFormatter={(value) => `${value}%`}
                className="text-xs"
              />
              <Tooltip
                formatter={(value: number) => [
                  `${value.toFixed(1)}%`,
                  "Market Share",
                ]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar dataKey="marketShare" fill="#10B981" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  const CompetitiveRatingChart = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="h-5 w-5 text-red-600" />
          Competitive Rating
          <Badge variant="secondary" className="ml-2">
            0-10 Scale
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={retailerInsights} layout="horizontal">
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis type="number" domain={[0, 10]} className="text-xs" />
              <YAxis
                type="category"
                dataKey="retailerName"
                className="text-xs"
                width={80}
              />
              <Tooltip
                formatter={(value: number) => [value.toFixed(1), "Rating"]}
                contentStyle={{
                  backgroundColor: "white",
                  border: "1px solid #e5e7eb",
                  borderRadius: "8px",
                }}
              />
              <Bar
                dataKey="competitiveRating"
                fill="#EF4444"
                radius={[0, 4, 4, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );

  // Render based on viewMode
  if (viewMode === "categories") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPerformanceChart />
        <CategoryDistributionChart />
      </div>
    );
  }

  if (viewMode === "trends") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceTrendsChart />
        <VolatilityChart />
      </div>
    );
  }

  if (viewMode === "retailers") {
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetailerComparisonChart />
        <CompetitiveRatingChart />
      </div>
    );
  }

  // Default: show all charts
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PriceTrendsChart />
        <VolatilityChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CategoryPerformanceChart />
        <CategoryDistributionChart />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <RetailerComparisonChart />
        <CompetitiveRatingChart />
      </div>
    </div>
  );
}
