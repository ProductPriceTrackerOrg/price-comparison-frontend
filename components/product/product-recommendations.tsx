"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles, Users, TrendingUp } from "lucide-react";
import { RecommendedProduct, audioProducts } from "@/lib/product-data";

interface ProductRecommendationsProps {
  productId: string;
}

export function ProductRecommendations({
  productId,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>(
    []
  );

  useEffect(() => {
    // In a real implementation, this would call an API endpoint
    // const fetchRecommendations = async () => {
    //   const response = await fetch(`/api/products/${productId}/recommendations`);
    //   const data = await response.json();
    //   setRecommendations(data.recommendations);
    // };
    // fetchRecommendations();

    // Using our centralized product data
    // Limit to only 4 items by using slice
    setRecommendations(audioProducts.slice(0, 4));
  }, [productId]);

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return <Sparkles className="h-4 w-4" />;
      case "COLLABORATIVE":
        return <Users className="h-4 w-4" />;
      case "TRENDING":
        return <TrendingUp className="h-4 w-4" />;
      default:
        return <Sparkles className="h-4 w-4" />;
    }
  };

  const getRecommendationLabel = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return "Perfect Match";
      case "COLLABORATIVE":
        return "Users Also Bought";
      case "TRENDING":
        return "Trending Now";
      default:
        return "Recommended";
    }
  };

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return "default";
      case "COLLABORATIVE":
        return "secondary";
      case "TRENDING":
        return "destructive";
      default:
        return "default";
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Recommendations</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {recommendations.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-2 right-2">
                <Badge
                  variant={getRecommendationColor(product.recommendationType)}
                  className="flex items-center gap-1 text-xs"
                >
                  {getRecommendationIcon(product.recommendationType)}
                  {getRecommendationLabel(product.recommendationType)}
                </Badge>
              </div>
              <div className="absolute bottom-2 left-2">
                <Badge variant="outline" className="text-xs">
                  {(product.recommendationScore * 100).toFixed(0)}% match
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Recommendation Insights */}
        <div className="mt-6 p-4 bg-muted/50 rounded-lg">
          <h4 className="font-semibold mb-2 flex items-center space-x-2">
            <Sparkles className="h-4 w-4" />
            <span>Why these recommendations?</span>
          </h4>
          <div className="text-sm text-muted-foreground space-y-1">
            <p>
              • <strong>Perfect Match:</strong> Accessories and complementary
              products that work great with your selection
            </p>
            <p>
              • <strong>Users Also Bought:</strong> Products frequently
              purchased together by other customers
            </p>
            <p>
              • <strong>Trending Now:</strong> Popular products in the same
              category with great deals
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
