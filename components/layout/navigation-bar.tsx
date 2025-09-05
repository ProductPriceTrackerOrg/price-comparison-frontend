"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Grid3X3,
  Sparkles,
  Percent,
  Star,
  Menu,
  ChevronDown,
  BarChart3,
  TrendingDown,
  Phone,
  HelpCircle,
  ShoppingBag,
} from "lucide-react";
import { useState } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function NavigationBar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems = [
    {
      label: "All Categories",
      href: "/categories",
      icon: Grid3X3,
    },
    {
      label: "Top Deals",
      href: "/deals",
      icon: Percent,
      description: "Best deals and discounts",
    },
    {
      label: "Price Drops",
      href: "/price-drops",
      icon: TrendingDown,
      description: "Recently reduced prices",
    },
    {
      label: "New Arrivals",
      href: "/new-arrivals",
      icon: Sparkles,
      description: "Latest products added",
    },
    {
      label: "Trending",
      href: "/trending",
      icon: Star,
      description: "Popular products",
    },
    {
      label: "Analytics",
      href: "/analytics",
      icon: BarChart3,
      description: "Price trends and insights",
    },
  ];

  const rightNavItems = [
    {
      label: "Buyer Central",
      href: "/buyer-central",
      icon: ShoppingBag,
      description: "Resources for buyers",
    },
    {
      label: "Help Center",
      href: "/help",
      icon: HelpCircle,
      description: "Get support and answers",
    },
    {
      label: "Contact Us",
      href: "/contact",
      icon: Phone,
      description: "Get in touch with us",
    },
  ];

  return (
    <nav className="relative bg-white/90 backdrop-blur-md border-b border-gray-200/50 shadow-lg shadow-gray-100/50 mt-0">
      {/* Gradient overlay for depth */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-50/30 via-transparent to-purple-50/30 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 relative">
        <div className="flex items-center justify-between py-1">
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-1.5">
            {navItems.map((item, index) => (
              <div
                key={item.label}
                className="group relative"
                style={{ animationDelay: `${index * 100}ms` }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex items-center space-x-1.5 px-3 py-2 text-gray-700 transition-all duration-300 ease-out rounded-lg group-hover:shadow-md relative overflow-hidden"
                >
                  <Link href={item.href}>
                    {/* Gradient background on hover */}
                    <div
                      className={`absolute inset-0 bg-gradient-to-r ${item.color} opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl`}
                    />

                    {/* Content */}
                    <div className="relative z-10 flex items-center space-x-1.5">
                      <item.icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                      <span className="font-medium text-xs tracking-wide">
                        {item.label}
                      </span>
                    </div>

                    {/* Shine effect */}
                    <div className="absolute top-0 -inset-full h-full w-1/2 z-5 block transform -skew-x-12 bg-gradient-to-r from-transparent to-white opacity-20 group-hover:animate-pulse" />
                  </Link>
                </Button>
              </div>
            ))}
          </div>

          {/* Mobile Menu */}
          <div className="lg:hidden">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 text-white hover:from-blue-600 hover:to-purple-600 transition-all duration-300 shadow-md hover:shadow-lg"
                >
                  <Menu className="h-3.5 w-3.5" />
                  <span className="font-medium text-xs tracking-wide">
                    Menu
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 transition-transform duration-200" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-64 mt-2 bg-white/95 backdrop-blur-md border border-gray-200/50 shadow-xl rounded-xl">
                <div className="p-2 space-y-1">
                  {navItems.map((item) => (
                    <DropdownMenuItem
                      key={item.label}
                      asChild
                      className="rounded-lg"
                    >
                      <Link
                        href={item.href}
                        className="flex items-center p-3 rounded-lg hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-200 group"
                      >
                        <div
                          className={`p-2 rounded-lg bg-gradient-to-r ${item.color} text-white mr-3 group-hover:scale-110 transition-transform duration-200`}
                        >
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900">
                            {item.label}
                          </div>
                          <div className="text-xs text-gray-500">
                            {item.description}
                          </div>
                        </div>
                      </Link>
                    </DropdownMenuItem>
                  ))}
                </div>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Right side info */}
          <div className="hidden md:flex items-center space-x-0.5">
            {rightNavItems.map((item, index) => (
              <div
                key={item.label}
                className="group relative"
                style={{
                  animationDelay: `${(index + navItems.length) * 100}ms`,
                }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="flex items-center space-x-1.5 px-2.5 py-1.5 text-gray-600 hover:text-gray-900 hover:bg-gray-50/80 transition-all duration-300 rounded-lg border border-transparent hover:border-gray-200/50 hover:shadow-sm"
                >
                  <Link href={item.href}>
                    <item.icon className="h-3.5 w-3.5 transition-transform duration-300 group-hover:scale-110" />
                    <span className="text-xs font-medium tracking-wide">
                      {item.label}
                    </span>
                  </Link>
                </Button>
              </div>
            ))}
          </div>
        </div>

        {/* Animated bottom border */}
        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-30" />

        {/* Center dot accent */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 -translate-y-0.5 w-1.5 h-1.5 rounded-full bg-blue-500 shadow-sm shadow-blue-500/50"></div>
      </div>
    </nav>
  );
}
