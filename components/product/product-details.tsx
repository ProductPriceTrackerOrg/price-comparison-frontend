"use client";

import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  ExternalLink,
  Phone,
  MessageCircle,
  Store,
  Share2,
  Eye,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { ProductChat } from "@/components/product/product-chat";
import { useAuth } from "@/contexts/auth-context";
import {
  toggleProductFavorite,
  isProductFavorited,
  getUserFavorites,
} from "@/lib/favorites-service";
import {
  checkUserNotificationSettings,
  createUserNotificationSettings,
} from "@/lib/notification-service";
import { useRouter } from "next/navigation";
import { SignInDialog } from "@/components/auth/sign-in-dialog";
import { NotificationConfirmDialog } from "@/components/product/notification-confirm-dialog";
import { resolveProductImageUrl } from "@/lib/utils";

interface ProductDetailsProps {
  product: {
    id: number;
    name: string;
    brand?: string;
    category?: string;
    price: number;
    originalPrice?: number;
    retailer?: string;
    retailerPhone?: string;
    retailerWhatsapp?: string;
    productUrl?: string; // New field for product URL
    inStock: boolean;
    image?: string;
    description?: string;
    discount?: number;
    isFavorited?: boolean;
    variants?: any[];
    images?: string[];
    specifications?: Record<string, string>;
  };
}

