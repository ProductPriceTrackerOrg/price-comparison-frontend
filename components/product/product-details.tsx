"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ExternalLink,
  Phone,
  MessageCircle,
  Store,
  Share2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductChat } from "@/components/product/product-chat";

interface ProductDetailsProps {
  product: any;
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [isFavorited, setIsFavorited] = useState(false);
  const { toast } = useToast();

  const handleFavorite = () => {
    setIsFavorited(!isFavorited);
    toast({
      title: isFavorited ? "Removed from tracking" : "Added to tracking",
      description: isFavorited
        ? `${product.name} removed from your tracked products`
        : `${product.name} added to your tracked products`,
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image and Chat */}
      <div className="space-y-6">
        <div className="relative">
          <img
            src={product.image || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {product.discount && (
            <Badge className="absolute top-4 left-4 bg-red-500 text-white">
              -{product.discount}% OFF
            </Badge>
          )}
        </div>

        {/* Product Chat - Isolate from page scroll events */}
        <div
          className="mt-6"
          onClick={(e) => e.stopPropagation()}
          onScroll={(e) => e.stopPropagation()}
        >
          <ProductChat productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {product.name}
          </h1>
          <div className="flex items-center space-x-2 text-muted-foreground mb-4">
            <span>{product.brand}</span>
            <span>•</span>
            <span>{product.category}</span>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl font-bold text-foreground">
              Rs {product.price.toLocaleString('en-US')}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                Rs {product.originalPrice.toLocaleString('en-US')}
              </span>
            )}
            {product.discount && (
              <Badge variant="destructive">
                Save Rs {(product.originalPrice - product.price).toLocaleString('en-US', {minimumFractionDigits: 2, maximumFractionDigits: 2})}
              </Badge>
            )}
          </div>

          <Badge
            variant={product.inStock ? "default" : "secondary"}
            className="mb-4"
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* Retailer Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-semibold">{product.retailer}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a href="#" target="_blank" rel="noopener noreferrer">
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Store
                </a>
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                {product.retailerPhone}
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            onClick={handleFavorite}
            variant={isFavorited ? "default" : "outline"}
            className="flex-1"
          >
            <Heart
              className={`mr-2 h-4 w-4 ${isFavorited ? "fill-current" : ""}`}
            />
            {isFavorited ? "Tracking" : "Track Price"}
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" asChild>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <Eye className="mr-2 h-4 w-4" />
              View on Google
            </a>
          </Button>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
