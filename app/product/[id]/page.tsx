"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { AlertTriangle } from "lucide-react";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { Button } from "@/components/ui/button";
import { ProductDetails } from "@/components/product/product-details";
import { PriceHistory } from "@/components/product/price-history";
import { PriceForecasting } from "@/components/product/price-forecasting";
import { SimilarProducts } from "@/components/product/similar-products";
import { ProductRecommendations } from "@/components/product/product-recommendations";
import { AnomalyDetection } from "@/components/product/anomaly-detection";
import { ProductDetailsResponse } from "@/lib/types/product";

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);

      try {
        // Fetch product details from our API
        const response = await fetch(`/api/v1/products/${productId}`);

        if (!response.ok) {
          throw new Error(
            `Failed to fetch product details: ${response.status}`
          );
        }

        const data: ProductDetailsResponse = await response.json();

        // Transform the product data to match our component expectations
        const mainVariant = data.product.variants[0]; // Use first variant as default
        const transformedProduct = {
          id: data.product.id,
          name: data.product.name,
          brand: data.product.brand,
          category: data.product.category,
          price: mainVariant?.price || 0,
          originalPrice: mainVariant?.original_price,
          retailer: data.product.retailer,
          retailerPhone: data.product.retailer_phone,
          retailerWhatsapp: data.product.retailer_whatsapp,
          inStock: mainVariant?.is_available || false,
          image:
            data.product.image || data.product.images[0] || "/placeholder.svg",
          description: data.product.description,
          discount: mainVariant?.discount || 0,
          isFavorited: data.product.is_favorited,
          variants: data.product.variants,
          images: data.product.images,
          // You can add more fields here if needed
          specifications: {
            Category: data.product.category,
            // You'd need to get specifications from the API if available
          },
        };

        setProduct(transformedProduct);
      } catch (error) {
        console.error("Error fetching product details:", error);
        setError("Failed to load product details. Please try again.");
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProductDetails();
    }
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Product</span>
          </div>

          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-muted h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-muted h-8 rounded"></div>
                <div className="bg-muted h-6 rounded w-2/3"></div>
                <div className="bg-muted h-12 rounded"></div>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center text-sm text-muted-foreground mb-4">
            <Link href="/" className="hover:text-foreground transition-colors">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Product</span>
          </div>

          <div className="flex flex-col items-center justify-center space-y-4 py-12">
            <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center max-w-lg">
              <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-gray-800 mb-2">
                Product Not Found
              </h2>
              <p className="text-gray-600 mb-4">
                {error ||
                  "We couldn't find the product you're looking for. It may have been removed or is unavailable."}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button onClick={() => window.history.back()} variant="outline">
                  Go Back
                </Button>
                <Button asChild>
                  <Link href="/new-arrivals">Browse New Arrivals</Link>
                </Button>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Breadcrumb Navigation */}
        <div className="flex items-center text-sm text-muted-foreground mb-4">
          <Link href="/" className="hover:text-foreground transition-colors">
            Home
          </Link>
          <span className="mx-2">&gt;</span>
          <span>{product.name}</span>
        </div>

        <ProductDetails product={product} />
        <PriceHistory productId={productId} />
        <PriceForecasting productId={productId} />
        <AnomalyDetection productId={productId} />
        <SimilarProducts productId={productId} />
        <ProductRecommendations productId={productId} />
      </main>

      <Footer />
    </div>
  );
}
