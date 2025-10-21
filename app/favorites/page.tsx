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
  AlertCircle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import Link from "next/link";
import {
  getUserFavorites,
  removeFromFavorites,
  FavoriteProduct,
} from "@/lib/favorites-api";
import { useToast } from "@/hooks/use-toast";

export default function FavoritesPage() {
  const { user, isLoggedIn } = useAuth();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [isRemoving, setIsRemoving] = useState<number | null>(null);
  const [favorites, setFavorites] = useState<FavoriteProduct[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchFavorites = async () => {
    if (!isLoggedIn || !user) return;

    setIsLoading(true);
    setError(null);

    try {
      // Fetch favorites using our API
      const response = await getUserFavorites();
      setFavorites(response.favorites);

      // Show success message on manual refresh
      if (!isLoading) {
        toast({
          title: "Products refreshed",
          description: (
            <div className="flex items-center">
              <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
              <span>Your tracked products have been refreshed.</span>
            </div>
          ),
        });
      }
    } catch (error: any) {
      console.error("Error fetching favorites:", error);
      setError(
        error.message ||
          "Failed to load your favorite products. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Handle removing a favorite
  const getFavoriteIdentifier = (favorite: FavoriteProduct) => {
    const candidate =
      favorite.variant_id ?? favorite.favorite_id ?? favorite.id;

    if (candidate === undefined || candidate === null) {
      return null;
    }

    if (typeof candidate === "string") {
      const parsed = Number(candidate);
      return Number.isNaN(parsed) ? null : parsed;
    }

    return candidate;
  };

  const handleRemoveFavorite = async (favorite: FavoriteProduct) => {
    if (!isLoggedIn || !user) return;

    const removalKey = getFavoriteIdentifier(favorite);

    if (removalKey === null) {
      console.error("Favorite item missing identifier", favorite);
      toast({
        title: "Removal unavailable",
        description:
          "We couldn't determine which product to remove. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    const productId =
      typeof favorite.id === "string" ? Number(favorite.id) : favorite.id;

    if (
      productId === undefined ||
      productId === null ||
      Number.isNaN(productId)
    ) {
      console.error("Favorite item missing product id", favorite);
      toast({
        title: "Removal unavailable",
        description:
          "We couldn't determine which product to remove. Please refresh and try again.",
        variant: "destructive",
      });
      return;
    }

    setIsRemoving(removalKey);
    setError(null);

    try {
      // Get product name before removing it
      const productToRemove = favorites.find(
        (p) => getFavoriteIdentifier(p) === removalKey
      );
      const productName = productToRemove?.name || "Product";

      // Remove from favorites using our API
  await removeFromFavorites(productId);

      // Update the favorites list
      setFavorites((prevFavorites) =>
        prevFavorites.filter(
          (favoriteItem) => getFavoriteIdentifier(favoriteItem) !== removalKey
        )
      );

      // Show success toast
      toast({
        title: "Product removed from tracked items",
        description: (
          <div className="flex items-center">
            <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
            <span>{`${productName.substring(0, 30)}${
              productName.length > 30 ? "..." : ""
            } has been removed from your tracked products.`}</span>
          </div>
        ),
      });
    } catch (error: any) {
      console.error("Error removing favorite:", error);
      setError(
        error.message ||
          "Failed to remove product from favorites. Please try again."
      );

      // Show error toast
      toast({
        title: "Failed to remove product",
        description: (
          <div className="flex items-center">
            <XCircle className="h-4 w-4 text-red-500 mr-2" />
            <span>
              {error.message ||
                "There was an error removing this product from your tracked items."}
            </span>
          </div>
        ),
        variant: "destructive",
      });
    } finally {
      setIsRemoving(null);
    }
  };

  // Fetch user favorites
  useEffect(() => {
    fetchFavorites();
  }, [isLoggedIn, user]);

  // If user is not logged in, show a message
  if (!isLoggedIn) {
    return (
      <div className="mx-4 md:mx-8 lg:mx-16 xl:mx-24">
        <div className="container max-w-5xl py-10">
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
      <div className="container max-w-5xl pb-10">
        {/* <div className="flex items-center gap-2 text-sm text-gray-500 mb-4 pl-1">
          <Link
            href="/"
            className="flex items-center hover:text-rose-600 transition-colors"
          >
            <Home className="h-3.5 w-3.5 mr-1" />
            <span>Home</span>
          </Link>
          <span>/</span>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-rose-600 via-rose-500 to-indigo-600">
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
            onClick={fetchFavorites}
          >
            <RefreshCw
              className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`}
            />
            Refresh
          </Button>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
            <div className="flex items-center">
              <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
              <p className="text-red-800">{error}</p>
            </div>
          </div>
        )}

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Card
                key={i}
                className="animate-pulse overflow-hidden border border-rose-100 shadow-md"
              >
                <CardContent className="p-0">
                  <div className="flex border-b border-rose-100">
                    <div className="w-1/3 bg-gradient-to-br from-rose-50 to-indigo-50 p-4 flex items-center justify-center">
                      <div className="bg-gray-200/50 rounded-md w-20 h-20"></div>
                    </div>
                    <div className="w-2/3 p-4 space-y-3">
                      <div className="h-5 bg-gray-200/70 rounded w-3/4"></div>
                      <div className="h-4 bg-gray-200/70 rounded w-1/2"></div>
                      <div className="h-3 bg-gray-200/70 rounded w-2/3"></div>
                    </div>
                  </div>
                  <div className="flex border-t border-rose-100 h-12">
                    <div className="flex-1 border-r border-rose-100"></div>
                    <div className="flex-1 border-r border-rose-100"></div>
                    <div className="flex-1"></div>
                  </div>
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
                          src={
                            product.image ||
                            "/placeholder.svg?height=128&width=128"
                          }
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
                        {product.original_price &&
                        product.original_price > product.price ? (
                          <span className="text-sm text-gray-400 line-through">
                            Rs {product.original_price.toLocaleString()}
                          </span>
                        ) : (
                          ""
                        )}
                        {product.discount && product.discount > 0 ? (
                          <span className="text-xs font-medium text-green-600 bg-green-50 px-1.5 py-0.5 rounded">
                            Save {product.discount}%
                          </span>
                        ) : (
                          ""
                        )}
                      </div>
                      <p className="text-xs text-gray-600 mt-2 flex items-center">
                        {product.is_available ? (
                          <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
                        ) : (
                          <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1"></span>
                        )}
                        {product.retailer} •{" "}
                        {product.is_available ? "In Stock" : "Out of Stock"}
                      </p>
                    </div>
                  </div>{" "}
                  <div className="flex border-t border-rose-100">
                    <button
                      onClick={() => {
                        toast({
                          title: "Price Alert Feature",
                          description: (
                            <div className="flex items-center">
                              <Star className="h-4 w-4 text-amber-500 mr-2" />
                              <span>
                                Price alert functionality will be available
                                soon!
                              </span>
                            </div>
                          ),
                        });
                      }}
                      className="flex-1 py-3 px-2 text-indigo-600 hover:bg-indigo-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <Star className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:underline underline-offset-2">
                        Price Alert
                      </span>
                    </button>
                    <div className="w-px bg-rose-100"></div>
                    <Link
                      href={`/product/${product.id}`}
                      className="flex-1 py-3 px-2 text-green-600 hover:bg-green-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      <ShoppingCart className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                      <span className="group-hover:underline underline-offset-2">
                        View
                      </span>
                    </Link>
                    <div className="w-px bg-rose-100"></div>
                    <button
                      onClick={() => handleRemoveFavorite(product)}
                      disabled={isRemoving === getFavoriteIdentifier(product)}
                      className="flex-1 py-3 px-2 text-rose-600 hover:bg-rose-50 font-medium text-sm transition-all duration-200 flex items-center justify-center gap-2 group"
                    >
                      {isRemoving === getFavoriteIdentifier(product) ? (
                        <span className="flex items-center">
                          <svg
                            className="animate-spin -ml-1 mr-1 h-4 w-4"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Removing...
                        </span>
                      ) : (
                        <>
                          <Trash2 className="h-4 w-4 group-hover:scale-110 transition-transform duration-200" />
                          <span className="group-hover:underline underline-offset-2">
                            Remove
                          </span>
                        </>
                      )}
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
              <Link href="/trending">
                <Button className="mt-8 bg-gradient-to-r from-rose-500 to-indigo-600 hover:from-rose-600 hover:to-indigo-700 text-white px-6 py-2 rounded-full shadow-md hover:shadow-lg transition-all duration-300">
                  Browse Products
                </Button>
              </Link>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
