"use client"

import { useEffect, useState } from "react"
import { Package, Users, Store, BarChart3 } from "lucide-react"

export function StatsSection() {
  const [counters, setCounters] = useState({
    products: 0,
    categories: 0,
    users: 0,
    retailers: 0,
  })

  const finalValues = {
    products: 2500000,
    categories: 150,
    users: 50000,
    retailers: 25,
  }

  useEffect(() => {
    const duration = 2000 // 2 seconds
    const steps = 60
    const stepDuration = duration / steps

    const intervals = Object.keys(finalValues).map((key) => {
      const finalValue = finalValues[key as keyof typeof finalValues]
      const increment = finalValue / steps

      return setInterval(() => {
        setCounters((prev) => {
          const newValue = Math.min(prev[key as keyof typeof prev] + increment, finalValue)
          return { ...prev, [key]: Math.floor(newValue) }
        })
      }, stepDuration)
    })

    setTimeout(() => {
      intervals.forEach(clearInterval)
      setCounters(finalValues)
    }, duration)

    return () => intervals.forEach(clearInterval)
  }, [])

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`
    return `${num}+`
  }

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Explore millions of offerings tailored to your business needs
          </h2>
          <p className="text-gray-600 text-lg max-w-3xl mx-auto">
            Comprehensive price intelligence across the largest e-commerce platforms with enterprise-grade analytics
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="text-center group">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-blue-200 transition-colors">
              <Package className="h-8 w-8 text-blue-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{formatNumber(counters.products)}</div>
            <div className="text-gray-600 font-medium">Products Tracked</div>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-green-200 transition-colors">
              <BarChart3 className="h-8 w-8 text-green-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-green-600 mb-2">
              {formatNumber(counters.categories)}
            </div>
            <div className="text-gray-600 font-medium">Categories</div>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-purple-200 transition-colors">
              <Users className="h-8 w-8 text-purple-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-purple-600 mb-2">{formatNumber(counters.users)}</div>
            <div className="text-gray-600 font-medium">Active Users</div>
          </div>

          <div className="text-center group">
            <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-orange-200 transition-colors">
              <Store className="h-8 w-8 text-orange-600" />
            </div>
            <div className="text-3xl md:text-4xl font-bold text-orange-600 mb-2">
              {formatNumber(counters.retailers)}
            </div>
            <div className="text-gray-600 font-medium">Trusted Retailers</div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-12 text-center">
          <div className="inline-flex items-center space-x-8 bg-gray-50 rounded-2xl px-8 py-4">
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live monitoring active</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">AI models running</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Data processing</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
