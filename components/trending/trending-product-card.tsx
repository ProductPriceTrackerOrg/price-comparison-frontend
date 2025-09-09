"use client";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Eye,
  Share2,
  ExternalLink,
  TrendingUp,
  TrendingDown,
  Zap,
  Star,
  Clock,
  BarChart3,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Flame,
} from "lucide-react";

interface TrendingProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice: number;
  retailer: string;
  inStock: boolean;
  image: string;
  discount: number;
  trendingScore: number;
  views: string;
  favorites: string;
  priceChange: number;
  trendingPosition: number;
  trendingChange: "up" | "down" | "new" | "neutral";
  lastWeekPosition: number | null;
  daysInTrending: number;
  rating?: number;
  reviews?: number;
}

interface TrendingProductCardProps {
  product: TrendingProduct;
  rank: number;
}

export function TrendingProductCard({
  product,
  rank,
}: TrendingProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const getTrendingIcon = (change: string) => {
    switch (change) {
      case "up":
        return <ArrowUpRight className="h-3 w-3 text-green-500" />;
      case "down":
        return <ArrowDownRight className="h-3 w-3 text-red-500" />;
      case "new":
        return <Zap className="h-3 w-3 text-orange-500" />;
      default:
        return <Minus className="h-3 w-3 text-gray-500" />;
    }
  };

  const getTrendingBadgeColor = (change: string) => {
    switch (change) {
      case "up":
        return "from-green-500 to-emerald-500";
      case "down":
        return "from-red-500 to-rose-500";
      case "new":
        return "from-orange-500 to-amber-500";
      default:
        return "from-gray-500 to-slate-500";
    }
  };

  const getPositionBadgeColor = (position: number) => {
    if (position === 1) return "from-yellow-500 to-orange-500";
    if (position <= 3) return "from-gray-400 to-gray-600";
    if (position <= 10) return "from-blue-500 to-blue-600";
    return "from-purple-500 to-purple-600";
  };

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    // TODO: Implement API call to add/remove favorite
  };

  const handleShare = async () => {
    setIsSharing(true);
    try {
      if (navigator.share) {
        await navigator.share({
          title: product.name,
          text: `Check out this trending product: ${product.name} - ${product.discount}% off!`,
          url: window.location.href,
        });
      } else {
        // Fallback: copy to clipboard
        await navigator.clipboard.writeText(window.location.href);
        // Show toast notification
      }
    } catch (error) {
      console.error("Error sharing:", error);
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <Card className="group relative overflow-hidden hover:shadow-2xl transition-all duration-500 hover:scale-[1.02] bg-gradient-to-br from-white to-gray-50">
      {/* Trending Position Badge */}
      <div className="absolute top-3 left-3 z-30 flex gap-2">
        <Badge
          className={`bg-gradient-to-r ${getPositionBadgeColor(
            product.trendingPosition
          )} text-white font-bold shadow-lg px-3 py-1`}
        >
          <Flame className="h-3 w-3 mr-1" />#{product.trendingPosition}
        </Badge>

        {product.trendingChange === "new" && (
          <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold animate-pulse">
            NEW
          </Badge>
        )}
      </div>

      {/* Trending Change Indicator */}
      <div className="absolute top-3 right-3 z-30">
        <div className="bg-white/90 backdrop-blur-sm rounded-full p-2 shadow-lg border">
          {getTrendingIcon(product.trendingChange)}
        </div>
      </div>

      {/* Discount Badge */}
      {product.discount > 0 && (
        <div className="absolute top-12 right-3 z-30">
          <Badge className="bg-red-500 text-white font-bold">
            -{product.discount}%
          </Badge>
        </div>
      )}

      <CardContent className="p-0">
        {/* Product Image */}
        <div className="relative overflow-hidden">
          <Link href={`/product/${product.id}`}>
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-500"
            />
          </Link>

          {/* Trending Score Overlay */}
          <div className="absolute bottom-2 left-2 bg-black/70 backdrop-blur-sm text-white px-2 py-1 rounded-full text-xs font-medium">
            <BarChart3 className="inline h-3 w-3 mr-1" />
            {product.trendingScore}% Hot
          </div>
        </div>

        {/* Product Info */}
        <div className="p-4 space-y-3">
          {/* Brand and Category */}
          <div className="flex items-center justify-between text-xs">
            <Badge variant="outline" className="text-blue-600 border-blue-200">
              {product.brand}
            </Badge>
            <span className="text-gray-500">{product.category}</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.id}`}>
            <h3 className="font-semibold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
              {product.name}
            </h3>
          </Link>

          {/* Price Information */}
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xl font-bold text-gray-900">
                  Rs {product.price.toFixed(2)}
                </span>
                {product.originalPrice > product.price && (
                  <span className="text-sm text-gray-500 line-through">
                    ${product.originalPrice.toFixed(2)}
                  </span>
                )}
              </div>
              <div
                className={`text-sm font-medium ${
                  product.priceChange < 0
                    ? "text-green-600"
                    : product.priceChange > 0
                    ? "text-red-600"
                    : "text-gray-600"
                }`}
              >
                {product.priceChange < 0
                  ? "↓"
                  : product.priceChange > 0
                  ? "↑"
                  : "→"}
                {Math.abs(product.priceChange).toFixed(1)}%
              </div>
            </div>

            {/* Retailer and Stock */}
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">at {product.retailer}</span>
              <span
                className={`font-medium ${
                  product.inStock ? "text-green-600" : "text-red-600"
                }`}
              >
                {product.inStock ? "In Stock" : "Out of Stock"}
              </span>
            </div>
          </div>

          {/* Trending Metrics */}
          <div className="grid grid-cols-3 gap-3 py-2 border-t border-gray-100">
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <Eye className="h-3 w-3" />
                {product.views}
              </div>
              <div className="text-xs text-gray-500">Views</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <Heart className="h-3 w-3" />
                {product.favorites}
              </div>
              <div className="text-xs text-gray-500">Favorites</div>
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center gap-1 text-xs text-gray-600">
                <Clock className="h-3 w-3" />
                {product.daysInTrending}d
              </div>
              <div className="text-xs text-gray-500">Trending</div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleFavorite}
            >
              <Heart
                className={`h-4 w-4 mr-1 ${
                  isFavorited ? "fill-red-500 text-red-500" : ""
                }`}
              />
              {isFavorited ? "Saved" : "Track"}
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleShare}
              disabled={isSharing}
            >
              <Share2 className="h-4 w-4" />
            </Button>

            <Button variant="outline" size="sm" asChild>
              <a
                href={`/product/${product.id}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            </Button>
          </div>

          {/* Position Change Info */}
          {product.lastWeekPosition && (
            <div className="text-xs text-gray-500 text-center bg-gray-50 rounded-lg py-2 px-3">
              {product.trendingPosition < product.lastWeekPosition ? (
                <span className="text-green-600">
                  ↗ Moved up from #{product.lastWeekPosition} last week
                </span>
              ) : product.trendingPosition > product.lastWeekPosition ? (
                <span className="text-red-600">
                  ↘ Dropped from #{product.lastWeekPosition} last week
                </span>
              ) : (
                <span>→ Maintained position from last week</span>
              )}
            </div>
          )}
        </div>
      </CardContent>

      {/* Hover Overlay with Additional Info */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-end justify-center p-4">
        <div className="text-white text-center space-y-2">
          <div className="text-sm font-medium">Trending Insights</div>
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <div className="font-semibold">Engagement Rate</div>
              <div className="text-green-300">
                +{(product.trendingScore * 1.2).toFixed(0)}%
              </div>
            </div>
            <div>
              <div className="font-semibold">Price Trend</div>
              <div
                className={
                  product.priceChange < 0 ? "text-green-300" : "text-red-300"
                }
              >
                {product.priceChange < 0 ? "Decreasing" : "Increasing"}
              </div>
            </div>
          </div>
          <Button
            size="sm"
            className="w-full bg-white/20 hover:bg-white/30 border-white/30"
          >
            View Full Analysis
          </Button>
        </div>
      </div>
    </Card>
  );
}
