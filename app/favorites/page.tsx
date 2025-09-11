"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Heart,
  Star,
  Trash2,
  ShoppingCart,
  RefreshCw,
  Home,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

export default function FavoritesPage() {
  const { user, isLoggedIn } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [favorites, setFavorites] = useState<any[]>([]);

  // Fetch user favorites
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchFavorites = async () => {
      setIsLoading(true);
      try {
        // Fetch favorites from the UserFavorites table
        const { data, error } = await supabase
          .from("UserFavorites")
          .select(
            `
            favorite_id,
            variant_id
          `
          )
          .eq("user_id", user.id);

        if (error) {
          throw error;
        }

        // For now, use mock data since we don't have product details
        const mockProducts = [
          {
            id: 1,
            name: "Samsung Galaxy S25 Ultra",
            image: "/placeholder.svg?height=128&width=128",
            price: 1199.99,
            oldPrice: 1299.99,
            store: "Samsung Official Store",
            inStock: true,
          },
          {
            id: 2,
            name: "Apple MacBook Pro M3 Pro (16-inch)",
            image: "/placeholder.svg?height=128&width=128",
            price: 2499.99,
            oldPrice: 2699.99,
            store: "Apple Store",
            inStock: true,
          },
          {
            id: 3,
            name: "Sony WH-1000XM5 Wireless Headphones",
            image: "/placeholder.svg?height=128&width=128",
            price: 349.99,
            oldPrice: 399.99,
            store: "Best Buy",
            inStock: false,
          },
        ];

        // In the future, fetch actual product details based on variant_id
        setFavorites(mockProducts);
      } catch (error) {
        console.error("Error fetching favorites:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchFavorites();
  }, [isLoggedIn, user]);

  // If user is not logged in, show a message
  if (!isLoggedIn) {
    return (
      <div className="mx-2 md:mx-4 lg:mx-8 xl:mx-12">
        <div className="container max-w-7xl py-6">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-3 pl-1">
            <Link
              href="/"
              className="flex items-center hover:text-rose-600 transition-colors"
            >
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <span>/</span>
            <span className="text-gray-900">Tracked Products</span>
          </div>
          <Card className="border-rose-100 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-rose-50 to-indigo-50 border-b border-rose-100">
              <CardTitle className="flex items-center text-rose-700">
                <Heart className="h-5 w-5 mr-2 text-rose-500" />
                Tracked Products
              </CardTitle>
            </CardHeader>
            <CardContent className="py-8 text-center">
              <p className="text-gray-600 mb-4">
                Please sign in to view your tracked products.
              </p>
              <Button className="bg-rose-500 hover:bg-rose-600">Sign In</Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="mx-2 md:mx-4 lg:mx-8 xl:mx-12">
      <div className="container max-w-5xl py-6">
        {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pl-1">
          <Link
            href="/"
            className="flex items-center hover:text-rose-600 transition-colors"
          >
            <Home className="h-3.5 w-3.5 mr-1" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800">
            Tracked Products
          </span>
        </div> */}
        <div className="flex justify-between items-center mb-5">
          <div>
            <h1 className="text-3xl font-bold flex items-center bg-clip-text text-transparent bg-gradient-to-r from-rose-500 to-indigo-600">
              <Heart className="h-8 w-8 mr-2 text-rose-500" />
              Tracked Products
            </h1>
            <p className="text-gray-500 mt-1 ml-10">
              Track your favorite products and get notified about price changes
            </p>
          </div>
          <Button
            variant="outline"
            className="gap-2 bg-gradient-to-r from-rose-50 to-indigo-50 border-rose-200 text-rose-700 hover:bg-rose-100"
            disabled={isLoading}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="animate-pulse overflow-hidden border border-rose-100 shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex border-b border-rose-50">
                    <div className="w-1/3 bg-rose-50/30 p-6 flex items-center justify-center">
                      <div className="bg-gray-200 rounded-md w-20 h-20"></div>
                    </div>
                    <div className="w-2/3 p-4 space-y-2">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-gray-50"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : favorites.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((product) => (
              <Card
                key={product.id}
                className="overflow-hidden group border border-rose-100 shadow-md hover:shadow-lg transition-all duration-300"
              >
                <CardContent className="p-0">
                  <div className="flex border-b border-rose-100">
                    <div className="w-1/3 bg-gradient-to-br from-rose-50 to-indigo-50 p-4 flex items-center justify-center">
                      <div className="relative group-hover:scale-105 transition-transform duration-300">
                        <div className="absolute -inset-1 bg-gradient-to-r from-rose-200 to-indigo-200 rounded-full blur-sm opacity-30 group-hover:opacity-70 transition-opacity duration-300"></div>
                        <img
                          src={product.image}
                          alt={product.name}
                          className="h-20 w-auto object-contain relative"
                        />
                      </div>
                    </div>
                    <div className="w-2/3 p-4">
                      <h3 className="font-medium text-lg line-clamp-2 mb-2 group-hover:text-rose-600 transition-colors duration-200">
                        {product.name}
                      </h3>
                      <div className="flex items-baseline space-x-2">
                        <span className="text-lg font-bold text-rose-600">
                          Rs {product.price.toLocaleString()}
                        </span>
                        {product.oldPrice && (
                          <span className="text-sm text-gray-400 line-through">
                            Rs {product.oldPrice.toLocaleString()}
                          </span>
                        )}
                        {product.oldPrice && (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            Save{" "}
                            {Math.round(
                              ((product.oldPrice - product.price) /
                                product.oldPrice) *
                                100
                            )}
                            %
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 flex items-center">
                        {product.inStock ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        )}
                        {product.store} •{" "}
                        {product.inStock ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>

                  <div className="flex border-t border-rose-100">
                    <button className="flex-1 py-3 px-2 text-indigo-600 hover:bg-indigo-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group">
                      <Star className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:underline underline-offset-2">
                        Price Alert
                      </span>
                    </button>
                    <div className="w-px bg-rose-100"></div>
                    <button className="flex-1 py-3 px-2 text-green-600 hover:bg-green-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group">
                      <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:underline underline-offset-2">
                        Buy Now
                      </span>
                    </button>
                    <div className="w-px bg-rose-100"></div>
                    <button className="flex-1 py-3 px-2 text-rose-600 hover:bg-rose-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group">
                      <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:underline underline-offset-2">
                        Remove
                      </span>
                    </button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="border border-rose-100 shadow-lg overflow-hidden">
            <div className="h-2 bg-gradient-to-r from-rose-500 via-purple-500 to-indigo-500"></div>
            <CardContent className="flex flex-col items-center justify-center py-16 px-6">
              <div className="relative mb-6">
                <div className="absolute -inset-1 bg-gradient-to-r from-rose-400 to-indigo-400 rounded-full blur-md opacity-20 animate-pulse"></div>
                <div className="rounded-full bg-gradient-to-br from-rose-50 to-indigo-50 p-5 relative">
                  <Heart className="h-12 w-12 text-rose-400" />
                </div>
              </div>
              <h3 className="text-2xl font-medium text-gray-900">
                No tracked products yet
              </h3>
              <p className="text-gray-500 mt-3 text-center max-w-md leading-relaxed">
                Start tracking products to receive price drop alerts and compare
                prices across different retailers. We'll notify you when prices
                change.
              </p>
              <Button className="mt-8 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                Browse Products
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
