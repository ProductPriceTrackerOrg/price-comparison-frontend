"use client";

import { useState, useMemo } from "react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { PageHeader } from "@/components/layout/page-header";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import Link from "next/link";
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
  Cpu,
  HardDrive,
  Printer,
  Router,
  Search,
  TrendingUp,
  ArrowRight,
  Grid3X3,
  Home,
  ChevronRight,
} from "lucide-react";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("name");

  const categories = [
    {
      name: "Smartphones",
      icon: Smartphone,
      count: "450,234",
      href: "/category/smartphones",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "Latest mobile phones and accessories",
      trending: true,
      popularProducts: [
        "iPhone 15 Pro",
        "Samsung Galaxy S24",
        "Google Pixel 8",
      ],
      avgSavings: "15%",
    },
    {
      name: "Laptops",
      icon: Laptop,
      count: "125,678",
      href: "/category/laptops",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Gaming, business, and ultrabooks",
      trending: false,
      popularProducts: ["MacBook Pro", "Dell XPS 13", "ThinkPad X1"],
      avgSavings: "22%",
    },
    {
      name: "Smart Watches",
      icon: Watch,
      count: "85,432",
      href: "/category/smartwatches",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Fitness trackers and smartwatches",
      trending: true,
      popularProducts: [
        "Apple Watch Series 9",
        "Samsung Galaxy Watch",
        "Fitbit",
      ],
      avgSavings: "18%",
    },
    {
      name: "Headphones",
      icon: Headphones,
      count: "200,567",
      href: "/category/headphones",
      color: "text-orange-600",
      bgColor: "bg-orange-50",
      borderColor: "border-orange-200",
      description: "Wireless, gaming, and studio headphones",
      trending: true,
      popularProducts: ["AirPods Pro", "Sony WH-1000XM5", "Bose QuietComfort"],
      avgSavings: "20%",
    },
    {
      name: "Cameras",
      icon: Camera,
      count: "75,234",
      href: "/category/cameras",
      color: "text-cyan-600",
      bgColor: "bg-cyan-50",
      borderColor: "border-cyan-200",
      description: "DSLR, mirrorless, and action cameras",
      trending: false,
      popularProducts: ["Canon EOS R5", "Sony A7 IV", "GoPro Hero 12"],
      avgSavings: "25%",
    },
    {
      name: "Gaming",
      icon: Gamepad2,
      count: "150,789",
      href: "/category/gaming",
      color: "text-pink-600",
      bgColor: "bg-pink-50",
      borderColor: "border-pink-200",
      description: "Consoles, games, and accessories",
      trending: true,
      popularProducts: ["PlayStation 5", "Xbox Series X", "Nintendo Switch"],
      avgSavings: "12%",
    },
    {
      name: "Tablets",
      icon: Tablet,
      count: "95,123",
      href: "/category/tablets",
      color: "text-indigo-600",
      bgColor: "bg-indigo-50",
      borderColor: "border-indigo-200",
      description: "iPads, Android tablets, and e-readers",
      trending: false,
      popularProducts: ["iPad Pro", "Samsung Galaxy Tab", "Microsoft Surface"],
      avgSavings: "16%",
    },
    {
      name: "Monitors",
      icon: Monitor,
      count: "110,456",
      href: "/category/monitors",
      color: "text-red-600",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      description: "Gaming, 4K, and ultrawide monitors",
      trending: false,
      popularProducts: ["LG UltraGear", "ASUS ROG", "Dell UltraSharp"],
      avgSavings: "19%",
    },
    {
      name: "TVs",
      icon: Tv,
      count: "65,789",
      href: "/category/tvs",
      color: "text-yellow-600",
      bgColor: "bg-yellow-50",
      borderColor: "border-yellow-200",
      description: "Smart TVs, OLED, and QLED displays",
      trending: false,
      popularProducts: ["Samsung QLED", "LG OLED", "Sony Bravia"],
      avgSavings: "28%",
    },
    {
      name: "Speakers",
      icon: Speaker,
      count: "80,345",
      href: "/category/speakers",
      color: "text-teal-600",
      bgColor: "bg-teal-50",
      borderColor: "border-teal-200",
      description: "Bluetooth, smart, and home theater",
      trending: false,
      popularProducts: ["Sonos", "JBL Flip", "Bose SoundLink"],
      avgSavings: "21%",
    },
    {
      name: "Computer Mice",
      icon: Mouse,
      count: "45,678",
      href: "/category/mice",
      color: "text-violet-600",
      bgColor: "bg-violet-50",
      borderColor: "border-violet-200",
      description: "Gaming, wireless, and ergonomic mice",
      trending: false,
      popularProducts: [
        "Logitech MX Master",
        "Razer DeathAdder",
        "SteelSeries",
      ],
      avgSavings: "14%",
    },
    {
      name: "Keyboards",
      icon: Keyboard,
      count: "55,234",
      href: "/category/keyboards",
      color: "text-emerald-600",
      bgColor: "bg-emerald-50",
      borderColor: "border-emerald-200",
      description: "Mechanical, wireless, and gaming keyboards",
      trending: false,
      popularProducts: ["Keychron", "Corsair K95", "Logitech MX Keys"],
      avgSavings: "17%",
    },
    {
      name: "Processors",
      icon: Cpu,
      count: "25,123",
      href: "/category/processors",
      color: "text-gray-600",
      bgColor: "bg-gray-50",
      borderColor: "border-gray-200",
      description: "Intel, AMD, and mobile processors",
      trending: true,
      popularProducts: ["Intel Core i9", "AMD Ryzen 9", "Apple M3"],
      avgSavings: "8%",
    },
    {
      name: "Storage",
      icon: HardDrive,
      count: "89,456",
      href: "/category/storage",
      color: "text-blue-600",
      bgColor: "bg-blue-50",
      borderColor: "border-blue-200",
      description: "SSDs, HDDs, and external storage",
      trending: false,
      popularProducts: ["Samsung 980 Pro", "WD Black", "Seagate Barracuda"],
      avgSavings: "23%",
    },
    {
      name: "Printers",
      icon: Printer,
      count: "35,789",
      href: "/category/printers",
      color: "text-green-600",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      description: "Inkjet, laser, and 3D printers",
      trending: false,
      popularProducts: ["HP LaserJet", "Canon PIXMA", "Epson EcoTank"],
      avgSavings: "26%",
    },
    {
      name: "Networking",
      icon: Router,
      count: "42,345",
      href: "/category/networking",
      color: "text-purple-600",
      bgColor: "bg-purple-50",
      borderColor: "border-purple-200",
      description: "Routers, switches, and WiFi equipment",
      trending: false,
      popularProducts: ["ASUS AX6000", "Netgear Orbi", "TP-Link Archer"],
      avgSavings: "15%",
    },
  ];

  const filteredCategories = useMemo(() => {
    let filtered = categories.filter(
      (category) =>
        category.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        category.description.toLowerCase().includes(searchTerm.toLowerCase())
    );

    // Sort categories
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "count":
          return (
            parseInt(b.count.replace(/,/g, "")) -
            parseInt(a.count.replace(/,/g, ""))
          );
        default:
          return a.name.localeCompare(b.name);
      }
    });

    return filtered;
  }, [searchTerm, sortBy]);

  const trendingCategories = categories.filter((cat) => cat.trending);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Page Header with Beautiful Blue Background */}
          <PageHeader
            title="All Categories"
            icon={Grid3X3}
            breadcrumbItems={[{ label: "All Categories" }]}
          />

          {/* Search and Filter Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-8 border border-gray-200">
            <div className="flex flex-col lg:flex-row gap-4 items-center">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search categories..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 h-12 border-2 border-gray-200 focus:border-blue-500 rounded-xl"
                />
              </div>

              <div className="flex gap-3">
                <select
                  value={sortBy}
                  onChange={(e) =>
                    setSortBy(e.target.value as "name" | "count")
                  }
                  className="px-4 py-3 border-2 border-gray-200 rounded-xl focus:border-blue-500 focus:outline-none"
                >
                  <option value="name">Sort by Name</option>
                  <option value="count">Sort by Product Count</option>
                </select>
              </div>
            </div>
          </div>

          {/* Categories Grid/List */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                All Categories ({filteredCategories.length})
              </h2>
              {searchTerm && (
                <Badge variant="outline" className="text-sm">
                  Showing results for "{searchTerm}"
                </Badge>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredCategories.map((category, index) => (
                <Link key={category.name} href={category.href}>
                  <Card
                    className={`group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 h-full border-2 ${category.borderColor} hover:border-opacity-50`}
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <CardContent className="p-6 text-center h-full flex flex-col">
                      <div className="relative mb-4">
                        <div
                          className={`w-16 h-16 ${category.bgColor} rounded-2xl flex items-center justify-center mx-auto group-hover:scale-110 transition-transform duration-300 border-2 ${category.borderColor}`}
                        >
                          <category.icon
                            className={`h-8 w-8 ${category.color}`}
                          />
                        </div>
                        {category.trending && (
                          <div className="absolute -top-2 -right-2 w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                            <TrendingUp className="h-3 w-3 text-white" />
                          </div>
                        )}
                      </div>

                      <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                        {category.name}
                      </h3>

                      <p className="text-sm text-gray-600 mb-4 flex-grow leading-relaxed">
                        {category.description}
                      </p>

                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-gray-500">
                          <span>Avg. savings</span>
                          <span className="font-semibold text-green-600">
                            {category.avgSavings}
                          </span>
                        </div>

                        <div className="flex items-center justify-center">
                          <Badge
                            variant="secondary"
                            className="text-xs font-medium"
                          >
                            {category.count} products
                          </Badge>
                        </div>

                        <div className="flex items-center justify-center text-blue-600 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                          Explore category{" "}
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* No Results */}
          {filteredCategories.length === 0 && (
            <div className="text-center py-12">
              <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No categories found
              </h3>
              <p className="text-gray-600 mb-4">
                Try adjusting your search terms or browse all categories.
              </p>
              <Button onClick={() => setSearchTerm("")} variant="outline">
                Clear search
              </Button>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
