"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calendar, 
  FilterX, 
  FilterIcon, 
  Store,
  Grid3X3
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface UserFiltersType {
  timeRange: "7d" | "30d" | "90d" | "1y";
  category: string;
  retailer: string;
}

interface UserFiltersProps {
  filters: UserFiltersType;
  onFiltersChange: (filters: UserFiltersType) => void;
  categories: Array<{ value: string; label: string }>;
  retailers: Array<{ value: string; label: string }>;
  loading: boolean;
}

export function UserFilters({
  filters,
  onFiltersChange,
  categories,
  retailers,
  loading,
}: UserFiltersProps) {
  const timeRangeOptions = [
    { value: "7d", label: "Last 7 Days" },
    { value: "30d", label: "Last 30 Days" },
    { value: "90d", label: "Last 3 Months" },
    { value: "1y", label: "Last Year" },
  ];

  const handleFilterChange = (
    key: keyof UserFiltersType,
    value: string
  ) => {
    onFiltersChange({
      ...filters,
      [key]: value,
    });
  };

  const handleResetFilters = () => {
    onFiltersChange({
      timeRange: "30d",
      category: "all",
      retailer: "all",
    });
  };

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="py-4">
          <div className="flex flex-wrap gap-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-40" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm font-medium">
            <FilterIcon className="h-4 w-4" />
            Customize Your View
          </CardTitle>
          {(filters.timeRange !== "30d" || 
            filters.category !== "all" || 
            filters.retailer !== "all") && (
            <Badge 
              variant="outline" 
              className="text-xs cursor-pointer flex items-center gap-1"
              onClick={handleResetFilters}
            >
              <FilterX className="h-3 w-3" />
              Reset Filters
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent>
        <div className="flex flex-wrap gap-4">
          {/* Time Range Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Calendar className="h-3 w-3" />
              Time Period
            </label>
            <Select
              value={filters.timeRange}
              onValueChange={(value) =>
                handleFilterChange(
                  "timeRange",
                  value as UserFiltersType["timeRange"]
                )
              }
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
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
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Grid3X3 className="h-3 w-3" />
              Category
            </label>
            <Select
              value={filters.category}
              onValueChange={(value) => handleFilterChange("category", value)}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {categories.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Retailer Filter */}
          <div className="space-y-2">
            <label className="text-xs text-muted-foreground flex items-center gap-1">
              <Store className="h-3 w-3" />
              Retailer
            </label>
            <Select
              value={filters.retailer}
              onValueChange={(value) => handleFilterChange("retailer", value)}
            >
              <SelectTrigger className="w-[160px] h-9">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {retailers.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Active Filters Display */}
        <div className="flex flex-wrap gap-2 mt-4">
          {(filters.timeRange !== "30d" || 
            filters.category !== "all" || 
            filters.retailer !== "all") && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <BarChart3 className="h-3 w-3" />
              <span>Currently viewing:</span>
            </div>
          )}
          
          {filters.timeRange !== "30d" && (
            <Badge variant="secondary" className="text-xs">
              {
                timeRangeOptions.find((opt) => opt.value === filters.timeRange)
                  ?.label
              }
            </Badge>
          )}
          {filters.category !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {
                categories.find((opt) => opt.value === filters.category)
                  ?.label
              }
            </Badge>
          )}
          {filters.retailer !== "all" && (
            <Badge variant="secondary" className="text-xs">
              {
                retailers.find((opt) => opt.value === filters.retailer)
                  ?.label
              }
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
}