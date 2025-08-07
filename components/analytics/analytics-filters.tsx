"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Filter,
  Calendar,
  Grid3X3,
  Store,
  BarChart3,
  RefreshCw,
  Download,
} from "lucide-react";
import { AnalyticsFilters as AnalyticsFiltersType } from "@/lib/types/analytics";

interface AnalyticsFiltersProps {
  filters: AnalyticsFiltersType;
  onFiltersChange: (filters: AnalyticsFiltersType) => void;
  loading: boolean;
}

export function AnalyticsFilters({
  filters,
  onFiltersChange,
  loading,
}: AnalyticsFiltersProps) {
  const timeRangeOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 3 Months" },
    { value: "1y", label: "Last Year" },
  ];

  const categoryOptions = [
    { value: "all", label: "All Categories" },
    { value: "smartphones", label: "Smartphones" },
    { value: "laptops", label: "Laptops" },
    { value: "smart-watches", label: "Smart Watches" },
    { value: "gaming", label: "Gaming" },
    { value: "audio", label: "Audio" },
    { value: "tablets", label: "Tablets" },
    { value: "accessories", label: "Accessories" },
  ];

  const retailerOptions = [
    { value: "all", label: "All Retailers" },
    { value: "techmart", label: "TechMart" },
    { value: "electrohub", label: "ElectroHub" },
    { value: "digitalworld", label: "DigitalWorld" },
    { value: "smartbuy", label: "SmartBuy" },
    { value: "gadgetzone", label: "GadgetZone" },
  ];

  const metricOptions = [
    { value: "price_changes", label: "Price Changes" },
    { value: "volatility", label: "Volatility" },
    { value: "anomalies", label: "Anomalies" },
    { value: "market_share", label: "Market Share" },
  ];

  const handleFilterChange = (
    key: keyof AnalyticsFiltersType,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleRefresh = () => {
    window.location.reload();
  };

  const handleExport = () => {
    // Mock export functionality
    const data = {
      filters,
      exportDate: new Date().toISOString(),
      reportType: "analytics_summary",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `analytics-report-${
      new Date().toISOString().split("T")[0]
    }.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Filter className="h-5 w-5" />
            Analytics Filters
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs">
              Real-time
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center gap-2"
            >
              <RefreshCw
                className={`h-4 w-4 ${loading ? "animate-spin" : ""}`}
              />
              Refresh
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={handleExport}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Time Range Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Time Range
              </label>
              <Select
                value={filters.timeRange}
                onValueChange={(value) =>
                  handleFilterChange(
                    "timeRange",
                    value as AnalyticsFiltersType["timeRange"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select time range" />
                </SelectTrigger>
                <SelectContent>
                  {timeRangeOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Category Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Grid3X3 className="h-4 w-4 text-purple-600" />
                Category
              </label>
              <Select
                value={filters.category}
                onValueChange={(value) => handleFilterChange("category", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categoryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Retailer Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <Store className="h-4 w-4 text-green-600" />
                Retailer
              </label>
              <Select
                value={filters.retailer}
                onValueChange={(value) => handleFilterChange("retailer", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select retailer" />
                </SelectTrigger>
                <SelectContent>
                  {retailerOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Metric Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium flex items-center gap-2">
                <BarChart3 className="h-4 w-4 text-orange-600" />
                Primary Metric
              </label>
              <Select
                value={filters.metric}
                onValueChange={(value) =>
                  handleFilterChange(
                    "metric",
                    value as AnalyticsFiltersType["metric"]
                  )
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select metric" />
                </SelectTrigger>
                <SelectContent>
                  {metricOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4 pt-4 border-t">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {filters.timeRange !== "30d" && (
            <Badge variant="outline" className="text-xs">
              {
                timeRangeOptions.find((opt) => opt.value === filters.timeRange)
                  ?.label
              }
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="outline" className="text-xs">
              {
                categoryOptions.find((opt) => opt.value === filters.category)
                  ?.label
              }
            </Badge>
          )}
          {filters.retailer !== "all" && (
            <Badge variant="outline" className="text-xs">
              {
                retailerOptions.find((opt) => opt.value === filters.retailer)
                  ?.label
              }
            </Badge>
          )}
          {filters.metric !== "price_changes" && (
            <Badge variant="outline" className="text-xs">
              {metricOptions.find((opt) => opt.value === filters.metric)?.label}
            </Badge>
          )}
        </div>

        {/* Filter Summary */}
        <div className="mt-3 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
          <p className="text-sm text-muted-foreground">
            Analyzing{" "}
            <strong>
              {filters.category === "all"
                ? "all categories"
                : categoryOptions.find((opt) => opt.value === filters.category)
                    ?.label}
            </strong>{" "}
            from{" "}
            <strong>
              {filters.retailer === "all"
                ? "all retailers"
                : retailerOptions.find((opt) => opt.value === filters.retailer)
                    ?.label}
            </strong>{" "}
            over the{" "}
            <strong>
              {timeRangeOptions
                .find((opt) => opt.value === filters.timeRange)
                ?.label.toLowerCase()}
            </strong>{" "}
            focusing on{" "}
            <strong>
              {metricOptions
                .find((opt) => opt.value === filters.metric)
                ?.label.toLowerCase()}
            </strong>
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
