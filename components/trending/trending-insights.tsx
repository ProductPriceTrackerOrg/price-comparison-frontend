"use client";

import { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  TrendingUp,
  TrendingDown,
  Eye,
  Heart,
  ShoppingCart,
  Clock,
  Award,
  Zap,
  BarChart3,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Star,
  Flame,
  Target,
} from "lucide-react";

const trendingCategories = [
  {
    name: "Smartphones",
    percentage: 35,
    change: "+5.2%",
    trend: "up",
    products: 847,
    icon: "📱",
  },
  {
    name: "Laptops",
    percentage: 22,
    change: "+2.1%",
    trend: "up",
    products: 532,
    icon: "💻",
  },
  {
    name: "Smartwatches",
    percentage: 18,
    change: "-1.3%",
    trend: "down",
    products: 423,
    icon: "⌚",
  },
  {
    name: "Headphones",
    percentage: 15,
    change: "+8.7%",
    trend: "up",
    products: 365,
    icon: "🎧",
  },
  {
    name: "Tablets",
    percentage: 10,
    change: "+1.5%",
    trend: "up",
    products: 241,
    icon: "📋",
  },
];

const trendingBrands = [
  { name: "Apple", score: 94, change: "up", products: 23 },
  { name: "Samsung", score: 89, change: "up", products: 31 },
  { name: "Google", score: 76, change: "down", products: 12 },
  { name: "Sony", score: 72, change: "up", products: 18 },
  { name: "Microsoft", score: 68, change: "neutral", products: 9 },
];

const trendingMetrics = [
  {
    title: "Peak Activity Hours",
    value: "2-4 PM, 8-10 PM",
    description: "When products gain most traction",
    icon: Clock,
    color: "text-blue-600",
  },
  {
    title: "Avg Trending Lifecycle",
    value: "4.2 days",
    description: "How long products stay trending",
    icon: Target,
    color: "text-green-600",
  },
  {
    title: "New Entries Today",
    value: "18 products",
    description: "Fresh trending products",
    icon: Zap,
    color: "text-orange-600",
  },
  {
    title: "User Engagement",
    value: "156% higher",
    description: "vs non-trending products",
    icon: Users,
    color: "text-purple-600",
  },
];

const realtimeActivity = [
  {
    time: "2 min ago",
    activity: "iPhone 15 Pro climbed to #1",
    type: "position",
  },
  {
    time: "5 min ago",
    activity: "Galaxy Watch 6 gained 1.2K views",
    type: "views",
  },
  {
    time: "8 min ago",
    activity: "MacBook Air dropped 2 positions",
    type: "position",
  },
  {
    time: "12 min ago",
    activity: "Sony WH-1000XM5 entered trending",
    type: "new",
  },
  {
    time: "15 min ago",
    activity: "Surface Pro gained 500 favorites",
    type: "favorites",
  },
];

export function TrendingInsights() {
  const [selectedTimeframe, setSelectedTimeframe] = useState("24h");

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "position":
        return <TrendingUp className="h-3 w-3 text-blue-500" />;
      case "views":
        return <Eye className="h-3 w-3 text-green-500" />;
      case "favorites":
        return <Heart className="h-3 w-3 text-red-500" />;
      case "new":
        return <Zap className="h-3 w-3 text-orange-500" />;
      default:
        return <BarChart3 className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case "up":
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {trendingMetrics.map((metric, index) => (
          <Card key={index} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-center justify-between mb-2">
                <metric.icon className={`h-5 w-5 ${metric.color}`} />
                <Badge variant="outline" className="text-xs">
                  Live
                </Badge>
              </div>
              <div className="text-lg font-bold text-gray-900 mb-1">
                {metric.value}
              </div>
              <div className="text-xs text-gray-600">{metric.description}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        {/* Category Breakdown */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-blue-600" />
              Category Distribution
            </CardTitle>
            <CardDescription>Trending products by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingCategories.map((category, index) => (
              <div key={index} className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    {getTrendIcon(category.trend)}
                    <span
                      className={`text-xs ${
                        category.trend === "up"
                          ? "text-green-600"
                          : category.trend === "down"
                          ? "text-red-600"
                          : "text-gray-600"
                      }`}
                    >
                      {category.change}
                    </span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={category.percentage} className="flex-1" />
                  <span className="text-sm font-medium text-gray-600 min-w-[3rem]">
                    {category.percentage}%
                  </span>
                </div>
                <div className="text-xs text-gray-500">
                  {category.products} trending products
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Brand Performance */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-purple-600" />
              Top Brands
            </CardTitle>
            <CardDescription>Brand performance in trending</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {trendingBrands.map((brand, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white text-xs font-bold">
                    {brand.name.charAt(0)}
                  </div>
                  <div>
                    <div className="font-semibold text-sm">{brand.name}</div>
                    <div className="text-xs text-gray-500">
                      {brand.products} products
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center gap-1 text-sm font-medium">
                    <span>{brand.score}</span>
                    {getTrendIcon(brand.change)}
                  </div>
                  <div className="text-xs text-gray-500">Trend Score</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Real-time Activity */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Flame className="h-5 w-5 text-red-500 animate-pulse" />
              Live Activity
            </CardTitle>
            <CardDescription>Real-time trending updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {realtimeActivity.map((activity, index) => (
              <div
                key={index}
                className="flex items-start gap-3 p-2 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <div className="mt-1">{getActivityIcon(activity.type)}</div>
                <div className="flex-1 min-w-0">
                  <div className="text-sm text-gray-900">
                    {activity.activity}
                  </div>
                  <div className="text-xs text-gray-500">{activity.time}</div>
                </div>
              </div>
            ))}
            <Button variant="outline" size="sm" className="w-full">
              View All Activity
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Trending Patterns */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-green-600" />
            Trending Patterns & Insights
          </CardTitle>
          <CardDescription>
            Key observations about current trending behavior
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-blue-50 to-blue-100">
              <div className="text-2xl font-bold text-blue-600 mb-2">35%</div>
              <div className="text-sm font-medium text-blue-900 mb-1">
                Price Sensitivity
              </div>
              <div className="text-xs text-blue-700">
                Products with 10%+ discounts trend faster
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-green-50 to-green-100">
              <div className="text-2xl font-bold text-green-600 mb-2">4.8x</div>
              <div className="text-sm font-medium text-green-900 mb-1">
                Engagement Boost
              </div>
              <div className="text-xs text-green-700">
                Trending products get 4.8x more views
              </div>
            </div>

            <div className="text-center p-4 rounded-lg bg-gradient-to-br from-orange-50 to-orange-100">
              <div className="text-2xl font-bold text-orange-600 mb-2">72h</div>
              <div className="text-sm font-medium text-orange-900 mb-1">
                Peak Window
              </div>
              <div className="text-xs text-orange-700">
                Most activity happens in first 72 hours
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
