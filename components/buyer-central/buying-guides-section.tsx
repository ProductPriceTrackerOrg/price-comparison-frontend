"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  BookOpen,
  Clock,
  Star,
  Calendar,
  DollarSign,
  Users,
} from "lucide-react";
import { BuyingGuideCategory, BuyingGuide } from "@/lib/types/buyer-central";

interface BuyingGuidesSectionProps {
  categories: BuyingGuideCategory[];
  loading: boolean;
}

export function BuyingGuidesSection({
  categories,
  loading,
}: BuyingGuidesSectionProps) {
  const [selectedGuide, setSelectedGuide] = useState<BuyingGuide | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const handleReadGuide = (guide: BuyingGuide) => {
    setSelectedGuide(guide);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setSelectedGuide(null);
  };
  
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-4 w-full" />
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-4 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `$${price.toLocaleString()}`;

  // Mock best buying period data - this would come from your backend
  const bestBuyingPeriods = {
    Smartphones: { month: "September", reason: "New model releases" },
    Laptops: { month: "July", reason: "Back-to-school sales" },
    "Smart Watches": { month: "November", reason: "Holiday deals" },
    Headphones: { month: "November", reason: "Black Friday" },
    Cameras: { month: "February", reason: "New model announcements" },
    Tablets: { month: "October", reason: "Pre-holiday sales" },
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Buyer's Guides
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Learn the best times to buy products and get expert recommendations for
          making informed purchase decisions.
        </p>
      </div>

      {/* Best Time to Buy Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5 text-blue-600" />
            Best Time to Buy
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(bestBuyingPeriods).map(([category, info]) => (
              <Card key={category} className="border border-blue-200 bg-blue-50/50">
                <CardContent className="p-4">
                  <h3 className="font-semibold text-blue-900 mb-1">{category}</h3>
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{info.month}</Badge>
                    <span className="text-sm text-blue-700">Best Month to Buy</span>
                  </div>
                  <p className="text-sm text-gray-600">{info.reason}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Category Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((category) => (
          <Card
            key={category.categoryId}
            className="hover:shadow-lg transition-shadow"
          >
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <CardTitle className="flex items-center gap-2">
                    <span className="text-2xl">{category.icon}</span>
                    {category.categoryName}
                  </CardTitle>
                  <p className="text-sm text-gray-500">{category.description}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-2">
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Avg. Price</span>
                  <span className="font-semibold">
                    {formatPrice(category.avgProductPrice)}
                  </span>
                </div>
                <div className="flex flex-col">
                  <span className="text-xs text-gray-500">Guides</span>
                  <span className="font-semibold">{category.guideCount}</span>
                </div>
              </div>

              <div>
                <span className="text-xs text-gray-500 block mb-1">
                  Popular Brands
                </span>
                <div className="flex flex-wrap gap-1">
                  {category.popularBrands.map((brand) => (
                    <Badge key={brand} variant="outline">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                className="w-full text-blue-600 hover:text-blue-700 hover:bg-blue-50 border border-blue-200"
                onClick={() => 
                  handleReadGuide({
                    guideId: `guide-${category.categoryId}`,
                    title: `${category.categoryName} Buying Guide`,
                    categoryName: category.categoryName,
                    content: `This is a sample content for ${category.categoryName} buying guide. In a real implementation, this would contain comprehensive information to help users make informed purchase decisions.`,
                    lastUpdated: "2024-07-15",
                    readTime: 5,
                    tags: ["buying guide", category.categoryName.toLowerCase(), "2024"],
                  })
                }
              >
                <BookOpen className="h-4 w-4 mr-2" />
                View Buying Guide
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Tips Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-blue-600" />
            Smart Buying Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 flex items-center gap-2 mb-2">
                <DollarSign className="h-4 w-4 text-green-600" />
                Research Price History
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Check if current prices are actually good deals by looking at the product's price history across multiple retailers.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 flex items-center gap-2 mb-2">
                <Calendar className="h-4 w-4 text-blue-600" />
                Time Your Purchase
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Many products have predictable price cycles. Check our guides for the optimal months to buy specific categories.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-purple-600" />
                Read User Reviews
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Don't just focus on price. Look at user reviews to ensure the product meets your needs and quality expectations.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Guide Reading Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3 text-xl">
              <BookOpen className="h-6 w-6 text-blue-600" />
              {selectedGuide?.title || "Buying Guide"}
            </DialogTitle>
          </DialogHeader>

          {selectedGuide && (
            <div className="space-y-6">
              <div className="flex items-center justify-between text-sm text-gray-500">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedGuide.readTime} min read</span>
                </div>
                <div>Last updated: {selectedGuide.lastUpdated}</div>
              </div>

              <div className="flex flex-wrap gap-2">
                {selectedGuide.tags.map((tag) => (
                  <Badge key={tag} variant="secondary">
                    {tag}
                  </Badge>
                ))}
              </div>

              <div className="prose max-w-none dark:prose-invert">
                <p>{selectedGuide.content}</p>
              </div>

              <div className="border-t pt-4">
                <h4 className="font-medium text-lg mb-4">Recommended Products</h4>
                <p className="text-gray-500">
                  In a full implementation, this section would display recommended products for this category with their current best prices.
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}