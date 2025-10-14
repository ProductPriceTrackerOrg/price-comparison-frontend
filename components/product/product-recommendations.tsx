"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Sparkles, Users, TrendingUp } from "lucide-react";
import { RecommendedProduct, audioProducts } from "@/lib/product-data";
import { useAuth } from "@/contexts/auth-context";

interface ProductRecommendationsProps {
  productId: string;
}

export function ProductRecommendations({
  productId,
}: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState<RecommendedProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { isLoggedIn, session } = useAuth();

  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isLoggedIn || !session) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        
        // Force to show something for testing purposes - remove this once fixed
        const useSampleData = true;
        
        if (useSampleData) {
          console.log("Using sample data directly for testing");
          setRecommendations(audioProducts.slice(0, 4));
          return;
        }
        
        // Get auth token for the authenticated request
        const { access_token } = session;
        
        console.log("Fetching recommendations with token:", !!access_token);
        const response = await fetch(`/api/v1/products/${productId}/recommendations?limit=4`, {
          headers: {
            'Authorization': `Bearer ${access_token}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`API error: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        
        // Debug logging
        console.log("API Response:", data);
        console.log("Has recommended_products array:", !!data.recommended_products);
        console.log("Array length:", data.recommended_products?.length || 0);
        
        // Log all the keys in the response to see the correct structure
        console.log("All response keys:", Object.keys(data));
        
        if (!data.recommended_products) {
          console.warn("No recommended_products field in API response");
          
          // Check for other possible field names
          const possibleFields = ['recommendations', 'products', 'items', 'results', 'data'];
          for (const field of possibleFields) {
            if (data[field] && Array.isArray(data[field])) {
              console.log(`Found ${field} field instead, using that`);
              data.recommended_products = data[field];
              break;
            }
          }
          
          // If still no data, create an empty array to prevent errors
          if (!data.recommended_products) {
            console.warn("No suitable product array found in response");
            data.recommended_products = [];
          }
        }
        
        if (data.recommended_products && Array.isArray(data.recommended_products)) {
          // Transform the API response to match our RecommendedProduct type
          const transformedProducts = data.recommended_products.map((item: any) => ({
            id: item.id || item.product_id || item.variant_id,
            name: item.name || item.product_name || item.title,
            brand: item.brand || "Unknown",
            category: item.category || item.category_name || "General",
            price: item.price || item.current_price,
            originalPrice: item.original_price || item.previous_price,
            retailer: item.retailer || item.shop_name,
            inStock: item.in_stock !== false,
            image: item.image || item.image_url || "/placeholder.svg",
            discount: item.discount_percentage || 
              (item.original_price && item.price ? 
                Math.round(((item.original_price - item.price) / item.original_price) * 100) : 0),
            recommendationType: item.recommendation_type || "COMPLEMENTARY",
            recommendationScore: item.recommendation_score || 0.85,
          }));
          
          console.log("Setting recommendations with", transformedProducts.length, "items");
          setRecommendations(transformedProducts);
        }
      } catch (error: any) {
        console.error("Error fetching recommendations:", error);
        setError(error.message || "Failed to fetch recommendations");
        console.log("Using fallback sample data");
        // Fallback to sample data in case of error
        setRecommendations(audioProducts.slice(0, 4));
      } finally {
        // Note: recommendations.length here will show the previous value, not the updated one
        // because React state updates are asynchronous
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [productId, isLoggedIn, session]);

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

  // Debug logging for component state
  console.log("ProductRecommendations state:", { 
    isLoggedIn, 
    hasSession: !!session,
    loading,
    recommendationsCount: recommendations.length 
  });

  // Only render the component when the user is logged in
  if (!isLoggedIn) {
    console.log("Not rendering recommendations - user not logged in");
    return null;
  }

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Recommendations For You</span>
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="h-[250px] bg-muted rounded-lg mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // If there are no recommendations, don't render the component
  if (recommendations.length === 0) {
    console.log("Not rendering recommendations - no recommendations available");
    
    // If there was an error, show error message instead of returning null
    if (error) {
      return (
        <Card className="border-red-200">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Sparkles className="h-5 w-5" />
              <span>Recommendations For You</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-500">
              Unable to load recommendations. Please try again later.
            </p>
          </CardContent>
        </Card>
      );
    }
    
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>Recommendations For You</span>
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
