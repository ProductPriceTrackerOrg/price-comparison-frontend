"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Store,
  Eye,
  Share2,
  TrendingDown,
  Clock,
  ExternalLink,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";
import { PriceDropResponse } from "@/lib/types/price-drops";

interface PriceDropCardProps {
  priceDrop: PriceDropResponse;
}

export function PriceDropCard({ priceDrop }: PriceDropCardProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const { toast } = useToast();
  const { isLoggedIn } = useAuth();

  const handleFavorite = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isLoggedIn) {
      toast({
        title: "Login Required",
        description: "Please log in to track products",
        variant: "destructive",
      });
      return;
    }

    try {
      // API call would be:
      // const response = await fetch('/api/user/favorites', {
      //   method: isFavorited ? 'DELETE' : 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ variant_id: priceDrop.variant_id })
      // })

      setIsFavorited(!isFavorited);
      toast({
        title: isFavorited ? "Removed from favorites" : "Added to favorites",
        description: isFavorited
          ? `${priceDrop.product_title} removed from your tracked products`
          : `${priceDrop.product_title} added to your tracked products`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update favorites",
        variant: "destructive",
      });
    }
  };

  const handleShare = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (navigator.share) {
      navigator.share({
        title: priceDrop.product_title,
        text: `Check out this price drop: ${
          priceDrop.product_title
        } - ${Math.abs(priceDrop.percentage_change).toFixed(1)}% off!`,
        url:
          window.location.origin + `/product/${priceDrop.canonical_product_id}`,
      });
    } else {
      navigator.clipboard.writeText(
        window.location.origin + `/product/${priceDrop.canonical_product_id}`
      );
      toast({
        title: "Link copied",
        description: "Product link copied to clipboard",
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return (
      "Rs " +
      new Intl.NumberFormat("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(amount)
    );
  };

  const getTimeSince = (days: number) => {
    if (days === 0) return "Today";
    if (days === 1) return "Yesterday";
    if (days < 7) return `${days} days ago`;
    const weeks = Math.floor(days / 7);
    return weeks === 1 ? "1 week ago" : `${weeks} weeks ago`;
  };

  return (
    <Card
      className={`group relative overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 border-0 bg-white/70 backdrop-blur-sm ${
        isHovered ? "shadow-2xl" : "shadow-md"
      }`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Price Drop Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="bg-gradient-to-r from-red-500 to-red-600 text-white border-0 shadow-lg">
          <TrendingDown className="w-3 h-3 mr-1" />
          {Math.abs(priceDrop.percentage_change).toFixed(1)}% OFF
        </Badge>
      </div>

      {/* Availability Badge */}
      <div className="absolute top-3 right-3 z-10">
        <Badge
          variant={priceDrop.is_available ? "default" : "destructive"}
          className="shadow-lg"
        >
          {priceDrop.is_available ? "In Stock" : "Out of Stock"}
        </Badge>
      </div>

      <Link
        href={`/product/${priceDrop.canonical_product_id}`}
        className="block"
      >
        <CardContent className="p-0">
          {/* Product Image */}
          <div className="relative overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
            <img
              src={priceDrop.image_url}
              alt={priceDrop.product_title}
              className="w-full h-48 object-cover transition-transform duration-300 group-hover:scale-105"
            />

            {/* Action Buttons Overlay */}
            <div
              className={`absolute inset-0 bg-black/20 flex items-center justify-center gap-2 transition-opacity duration-300 ${
                isHovered ? "opacity-100" : "opacity-0"
              }`}
            >
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-gray-800 hover:bg-white shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(
                    `/product/${priceDrop.canonical_product_id}`,
                    "_blank"
                  );
                }}
              >
                <Eye className="w-4 h-4 mr-1" />
                View
              </Button>
              <Button
                size="sm"
                variant="secondary"
                className="bg-white/90 text-gray-800 hover:bg-white shadow-lg"
                onClick={handleShare}
              >
                <Share2 className="w-4 h-4 mr-1" />
                Share
              </Button>
            </div>
          </div>

          {/* Product Info */}
          <div className="p-4 space-y-3">
            {/* Brand & Category */}
            <div className="flex items-center justify-between text-xs text-gray-500">
              <span className="font-medium">{priceDrop.brand}</span>
              <span>{priceDrop.category_name}</span>
            </div>

            {/* Product Title */}
            <h3 className="font-semibold text-gray-900 line-clamp-2 leading-tight group-hover:text-blue-600 transition-colors">
              {priceDrop.product_title}
            </h3>

            {/* Retailer */}
            <div className="flex items-center gap-1 text-sm text-gray-600">
              <Store className="w-4 h-4" />
              <span>{priceDrop.shop_name}</span>
            </div>

            {/* Price Information */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {formatCurrency(priceDrop.current_price)}
                  </span>
                  <span className="text-lg text-gray-400 line-through">
                    {formatCurrency(priceDrop.previous_price)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm">
                <span className="text-green-600 font-semibold">
                  Save {formatCurrency(Math.abs(priceDrop.price_change))}
                </span>
                <div className="flex items-center gap-1 text-gray-500">
                  <Clock className="w-3 h-3" />
                  <span>{getTimeSince(priceDrop.days_since_drop)}</span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className={`flex-1 transition-colors ${
                  isFavorited
                    ? "bg-red-50 border-red-200 text-red-600 hover:bg-red-100"
                    : "hover:bg-gray-50"
                }`}
                onClick={handleFavorite}
              >
                <Heart
                  className={`w-4 h-4 mr-1 ${
                    isFavorited ? "fill-current" : ""
                  }`}
                />
                {isFavorited ? "Tracking" : "Track"}
              </Button>

              <Button
                variant="outline"
                size="sm"
                onClick={(e) => {
                  e.preventDefault();
                  window.open(priceDrop.product_url, "_blank");
                }}
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Link>
    </Card>
  );
}
