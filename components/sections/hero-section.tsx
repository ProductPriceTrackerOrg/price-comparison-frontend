"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Camera, Mic, TrendingUp, Sparkles, BarChart3, Shield, Zap } from "lucide-react"
import { SearchSuggestions } from "@/components/search/search-suggestions"

export function HeroSection() {
  const [searchQuery, setSearchQuery] = useState("")
  const [showSuggestions, setShowSuggestions] = useState(false)

  const frequentSearches = [
    "Samsung Galaxy S24",
    "iPhone 15 Pro",
    "MacBook Air M3",
    "Sony WH-1000XM5",
    "iPad Pro",
    "Dell XPS 13",
    "AirPods Pro",
    "Nintendo Switch",
  ]

  const handleSearch = (query: string) => {
    if (query.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(query)}`
    }
  }

  return (
    <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-800 text-white overflow-hidden min-h-[600px]">
      {/* Hero Background Image */}
      <div
        className="absolute inset-0 bg-cover bg-center opacity-20"
        style={{
          backgroundImage: "url('/images/retail-hero.jpg')",
        }}
      />

      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900/80 via-blue-900/70 to-slate-800/80" />

      {/* Floating geometric elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 border border-white/10 rotate-45 rounded-lg"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 border border-orange-500/20 rotate-12 rounded-lg"></div>
        <div className="absolute top-1/2 left-1/4 w-24 h-24 border border-blue-400/20 rotate-45 rounded-lg"></div>
      </div>

      <div className="container mx-auto px-4 py-20 relative z-10">
        <div className="max-w-5xl mx-auto text-center">
          {/* Main Title */}
          <div className="mb-8 fade-in">
            <div className="inline-flex items-center space-x-2 bg-orange-500/20 backdrop-blur-sm border border-orange-500/30 rounded-full px-6 py-2 mb-6">
              <Sparkles className="h-4 w-4 text-orange-400" />
              <span className="text-sm font-medium text-orange-300">AI-Powered Retail Intelligence</span>
            </div>

            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
              Smart <span className="text-orange-400">RETAIL</span> Price
              <br />
              <span className="text-blue-400">INTELLIGENCE</span> Platform
            </h1>
            <p className="text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Harness the power of AI to track millions of products, predict price trends, and make data-driven retail
              decisions with enterprise-grade analytics
            </p>
          </div>

          {/* Enhanced Search Bar */}
          <div className="relative max-w-4xl mx-auto mb-8 slide-up">
            <div className="flex bg-white rounded-2xl shadow-2xl overflow-hidden border border-white/20 backdrop-blur-sm">
              <div className="flex-1 relative">
                <Input
                  type="text"
                  placeholder="Search products, brands, or categories..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value)
                    setShowSuggestions(e.target.value.length > 0)
                  }}
                  onKeyPress={(e) => e.key === "Enter" && handleSearch(searchQuery)}
                  className="h-16 pl-6 pr-20 text-lg border-0 focus:ring-0 text-gray-900 placeholder:text-gray-500 bg-transparent rounded-2xl"
                />
                <div className="absolute right-2 top-2 flex space-x-1">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <Camera className="h-5 w-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-12 w-12 p-0 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-xl"
                  >
                    <Mic className="h-5 w-5" />
                  </Button>
                </div>
              </div>
              <Button
                size="lg"
                className="h-16 px-8 bg-orange-500 hover:bg-orange-600 text-white font-semibold rounded-none rounded-r-2xl transition-all duration-200 transform hover:scale-105"
                onClick={() => handleSearch(searchQuery)}
              >
                <Search className="h-5 w-5 mr-2" />
                Search
              </Button>
            </div>

            {showSuggestions && searchQuery && (
              <SearchSuggestions
                query={searchQuery}
                onSelect={(suggestion) => {
                  setSearchQuery(suggestion)
                  setShowSuggestions(false)
                  handleSearch(suggestion)
                }}
                onClose={() => setShowSuggestions(false)}
              />
            )}
          </div>

          {/* Frequent Searches */}
          <div className="mb-12 fade-in">
            <p className="text-slate-400 mb-4 text-lg">Popular searches:</p>
            <div className="flex flex-wrap justify-center gap-3">
              {frequentSearches.map((search, index) => (
                <Button
                  key={search}
                  variant="outline"
                  size="sm"
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20 hover:border-white/50 rounded-full px-4 py-2 transition-all duration-200 transform hover:scale-105 backdrop-blur-sm"
                  onClick={() => handleSearch(search)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {search}
                </Button>
              ))}
            </div>
          </div>

          {/* Feature Highlights */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <BarChart3 className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Real-time Analytics</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Monitor price movements across 25+ retailers with instant notifications and trend analysis
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">AI Forecasting</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Predict future price trends with 95% accuracy using advanced machine learning models
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 text-center border border-white/20 hover:bg-white/15 transition-all duration-300 transform hover:scale-105 group">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform">
                <Zap className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">Smart Insights</h3>
              <p className="text-slate-300 text-sm leading-relaxed">
                Discover anomalies, market opportunities, and optimal buying moments with AI-driven insights
              </p>
            </div>
          </div>

          {/* Trust Indicators */}
          <div className="mt-16 flex items-center justify-center space-x-8 text-slate-400">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-400" />
              <span className="text-sm">Enterprise Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-blue-400" />
              <span className="text-sm">2.5M+ Products</span>
            </div>
            <div className="flex items-center space-x-2">
              <TrendingUp className="h-5 w-5 text-orange-400" />
              <span className="text-sm">95% Accuracy</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
