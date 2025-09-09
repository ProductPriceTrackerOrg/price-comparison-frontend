"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface FilterState {
  priceRange: [number, number];
  selectedRetailers: string[];
  inStockOnly: boolean;
  sortBy: string;
}

interface SearchFiltersProps {
  onFiltersChange: (filters: FilterState) => void;
}

export function SearchFilters({ onFiltersChange }: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 2000]);
  const [selectedRetailers, setSelectedRetailers] = useState<string[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState("relevance");

  const retailers = [
    "TechStore",
    "MobileHub",
    "ElectroMax",
    "GadgetWorld",
    "DigitalStore",
    "WearableTech",
    "ComputerStore",
  ];

  // Notify parent component when filters change
  useEffect(() => {
    onFiltersChange({
      priceRange,
      selectedRetailers,
      inStockOnly,
      sortBy,
    });
  }, [priceRange, selectedRetailers, inStockOnly, sortBy]);

  const handleRetailerChange = (retailer: string, checked: boolean) => {
    if (checked) {
      setSelectedRetailers([...selectedRetailers, retailer]);
    } else {
      setSelectedRetailers(selectedRetailers.filter((r) => r !== retailer));
    }
  };

  const clearAllFilters = () => {
    setPriceRange([0, 2000]);
    setSelectedRetailers([]);
    setInStockOnly(false);
    setSortBy("relevance");
  };

  return (
    <div className="space-y-6">
      {/* Sort */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Sort By</CardTitle>
        </CardHeader>
        <CardContent>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="relevance">Relevance</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
              <SelectItem value="discount">Highest Discount</SelectItem>
              <SelectItem value="newest">Newest First</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Price Range */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Price Range</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Slider
            value={priceRange}
            onValueChange={(value) => setPriceRange([value[0], value[1]])}
            max={2000}
            min={0}
            step={50}
            className="w-full"
          />
          <div className="flex justify-between text-sm text-muted-foreground">
            <span>Rs {priceRange[0]}</span>
            <span>Rs {priceRange[1]}</span>
          </div>
        </CardContent>
      </Card>

      {/* Availability */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Availability</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={inStockOnly}
              onCheckedChange={(checked) => setInStockOnly(checked === true)}
            />
            <label htmlFor="in-stock" className="text-sm font-medium">
              In Stock Only
            </label>
          </div>
        </CardContent>
      </Card>

      {/* Retailers */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Retailers</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {retailers.map((retailer) => (
            <div key={retailer} className="flex items-center space-x-2">
              <Checkbox
                id={retailer}
                checked={selectedRetailers.includes(retailer)}
                onCheckedChange={(checked) =>
                  handleRetailerChange(retailer, checked as boolean)
                }
              />
              <label htmlFor={retailer} className="text-sm font-medium">
                {retailer}
              </label>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Clear Filters */}
      <Button
        variant="outline"
        className="w-full bg-transparent"
        onClick={clearAllFilters}
      >
        Clear All Filters
      </Button>
    </div>
  );
}
