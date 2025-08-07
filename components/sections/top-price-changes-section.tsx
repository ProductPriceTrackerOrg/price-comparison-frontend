"use client"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { TrendingDown, ArrowRight } from "lucide-react"
import { ProductCard } from "@/components/product/product-card"

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
  ]

  return (
    <section className="py-16 bg-gray-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center">
            <TrendingDown className="h-6 w-6 text-green-600 mr-3" />
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Top Price Changes</h2>
              <p className="text-gray-600">Biggest price drops in the last 24 hours</p>
            </div>
          </div>
          <Button variant="outline" asChild className="hidden md:flex bg-transparent">
            <a href="/price-changes">
              View All Changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {priceDrops.map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-2 left-2">
                <Badge className="bg-green-500 hover:bg-green-600 text-white font-semibold flex items-center gap-1">
                  <TrendingDown className="h-3 w-3" />-{product.discount}%
                </Badge>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 md:hidden">
          <Button variant="outline" asChild>
            <a href="/price-changes">
              View All Price Changes
              <ArrowRight className="ml-2 h-4 w-4" />
            </a>
          </Button>
        </div>
      </div>
    </section>
  )
}
