"use client";

import type React from "react";

import { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Store,
  Eye,
  Share2,
  TrendingUp,
  TrendingDown,
  Star,
  Clock,
  Users,
  Zap,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { resolveProductImageUrl } from "@/lib/utils";

interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  inStock: boolean;
  image: string;
  discount?: number;
  // Enhanced properties for better visualization
  trendScore?: number;
  searchVolume?: string;
  priceChange?: number;
  launchDate?: string;
  preOrders?: number;
  rating?: number;
  isNew?: boolean;
}

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();
  const resolvedImage = resolveProductImageUrl(product.image);

  const handleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast({
        title: "Sign in required",
        description: "Please sign in to track products",
        variant: "destructive",
      });
      return;
    }

    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from tracking" : "Added to tracking",
      description: isFavorited
        ? `${product.name} removed from your tracked products`
        : `${product.name} added to your tracked products`,
    });
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    navigator.clipboard.writeText(
      `${window.location.origin}/product/${encodeURIComponent(
        product.id.toString()
      )}`
    );
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  return (
    <Card
      className="group bg-white border border-gray-200 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-3 overflow-hidden h-full flex flex-col relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={(e) => e.stopPropagation()}
    >
      {/* Enhanced Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <CardContent className="p-0 flex flex-col h-full relative z-10">
        {/* Enhanced Image Section */}
        <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100 rounded-t-2xl">
          <Link
            href={`/product/${encodeURIComponent(product.id.toString())}`}
            className="block"
          >
            <img
              src={
                resolvedImage ??
                "/placeholder.svg?height=240&width=240&text=Product"
              }
              alt={product.name}
              className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-700"
            />
          </Link>

          {/* Enhanced Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Top Badges - Enhanced positioning */}
          <div className="absolute top-3 left-3 flex flex-col gap-2 z-20">
            {(() => {
              if (product.discount) {
                return (
                  <Badge className="bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold shadow-xl animate-pulse">
                    -{product.discount}% OFF
                  </Badge>
                );
              } else if (product.isNew) {
                return (
                  <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white font-bold shadow-xl">
                    <Zap className="h-3 w-3 mr-1" />
                    NEW
                  </Badge>
                );
              } else {
                return null;
              }
            })()}
          </div>

          {/* Stock Status - Enhanced */}
          <div className="absolute top-3 right-3 z-20">
            <Badge
              variant={product.inStock ? "default" : "secondary"}
              className={`text-xs shadow-xl backdrop-blur-sm ${
                product.inStock
                  ? "bg-green-500/90 hover:bg-green-600/90 text-white border-0"
                  : "bg-gray-500/90 text-white border-0"
              }`}
            >
              {product.inStock ? "In Stock" : "Out of Stock"}
            </Badge>
          </div>

          {/* Enhanced Hover Actions */}
          <div
            className={`absolute bottom-3 right-3 flex gap-2 transition-all duration-500 ${
              isHovered
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-4"
            }`}
          >
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 p-0 bg-white/95 hover:bg-white shadow-xl backdrop-blur-sm rounded-full border-0 transform hover:scale-110 transition-all duration-200"
              onClick={handleFavorite}
            >
              <Heart
                className={`h-4 w-4 ${
                  isFavorited ? "fill-red-500 text-red-500" : "text-gray-600"
                }`}
              />
            </Button>
            <Button
              variant="secondary"
              size="sm"
              className="h-10 w-10 p-0 bg-white/95 hover:bg-white shadow-xl backdrop-blur-sm rounded-full border-0 transform hover:scale-110 transition-all duration-200"
              onClick={handleShare}
            >
              <Share2 className="h-4 w-4 text-gray-600" />
            </Button>
          </div>

          {/* Enhanced Trend/Launch Indicators */}
          {product.trendScore && (
            <div className="absolute bottom-3 left-3 flex gap-2">
              <Badge className="bg-orange-500/90 text-white text-xs backdrop-blur-sm border-0 shadow-lg">
                <TrendingUp className="h-3 w-3 mr-1" />
                {product.trendScore}% Hot
              </Badge>
            </div>
          )}

          {product.rating && (
            <div className="absolute bottom-3 left-3">
              <Badge className="bg-yellow-500/90 text-white text-xs backdrop-blur-sm border-0 shadow-lg">
                <Star className="h-3 w-3 mr-1" />
                {product.rating}
              </Badge>
            </div>
          )}
        </div>

        {/* Enhanced Content Section */}
        <div className="p-5 flex flex-col flex-grow space-y-4">
          {/* Brand & Category - Enhanced */}
          <div className="flex items-center justify-between">
            <Badge
              variant="outline"
              className="bg-blue-50 text-blue-700 border-blue-200 font-medium px-3 py-1"
            >
              {product.brand}
            </Badge>
            <span className="text-xs text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
              {product.category}
            </span>
          </div>

          {/* Product Name - Enhanced */}
          <Link
            href={`/product/${encodeURIComponent(product.id.toString())}`}
            className="block"
          >
            <h3 className="font-bold text-gray-900 hover:text-blue-600 transition-colors line-clamp-2 leading-tight text-base group-hover:text-blue-600">
              {product.name}
            </h3>
          </Link>

          {/* Enhanced Metrics Row */}
          {(product.searchVolume ||
            product.preOrders ||
            product.priceChange) && (
            <div className="flex items-center gap-2 flex-wrap">
              {product.searchVolume && (
                <Badge
                  variant="outline"
                  className="text-xs bg-green-50 text-green-700 border-green-200"
                >
                  <Users className="h-3 w-3 mr-1" />
                  {product.searchVolume}
                </Badge>
              )}
              {product.preOrders && (
                <Badge
                  variant="outline"
                  className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                >
                  <Clock className="h-3 w-3 mr-1" />
                  {product.preOrders.toLocaleString()}
                </Badge>
              )}
              {product.priceChange && (
                <Badge
                  variant="outline"
                  className={`text-xs ${
                    product.priceChange < 0
                      ? "bg-green-50 text-green-700 border-green-200"
                      : "bg-red-50 text-red-700 border-red-200"
                  }`}
                >
                  {product.priceChange < 0 ? (
                    <TrendingDown className="h-3 w-3 mr-1" />
                  ) : (
                    <TrendingUp className="h-3 w-3 mr-1" />
                  )}
                  {product.priceChange > 0 ? "+" : ""}
                  {product.priceChange.toFixed(1)}%
                </Badge>
              )}
            </div>
          )}

          {/* Enhanced Price Section */}
          <div className="space-y-3 flex-grow">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl font-bold text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Rs {product.price.toLocaleString("en-US")}
                </span>
                {product.originalPrice && (
                  <span className="text-sm text-gray-500 line-through bg-gray-100 px-2 py-1 rounded">
                    Rs {product.originalPrice.toLocaleString("en-US")}
                  </span>
                )}
              </div>
            </div>

            {product.originalPrice && (
              <div className="flex justify-between items-center">
                <Badge className="bg-gradient-to-r from-green-500 to-emerald-500 text-white border-0 shadow-lg">
                  Save Rs{" "}
                  {(product.originalPrice - product.price).toLocaleString(
                    "en-US",
                    { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                  )}
                </Badge>
                <div className="text-right">
                  <div className="text-xs text-gray-500">You save</div>
                  <div className="text-sm font-semibold text-green-600">
                    {Math.round(
                      ((product.originalPrice - product.price) /
                        product.originalPrice) *
                        100
                    )}
                    %
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Enhanced Retailer Section */}
          <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-xl border border-gray-100">
            <Store className="h-4 w-4 text-gray-600" />
            <span className="text-sm font-medium text-gray-700 truncate flex-1">
              {product.retailer}
            </span>
            <div className="flex items-center gap-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
          </div>

          {/* Enhanced Action Button */}
          <div className="mt-auto pt-2">
            <Link
              href={`/product/${encodeURIComponent(product.id.toString())}`}
              passHref
              className="block"
            >
              <Button
                className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl rounded-xl h-12 font-semibold"
                onClick={(e) => e.stopPropagation()}
              >
                <Eye className="mr-2 h-4 w-4" />
                View Details
              </Button>
            </Link>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
