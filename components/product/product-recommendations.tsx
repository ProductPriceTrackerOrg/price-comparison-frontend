"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ProductCard } from "@/components/product/product-card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { ExternalLink, Sparkles, Users, TrendingUp } from "lucide-react"

interface ProductRecommendationsProps {
  productId: string
}

export function ProductRecommendations({ productId }: ProductRecommendationsProps) {
  const [recommendations, setRecommendations] = useState([])

  // Mock recommendation data with different types
  const mockRecommendations = [
    {
      id: 6,
      name: "Samsung Galaxy Buds Pro 2",
      brand: "Samsung",
      category: "Audio",
      price: 199.99,
      originalPrice: 229.99,
      retailer: "AudioHub",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 13,
      recommendationType: "COMPLEMENTARY",
      recommendationScore: 0.92,
    },
    {
      id: 7,
      name: "Samsung 45W Fast Charger",
      brand: "Samsung",
      category: "Accessories",
      price: 49.99,
      originalPrice: 59.99,
      retailer: "TechStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 17,
      recommendationType: "COMPLEMENTARY",
      recommendationScore: 0.88,
    },
    {
      id: 8,
      name: "iPhone 15 Pro Max",
      brand: "Apple",
      category: "Smartphones",
      price: 1299.99,
      originalPrice: 1399.99,
      retailer: "AppleStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 7,
      recommendationType: "COLLABORATIVE",
      recommendationScore: 0.85,
    },
    {
      id: 9,
      name: "Samsung Galaxy Watch 6 Classic",
      brand: "Samsung",
      category: "Smartwatches",
      price: 379.99,
      originalPrice: 429.99,
      retailer: "WearableTech",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200",
      discount: 12,
      recommendationType: "TRENDING",
      recommendationScore: 0.79,
    },
  ]

  useEffect(() => {
    setRecommendations(mockRecommendations)
  }, [productId])

  const getRecommendationIcon = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return <Sparkles className="h-4 w-4" />
      case "COLLABORATIVE":
        return <Users className="h-4 w-4" />
      case "TRENDING":
        return <TrendingUp className="h-4 w-4" />
      default:
        return <Sparkles className="h-4 w-4" />
    }
  }

  const getRecommendationLabel = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return "Perfect Match"
      case "COLLABORATIVE":
        return "Users Also Bought"
      case "TRENDING":
        return "Trending Now"
      default:
        return "Recommended"
    }
  }

  const getRecommendationColor = (type: string) => {
    switch (type) {
      case "COMPLEMENTARY":
        return "default"
      case "COLLABORATIVE":
        return "secondary"
      case "TRENDING":
        return "destructive"
      default:
        return "default"
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center space-x-2">
            <Sparkles className="h-5 w-5" />
            <span>AI Recommendations</span>
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
              • <strong>Perfect Match:</strong> Accessories and complementary products that work great with your
              selection
            </p>
            <p>
              • <strong>Users Also Bought:</strong> Products frequently purchased together by other customers
            </p>
            <p>
              • <strong>Trending Now:</strong> Popular products in the same category with great deals
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
