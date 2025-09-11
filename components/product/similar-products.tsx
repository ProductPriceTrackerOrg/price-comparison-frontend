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
    // In a real implementation, this would call an API endpoint
    // const fetchSimilarProducts = async () => {
    //   const response = await fetch(`/api/products/${productId}/similar`);
    //   const data = await response.json();
    //   setProducts(data.products);
    // };
    // fetchSimilarProducts();

    // Using our centralized product data from lib/product-data.ts
    // Limit to only 4 items by using slice
    setProducts(smartphones.slice(0, 4));
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
