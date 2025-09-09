"use client";

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
  ArrowRight,
  TrendingUp,
  DollarSign,
  Users,
  User,
  Calendar,
  Eye,
} from "lucide-react";
import { BuyingGuideCategory, BuyingGuide } from "@/lib/types/buyer-central";
import { useState } from "react";

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
                <div className="space-y-3">
                  <Skeleton className="h-4 w-24" />
                  <Skeleton className="h-4 w-32" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const formatPrice = (price: number) => `Rs ${price.toLocaleString()}`;

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Expert Buying Guides
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Comprehensive guides written by experts to help you make the best
          purchasing decisions across all product categories.
        </p>
      </div>

      {/* Featured Guide */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 border-blue-200 dark:border-blue-800">
        <CardContent className="p-8">
          <div className="flex items-start justify-between">
            <div className="flex-1">
              <Badge className="mb-4 bg-blue-100 text-blue-700 hover:bg-blue-200">
                Featured Guide
              </Badge>
              <h3 className="text-2xl font-bold text-blue-900 dark:text-blue-100 mb-3">
                Ultimate Smartphone Buying Guide 2024
              </h3>
              <p className="text-blue-700 dark:text-blue-300 mb-6 text-lg">
                Everything you need to know about choosing the perfect
                smartphone, from budget options to flagship devices.
              </p>
              <div className="flex items-center gap-6 mb-6">
                <div className="flex items-center gap-2 text-blue-600">
                  <Clock className="h-4 w-4" />
                  <span className="text-sm">15 min read</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Star className="h-4 w-4" />
                  <span className="text-sm">4.9/5 rating</span>
                </div>
                <div className="flex items-center gap-2 text-blue-600">
                  <Users className="h-4 w-4" />
                  <span className="text-sm">12K readers</span>
                </div>
              </div>
              <Button
                className="bg-blue-600 hover:bg-blue-700"
                onClick={() =>
                  handleReadGuide({
                    guideId: "featured-smartphone-guide",
                    title: "Ultimate Smartphone Buying Guide 2024",
                    categoryName: "Smartphones",
                    content: `# Ultimate Smartphone Buying Guide 2024

## Introduction
Choosing the right smartphone can be overwhelming with hundreds of options available in the market. This comprehensive guide will help you make an informed decision based on your needs, budget, and preferences.

## Key Factors to Consider

### 1. Budget Planning
- **Budget Range (Under Rs 50,000)**: Focus on essential features like battery life, basic camera, and reliable performance
- **Mid-range (Rs 50,000-Rs 120,000)**: Balance of performance, camera quality, and premium features
- **Premium (Rs 120,000+)**: Latest technology, superior cameras, and flagship performance

### 2. Operating System
- **Android**: More customization options, wider price range, Google ecosystem integration
- **iOS**: Streamlined experience, better app optimization, seamless Apple ecosystem

### 3. Performance Requirements
- **Basic Users**: 4-6GB RAM, entry-level processor sufficient
- **Power Users**: 8GB+ RAM, flagship processor for gaming and multitasking
- **Storage**: Consider cloud storage vs local storage needs

### 4. Camera Priorities
- **Main Camera**: Megapixels aren't everything - look for sensor size and image processing
- **Ultra-wide & Telephoto**: Essential for photography enthusiasts
- **Night Mode**: Important for low-light photography

### 5. Battery & Charging
- **Battery Capacity**: 4000mAh+ recommended for all-day use
- **Fast Charging**: 30W+ for quick top-ups
- **Wireless Charging**: Convenient but not essential

## Top Recommendations by Category

### Best Budget Phones
1. **Samsung Galaxy A54** - Great camera for the price
2. **Google Pixel 7a** - Clean Android experience
3. **OnePlus Nord N30** - Fast charging and good display

### Best Mid-Range Phones
1. **iPhone 13** - Excellent camera and performance
2. **Samsung Galaxy S23** - Versatile camera system
3. **Google Pixel 8** - Best AI features

### Best Premium Phones
1. **iPhone 15 Pro** - Best overall premium experience
2. **Samsung Galaxy S24 Ultra** - Best for productivity
3. **Google Pixel 8 Pro** - Best computational photography

## Common Mistakes to Avoid
- Don't focus solely on megapixels for camera quality
- Don't ignore software update policies
- Don't overlook battery health and charging speeds
- Don't forget to check carrier compatibility

## Final Tips
- Read reviews from multiple sources
- Compare prices across different retailers
- Consider trade-in values for future upgrades
- Check warranty and customer support options

Making the right choice requires balancing your priorities with your budget. Take time to research and compare options before making your final decision.`,
                    lastUpdated: "2024-07-20",
                    readTime: 15,
                    tags: [
                      "smartphones",
                      "buying-guide",
                      "budget",
                      "premium",
                      "android",
                      "ios",
                    ],
                  })
                }
              >
                Read Guide
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
            <div className="text-8xl opacity-20">📱</div>
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
              <div className="flex items-center justify-between">
                <div className="text-3xl">{category.icon}</div>
                <Badge variant="secondary">{category.guideCount} guides</Badge>
              </div>
              <CardTitle className="text-xl">{category.categoryName}</CardTitle>
              <p className="text-sm text-gray-600">{category.description}</p>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                  </div>
                  <div className="text-sm font-semibold">
                    {formatPrice(category.avgProductPrice)}
                  </div>
                  <div className="text-xs text-gray-500">Avg Price</div>
                </div>
                <div className="text-center p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
                  <div className="flex items-center justify-center mb-1">
                    <TrendingUp className="h-4 w-4 text-blue-600" />
                  </div>
                  <div className="text-sm font-semibold">
                    {category.popularBrands.length}
                  </div>
                  <div className="text-xs text-gray-500">Top Brands</div>
                </div>
              </div>

              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-gray-700">
                  Popular Brands:
                </h4>
                <div className="flex flex-wrap gap-1">
                  {category.popularBrands.map((brand, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {brand}
                    </Badge>
                  ))}
                </div>
              </div>

              <Button variant="outline" className="w-full">
                <BookOpen className="h-4 w-4 mr-2" />
                View Guides
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
            Quick Buying Tips
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
              <h4 className="font-semibold text-green-900 dark:text-green-100 mb-2">
                Best Time to Buy
              </h4>
              <p className="text-sm text-green-700 dark:text-green-300">
                Monitor price trends for 2-3 weeks before making major
                purchases. Set alerts for significant drops.
              </p>
            </div>
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
              <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                Compare Retailers
              </h4>
              <p className="text-sm text-blue-700 dark:text-blue-300">
                Always check multiple retailers. Price differences can be
                significant, especially during sales periods.
              </p>
            </div>
            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg border border-purple-200 dark:border-purple-800">
              <h4 className="font-semibold text-purple-900 dark:text-purple-100 mb-2">
                Read Reviews
              </h4>
              <p className="text-sm text-purple-700 dark:text-purple-300">
                Check expert reviews and user feedback before committing to
                expensive purchases.
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
              {selectedGuide?.title}
            </DialogTitle>
          </DialogHeader>

          {selectedGuide && (
            <div className="space-y-6">
              {/* Guide Meta Info */}
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 border-b pb-4">
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4" />
                  <span>Expert Guide</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4" />
                  <span>{selectedGuide.readTime} min read</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span>
                    Updated{" "}
                    {new Date(selectedGuide.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Eye className="h-4 w-4" />
                  <span>{selectedGuide.categoryName}</span>
                </div>
              </div>

              {/* Tags */}
              <div className="flex flex-wrap gap-2">
                {selectedGuide.tags?.map((tag, index) => (
                  <Badge key={index} variant="outline" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>

              {/* Guide Content */}
              <div className="prose prose-sm max-w-none dark:prose-invert">
                <div
                  className="text-gray-700 dark:text-gray-300 leading-relaxed"
                  style={{ whiteSpace: "pre-line" }}
                >
                  {selectedGuide.content}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={closeDialog}>
                  Close
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Save Guide
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
