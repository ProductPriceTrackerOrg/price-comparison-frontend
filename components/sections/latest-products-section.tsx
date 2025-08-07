"use client";

import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight, Clock } from "lucide-react";

export function LatestProductsSection() {
  const latestProducts = [
    {
      id: 13,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      category: "Smartphones",
      price: 1199.99,
      originalPrice: 1299.99,
      retailer: "TechStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 8,
    },
    {
      id: 14,
      name: "MacBook Air M3",
      brand: "Apple",
      category: "Laptops",
      price: 1099.99,
      originalPrice: 1199.99,
      retailer: "AppleStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 8,
    },
    {
      id: 15,
      name: "Sony WH-1000XM5",
      brand: "Sony",
      category: "Headphones",
      price: 349.99,
      originalPrice: 399.99,
      retailer: "AudioHub",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 13,
    },
    {
      id: 16,
      name: "iPad Pro 12.9",
      brand: "Apple",
      category: "Tablets",
      price: 1099.99,
      retailer: "TechMart",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
    },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <Clock className="h-6 w-6 text-blue-600 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">
                Latest Products
              </h2>
              <p className="text-gray-600">
                Recently added to our tracking system
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden md:flex bg-transparent"
          >
            <a href="/products/latest">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <a href="/products/latest">
              View All Latest Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
