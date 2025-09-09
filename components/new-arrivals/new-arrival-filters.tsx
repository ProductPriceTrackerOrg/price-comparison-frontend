"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Filter } from "lucide-react";
import { NewArrivalFilters as FilterType } from "@/lib/types/new-arrivals";
import { Category, Retailer } from "@/lib/types/price-drops";

interface FilterState {
  category: string;
  retailer: string;
  priceRange: number[];
  sortBy: FilterType["sortBy"];
  timeRange: FilterType["timeRange"];
  inStockOnly: boolean;
}

interface NewArrivalFiltersProps {
  filters: FilterState;
  setFilters: (filters: FilterState) => void;
  categories: Category[];
  retailers: Retailer[];
}

export function NewArrivalFilters({
  filters,
  setFilters,
  categories,
  retailers,
}: NewArrivalFiltersProps) {
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Filter className="h-5 w-5" />
          Filters
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
          {/* Time Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">Time Range</label>
            <Select
              value={filters.timeRange}
              onValueChange={(value: FilterType["timeRange"]) =>
                setFilters({ ...filters, timeRange: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="1d">Last 24 hours</SelectItem>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 3 months</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Category */}
          <div>
            <label className="text-sm font-medium mb-2 block">Category</label>
            <Select
              value={filters.category}
              onValueChange={(value) =>
                setFilters({ ...filters, category: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.map((cat) => (
                  <SelectItem key={cat.category_id} value={cat.category_name}>
                    {cat.category_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Retailer */}
          <div>
            <label className="text-sm font-medium mb-2 block">Retailer</label>
            <Select
              value={filters.retailer}
              onValueChange={(value) =>
                setFilters({ ...filters, retailer: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Retailers</SelectItem>
                {retailers.map((retailer) => (
                  <SelectItem key={retailer.shop_id} value={retailer.shop_name}>
                    {retailer.shop_name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Price Range */}
          <div>
            <label className="text-sm font-medium mb-2 block">
              Price Range: Rs {filters.priceRange[0].toLocaleString()} - Rs{" "}
              {filters.priceRange[1].toLocaleString()}
            </label>
            <div className="space-y-3">
              {/* Minimum Value Slider */}
              <div>
                <label className="text-xs text-blue-600 font-medium mb-1 block">
                  Minimum: Rs {filters.priceRange[0].toLocaleString()}
                </label>
                <Slider
                  value={[filters.priceRange[0]]}
                  onValueChange={(value) => {
                    const newMin = Math.min(
                      value[0],
                      filters.priceRange[1] - 10000
                    );
                    setFilters({
                      ...filters,
                      priceRange: [newMin, filters.priceRange[1]],
                    });
                  }}
                  max={filters.priceRange[1] - 10000}
                  min={0}
                  step={10000}
                  className="w-full"
                />
              </div>

              {/* Maximum Value Slider */}
              <div>
                <label className="text-xs text-red-600 font-medium mb-1 block">
                  Maximum: Rs {filters.priceRange[1].toLocaleString()}
                </label>
                <Slider
                  value={[filters.priceRange[1]]}
                  onValueChange={(value) => {
                    const newMax = Math.max(
                      value[0],
                      filters.priceRange[0] + 10000
                    );
                    setFilters({
                      ...filters,
                      priceRange: [filters.priceRange[0], newMax],
                    });
                  }}
                  max={10000000}
                  min={filters.priceRange[0] + 10000}
                  step={10000}
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-sm font-medium mb-2 block">Sort By</label>
            <Select
              value={filters.sortBy}
              onValueChange={(value: FilterType["sortBy"]) =>
                setFilters({ ...filters, sortBy: value })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
                <SelectItem value="price_asc">Price: Low to High</SelectItem>
                <SelectItem value="price_desc">Price: High to Low</SelectItem>
                <SelectItem value="name_asc">Name: A to Z</SelectItem>
                <SelectItem value="name_desc">Name: Z to A</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* In Stock Only */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center space-x-2">
              <Switch
                id="in-stock-only"
                checked={filters.inStockOnly}
                onCheckedChange={(checked) =>
                  setFilters({ ...filters, inStockOnly: checked })
                }
              />
              <Label htmlFor="in-stock-only" className="text-sm font-medium">
                In Stock Only
              </Label>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
