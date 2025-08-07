import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { ProductCard } from "@/components/product/product-card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Percent,
  TrendingDown,
  Clock,
  Filter,
  Home,
  ChevronRight,
} from "lucide-react";

export default function DealsPage() {
  const topDeals = [
    {
      id: 1,
      name: "Samsung Galaxy S24 Ultra 256GB",
      brand: "Samsung",
      category: "Smartphones",
      price: 1099.99,
      originalPrice: 1299.99,
      retailer: "TechStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=Samsung+S24",
      discount: 15,
    },
    {
      id: 2,
      name: "MacBook Air M3 13-inch",
      brand: "Apple",
      category: "Laptops",
      price: 999.99,
      originalPrice: 1199.99,
      retailer: "AppleStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=MacBook+Air",
      discount: 17,
    },
    {
      id: 3,
      name: "Sony WH-1000XM5 Headphones",
      brand: "Sony",
      category: "Headphones",
      price: 299.99,
      originalPrice: 399.99,
      retailer: "AudioHub",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=Sony+WH1000XM5",
      discount: 25,
    },
    {
      id: 4,
      name: "iPad Pro 12.9-inch M2",
      brand: "Apple",
      category: "Tablets",
      price: 999.99,
      originalPrice: 1199.99,
      retailer: "TechMart",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=iPad+Pro",
      discount: 17,
    },
    {
      id: 5,
      name: "Dell XPS 13 Plus",
      brand: "Dell",
      category: "Laptops",
      price: 849.99,
      originalPrice: 1099.99,
      retailer: "ComputerHub",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=Dell+XPS",
      discount: 23,
    },
    {
      id: 6,
      name: "AirPods Pro 2nd Gen",
      brand: "Apple",
      category: "Audio",
      price: 199.99,
      originalPrice: 249.99,
      retailer: "AudioStore",
      inStock: true,
      image: "/placeholder.svg?height=200&width=200&text=AirPods+Pro",
      discount: 20,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
          <Home className="h-4 w-4" />
          <span>Home</span>
          <ChevronRight className="h-4 w-4" />
          <span className="font-medium text-gray-900">Deals</span>
        </div>

        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-3 bg-orange-100 rounded-full">
              <Percent className="h-6 w-6 text-orange-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Top Deals</h1>
              <p className="text-gray-600">
                Discover the best discounts and price drops across all
                categories
              </p>
            </div>
          </div>
        </div>

        {/* Stats Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
            <TrendingDown className="h-8 w-8 text-green-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">1,234</div>
            <div className="text-gray-600">Active Deals</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
            <Percent className="h-8 w-8 text-orange-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">35%</div>
            <div className="text-gray-600">Average Discount</div>
          </div>
          <div className="bg-white rounded-lg p-6 text-center shadow-sm border">
            <Clock className="h-8 w-8 text-blue-500 mx-auto mb-2" />
            <div className="text-2xl font-bold text-gray-900">24h</div>
            <div className="text-gray-600">Updated Every</div>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="flex items-center justify-between mb-8 bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              All Categories
            </Button>
            <Button variant="outline" size="sm">
              Discount: 20%+
            </Button>
            <Button variant="outline" size="sm">
              In Stock Only
            </Button>
          </div>
          <div className="text-sm text-gray-600">Showing 4 deals</div>
        </div>

        {/* Deals Grid - 4 columns on desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {topDeals.slice(0, 4).map((product) => (
            <div key={product.id} className="relative">
              <ProductCard product={product} />
              <div className="absolute top-2 left-2 z-20">
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-bold shadow-lg">
                  HOT DEAL
                </Badge>
              </div>
            </div>
          ))}
        </div>

        {/* Load More */}
        <div className="text-center mt-12">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
            Load More Deals
          </Button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
