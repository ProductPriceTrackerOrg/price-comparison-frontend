"use client";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingDown, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/product/product-card";

export function TopPriceChangesSection() {
  const priceDrops = [
    {
      id: 17,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      category: "Smartphones",
      price: 1099.99,
      originalPrice: 1199.99,
      retailer: "MobileWorld",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 8,
    },
    {
      id: 18,
      name: "Dell XPS 13",
      brand: "Dell",
      category: "Laptops",
      price: 899.99,
      originalPrice: 1099.99,
      retailer: "ComputerHub",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 18,
    },
    {
      id: 19,
      name: "AirPods Pro 2",
      brand: "Apple",
      category: "Audio",
      price: 199.99,
      originalPrice: 249.99,
      retailer: "AudioStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 20,
    },
    {
      id: 20,
      name: "Samsung 4K Monitor",
      brand: "Samsung",
      category: "Monitors",
      price: 299.99,
      originalPrice: 399.99,
      retailer: "DisplayTech",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 25,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-r from-green-50 to-emerald-50 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-gradient-to-br from-green-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-gradient-to-tl from-teal-200/20 to-emerald-200/20 rounded-full blur-3xl"></div>

      {/* Subtle pattern overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23047857' fill-opacity='0.1' fill-rule='evenodd'%3E%3Cpath d='M0 20L20 0v5L5 20zm0 10L20 10v5L5 30zM10 0l10 10v5L15 10zm10 10l10 10v5L25 20z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 shadow-lg shadow-green-200 mr-4">
              <TrendingDown className="h-7 w-7 text-white" />
            </div>
            <div>
              <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-700">
                Top Price Changes
              </h2>
              <p className="text-gray-600 font-medium">
                Biggest savings in the last 24 hours
              </p>
            </div>
          </div>
          <Button
            variant="outline"
            asChild
            className="hidden md:flex border-green-300 hover:bg-green-100/50 text-green-700"
          >
            <a href="/price-drops">
              View All Changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {priceDrops.map((product) => (
            <div
              key={product.id}
              className="relative group transform hover:scale-105 transition-all duration-300"
            >
              <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-green-100 group-hover:border-green-200 transition-all duration-300">
                <ProductCard product={product} />

                {/* Price drop badge with improved styling */}
                <div className="absolute top-3 left-3 z-10">
                  <div className="flex items-center gap-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white text-sm font-bold px-3 py-1 rounded-full shadow-md animate-pulse">
                    <TrendingDown className="h-3.5 w-3.5 mr-0.5" />
                    <span>-{product.discount}%</span>
                  </div>
                </div>

                {/* Savings callout */}
                <div className="absolute top-3 right-3 z-10">
                  <div className="bg-white/90 backdrop-blur-sm text-green-700 text-xs font-bold px-2 py-1 rounded-md shadow-sm border border-green-100">
                    Save ${(product.originalPrice - product.price).toFixed(2)}
                  </div>
                </div>

                {/* Highlight effect on hover - moved to back with pointer-events-none */}
                <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10 md:hidden">
          <Button
            variant="outline"
            asChild
            className="bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 border-green-300 text-green-700"
          >
            <a href="/price-drops">
              View All Price Changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  );
}
