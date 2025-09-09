"use client";

import { useState, useMemo, useEffect } from "react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Tablet,
  Monitor,
  Tv,
  Speaker,
  Mouse,
  Keyboard,
  Cpu,
  HardDrive,
  Printer,
  Router,
  Search,
  TrendingUp,
  ArrowRight,
  Grid3X3,
  X,
} from "lucide-react";

// Map backend icon string to Lucide icon component
const iconMap: Record<string, any> = {
  smartphone: Smartphone,
  smartphones: Smartphone,
  laptops: Laptop,
  laptop: Laptop,
  watch: Watch,
  smart_watches: Watch,
  smartwatches: Watch,
  headphones: Headphones,
  camera: Camera,
  cameras: Camera,
  gamepad2: Gamepad2,
  gaming: Gamepad2,
  tablet: Tablet,
  tablets: Tablet,
  monitor: Monitor,
  monitors: Monitor,
  tv: Tv,
  tvs: Tv,
  speaker: Speaker,
  speakers: Speaker,
  mouse: Mouse,
  mice: Mouse,
  computer_mice: Mouse,
  keyboard: Keyboard,
  keyboards: Keyboard,
  cpu: Cpu,
  processors: Cpu,
  harddrive: HardDrive,
  storage: HardDrive,
  printer: Printer,
  printers: Printer,
  router: Router,
  networking: Router,
};

