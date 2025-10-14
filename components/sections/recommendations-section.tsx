"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { ProductCard } from "@/components/product/product-card";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Sparkles, TrendingUp, Users, Heart, Loader2 } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { supabase } from "@/lib/supabase";

export function RecommendationsSection() {
  const { isLoggedIn } = useAuth();
  const [recommendedProducts, setRecommendedProducts] = useState<any[]>([]);
  const [trendingProducts, setTrendingProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch recommendation and trending data
  useEffect(() => {
    const fetchRecommendations = async () => {
      if (!isLoggedIn) {
        console.log(
          "User not logged in, skipping personalized recommendations"
        );
        return;
      }

      try {
        setLoading(true);

        // Get Supabase session for auth token - get the most recent session
        const { data: sessionData, error: sessionError } =
          await supabase.auth.getSession();

        if (sessionError) {
          console.error("Error getting Supabase session:", sessionError);
          throw new Error("Authentication error: " + sessionError.message);
        }

        const token = sessionData?.session?.access_token;

        // Log auth status for debugging
        console.log("Authentication token available:", !!token);

        if (!token) {
          console.warn(
            "No authentication token available despite user being logged in"
          );
          // Try refreshing the session
          const { data: refreshData, error: refreshError } =
            await supabase.auth.refreshSession();
          if (refreshError) {
            console.error("Error refreshing session:", refreshError);
          } else if (refreshData?.session?.access_token) {
            console.log("Successfully refreshed authentication token");
          }
        }

        // Set auth headers if token exists
        const headers: HeadersInit = {};
        if (token) {
          headers["Authorization"] = `Bearer ${token}`;
        }

        // Fetch personalized recommendations with auth header
        const recommendationsResponse = await fetch(
          "/api/v1/home/recommendations?limit=4",
          {
            headers,
            // Add a longer timeout for the recommendations request
            signal: AbortSignal.timeout(30000), // 30 seconds timeout
          }
        );

        if (!recommendationsResponse.ok) {
          throw new Error("Failed to fetch recommendations");
        }
        const recommendationsData = await recommendationsResponse.json();

        // Fetch trending products
        const trendingResponse = await fetch(
          "/api/v1/home/homepage-trending?limit=4",
          {
            headers,
            // Add a longer timeout for the trending request
            signal: AbortSignal.timeout(30000), // 30 seconds timeout
          }
        );

        if (!trendingResponse.ok) {
          throw new Error("Failed to fetch trending products");
        }
        const trendingData = await trendingResponse.json();

        // Map the API responses to the format our component expects
        const mappedRecommendations = (
          recommendationsData.recommended_products || []
        ).map((item: any) => ({
          id: item.id,
          name: item.name,
          brand: item.brand || "Unknown",
          category: item.category || "General",
          price: item.price,
          originalPrice: item.original_price,
          retailer: item.retailer,
          inStock: item.in_stock !== false, // Default to true if not specified
          image: item.image || "/placeholder.svg",
          discount:
            item.discount ||
            (item.original_price
              ? Math.round(
                  ((item.original_price - item.price) / item.original_price) *
                    100
                )
              : 0),
          recommendationScore: item.recommendation_score,
          recommendationReason: item.recommendation_reason,
        }));

        const mappedTrending = (trendingData.products || []).map(
          (item: any) => ({
            id: item.id,
            name: item.name,
            brand: item.brand || "Unknown",
            category: item.category || "General",
            price: item.price,
            originalPrice: item.original_price,
            retailer: item.retailer,
            inStock: item.in_stock !== false, // Default to true if not specified
            image: item.image || "/placeholder.svg",
            discount:
              item.discount ||
              (item.original_price
                ? Math.round(
                    ((item.original_price - item.price) / item.original_price) *
                      100
                  )
                : 0),
            trendScore: item.trend_score,
            searchVolume: item.search_volume,
            priceChange: item.price_change,
          })
        );

        setRecommendedProducts(mappedRecommendations);
        setTrendingProducts(mappedTrending);
        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching recommendations:", error);

        // Provide more specific error messages
        if (error.name === "AbortError" || error.message?.includes("timeout")) {
          console.error("Request timed out, returning fallback data");
          setError("Request timed out. Please try again later.");
          console.log("Using fallback recommendation data due to API error");
        } else if (
          error.message?.includes("401") ||
          error.message?.includes("Unauthorized")
        ) {
          setError("Authentication failed. Please log in again.");
          console.error("Authentication error when fetching recommendations");
        } else {
          setError("Failed to load recommendations");
        }

        setLoading(false);

        // Use fallback data if API fails
        setRecommendedProducts([
          {
            id: 3568948440,
            name: "UGREEN 3.5mm Male to 3.5mm Male Braided Cable 1m",
            brand: "SimplyTek",
            category: "Accessories",
            price: 999,
            originalPrice: 1499,
            retailer: "simplytek",
            inStock: true,
            image:
              "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/UGREEN3.5mmMaleto3.5mmMaleCableGoldPlatedMetalCasewithBraid1m_Black_50361_SimplyTek_Srilanka.webp?v=1697530979",
            discount: 33.36,
          },
          {
            id: 2752769646,
            name: "Aspor A907 Car Charger",
            brand: "SimplyTek",
            category: "Car Accessories",
            price: 999,
            originalPrice: 1499,
            retailer: "simplytek",
            inStock: true,
            image:
              "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/buy-aspor-a907-power-delivery-fast-car-charger-20w-white-simplytek-lk.png?v=1694426768",
            discount: 33.36,
          },
          {
            id: 1237805095,
            name: "Ugreen 10625 3.5mm Male To 6.35 Male Stereo Audio Cable",
            brand: "Ugreen",
            category: "Accessories",
            price: 2340.43,
            originalPrice: 3500,
            retailer: "appleme",
            inStock: true,
            image:
              "https://appleme.lk/wp-content/uploads/2024/02/Ugreen-10625-3.5mm-Male-To-6.35-Male-Stereo-Audio-Cable-1M-by-otc.lk-in-Sri-Lanka.jpg",
            discount: 33.13,
          },
          {
            id: 1062839221,
            name: "Phone Mount for Car CZ019-30",
            brand: "Phone",
            category: "Car Accessories",
            price: 895,
            originalPrice: 1341,
            retailer: "appleme",
            inStock: true,
            image:
              "https://appleme.lk/wp-content/uploads/2023/07/Phone-Mount-for-Car-CZ019-30-by-otc.lk-in-Sri-Lanka8.jpg",
            discount: 33.26,
          },
        ]);

        setTrendingProducts([
          {
            id: 2479411966,
            name: "Addlink micro SD 64GB XC (Class U3) 100MB/s",
            brand: "SimplyTek",
            category: "Memory Cards",
            price: 2999,
            originalPrice: 4499,
            retailer: "simplytek",
            inStock: true,
            image:
              "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/addlink-64gb-micro-sd-card-sri-lanka.jpg?v=1694424386",
            discount: 33.34,
          },
          {
            id: 3705271816,
            name: "Noise Pop Buds Truly Wireless Earbuds",
            brand: "SimplyTek",
            category: "Audio",
            price: 3999,
            originalPrice: 5999,
            retailer: "simplytek",
            inStock: true,
            image:
              "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/noise-pop-buds-black-simplytek-sri-lanka.png?v=1729670098",
            discount: 33.34,
          },
          {
            id: 3470575700,
            name: "SanDisk Ultra 64GB SDXC 140MB/s UHS-I Memory Card",
            brand: "SanDisk",
            category: "Memory Cards",
            price: 4361.7,
            originalPrice: 6490,
            retailer: "appleme",
            inStock: true,
            image: "https://appleme.lk/wp-content/uploads/2023/08/1-110.jpg",
            discount: 32.79,
          },
          {
            id: 3909295080,
            name: "Anker 633 Magnetic Battery 10000mah Powerbank",
            brand: "SimplyTek",
            category: "Power Banks",
            price: 19999,
            originalPrice: 29999,
            retailer: "simplytek",
            inStock: true,
            image:
              "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/Anker-633-Magnetic-Battery-MagGo-SIMPLYTEK-LK-2.jpg?v=1694426744",
            discount: 33.33,
          },
        ]);
      }
    };

    fetchRecommendations();
  }, [isLoggedIn]);

  // Users Also Liked (Collaborative) - We'll keep this as static data
  const collaborativeProducts = [
    {
      id: 838075928,
      name: "Xiaomi Haylou RT LS05S Smart Watch",
      brand: "Xiaomi",
      category: "Wearables",
      price: 12756,
      originalPrice: 18990,
      retailer: "appleme",
      inStock: true,
      image:
        "https://appleme.lk/wp-content/uploads/2021/08/Xiaomi-Haylou-RT-LS05S-Smart-Watch.jpg",
      discount: 32.83,
    },
    {
      id: 240898780,
      name: "HK10 Pro Max plus Gen7 Series 10 Smart Watch",
      brand: "HK10",
      category: "Wearables",
      price: 9042.55,
      originalPrice: 13500,
      retailer: "appleme",
      inStock: true,
      image:
        "https://appleme.lk/wp-content/uploads/2025/03/HK10-Pro-Max-Gen7-Series-10-Smart-Watch-2025-by-appleme.lk-01.webp",
      discount: 33.02,
    },
    {
      id: 107067607,
      name: "MTB Camera Lens Protector for iPhone 14 Pro Max",
      brand: "MTB",
      category: "Phone Accessories",
      price: 2330,
      originalPrice: 3490,
      retailer: "appleme",
      inStock: true,
      image: "https://appleme.lk/wp-content/uploads/2022/09/NNEEE-12.jpg",
      discount: 33.24,
    },
    {
      id: 2602987338,
      name: "Mtb Ultra Thin Camera Lens for Galaxy S23 Ultra",
      brand: "Mtb",
      category: "Phone Accessories",
      price: 2011,
      originalPrice: 2990,
      retailer: "appleme",
      inStock: true,
      image: "https://appleme.lk/wp-content/uploads/2023/03/s23-ultra-lens.png",
      discount: 32.74,
    },
  ];

  if (!isLoggedIn) {
    return null;
  }

  return (
    <section className="py-16 relative overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-purple-50"></div>

      {/* Decorative elements */}
      <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-100/30 to-transparent"></div>
      <div className="absolute right-10 top-20 w-48 h-48 bg-gradient-to-br from-purple-300/20 to-pink-300/20 rounded-full blur-3xl"></div>
      <div className="absolute left-10 bottom-20 w-72 h-72 bg-gradient-to-tr from-blue-300/20 to-cyan-300/20 rounded-full blur-3xl"></div>

      {/* Subtle patterns */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%234f46e5' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
        }}
      ></div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center justify-center p-2 bg-gradient-to-r from-indigo-500 to-purple-600 rounded-full mb-5">
            <div className="bg-white p-2 rounded-full">
              <Sparkles className="h-7 w-7 text-indigo-600" />
            </div>
          </div>
          <h2 className="text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 via-purple-600 to-indigo-600 mb-5">
            Personalized For You
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto font-medium">
            Curated recommendations based on your browsing patterns and
            preferences
          </p>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Spinner size="lg" className="text-indigo-600 mb-4" />
            <p className="text-gray-600">
              Loading your personalized recommendations...
            </p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center justify-center py-20 bg-red-50 rounded-xl border border-red-100">
            <p className="text-red-600 mb-2 font-medium">{error}</p>
            <p className="text-gray-600">Please try again later</p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* For You Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-indigo-500 to-blue-600 shadow-lg shadow-indigo-100 mr-4">
                  <Sparkles className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Recommended for You
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Personalized picks based on your preferences
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {recommendedProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-indigo-100 group-hover:border-indigo-200 transition-all duration-300">
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-indigo-600 to-blue-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                          Just For You
                        </div>
                      </div>
                      <ProductCard product={product} />
                      {/* Highlight effect on hover - moved to back with pointer-events-none */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-500/10 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Trending Section */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-green-500 to-teal-600 shadow-lg shadow-green-100 mr-4">
                  <TrendingUp className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Trending Products
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Popular products with significant price drops
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {trendingProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-green-100 group-hover:border-green-200 transition-all duration-300">
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-green-600 to-teal-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                          <TrendingUp className="h-3 w-3 mr-1 inline" />
                          {product.trendScore
                            ? `${product.trendScore}%`
                            : "Hot"}
                        </div>
                      </div>
                      <ProductCard product={product} />
                      {/* Highlight effect on hover - moved to back with pointer-events-none */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-green-500/10 to-teal-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Users Also Bought */}
            <div className="mb-16">
              <div className="flex items-center mb-8">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 shadow-lg shadow-purple-100 mr-4">
                  <Users className="h-6 w-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Users Also Liked
                  </h3>
                  <p className="text-gray-600 text-sm mt-1">
                    Smart watches and camera protection
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {collaborativeProducts.map((product) => (
                  <div
                    key={product.id}
                    className="group transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="relative rounded-xl overflow-hidden shadow-md hover:shadow-xl border border-purple-100 group-hover:border-purple-200 transition-all duration-300">
                      <div className="absolute top-3 right-3 z-10">
                        <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs rounded-full py-1 px-3 font-bold shadow-lg">
                          Popular Pick
                        </div>
                      </div>
                      <ProductCard product={product} />
                      {/* Highlight effect on hover - moved to back with pointer-events-none */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-purple-500/10 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Recommendation Insights */}
        <Card className="mt-8 bg-gradient-to-r from-indigo-50 to-purple-50 border-0 shadow-xl rounded-2xl overflow-hidden">
          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-indigo-200/30 to-purple-200/30 rounded-full blur-3xl -translate-y-1/2 translate-x-1/4"></div>
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-purple-600">
              <div className="p-2 bg-gradient-to-r from-indigo-100 to-purple-100 rounded-full mr-3">
                <Heart className="h-5 w-5 text-indigo-600" />
              </div>
              How We Create Your Recommendations
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
              <div className="bg-white rounded-xl p-4 shadow-sm border border-indigo-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center mr-3">
                    <Sparkles className="h-5 w-5 text-indigo-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">For You</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  AI-powered analysis of your browsing patterns, search history,
                  and time spent viewing products
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-green-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center mr-3">
                    <TrendingUp className="h-5 w-5 text-green-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Trending</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Real-time analysis of popular products with significant price
                  drops and high engagement
                </p>
              </div>

              <div className="bg-white rounded-xl p-4 shadow-sm border border-purple-100">
                <div className="flex items-center mb-3">
                  <div className="w-10 h-10 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                    <Users className="h-5 w-5 text-purple-600" />
                  </div>
                  <h4 className="font-bold text-gray-800">Collaborative</h4>
                </div>
                <p className="text-gray-600 text-sm">
                  Products frequently purchased together and highly rated by
                  customers with similar preferences
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
