"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ProductCard } from "@/components/product/product-card";
import { Button } from "@/components/ui/button";
import { ExternalLink, Shuffle } from "lucide-react";

interface SimilarProductsProps {
  productId: string;
}

export function SimilarProducts({ productId }: SimilarProductsProps) {
  const [products, setProducts] = useState([]);

  // Mock similar products
  const mockProducts = [
    {
      id: 2,
      name: "Samsung Galaxy S24",
      brand: "Samsung",
      category: "Smartphones",
      price: 899.99,
      originalPrice: 999.99,
      retailer: "MobileHub",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 10,
    },
    {
      id: 3,
      name: "iPhone 15 Pro",
      brand: "Apple",
      category: "Smartphones",
      price: 1099.99,
      originalPrice: 1199.99,
      retailer: "AppleStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 8,
    },
    {
      id: 4,
      name: "Google Pixel 8 Pro",
      brand: "Google",
      category: "Smartphones",
      price: 799.99,
      originalPrice: 899.99,
      retailer: "TechMart",
      inStock: false,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 11,
    },
    {
      id: 5,
      name: "OnePlus 12",
      brand: "OnePlus",
      category: "Smartphones",
      price: 699.99,
      originalPrice: 799.99,
      retailer: "GadgetWorld",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 13,
    },
  ];

  useEffect(() => {
    setProducts(mockProducts);
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
