"use client";

import { useState, useMemo, useEffect } from "react";
import { categoryNameToSlug } from "@/lib/category-data";
import { getAllCategories } from "@/lib/categories-api";

import { PageHeader } from "@/components/layout/page-header";

// Function to map category names/icons to Lucide icons
const getIconForCategory = (iconName: string) => {
  const iconMap: Record<string, any> = {
    mobile_phones: Smartphone,
    laptops: Laptop,
    smart_watches_accessories: Watch,
    headphones_earbuds: Headphones,
    cameras_drones: Camera,
    gaming_peripherals: Gamepad2,
    tablets: Tablet,
    monitors: Monitor,
    speakers: Speaker,
    mice: Mouse,
    keyboards: Keyboard,
    cables_adapters: Cable,
    bags_sleeves_backpacks: Briefcase,
    cases_screen_protectors: ShieldCheck,
    chargers_power_banks: BatteryCharging,
    cpus: Cpu,
    graphic_cards: CircuitBoard,
    memory: MemoryStick,
    storage: HardDrive,
    printers_scanners: Printer,
    networking: Wifi,
    health_personal_care_electronics: HeartPulse,
    power_supplies_pc_cooling: Power,
    smart_home_office_accessories: SmartHomeIcon,
    motherboards: CircuitBoard,
    car_accessories: Car,
    camera_accessories: VideoIcon,
    webcams_microphones: Mic,
  };

  return iconMap[iconName.toLowerCase()] || Package;
};
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
  Briefcase,
  Cable,
  Car,
  BatteryCharging,
  HeartPulse,
  MemoryStick,
  VideoIcon,
  Mic,
  Power,
  ScanLine,
  PenTool,
  Home as SmartHomeIcon,
  Package,
  CircuitBoard,
  Wifi,
  ShieldCheck,
} from "lucide-react";

