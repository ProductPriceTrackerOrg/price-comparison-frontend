"use client";

import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  BarChart3,
  TrendingUp,
  Activity,
  PieChart,
  Zap,
  Globe,
} from "lucide-react";

export default function AnalyticsLoading() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb Loading */}
          <div className="mb-6">
            <Skeleton className="h-4 w-32" />
          </div>

          {/* Page Header Loading */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <Skeleton className="h-8 w-64 mb-2" />
              <Skeleton className="h-5 w-96" />
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline" className="text-sm">
                <Activity className="h-4 w-4 mr-2" />
                Loading...
              </Badge>
              <Badge variant="secondary" className="text-sm">
                <Globe className="h-4 w-4 mr-2" />
                47 Retailers
              </Badge>
            </div>
          </div>

          {/* Filters Loading */}
          <Card className="mb-6">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-40" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-20" />
                  <Skeleton className="h-8 w-24" />
                  <Skeleton className="h-8 w-20" />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div key={i} className="space-y-2">
                    <Skeleton className="h-4 w-16" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Tabs Loading */}
          <div className="space-y-6">
            <div className="grid grid-cols-4 gap-2 p-1 bg-muted rounded-lg">
              <div className="flex items-center justify-center gap-2 px-3 py-2 bg-background rounded-md shadow-sm">
                <BarChart3 className="h-4 w-4" />
                <span className="text-sm font-medium">Overview</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm">Price Trends</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <PieChart className="h-4 w-4" />
                <span className="text-sm">Categories</span>
              </div>
              <div className="flex items-center justify-center gap-2 px-3 py-2">
                <Zap className="h-4 w-4" />
                <span className="text-sm">Market Insights</span>
              </div>
            </div>

            {/* Overview Content Loading */}
            <div className="space-y-6">
              {/* Main Stats Grid Loading */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {Array.from({ length: 8 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                      <Skeleton className="h-4 w-20" />
                      <Skeleton className="h-8 w-8 rounded-lg" />
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-baseline space-x-2">
                        <Skeleton className="h-8 w-16" />
                        <Skeleton className="h-4 w-12" />
                      </div>
                      <Skeleton className="h-3 w-24 mt-1" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Anomalies Insights Loading */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, i) => (
                  <Card key={i}>
                    <CardHeader className="pb-2">
                      <Skeleton className="h-5 w-32" />
                    </CardHeader>
                    <CardContent>
                      <Skeleton className="h-8 w-12 mb-2" />
                      <Skeleton className="h-3 w-40" />
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Market Summary Loading */}
              <Card>
                <CardHeader>
                  <Skeleton className="h-6 w-40" />
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {Array.from({ length: 2 }).map((_, i) => (
                      <div key={i} className="p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center justify-between">
                          <div className="space-y-2">
                            <Skeleton className="h-5 w-24" />
                            <Skeleton className="h-4 w-32" />
                          </div>
                          <Skeleton className="h-8 w-8" />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="border-t pt-4">
                    <Skeleton className="h-3 w-48" />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Loading Message */}
          <div className="text-center mt-8">
            <div className="inline-flex items-center px-4 py-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-3"></div>
              <span className="text-sm text-blue-700 dark:text-blue-300">
                Loading analytics data from 47 retailers...
              </span>
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