export function ProductDetails({ product }: ProductDetailsProps) {
  const [isFavorited, setIsFavorited] = useState(product?.isFavorited || false);
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingStatus, setIsCheckingStatus] = useState(true); // Loading state for initial favorite status check
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [showNotificationDialog, setShowNotificationDialog] = useState(false);
  const { toast } = useToast();
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const resolvedImage = resolveProductImageUrl(product.image);

  // Check if the product is already favorited when component loads
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (user && product?.id) {
        setIsCheckingStatus(true);
        try {
          const isFav = await isProductFavorited(product.id, user.id);
          setIsFavorited(isFav);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        } finally {
          setIsCheckingStatus(false);
        }
      } else {
        // If no user or product id, we're done checking
        setIsCheckingStatus(false);
      }
    };

    checkFavoriteStatus();
  }, [user, product?.id]);

  const handleFavorite = async () => {
    // If user is not logged in, show auth dialog
    if (!isLoggedIn || !user) {
      setShowAuthDialog(true);
      return;
    }

    setIsLoading(true);

    try {
      const result = await toggleProductFavorite(product.id, user.id);

      // If the product was added to favorites (not removed)
      if (result.isFavorited) {
        setIsFavorited(true);

        toast({
          title: "Added to tracking",
          description: `${product.name} added to your tracked products`,
        });

        // Check if user has notification settings
        const hasNotificationSettings = await checkUserNotificationSettings(
          user.id
        );

        if (!hasNotificationSettings) {
          // Show notification settings dialog after a short delay to allow the first toast to be visible
          setTimeout(() => {
            setShowNotificationDialog(true);
          }, 500);
        }
      } else {
        // Product was removed from favorites
        setIsFavorited(false);

        toast({
          title: "Removed from tracking",
          description: `${product.name} removed from your tracked products`,
        });
      }

      if (result.error) {
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating favorite status:", error);
      toast({
        title: "Something went wrong",
        description: "Could not update tracked products. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handler for when user confirms notification settings
  const handleNotificationConfirm = async () => {
    if (!user) return;

    try {
      const result = await createUserNotificationSettings(user.id);

      if (result.success) {
        toast({
          title: "Notifications enabled",
          description:
            "You'll now receive price drop alerts and weekly reports",
        });
      } else {
        throw result.error;
      }
    } catch (error) {
      console.error("Error setting up notifications:", error);
      toast({
        title: "Notification setup failed",
        description:
          "We couldn't set up notifications. You can try again in your settings.",
        variant: "destructive",
      });
    }
  };

  // Handler for when user cancels notification settings
  const handleNotificationCancel = () => {
    toast({
      title: "Notifications skipped",
      description: "You can enable notifications later in your settings",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link copied",
      description: "Product link copied to clipboard",
    });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Product Image and Chat */}
      <div className="space-y-6">
        <div className="relative">
          <img
            src={resolvedImage || "/placeholder.svg"}
            alt={product.name}
            className="w-full h-96 object-cover rounded-lg"
          />
          {(() => {
            if (product.discount && product.originalPrice) {
              return (
                <>
                  <Badge className="absolute top-4 left-4 bg-red-500 text-white">
                    -{product.discount}% OFF
                  </Badge>
                </>
              );
            }
            return null;
          })()}
        </div>

        {/* Product Chat - Isolate from page scroll events */}
        <div
          className="mt-6"
          onClick={(e) => e.stopPropagation()}
          onScroll={(e) => e.stopPropagation()}
        >
          <ProductChat productId={product.id} productName={product.name} />
        </div>
      </div>

      {/* Product Info */}
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground mb-2">
            {product.name}
          </h1>
          <div className="flex items-center space-x-2 text-muted-foreground mb-4">
            <span>{product.brand}</span>
            <span>•</span>
            <span>{product.category}</span>
          </div>

          <div className="flex items-center space-x-4 mb-4">
            <span className="text-4xl font-bold text-foreground">
              Rs {product.price.toLocaleString("en-US")}
            </span>
            {product.originalPrice && (
              <span className="text-xl text-muted-foreground line-through">
                Rs {product.originalPrice.toLocaleString("en-US")}
              </span>
            )}
            {(() => {
              if (product.discount && product.originalPrice) {
                return (
                  <Badge variant="destructive">
                    Save Rs{" "}
                    {(product.originalPrice - product.price).toLocaleString(
                      "en-US",
                      { minimumFractionDigits: 2, maximumFractionDigits: 2 }
                    )}
                  </Badge>
                );
              }
              return null;
            })()}
          </div>

          <Badge
            variant={product.inStock ? "default" : "secondary"}
            className="mb-4"
          >
            {product.inStock ? "In Stock" : "Out of Stock"}
          </Badge>
        </div>

        {/* Description */}
        <div>
          <h3 className="text-lg font-semibold mb-2">Description</h3>
          <p className="text-muted-foreground">{product.description}</p>
        </div>

        {/* Retailer Info */}
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Store className="h-5 w-5 text-primary" />
                <span className="font-semibold">{product.retailer}</span>
              </div>
              <Button variant="outline" size="sm" asChild>
                <a
                  href={product.productUrl || "#"}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  Visit Store
                </a>
              </Button>
            </div>

            <div className="flex space-x-4">
              <Button variant="outline" size="sm">
                <Phone className="mr-2 h-4 w-4" />
                {product.retailerPhone}
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="mr-2 h-4 w-4" />
                WhatsApp
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex space-x-4">
          <Button
            onClick={handleFavorite}
            variant={isFavorited ? "default" : "outline"}
            className="flex-1"
            disabled={isLoading || isCheckingStatus}
          >
            {isLoading || isCheckingStatus ? (
              <span className="flex items-center">
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
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
                {isCheckingStatus ? "Checking..." : "Processing..."}
              </span>
            ) : (
              <>
                <Heart
                  className={`mr-2 h-4 w-4 ${
                    isFavorited ? "fill-current" : ""
                  }`}
                />
                {isFavorited ? "Tracking" : "Track Price"}
              </>
            )}
          </Button>
          <Button variant="outline" onClick={handleShare} disabled={isLoading}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" asChild>
            <a
              href={`https://www.google.com/search?q=${encodeURIComponent(
                product.name
              )}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              <Eye className="mr-2 h-4 w-4" />
              View on Google
            </a>
          </Button>
        </div>

        {/* Specifications */}
        {product.specifications && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Specifications</h3>
            <div className="space-y-2">
              {Object.entries(product.specifications).map(([key, value]) => (
                <div
                  key={key}
                  className="flex justify-between py-2 border-b border-border last:border-b-0"
                >
                  <span className="text-muted-foreground">{key}</span>
                  <span className="font-medium">{value as string}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sign In Dialog */}
      <SignInDialog
        isOpen={showAuthDialog}
        setIsOpen={setShowAuthDialog}
        title="Sign in to track prices"
        message="You need to be signed in to track product prices and get notifications on price changes."
      />

      {/* Notification Confirmation Dialog */}
      <NotificationConfirmDialog
        isOpen={showNotificationDialog}
        setIsOpen={setShowNotificationDialog}
        onConfirm={handleNotificationConfirm}
        onCancel={handleNotificationCancel}
        productName={product.name}
      />
    </div>
  );
}
