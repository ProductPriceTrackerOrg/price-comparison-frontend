"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shuffle } from "lucide-react";
import { Product, smartphones } from "@/lib/product-data";

interface SimilarProductsProps {
  productId: string;
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const fetchSimilarProducts = async () => {
      try {
        const response = await fetch(
          `/api/v1/products/${productId}/similar?limit=8`
        );

        if (!response.ok) {
          throw new Error(
            `API error: ${response.status} ${response.statusText}`
          );
        }

        const data = await response.json();

        if (data.similar_products && Array.isArray(data.similar_products)) {
          // Transform the API response to match our Product type
          const transformedProducts = data.similar_products.map(
            (item: any) => ({
              id: item.id || item.product_id || item.variant_id,
              name: item.name || item.product_name || item.title,
              brand: item.brand || "Unknown",
              category: item.category || item.category_name || "General",
              price: item.price || item.current_price,
              originalPrice: item.original_price || item.previous_price,
              retailer: item.retailer || item.shop_name,
              inStock: item.in_stock !== false,
              image: item.image || item.image_url || "/placeholder.svg",
              discount:
                item.discount_percentage ||
                (item.original_price && item.price
                  ? Math.round(
                      ((item.original_price - item.price) /
                        item.original_price) *
                        100
                    )
                  : 0),
            })
          );

          setProducts(transformedProducts);
        }
      } catch (error) {
        console.error("Error fetching similar products:", error);
        // Fallback to sample data in case of error
        setProducts(smartphones.slice(0, 4));
      }
    };

    if (productId) {
      fetchSimilarProducts();
    }
  }, [productId]);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Shuffle className="h-5 w-5" />
            <span>Similar Products</span>
          </CardTitle>
          <Button variant="outline" size="sm">
            <ExternalLink className="mr-2 h-4 w-4" />
            View All
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