// Color schemes for different categories
const colorSchemes = [
  { color: "text-blue-600", bgColor: "bg-blue-50", borderColor: "border-blue-200" },
  { color: "text-green-600", bgColor: "bg-green-50", borderColor: "border-green-200" },
  { color: "text-purple-600", bgColor: "bg-purple-50", borderColor: "border-purple-200" },
  { color: "text-orange-600", bgColor: "bg-orange-50", borderColor: "border-orange-200" },
  { color: "text-cyan-600", bgColor: "bg-cyan-50", borderColor: "border-cyan-200" },
  { color: "text-pink-600", bgColor: "bg-pink-50", borderColor: "border-pink-200" },
  { color: "text-indigo-600", bgColor: "bg-indigo-50", borderColor: "border-indigo-200" },
  { color: "text-red-600", bgColor: "bg-red-50", borderColor: "border-red-200" },
];

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('Fetching categories from:', `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories`);
        
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/v1/categories?include_subcategories=false`
        );
        
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        console.log('Categories API response:', data);
        
        // Map backend data to frontend format
        const mappedCategories = (data.categories || []).map((cat: any, index: number) => {
          const colorScheme = colorSchemes[index % colorSchemes.length];
          
          return {
            name: cat.name || 'Unknown Category',
            icon: iconMap[cat.icon?.toLowerCase()] || Grid3X3,
            count: cat.product_count?.toLocaleString() || "0",
            href: `/category/${(cat.name || '').toLowerCase().replace(/\s+/g, '-')}`,
            ...colorScheme,
            description: cat.description || `${cat.name} products and accessories`,
            trending: (cat.trending_score || 0) > 0.1, // Adjust threshold as needed
            avgSavings: "15%", // You can calculate this from your data if available
          };
        });
        
        setCategories(mappedCategories);
      } catch (err: any) {
        console.error('Error fetching categories:', err);
        setError(err.message || 'Failed to fetch categories');
      } finally {
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Enhanced search filtering
  const filteredCategories = useMemo(() => {
    if (!categories.length) return [];
    
    let filtered = categories.filter((category) => {
      const searchLower = searchTerm.toLowerCase().trim();
      if (!searchLower) return true;
      
      return (
        category.name?.toLowerCase().includes(searchLower) ||
        category.description?.toLowerCase().includes(searchLower)
      );
    });

    // Sort categories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "count":
          const countA = parseInt((a.count || "0").replace(/,/g, ""));
          const countB = parseInt((b.count || "0").replace(/,/g, ""));
          return countB - countA;
        default:
          return (a.name || "").localeCompare(b.name || "");
      }
    });

    return filtered;
  }, [categories, searchTerm, sortBy]);

  // Clear search function
  const clearSearch = () => {
    setSearchTerm("");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          <PageHeader
            title="All Categories"
            icon={Grid3X3}
            breadcrumbItems={[{ label: "All Categories" }]}
          />

          {/* Enhanced Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search categories"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl transition-colors"
                />
                {searchTerm && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={clearSearch}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100 rounded-full"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "count")
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none transition-colors"
                >
                  <option value="name">Sort by Name</option>
                  <option value="count">Sort by Product Count</option>
                </select>
              </div>
            </div>

            {/* Search Results Summary */}
            {searchTerm && (
              <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
                <div>
                  Found <span className="font-semibold text-blue-600">{filteredCategories.length}</span> categories matching "<span className="font-medium">{searchTerm}</span>"
                </div>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={clearSearch}
                  className="text-xs"
                >
                  Clear search
                </Button>
              </div>
            )}
          </div>

          {/* Categories Grid/List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {searchTerm ? 'Search Results' : 'All Categories'} ({filteredCategories.length})
              </h2>
              {searchTerm && (
                <Badge variant="outline" className="text-sm">
                  Showing results for "{searchTerm}"
                </Badge>
              )}
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[...Array(8)].map((_, index) => (
                  <Card key={index} className="h-64">
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className="w-16 h-16 bg-gray-200 rounded-2xl mx-auto mb-4 animate-pulse"></div>
                      <div className="h-4 bg-gray-200 rounded mb-2 animate-pulse"></div>
                      <div className="h-3 bg-gray-200 rounded mb-4 animate-pulse"></div>
                      <div className="mt-auto">
                        <div className="h-6 bg-gray-200 rounded animate-pulse"></div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : error ? (
              <div className="text-center py-12">
                <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-12 w-12 text-red-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Failed to load categories
                </h3>
                <p className="text-red-600 mb-4">{error}</p>
                <Button onClick={() => window.location.reload()} variant="outline">
                  Try again
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredCategories.map((category, index) => (
                  <Link key={category.name} href={category.href}>
                    <Card
                      className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full border-2 ${category.borderColor} hover:border-opacity-50`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <CardContent className="p-6 text-center h-full flex flex-col">
                        <div className="relative mb-4">
                          <div
                            className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-2 ${category.borderColor}`}
                          >
                            <category.icon
                              className={`h-8 w-8 ${category.color}`}
                            />
                          </div>
                          {category.trending && (
                            <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                              <TrendingUp className="h-3 w-3 text-white" />
                            </div>
                          )}
                        </div>

                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {category.name}
                        </h3>

                        <p className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed">
                          {category.description}
                        </p>

                        <div className="space-y-3">
                          <div className="flex items-center justify-between text-xs text-gray-500">
                            <span>Avg. savings</span>
                            <span className="font-semibold text-green-600">
                              {category.avgSavings}
                            </span>
                          </div>

                          <div className="flex items-center justify-center">
                            <Badge
                              variant="secondary"
                              className="text-xs font-medium"
                            >
                              {category.count} products
                            </Badge>
                          </div>

                          <div className="flex items-center justify-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                            Explore category{" "}
                            <ArrowRight className="h-4 w-4 ml-1" />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Enhanced No Results */}
          {!loading && !error && filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {searchTerm ? `No categories found for "${searchTerm}"` : 'No categories found'}
              </h3>
              <p className="text-gray-600 mb-4">
                {searchTerm 
                  ? 'Try adjusting your search terms or browse all categories.' 
                  : 'No categories are currently available.'
                }
              </p>
              <div className="flex gap-2 justify-center">
                {searchTerm && (
                  <Button onClick={clearSearch} variant="outline">
                    Clear search
                  </Button>
                )}
                <Button onClick={() => window.location.reload()} variant="outline">
                  Refresh page
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}