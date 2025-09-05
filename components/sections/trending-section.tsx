"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ProductCard } from "@/components/product/product-card";
import {
  TrendingUp,
  Sparkles,
  ArrowRight,
  FlameIcon as Fire,
  Star,
  Zap,
  Clock,
  Users,
} from "lucide-react";

export function TrendingSection() {
  const [activeTab, setActiveTab] = useState("trends");
  const router = useRouter();

  const handleExploreAll = () => {
    if (activeTab === "trends") {
      router.push("/trending");
    } else {
      router.push("/new-arrivals");
    }
  };

  const trendingProducts = [
    {
      id: 7,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      category: "Smartphones",
      price: 1299.99,
      originalPrice: 1399.99,
      retailer: "MobileWorld",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 7,
      trendScore: 98,
      searchVolume: "+245%",
      priceChange: -7.2,
    },
    {
      id: 8,
      name: "Samsung Galaxy Watch 6",
      brand: "Samsung",
      category: "Smartwatches",
      price: 329.99,
      originalPrice: 399.99,
      retailer: "WearableTech",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 18,
      trendScore: 94,
      searchVolume: "+189%",
      priceChange: -17.5,
    },
    {
      id: 9,
      name: "Google Pixel 8 Pro",
      brand: "Google",
      category: "Smartphones",
      price: 799.99,
      originalPrice: 899.99,
      retailer: "TechMart",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 11,
      trendScore: 91,
      searchVolume: "+156%",
      priceChange: -11.1,
    },
    {
      id: 10,
      name: "Microsoft Surface Pro 9",
      brand: "Microsoft",
      category: "Tablets",
      price: 999.99,
      originalPrice: 1199.99,
      retailer: "ComputerStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 17,
      trendScore: 87,
      searchVolume: "+134%",
      priceChange: -16.7,
    },
    {
      id: 8,
      name: "Samsung Galaxy Watch 6",
      brand: "Samsung",
      category: "Smartwatches",
      price: 329.99,
      originalPrice: 399.99,
      retailer: "WearableTech",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 18,
      trendScore: 94,
      searchVolume: "+189%",
      priceChange: -17.5,
    },
    {
      id: 9,
      name: "Google Pixel 8 Pro",
      brand: "Google",
      category: "Smartphones",
      price: 799.99,
      originalPrice: 899.99,
      retailer: "TechMart",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 11,
      trendScore: 91,
      searchVolume: "+156%",
      priceChange: -11.1,
    },
    {
      id: 10,
      name: "Microsoft Surface Pro 9",
      brand: "Microsoft",
      category: "Tablets",
      price: 999.99,
      originalPrice: 1199.99,
      retailer: "ComputerStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      discount: 17,
      trendScore: 87,
      searchVolume: "+134%",
      priceChange: -16.7,
    },
  ];

  const newLaunches = [
    {
      id: 11,
      name: "Nothing Phone 2a",
      brand: "Nothing",
      category: "Smartphones",
      price: 399.99,
      retailer: "TechStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      launchDate: "2024-01-15",
      preOrders: 15420,
      rating: 4.8,
      isNew: true,
    },
    {
      id: 12,
      name: "Framework Laptop 16",
      brand: "Framework",
      category: "Laptops",
      price: 1699.99,
      retailer: "FrameworkStore",
      inStock: true,
      image:
        "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
      launchDate: "2024-01-10",
      preOrders: 8930,
      rating: 4.9,
      isNew: true,
    },
  ];

  return (
    <section className="py-16 bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-600/10 to-purple-600/10"></div>
        <div className="absolute top-20 left-20 w-64 h-64 bg-gradient-to-br from-orange-500/20 to-red-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-80 h-80 bg-gradient-to-br from-blue-500/20 to-cyan-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        {/* Enhanced Tab Navigation */}
        <div className="flex justify-center mb-12">
          <div className="bg-white/10 rounded-2xl p-2 backdrop-blur-lg border border-white/20 shadow-2xl">
            <Button
              variant={activeTab === "trends" ? "default" : "ghost"}
              onClick={() => setActiveTab("trends")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "trends"
                  ? "bg-white text-slate-900 shadow-lg transform scale-105"
                  : "text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              <TrendingUp className="h-5 w-5 mr-2" />
              New Trends
              <Badge className="ml-2 bg-orange-500 text-white border-0">
                Hot
              </Badge>
            </Button>
            <Button
              variant={activeTab === "launches" ? "default" : "ghost"}
              onClick={() => setActiveTab("launches")}
              className={`px-8 py-3 rounded-xl transition-all duration-300 ${
                activeTab === "launches"
                  ? "bg-white text-slate-900 shadow-lg transform scale-105"
                  : "text-white hover:bg-white/20 hover:scale-105"
              }`}
            >
              <Sparkles className="h-5 w-5 mr-2" />
              New Launches
              <Badge className="ml-2 bg-green-500 text-white border-0">
                Fresh
              </Badge>
            </Button>
          </div>
        </div>

        {/* Enhanced Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          {/* Left side - Enhanced Info */}
          <div className="text-center lg:text-left space-y-8">
            {activeTab === "trends" ? (
              <>
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2">
                    <Fire className="h-4 w-4 text-orange-400" />
                    <span className="text-sm font-medium text-orange-300">
                      Trending Now
                    </span>
                  </div>

                  <h2 className="text-5xl font-bold mb-6 leading-tight">
                    Discover What's
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-red-400">
                      Trending
                    </span>
                  </h2>

                  <p className="text-xl text-slate-300 leading-relaxed">
                    Stay ahead of the market with real-time trending analysis
                    powered by AI
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-red-500 rounded-xl flex items-center justify-center">
                      <TrendingUp className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Real-time Trend Detection
                      </h4>
                      <p className="text-sm text-slate-300">
                        AI-powered analysis of search patterns
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-xl flex items-center justify-center">
                      <Users className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Market Insights
                      </h4>
                      <p className="text-sm text-slate-300">
                        Consumer behavior and demand forecasting
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center">
                      <Zap className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Price Movement Tracking
                      </h4>
                      <p className="text-sm text-slate-300">
                        Monitor trending price changes
                      </p>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="space-y-6">
                  <div className="inline-flex items-center space-x-2 bg-green-500/20 backdrop-blur-sm border border-green-500/30 rounded-full px-6 py-2">
                    <Sparkles className="h-4 w-4 text-green-400" />
                    <span className="text-sm font-medium text-green-300">
                      Just Launched
                    </span>
                  </div>

                  <h2 className="text-5xl font-bold mb-6 leading-tight">
                    Latest Product
                    <span className="block text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-blue-400">
                      Launches
                    </span>
                  </h2>

                  <p className="text-xl text-slate-300 leading-relaxed">
                    Be the first to discover and track newly launched products
                  </p>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-500 rounded-xl flex items-center justify-center">
                      <Sparkles className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Early Access Deals
                      </h4>
                      <p className="text-sm text-slate-300">
                        Exclusive pricing for new products
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center">
                      <Clock className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Pre-order Tracking
                      </h4>
                      <p className="text-sm text-slate-300">
                        Monitor availability and delivery dates
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-4 p-4 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-violet-500 rounded-xl flex items-center justify-center">
                      <Star className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h4 className="font-semibold text-white">
                        Innovation Showcase
                      </h4>
                      <p className="text-sm text-slate-300">
                        Latest tech breakthroughs and features
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <Button
              size="lg"
              onClick={handleExploreAll}
              className="bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white px-8 py-4 rounded-xl font-semibold transform hover:scale-105 transition-all duration-200 shadow-2xl"
            >
              Explore All {activeTab === "trends" ? "Trends" : "Launches"}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Right side - Enhanced Products Grid */}
          <div>
            {activeTab === "trends" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {trendingProducts.slice(0, 2).map((product, index) => (
                  <div
                    key={product.id}
                    className="relative group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute -top-2 -right-2 z-20">
                      <Badge className="bg-gradient-to-r from-orange-500 to-red-500 text-white font-bold shadow-lg animate-pulse">
                        #{index + 1} TRENDING
                      </Badge>
                    </div>

                    {/* Trend Metrics Overlay */}
                    <div className="absolute top-4 left-4 z-20 space-y-1">
                      <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        {product.trendScore}% Hot
                      </Badge>
                      <Badge className="bg-green-600/80 text-white text-xs backdrop-blur-sm">
                        {product.searchVolume} searches
                      </Badge>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:border-white/20 transition-all duration-300">
                      <ProductCard product={product} />

                      {/* Glow effect on hover - moved to back with pointer-events-none */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {activeTab === "launches" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {newLaunches.slice(0, 2).map((product) => (
                  <div
                    key={product.id}
                    className="relative group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute -top-2 -right-2 z-20">
                      <Badge className="bg-gradient-to-r from-green-500 to-blue-500 text-white font-bold shadow-lg animate-bounce">
                        <Sparkles className="h-3 w-3 mr-1" />
                        NEW
                      </Badge>
                    </div>

                    {/* Launch Metrics Overlay */}
                    <div className="absolute top-4 left-4 z-20 space-y-1">
                      <Badge className="bg-black/70 text-white text-xs backdrop-blur-sm">
                        <Clock className="h-3 w-3 mr-1" />
                        {new Date(product.launchDate).toLocaleDateString()}
                      </Badge>
                      <Badge className="bg-blue-600/80 text-white text-xs backdrop-blur-sm">
                        {product.preOrders.toLocaleString()} pre-orders
                      </Badge>
                      <Badge className="bg-yellow-600/80 text-white text-xs backdrop-blur-sm">
                        <Star className="h-3 w-3 mr-1" />
                        {product.rating}
                      </Badge>
                    </div>

                    <div className="relative overflow-hidden rounded-2xl shadow-lg border border-white/10 hover:shadow-xl hover:border-white/20 transition-all duration-300">
                      <ProductCard product={product} />

                      {/* Glow effect on hover - moved to back with pointer-events-none */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
