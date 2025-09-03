"use client";

import { BarChart3, TrendingUp, Zap } from "lucide-react";
import { useEffect, useState } from "react";
import Image from "next/image";

export function FeatureHighlightsSection() {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const images = [
    "/images/retail-hero.jpg",
    "/images/retail-hero1.jpg",
    "/images/retail-hero2.jpg",
    "/images/retail-hero3.jpg",
    "/images/Inventory-Management.jpg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 3000); // Change image every 3 seconds

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-16 bg-gradient-to-br from-blue-50 via-gray-50 to-indigo-50 border-y border-gray-200 overflow-x-hidden">
      <div className="container mx-auto px-4 overflow-visible">
        <div className="text-center mb-12 relative">
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-blue-500/10 rounded-full blur-3xl -z-10"></div>
          <span className="inline-block px-4 py-1.5 bg-gradient-to-r from-blue-600 to-indigo-600 text-white text-sm font-medium rounded-full mb-3">
            AI-Powered Innovation
          </span>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 mb-4 px-4">
            Smart Technology at Your Service
          </h2>
          <p className="text-gray-600 max-w-3xl mx-auto text-base sm:text-lg px-4">
            Our AI-powered platform gives you the competitive edge in today's
            dynamic marketplace
          </p>
          <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto mt-6"></div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 max-w-6xl mx-auto px-4">
          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-blue-100 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-orange-500/5 rounded-full"></div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-orange-500 to-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10">
              <BarChart3 className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-orange-600 transition-colors">
              Real-time Analytics
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Monitor price movements across 25+ retailers with instant
              notifications and trend analysis
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-orange-500 to-red-500 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-blue-100 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-cyan-500/5 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-blue-500/5 rounded-full"></div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10">
              <TrendingUp className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-blue-600 transition-colors">
              AI Forecasting
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Predict future price trends with 95% accuracy using advanced
              machine learning models
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-cyan-500 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>

          <div className="relative bg-white/70 backdrop-blur-sm rounded-2xl p-4 sm:p-6 md:p-8 text-center border border-blue-100 hover:shadow-xl hover:shadow-blue-100/40 transition-all duration-300 transform hover:scale-105 group overflow-hidden">
            <div className="absolute -right-10 -top-10 w-40 h-40 bg-purple-500/5 rounded-full"></div>
            <div className="absolute -left-10 -bottom-10 w-40 h-40 bg-pink-500/5 rounded-full"></div>
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:scale-110 transition-transform shadow-lg relative z-10">
              <Zap className="h-8 w-8 sm:h-9 sm:w-9 text-white" />
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2 sm:mb-3 group-hover:text-purple-600 transition-colors">
              Smart Insights
            </h3>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              Discover anomalies, market opportunities, and optimal buying
              moments with AI-driven insights
            </p>
            <div className="w-16 h-1 bg-gradient-to-r from-purple-500 to-pink-500 mx-auto mt-4 opacity-0 group-hover:opacity-100 transition-opacity"></div>
          </div>
        </div>

        {/* Image Carousel/Slideshow */}
        <div className="mt-12 sm:mt-16 md:mt-20 max-w-5xl mx-auto px-4">
          <div className="relative h-[250px] sm:h-[300px] md:h-[420px] rounded-2xl overflow-hidden shadow-2xl border border-white/20 backdrop-blur-sm">
            {/* Decorative elements */}
            <div className="absolute -top-10 -left-10 w-40 h-40 bg-blue-500/10 rounded-full blur-xl"></div>
            <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-purple-500/10 rounded-full blur-xl"></div>

            {images.map((img, index) => (
              <div
                key={index}
                className={`absolute inset-0 transition-opacity duration-1500 ${
                  index === currentImageIndex ? "opacity-100" : "opacity-0"
                }`}
              >
                <Image
                  src={img}
                  alt={`Feature image ${index + 1}`}
                  fill
                  style={{ objectFit: "cover" }}
                  priority={index === 0}
                  className="filter brightness-[1.02] hover:scale-105 transition-transform duration-5000"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-blue-900/20 to-transparent mix-blend-overlay"></div>
              </div>
            ))}

            {/* Caption overlay */}
            <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent p-4 sm:p-6 md:p-8 text-white">
              <div className="max-w-xl">
                <span className="inline-block px-2 py-0.5 sm:px-3 sm:py-1 bg-blue-600/80 text-white text-xs font-medium rounded-full mb-1 sm:mb-3">
                  Featured
                </span>
                <h3 className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold tracking-tight mb-1 sm:mb-2">
                  Powerful Price Tracking in Action
                </h3>
                <p className="text-xs sm:text-sm md:text-base mt-1 sm:mt-2 text-gray-200 max-w-lg">
                  See how our technology gives businesses the competitive edge
                  in today's marketplace
                </p>
              </div>
            </div>

            {/* Control buttons */}
            <div className="absolute top-1/2 left-4 transform -translate-y-1/2 hidden md:block">
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prevIndex) =>
                      (prevIndex - 1 + images.length) % images.length
                  )
                }
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
                aria-label="Previous slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M15 18l-6-6 6-6" />
                </svg>
              </button>
            </div>
            <div className="absolute top-1/2 right-4 transform -translate-y-1/2 hidden md:block">
              <button
                onClick={() =>
                  setCurrentImageIndex(
                    (prevIndex) => (prevIndex + 1) % images.length
                  )
                }
                className="w-10 h-10 bg-white/20 backdrop-blur-sm hover:bg-white/40 rounded-full flex items-center justify-center text-white transition-all"
                aria-label="Next slide"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="M9 18l6-6-6-6" />
                </svg>
              </button>
            </div>

            {/* Indicators */}
            <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-3">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentImageIndex(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentImageIndex
                      ? "bg-white scale-110 shadow-lg shadow-white/30"
                      : "bg-white/40 hover:bg-white/60"
                  }`}
                  aria-label={`Go to slide ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
