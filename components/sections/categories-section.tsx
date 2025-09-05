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
import { useEffect } from "react";

// Define animation CSS class names we'll use
const ANIMATION_FLOAT_SLOW = "animate-float-slow";
const ANIMATION_FLOAT_REVERSE = "animate-float-reverse";
const ANIMATION_FADE_IN_UP = "animate-fade-in-up";

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
    <section className="py-20 relative overflow-hidden">
      {/* Enhanced Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-50 via-gray-100 to-blue-50"></div>
      <div className="absolute inset-0 grid-pattern opacity-[0.03]"></div>

      {/* Decorative shapes */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-blue-300/20 rounded-full blur-3xl"></div>
      <div className="absolute -top-20 left-1/4 w-40 h-40 bg-purple-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 left-10 w-80 h-80 bg-green-300/20 rounded-full blur-3xl"></div>
      <div className="absolute bottom-20 right-1/4 w-60 h-60 bg-yellow-300/10 rounded-full blur-3xl"></div>

      {/* Floating geometric elements */}
      <div className="absolute top-20 left-[10%] w-12 h-12 border-2 border-blue-200 rounded-lg rotate-12 opacity-30 animate-float-slow"></div>
      <div className="absolute bottom-40 right-[15%] w-16 h-16 border-2 border-purple-200 rounded-lg rotate-45 opacity-30 animate-float-reverse"></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-20 max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-indigo-600 rounded-full px-6 py-2 mb-8">
            <Sparkles className="h-4 w-4 text-white" />
            <span className="text-sm font-medium text-white">
              Explore Our Wide Selection
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-6 sm:mb-8 px-4">
            Browse by{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
              category
            </span>
          </h2>

          <div className="relative">
            <div className="w-24 h-1.5 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto my-8 rounded-full"></div>
          </div>

          <p className="text-gray-600 text-xl max-w-3xl mx-auto mb-10 leading-relaxed">
            Discover the best deals across all major product categories with
            real-time price tracking and AI-powered recommendations
          </p>

          <Button
            variant="outline"
            size="lg"
            className="group bg-white hover:bg-gradient-to-r hover:from-blue-500 hover:to-indigo-600 hover:text-white border-blue-200 hover:border-transparent transition-all duration-300 shadow-sm hover:shadow-lg"
          >
            View All Categories
            <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1.5 transition-transform" />
          </Button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto px-4">
          {categories.map((category, index) => (
            <Link
              key={category.name}
              href={category.href}
              className="group transform transition-all duration-500 hover:z-10 animate-fade-in-up category-item"
            >
              <Card className="transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 border border-gray-100 rounded-2xl overflow-hidden bg-white/90 backdrop-blur-md">
                <CardContent className="p-8 text-center relative">
                  {/* Decorative background shape */}
                  <div
                    className={`absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-300 ${category.bgColor}`}
                  >
                    <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full"></div>
                    <div className="absolute -left-8 -top-8 w-20 h-20 rounded-full"></div>
                  </div>

                  <div className="relative">
                    <div className="relative mx-auto mb-6 w-28 h-28">
                      {/* Outer glow effect */}
                      <div
                        className={`absolute inset-0 rounded-full blur-lg opacity-50 group-hover:opacity-70 transition-opacity duration-300`}
                        style={{
                          background: `radial-gradient(circle, ${
                            category.name === "Smartphones"
                              ? "rgba(59, 130, 246, 0.5)"
                              : category.name === "Laptops"
                              ? "rgba(34, 197, 94, 0.5)"
                              : category.name === "Smart Watches"
                              ? "rgba(168, 85, 247, 0.5)"
                              : category.name === "Headphones"
                              ? "rgba(249, 115, 22, 0.5)"
                              : category.name === "Cameras"
                              ? "rgba(6, 182, 212, 0.5)"
                              : category.name === "Gaming"
                              ? "rgba(236, 72, 153, 0.5)"
                              : category.name === "Tablets"
                              ? "rgba(99, 102, 241, 0.5)"
                              : "rgba(239, 68, 68, 0.5)"
                          } 20%, transparent 65%)`,
                        }}
                      ></div>

                      {/* Main circular background with glass effect */}
                      <div
                        className={`w-24 h-24 mx-auto rounded-full shadow-lg backdrop-blur-sm border transition-all duration-500 flex items-center justify-center group-hover:shadow-xl relative overflow-hidden z-10 group-hover:scale-105`}
                        style={{
                          background: `linear-gradient(135deg, ${
                            category.name === "Smartphones"
                              ? "rgba(219, 234, 254, 0.9)"
                              : category.name === "Laptops"
                              ? "rgba(220, 252, 231, 0.9)"
                              : category.name === "Smart Watches"
                              ? "rgba(243, 232, 255, 0.9)"
                              : category.name === "Headphones"
                              ? "rgba(255, 237, 213, 0.9)"
                              : category.name === "Cameras"
                              ? "rgba(207, 250, 254, 0.9)"
                              : category.name === "Gaming"
                              ? "rgba(252, 231, 243, 0.9)"
                              : category.name === "Tablets"
                              ? "rgba(224, 231, 255, 0.9)"
                              : "rgba(254, 226, 226, 0.9)"
                          }, white)`,
                          borderColor: `${
                            category.name === "Smartphones"
                              ? "rgba(96, 165, 250, 0.3)"
                              : category.name === "Laptops"
                              ? "rgba(74, 222, 128, 0.3)"
                              : category.name === "Smart Watches"
                              ? "rgba(192, 132, 252, 0.3)"
                              : category.name === "Headphones"
                              ? "rgba(251, 146, 60, 0.3)"
                              : category.name === "Cameras"
                              ? "rgba(34, 211, 238, 0.3)"
                              : category.name === "Gaming"
                              ? "rgba(244, 114, 182, 0.3)"
                              : category.name === "Tablets"
                              ? "rgba(129, 140, 248, 0.3)"
                              : "rgba(248, 113, 113, 0.3)"
                          }`,
                        }}
                      >
                        {/* Inner circle with stronger color */}
                        <div
                          className={`w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 group-hover:scale-110 relative`}
                          style={{
                            background: `linear-gradient(135deg, ${
                              category.name === "Smartphones"
                                ? "rgba(59, 130, 246, 0.15)"
                                : category.name === "Laptops"
                                ? "rgba(34, 197, 94, 0.15)"
                                : category.name === "Smart Watches"
                                ? "rgba(168, 85, 247, 0.15)"
                                : category.name === "Headphones"
                                ? "rgba(249, 115, 22, 0.15)"
                                : category.name === "Cameras"
                                ? "rgba(6, 182, 212, 0.15)"
                                : category.name === "Gaming"
                                ? "rgba(236, 72, 153, 0.15)"
                                : category.name === "Tablets"
                                ? "rgba(99, 102, 241, 0.15)"
                                : "rgba(239, 68, 68, 0.15)"
                            }, rgba(255, 255, 255, 0.8))`,
                          }}
                        >
                          <category.icon
                            className={`h-9 w-9 ${category.color} transition-all duration-500 group-hover:scale-125 drop-shadow-md`}
                          />
                        </div>

                        {/* Shine effect */}
                        <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-white/0 via-white/40 to-white/0 translate-x-[-200%] group-hover:translate-x-[200%] transition-transform duration-1000"></div>
                      </div>

                      {/* Decorative dots */}
                      <div className="absolute w-2 h-2 rounded-full bg-white/80 shadow-sm -right-1 top-1/4 group-hover:scale-150 transition-transform duration-500"></div>
                      <div className="absolute w-1.5 h-1.5 rounded-full bg-white/70 shadow-sm right-6 -top-1 group-hover:scale-150 transition-transform duration-700"></div>
                      <div className="absolute w-1 h-1 rounded-full bg-white/80 shadow-sm left-8 bottom-2 group-hover:scale-200 transition-transform duration-500"></div>
                    </div>

                    <h3
                      className={`font-bold mb-3 text-xl transition-colors relative`}
                    >
                      <span
                        className={`text-gray-900 group-hover:${category.color} transition-all duration-300`}
                      >
                        {category.name}
                      </span>
                      <div
                        className={`w-0 h-0.5 mx-auto mt-2 ${category.color} opacity-0 group-hover:w-1/2 group-hover:opacity-70 transition-all duration-300`}
                      ></div>
                    </h3>

                    <div className="flex items-center justify-center space-x-1">
                      <p
                        className={`text-base ${category.color} font-semibold`}
                      >
                        {category.count}
                      </p>
                      <p className="text-sm text-gray-500">products</p>
                    </div>

                    <div
                      className={`absolute bottom-3 left-1/2 transform -translate-x-1/2 w-0 group-hover:w-1/3 h-0.5 ${category.color} opacity-0 group-hover:opacity-40 transition-all duration-300`}
                    ></div>

                    <div className="mt-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center text-xs font-medium text-gray-600">
                        Explore Now
                        <ChevronRight className="ml-1 h-3 w-3" />
                      </span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Add decorative curved lines at the bottom */}
        <div className="relative mt-16 opacity-20 overflow-hidden">
          <svg
            className="w-full"
            viewBox="0 0 1200 120"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,60 C300,20 600,100 900,40 C1200,-20 1200,60 1200,80"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0,80 C300,40 600,120 900,60 C1200,0 1200,80 1200,100"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
            <path
              d="M0,100 C300,60 600,140 900,80 C1200,20 1200,100 1200,120"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            />
          </svg>
        </div>
      </div>
    </section>
  );
}