export default function CategoriesPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<"name" | "count">("name");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [apiCategories, setApiCategories] = useState<any[]>([]);

  useEffect(() => {
    async function fetchCategories() {
      try {
        setLoading(true);
        const data = await getAllCategories(true);
        setApiCategories(data.categories || []);
      } catch (err) {
        console.error("Failed to fetch categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    fetchCategories();
  }, []);

  // Fallback to static categories if API call fails
  const categories =
    apiCategories.length > 0
      ? apiCategories.map((cat) => ({
          name: cat.name,
          icon: getIconForCategory(
            cat.icon || cat.name.toLowerCase().replace(/\s+/g, "_")
          ),
          count: cat.product_count.toLocaleString(),
          href: `/category/${categoryNameToSlug(cat.name)}?id=${
            cat.category_id
          }`,
          color: "text-blue-600",
          bgColor: "bg-blue-50",
          borderColor: "border-blue-200",
          description: cat.description || `${cat.name} and accessories`,
          trending: cat.trending_score > 0.5,
          popularProducts: [],
          avgSavings: "15%",
          labelId: cat.category_id,
        }))
      : [
          {
            name: "Mobile Phones",
            icon: Smartphone,
            count: "4,234",
            href: "/category/mobile-phones",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description: "Latest smartphones and accessories",
            trending: true,
            popularProducts: [
              "iPhone 15 Pro",
              "Samsung Galaxy S24",
              "Google Pixel 8",
            ],
            avgSavings: "15%",
            labelId: 16,
          },
          {
            name: "Laptops",
            icon: Laptop,
            count: "1,678",
            href: "/category/laptops",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            description: "Gaming, business, and ultrabooks",
            trending: true,
            popularProducts: ["MacBook Pro", "Dell XPS 13", "ThinkPad X1"],
            avgSavings: "22%",
            labelId: 13,
          },
          {
            name: "Smart Watches & Accessories",
            icon: Watch,
            count: "8,432",
            href: "/category/smart-watches-accessories",
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
            labelId: 23,
          },
          {
            name: "Headphones & Earbuds",
            icon: Headphones,
            count: "2,567",
            href: "/category/headphones-earbuds",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            description: "Wireless, gaming, and studio audio",
            trending: true,
            popularProducts: [
              "AirPods Pro",
              "Sony WH-1000XM5",
              "Bose QuietComfort",
            ],
            avgSavings: "20%",
            labelId: 10,
          },
          {
            name: "Cameras & Drones",
            icon: Camera,
            count: "1,234",
            href: "/category/cameras-drones",
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            borderColor: "border-cyan-200",
            description: "DSLR, mirrorless, drones and action cameras",
            trending: false,
            popularProducts: ["Canon EOS R5", "Sony A7 IV", "DJI Mavic"],
            avgSavings: "25%",
            labelId: 4,
          },
          {
            name: "Gaming Peripherals",
            icon: Gamepad2,
            count: "1,789",
            href: "/category/gaming-peripherals",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-200",
            description: "Controllers, gaming mice, keyboards and more",
            trending: true,
            popularProducts: [
              "Razer BlackShark",
              "Logitech G Pro",
              "SteelSeries Apex",
            ],
            avgSavings: "12%",
            labelId: 8,
          },
          {
            name: "Tablets",
            icon: Tablet,
            count: "2,123",
            href: "/category/tablets",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
            description: "iPads, Android tablets, and e-readers",
            trending: false,
            popularProducts: [
              "iPad Pro",
              "Samsung Galaxy Tab",
              "Microsoft Surface",
            ],
            avgSavings: "16%",
            labelId: 26,
          },
          {
            name: "Monitors",
            icon: Monitor,
            count: "1,456",
            href: "/category/monitors",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            description: "Gaming, 4K, and ultrawide monitors",
            trending: false,
            popularProducts: ["LG UltraGear", "ASUS ROG", "Dell UltraSharp"],
            avgSavings: "19%",
            labelId: 17,
          },
          {
            name: "Speakers",
            icon: Speaker,
            count: "8,345",
            href: "/category/speakers",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-200",
            description: "Bluetooth, smart, and home theater",
            trending: false,
            popularProducts: ["Sonos", "JBL Flip", "Bose SoundLink"],
            avgSavings: "21%",
            labelId: 24,
          },
          {
            name: "Mice",
            icon: Mouse,
            count: "4,678",
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
            labelId: 15,
          },
          {
            name: "Keyboards",
            icon: Keyboard,
            count: "5,234",
            href: "/category/keyboards",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            description: "Mechanical, wireless, and gaming keyboards",
            trending: false,
            popularProducts: ["Keychron", "Corsair K95", "Logitech MX Keys"],
            avgSavings: "17%",
            labelId: 12,
          },
          {
            name: "CPUs",
            icon: Cpu,
            count: "1,123",
            href: "/category/cpus",
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
            description: "Intel, AMD, and mobile processors",
            trending: true,
            popularProducts: ["Intel Core i9", "AMD Ryzen 9", "Apple M3"],
            avgSavings: "8%",
            labelId: 1,
          },
          {
            name: "Storage",
            icon: HardDrive,
            count: "8,456",
            href: "/category/storage",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description: "SSDs, HDDs, and external storage",
            trending: false,
            popularProducts: [
              "Samsung 980 Pro",
              "WD Black",
              "Seagate Barracuda",
            ],
            avgSavings: "23%",
            labelId: 25,
          },
          {
            name: "Printers & Scanners",
            icon: Printer,
            count: "3,789",
            href: "/category/printers-scanners",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            description: "Inkjet, laser, and 3D printers",
            trending: false,
            popularProducts: ["HP LaserJet", "Canon PIXMA", "Epson EcoTank"],
            avgSavings: "26%",
            labelId: 21,
          },
          {
            name: "Networking",
            icon: Wifi,
            count: "2,345",
            href: "/category/networking",
            color: "text-purple-600",
            bgColor: "bg-purple-50",
            borderColor: "border-purple-200",
            description: "Routers, switches, and WiFi equipment",
            trending: false,
            popularProducts: ["ASUS AX6000", "Netgear Orbi", "TP-Link Archer"],
            avgSavings: "15%",
            labelId: 19,
          },
          {
            name: "Bags, Sleeves & Backpacks",
            icon: Briefcase,
            count: "6,432",
            href: "/category/bags-sleeves-backpacks",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            description: "Carrying solutions for laptops and devices",
            trending: false,
            popularProducts: ["Peak Design", "Timbuk2", "SwissGear"],
            avgSavings: "30%",
            labelId: 0,
          },
          {
            name: "Cables & Adapters",
            icon: Cable,
            count: "12,567",
            href: "/category/cables-adapters",
            color: "text-gray-600",
            bgColor: "bg-gray-50",
            borderColor: "border-gray-200",
            description: "Connectors, dongles, and adapters",
            trending: false,
            popularProducts: ["Anker", "Belkin", "CalDigit"],
            avgSavings: "25%",
            labelId: 2,
          },
          {
            name: "Camera Accessories",
            icon: VideoIcon,
            count: "4,923",
            href: "/category/camera-accessories",
            color: "text-pink-600",
            bgColor: "bg-pink-50",
            borderColor: "border-pink-200",
            description: "Lenses, tripods, and camera bags",
            trending: false,
            popularProducts: ["DJI Ronin", "Peak Design", "Manfrotto"],
            avgSavings: "20%",
            labelId: 3,
          },
          {
            name: "Car Accessories",
            icon: Car,
            count: "1,876",
            href: "/category/car-accessories",
            color: "text-teal-600",
            bgColor: "bg-teal-50",
            borderColor: "border-teal-200",
            description: "Car chargers, mounts, and car tech",
            trending: false,
            popularProducts: ["iOttie", "Anker", "VAVA"],
            avgSavings: "18%",
            labelId: 5,
          },
          {
            name: "Cases & Screen Protectors",
            icon: ShieldCheck,
            count: "2,789",
            href: "/category/cases-screen-protectors",
            color: "text-cyan-600",
            bgColor: "bg-cyan-50",
            borderColor: "border-cyan-200",
            description: "Device protection and covers",
            trending: true,
            popularProducts: ["Spigen", "OtterBox", "Mous"],
            avgSavings: "35%",
            labelId: 6,
          },
          {
            name: "Chargers & Power Banks",
            icon: BatteryCharging,
            count: "17,432",
            href: "/category/chargers-power-banks",
            color: "text-indigo-600",
            bgColor: "bg-indigo-50",
            borderColor: "border-indigo-200",
            description: "Wireless chargers, power banks, and adapters",
            trending: true,
            popularProducts: ["Anker", "Belkin", "RAVPower"],
            avgSavings: "28%",
            labelId: 7,
          },
          {
            name: "Graphic Cards",
            icon: CircuitBoard,
            count: "1,156",
            href: "/category/graphic-cards",
            color: "text-orange-600",
            bgColor: "bg-orange-50",
            borderColor: "border-orange-200",
            description: "NVIDIA and AMD graphics processors",
            trending: true,
            popularProducts: [
              "NVIDIA RTX 4090",
              "AMD RX 7900",
              "NVIDIA RTX 4080",
            ],
            avgSavings: "12%",
            labelId: 9,
          },
          {
            name: "Health & Personal Care Electronics",
            icon: HeartPulse,
            count: "6,725",
            href: "/category/health-personal-care",
            color: "text-green-600",
            bgColor: "bg-green-50",
            borderColor: "border-green-200",
            description: "Electronic health and wellness devices",
            trending: true,
            popularProducts: ["Theragun", "Withings", "Fitbit"],
            avgSavings: "22%",
            labelId: 11,
          },
          {
            name: "Memory",
            icon: MemoryStick,
            count: "7,345",
            href: "/category/memory",
            color: "text-red-600",
            bgColor: "bg-red-50",
            borderColor: "border-red-200",
            description: "RAM, memory modules, and upgrades",
            trending: false,
            popularProducts: [
              "Corsair Vengeance",
              "G.Skill Trident",
              "Kingston Fury",
            ],
            avgSavings: "15%",
            labelId: 14,
          },
          {
            name: "Motherboards",
            icon: CircuitBoard,
            count: "2,678",
            href: "/category/motherboards",
            color: "text-blue-600",
            bgColor: "bg-blue-50",
            borderColor: "border-blue-200",
            description: "AMD and Intel motherboards",
            trending: false,
            popularProducts: ["ASUS ROG", "MSI MPG", "Gigabyte AORUS"],
            avgSavings: "8%",
            labelId: 18,
          },
          {
            name: "Power Supplies & PC Cooling",
            icon: Power,
            count: "3,976",
            href: "/category/power-supplies-cooling",
            color: "text-emerald-600",
            bgColor: "bg-emerald-50",
            borderColor: "border-emerald-200",
            description: "PSUs, coolers, and liquid cooling",
            trending: false,
            popularProducts: ["Corsair RM850x", "NZXT Kraken", "Noctua NH-D15"],
            avgSavings: "17%",
            labelId: 20,
          },
          {
            name: "Smart Home & Office Accessories",
            icon: SmartHomeIcon,
            count: "3,678",
            href: "/category/smart-home-office",
            color: "text-violet-600",
            bgColor: "bg-violet-50",
            borderColor: "border-violet-200",
            description: "Smart speakers, cameras, and home automation",
            trending: true,
            popularProducts: ["Amazon Echo", "Google Nest", "Ring"],
            avgSavings: "24%",
            labelId: 22,
          },
          {
            name: "Webcams & Microphones",
            icon: Mic,
            count: "1,234",
            href: "/category/webcams-microphones",
            color: "text-yellow-600",
            bgColor: "bg-yellow-50",
            borderColor: "border-yellow-200",
            description: "HD webcams and professional microphones",
            trending: false,
            popularProducts: ["Logitech C920", "Blue Yeti", "Shure MV7"],
            avgSavings: "19%",
            labelId: 27,
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
                <Link
                  key={category.name}
                  href={`/category/${categoryNameToSlug(category.name)}?id=${
                    category.labelId
                  }`}
                >
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
    </div>
  );
}
