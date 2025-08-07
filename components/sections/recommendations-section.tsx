"use client"

import { useAuth } from "@/contexts/auth-context"
import { ProductCard } from "@/components/product/product-card"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, TrendingUp, Users, Heart } from "lucide-react"

export function RecommendationsSection() {
  const { isLoggedIn } = useAuth()

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
  }

  if (!isLoggedIn) {
    return null
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Personalized Recommendations</h2>
          <p className="text-gray-600">Based on your browsing history and preferences</p>
        </div>

        <div className="space-y-12">
          {/* For You Section */}
          <div>
            <div className="flex items-center mb-6">
              <Sparkles className="h-6 w-6 text-blue-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Recommended for You</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.forYou.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Trending Section */}
          <div>
            <div className="flex items-center mb-6">
              <TrendingUp className="h-6 w-6 text-green-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Trending Now</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.trending.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>

          {/* Users Also Bought */}
          <div>
            <div className="flex items-center mb-6">
              <Users className="h-6 w-6 text-purple-600 mr-2" />
              <h3 className="text-2xl font-bold text-gray-900">Users Also Bought</h3>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {recommendations.collaborative.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        </div>

        {/* Recommendation Insights */}
        <Card className="mt-12 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center text-blue-900">
              <Heart className="h-5 w-5 mr-2" />
              Why these recommendations?
            </CardTitle>
          </CardHeader>
          <CardContent className="text-blue-800">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
              <div>
                <strong>For You:</strong> Based on your recent searches and viewed products
              </div>
              <div>
                <strong>Trending:</strong> Popular products with great deals right now
              </div>
              <div>
                <strong>Users Also Bought:</strong> Products frequently purchased together
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  )
}
