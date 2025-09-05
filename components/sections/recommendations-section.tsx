"use client";

import { useAuth } from "@/contexts/auth-context";
import { ProductCard } from "@/components/product/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Users, Heart } from "lucide-react";

export function RecommendationsSection() {
  const { isLoggedIn } = useAuth();

  // Mock recommendation data
  const recommendations = {
    forYou: [
      {
        id: 1,
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
        id: 2,
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
    ],
    trending: [
      {
        id: 3,
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
        id: 4,
        name: "iPad Pro 12.9",
        brand: "Apple",
        category: "Tablets",
        price: 1099.99,
        retailer: "TechMart",
        inStock: true,
        image: "/placeholder.svg?height=200&width=200",
      },
    ],
    collaborative: [
      {
        id: 5,
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
        id: 6,
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
    ],
  };

  if (!isLoggedIn) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-purple-50"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100/30 to-transparent"></div>
      <div className="absolute right-10 top-20 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute left-10 bottom-20 w-72 h-72 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"></div>

      {/* Subtle patterns */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-5">
            <div className="bg-white p-2 rounded-full">
              <Sparkles className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-5">
            Personalized For You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Curated recommendations based on your browsing patterns and
            preferences
          </p>
        </div>

        <div className="space-y-12">
          {/* For You Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-100 mr-4">
                <Sparkles className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Recommended for You
                </h3>
                <p className="text-gray-600 text-sm mt-1">
                  Tailored to your interests
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.forYou.map((product) => (
                <div
                  key={product.id}
                  className="group transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-indigo-100 group-hover:border-indigo-200 transition-all duration-300">
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                        Just For You
                      </div>
                    </div>
                    <ProductCard product={product} />
                    {/* Highlight effect on hover - moved to back with pointer-events-none */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg shadow-green-100 mr-4">
                <TrendingUp className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Trending Products
                </h3>
                <p className="text-gray-600 text-sm mt-1">Popular right now</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.trending.map((product) => (
                <div
                  key={product.id}
                  className="group transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-green-100 group-hover:border-green-200 transition-all duration-300">
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                        <TrendingUp className="h-3 w-3 mr-1 inline" />
                        Hot
                      </div>
                    </div>
                    <ProductCard product={product} />
                    {/* Highlight effect on hover - moved to back with pointer-events-none */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Users Also Bought */}
          <div className="mb-16">
            <div className="flex items-center mb-8">
              <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-100 mr-4">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  Users Also Bought
                </h3>
                <p className="text-gray-600 text-sm mt-1">Customer favorites</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.collaborative.map((product) => (
                <div
                  key={product.id}
                  className="group transform hover:scale-105 transition-all duration-300"
                >
                  <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-purple-100 group-hover:border-purple-200 transition-all duration-300">
                    <div className="absolute top-3 right-3 z-10">
                      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                        Popular Pick
                      </div>
                    </div>
                    <ProductCard product={product} />
                    {/* Highlight effect on hover - moved to back with pointer-events-none */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Insights */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mr-3">
                <Heart className="h-5 w-5 text-indigo-600" />
              </div>
              How We Create Your Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">For You</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis of your browsing patterns, search history,
                  and time spent viewing products
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Trending</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Real-time analysis of popular products with significant price
                  drops and high engagement
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Collaborative</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Products frequently purchased together and highly rated by
                  customers with similar preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
