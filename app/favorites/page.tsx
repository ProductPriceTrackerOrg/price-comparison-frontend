"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Heart, Star, Trash2, ShoppingCart, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";

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
          .select(`
            favorite_id,
            variant_id
          `)
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
      <div className="container max-w-7xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Tracked Products</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view your tracked products.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-7xl py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold flex items-center">
          <Heart className="h-8 w-8 mr-2 text-rose-500" />
          Tracked Products
        </h1>
        <Button variant="outline" className="gap-2" disabled={isLoading}>
          <RefreshCw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="bg-gray-200 rounded-md w-20 h-20"></div>
                  <div className="flex-1 space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : favorites.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {favorites.map((product) => (
            <Card key={product.id} className="overflow-hidden group">
              <CardContent className="p-0">
                <div className="flex border-b">
                  <div className="w-1/3 bg-gray-50 p-4 flex items-center justify-center">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-20 w-auto object-contain"
                    />
                  </div>
                  <div className="w-2/3 p-4">
                    <h3 className="font-medium text-lg line-clamp-2 mb-1">
                      {product.name}
                    </h3>
                    <div className="flex items-baseline space-x-2">
                      <span className="text-lg font-bold text-blue-700">
                        Rs {product.price.toLocaleString()}
                      </span>
                      {product.oldPrice && (
                        <span className="text-sm text-gray-400 line-through">
                          Rs {product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-600 mt-1">
                      {product.store}
                    </p>
                  </div>
                </div>

                <div className="flex border-t">
                  <button className="flex-1 py-2 px-2 text-blue-600 hover:bg-blue-50 font-medium text-sm transition-colors duration-150 flex items-center justify-center gap-2">
                    <Star className="h-4 w-4" />
                    Price Alert
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button className="flex-1 py-2 px-2 text-green-600 hover:bg-green-50 font-medium text-sm transition-colors duration-150 flex items-center justify-center gap-2">
                    <ShoppingCart className="h-4 w-4" />
                    Buy Now
                  </button>
                  <div className="w-px bg-gray-200"></div>
                  <button className="flex-1 py-2 px-2 text-red-600 hover:bg-red-50 font-medium text-sm transition-colors duration-150 flex items-center justify-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Remove
                  </button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <div className="rounded-full bg-gray-100 p-3 mb-4">
              <Heart className="h-10 w-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900">
              No tracked products yet
            </h3>
            <p className="text-gray-500 mt-1 text-center max-w-md">
              Start tracking products to receive price drop alerts and compare
              prices across different retailers.
            </p>
            <Button className="mt-6">Browse Products</Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
