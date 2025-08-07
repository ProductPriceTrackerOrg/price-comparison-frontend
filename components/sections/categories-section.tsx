import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Camera,
  Gamepad2,
  Tablet,
  Monitor,
  Tv,
  Speaker,
  Mouse,
  Keyboard,
  ArrowRight,
  Sparkles,
  ChevronRight,
} from "lucide-react";

export function CategoriesSection() {
  const categories = [
    {
      name: "Smartphones",
      icon: Smartphone,
      count: "450K+",
      href: "/category/smartphones",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
      hoverBg: "group-hover:bg-blue-100",
    },
    {
      name: "Laptops",
      icon: Laptop,
      count: "125K+",
      href: "/category/laptops",
      color: "text-green-500",
      bgColor: "bg-green-50",
      hoverBg: "group-hover:bg-green-100",
    },
    {
      name: "Smart Watches",
      icon: Watch,
      count: "85K+",
      href: "/category/smartwatches",
      color: "text-purple-500",
      bgColor: "bg-purple-50",
      hoverBg: "group-hover:bg-purple-100",
    },
    {
      name: "Headphones",
      icon: Headphones,
      count: "200K+",
      href: "/category/headphones",
      color: "text-orange-500",
      bgColor: "bg-orange-50",
      hoverBg: "group-hover:bg-orange-100",
    },
    {
      name: "Cameras",
      icon: Camera,
      count: "75K+",
      href: "/category/cameras",
      color: "text-cyan-500",
      bgColor: "bg-cyan-50",
      hoverBg: "group-hover:bg-cyan-100",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      count: "150K+",
      href: "/category/gaming",
      color: "text-pink-500",
      bgColor: "bg-pink-50",
      hoverBg: "group-hover:bg-pink-100",
    },
    {
      name: "Tablets",
      icon: Tablet,
      count: "95K+",
      href: "/category/tablets",
      color: "text-indigo-500",
      bgColor: "bg-indigo-50",
      hoverBg: "group-hover:bg-indigo-100",
    },
    {
      name: "Monitors",
      icon: Monitor,
      count: "110K+",
      href: "/category/monitors",
      color: "text-red-500",
      bgColor: "bg-red-50",
      hoverBg: "group-hover:bg-red-100",
    },
  ];

  return (
    <section className="py-16 bg-gray-50 relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-pattern opacity-5"></div>
      <div className="absolute top-10 right-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-40 h-40 bg-chart-1/5 rounded-full blur-3xl"></div>

      <div className="container mx-auto px-4 relative">
        <div className="text-center mb-16">
          <div className="inline-flex items-center space-x-2 bg-primary/10 backdrop-blur-sm border border-primary/20 rounded-full px-6 py-2 mb-6">
            <Sparkles className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-primary">
              Product Categories
            </span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Browse by <span className="text-gradient">category</span>
          </h2>
          <p className="text-muted-foreground text-xl max-w-2xl mx-auto mb-8">
            Discover the best deals across all major product categories with
            real-time price tracking
          </p>

          <Button variant="outline" size="lg" className="group bg-transparent">
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <Card className="transition-all duration-300 hover:shadow-xl hover:-translate-y-2 border-0 bg-white/80 backdrop-blur-sm">
                <CardContent className="p-8 text-center">
                  <div
                    className={`w-20 h-20 mx-auto mb-6 rounded-2xl ${category.bgColor} ${category.hoverBg} transition-all duration-300 flex items-center justify-center group-hover:scale-110`}
                  >
                    <category.icon
                      className={`h-10 w-10 ${category.color} transition-transform duration-300`}
                    />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-2 text-lg group-hover:text-gray-700 transition-colors">
                    {category.name}
                  </h3>
                  <p className="text-sm text-gray-500 font-medium">
                    {category.count} products
                  </p>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
