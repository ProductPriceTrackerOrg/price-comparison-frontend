"use client";

import { useEffect, useState } from "react";
import { Package, Users, Store, BarChart3 } from "lucide-react";

export function StatsSection() {
  const [counters, setCounters] = useState({
    products: 0,
    categories: 0,
    users: 0,
    retailers: 0,
  });

  const finalValues = {
    products: 2500000,
    categories: 150,
    users: 50000,
    retailers: 25,
  };

  useEffect(() => {
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;

    const intervals = Object.keys(finalValues).map((key) => {
      const finalValue = finalValues[key as keyof typeof finalValues];
      const increment = finalValue / steps;

      return setInterval(() => {
        setCounters((prev) => {
          const newValue = Math.min(
            prev[key as keyof typeof prev] + increment,
            finalValue
          );
          return { ...prev, [key]: Math.floor(newValue) };
        });
      }, stepDuration);
    });

    setTimeout(() => {
      intervals.forEach(clearInterval);
      setCounters(finalValues);
    }, duration);

    return () => intervals.forEach(clearInterval);
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M+`;
    if (num >= 1000) return `${(num / 1000).toFixed(0)}K+`;
    return `${num}+`;
  };

  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4">
        {/* Decorative elements */}
        <div className="relative">
          <div className="absolute -top-40 -left-20 w-72 h-72 bg-blue-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute -top-40 -right-20 w-72 h-72 bg-purple-100 rounded-full mix-blend-multiply filter blur-xl opacity-70"></div>
          <div className="absolute top-40 left-20 w-36 h-36 bg-green-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
          <div className="hidden md:block absolute top-40 right-40 w-36 h-36 bg-yellow-100 rounded-full mix-blend-multiply filter blur-xl opacity-50"></div>
        </div>

        <div className="text-center mb-16 relative z-10">
          <span className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-medium bg-gradient-to-r from-indigo-500 to-blue-600 text-white mb-5 shadow-sm">
            <svg
              className="mr-1.5 h-4 w-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 10V3L4 14h7v7l9-11h-7z"
              ></path>
            </svg>
            Powered by Advanced Data Analysis
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-extrabold mb-5 bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-blue-600 to-cyan-600 px-4">
            Explore millions of offerings{" "}
            <span className="block md:inline">
              tailored to your business needs
            </span>
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto my-6 rounded-full"></div>
          <p className="text-gray-600 text-xl max-w-3xl mx-auto leading-relaxed">
            Comprehensive price intelligence across the largest e-commerce
            platforms with enterprise-grade analytics
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-5 md:gap-8 max-w-6xl mx-auto relative z-10 px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-3 sm:p-5 md:p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-blue-100/50">
            <div className="w-16 h-16 sm:w-18 sm:h-18 md:w-20 md:h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mx-auto mb-3 md:mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-blue-200">
              <Package className="h-7 w-7 sm:h-8 sm:w-8 md:h-9 md:w-9 text-white" />
            </div>
            <div className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-blue-600 to-indigo-600 mb-1 md:mb-2">
              {formatNumber(counters.products)}
            </div>
            <div className="text-gray-700 font-medium text-sm sm:text-base md:text-lg">
              Products Tracked
            </div>
            <div className="w-12 h-0.5 bg-blue-500/50 mx-auto mt-2 md:mt-3 group-hover:w-24 transition-all duration-300"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-green-100/50">
            <div className="w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-green-200">
              <BarChart3 className="h-9 w-9 text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-green-600 to-emerald-600 mb-2">
              {formatNumber(counters.categories)}
            </div>
            <div className="text-gray-700 font-medium text-lg">Categories</div>
            <div className="w-12 h-0.5 bg-green-500/50 mx-auto mt-3 group-hover:w-24 transition-all duration-300"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-purple-100/50">
            <div className="w-20 h-20 bg-gradient-to-br from-purple-500 to-violet-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-purple-200">
              <Users className="h-9 w-9 text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-purple-600 to-violet-600 mb-2">
              {formatNumber(counters.users)}
            </div>
            <div className="text-gray-700 font-medium text-lg">
              Active Users
            </div>
            <div className="w-12 h-0.5 bg-purple-500/50 mx-auto mt-3 group-hover:w-24 transition-all duration-300"></div>
          </div>

          <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 text-center group hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-orange-100/50">
            <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-transform duration-300 shadow-lg shadow-orange-200">
              <Store className="h-9 w-9 text-white" />
            </div>
            <div className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-orange-600 to-red-600 mb-2">
              {formatNumber(counters.retailers)}
            </div>
            <div className="text-gray-700 font-medium text-lg">
              Trusted Retailers
            </div>
            <div className="w-12 h-0.5 bg-orange-500/50 mx-auto mt-3 group-hover:w-24 transition-all duration-300"></div>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-10 sm:mt-12 md:mt-16 text-center relative z-10 px-4">
          <div className="inline-flex flex-wrap justify-center gap-2 sm:gap-3 md:gap-8 bg-white/70 backdrop-blur-md border border-blue-100/50 rounded-full px-4 sm:px-6 md:px-10 py-3 sm:py-4 md:py-5 shadow-lg">
            <div className="flex items-center space-x-3 px-3 py-1.5">
              <div className="relative">
                <div className="w-4 h-4 bg-green-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-green-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-gray-700 font-medium">
                Live monitoring active
              </span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-1.5">
              <div className="relative">
                <div className="w-4 h-4 bg-blue-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-blue-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-gray-700 font-medium">
                AI models running
              </span>
            </div>
            <div className="flex items-center space-x-3 px-3 py-1.5">
              <div className="relative">
                <div className="w-4 h-4 bg-purple-500 rounded-full animate-pulse"></div>
                <div className="absolute inset-0 w-4 h-4 bg-purple-400 rounded-full animate-ping opacity-75"></div>
              </div>
              <span className="text-gray-700 font-medium">Data processing</span>
            </div>
          </div>
        </div>

        {/* Extra flair - Curved lines decoration */}
        <div className="relative mt-10 hidden md:block overflow-hidden">
          <svg
            className="absolute top-0 left-0 w-full opacity-5"
            viewBox="0 0 1000 120"
            preserveAspectRatio="xMidYMid meet"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0,50 Q250,0 500,50 T1000,50"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
            <path
              d="M0,70 Q250,20 500,70 T1000,70"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
            <path
              d="M0,90 Q250,40 500,90 T1000,90"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            ></path>
          </svg>
        </div>
        
        {/* Transition element to the product grid */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center justify-center">
            <div className="h-0.5 w-12 bg-gradient-to-r from-transparent to-indigo-500"></div>
            <span className="px-4 text-gray-500 text-sm font-medium">PRODUCT SHOWCASE</span>
            <div className="h-0.5 w-12 bg-gradient-to-l from-transparent to-indigo-500"></div>
          </div>
        </div>
      </div>
    </section>
  );
}
