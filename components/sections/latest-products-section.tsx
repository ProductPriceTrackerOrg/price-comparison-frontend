"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product/product-card";
import { ArrowRight, Clock } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";

// Define interface for the products
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  retailer_id?: number;
  inStock: boolean;
  image: string;
  discount?: number;
  rating?: number;
  reviews_count?: number;
  added_date?: string;
}

interface ApiProduct {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  original_price?: number;
  retailer: string;
  retailer_id?: number;
  in_stock: boolean;
  image: string;
  discount?: number;
  rating?: number;
  reviews_count?: number;
  added_date?: string;
}

export function LatestProductsSection() {
  const [latestProducts, setLatestProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Default fallback products in case API fails
  const fallbackProducts = [
    {
      id: 13,
      name: "Samsung Galaxy S24 Ultra",
      brand: "Samsung",
      category: "Smartphones",
      price: 1199.99,
      originalPrice: 1299.99,
      retailer: "TechStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
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
      image: "/placeholder.svg?height=200&width=200",
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
      image: "/placeholder.svg?height=200&width=200",
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
      image: "/placeholder.svg?height=200&width=200",
    },
  ];

  useEffect(() => {
    const fetchLatestProducts = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/home/latest?limit=4`);
        if (!response.ok) {
          throw new Error('Failed to fetch latest products');
        }
        
        const data = await response.json();
        
        // Map API response to our Product interface
        const products: Product[] = data.products.map((product: ApiProduct) => ({
          id: product.id,
          name: product.name,
          brand: product.brand || "Unknown",
          category: product.category,
          price: product.price,
          originalPrice: product.original_price,
          retailer: product.retailer,
          inStock: product.in_stock,
          image: product.image || "/placeholder.svg?height=200&width=200",
          discount: product.discount,
          rating: product.rating,
          reviews_count: product.reviews_count,
          added_date: product.added_date
        }));
        
        setLatestProducts(products);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching latest products:', error);
        setLatestProducts(fallbackProducts);
        setError('Failed to load latest products');
        setLoading(false);
      }
    };

    fetchLatestProducts();
  }, []);

  return (
    <section className="py-14 bg-gradient-to-br from-gray-50 to-blue-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0 z-0">
        <div
          className="absolute top-0 left-0 w-full h-full opacity-30"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234338ca' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
        <div className="absolute -bottom-32 -right-32 w-64 h-64 bg-blue-200 rounded-full opacity-20 blur-3xl"></div>
        <div className="absolute -top-32 -left-32 w-64 h-64 bg-indigo-200 rounded-full opacity-20 blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="p-3 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-lg mr-4">
              <Clock className="h-6 w-6 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-700">
                Latest Products
              </h2>
              <p className="text-gray-600">
                Fresh arrivals to our tracking system
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden md:flex bg-transparent border-blue-300 hover:bg-blue-50 text-blue-700"
          >
            <a href="/new-arrivals">
              View All
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {latestProducts.map((product, index) => (
            <div
              key={product.id}
              className="transform hover:scale-105 transition-all duration-300 group"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-md group-hover:shadow-xl border border-blue-100 group-hover:border-blue-200 transition-all duration-300">
                <div className="absolute top-2 right-2 z-10">
                  <div className="flex items-center bg-blue-600 text-white text-xs rounded-full py-1 px-2 font-semibold shadow-lg">
                    NEW ARRIVAL
                  </div>
                </div>
                <ProductCard product={product} />

                {/* Highlight effect on hover - moved to back with pointer-events-none */}
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/10 to-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button
            variant="outline"
            asChild
            className="bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 border-blue-300 text-blue-700"
          >
            <a href="/new-arrivals">
              View All Latest Products
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
