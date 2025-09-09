"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";
import { ProductDetails } from "@/components/product/product-details";
import { PriceHistory } from "@/components/product/price-history";
import { PriceForecasting } from "@/components/product/price-forecasting";
import { SimilarProducts } from "@/components/product/similar-products";
import { ProductRecommendations } from "@/components/product/product-recommendations";
import { AnomalyDetection } from "@/components/product/anomaly-detection";
import { Button } from "@/components/ui/button";
import { Loader2, AlertCircle, RefreshCw } from "lucide-react";

interface ProductData {
  id: number;
  name: string;
  brand: string;
  category: string;
  category_id: number;
  description: string;
  image: string;
  images: string[];
  retailer: string;
  retailer_phone?: string;
  retailer_whatsapp?: string;
  variants: Array<{
    variant_id: number;
    title: string;
    price: number;
    original_price: number;
    is_available: boolean;
    discount: number;
  }>;
  is_favorited: boolean;
}

interface ProductResponse {
  product: ProductData;
}

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  
  const [product, setProduct] = useState<ProductData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Log product view
  const logProductView = async (productData: ProductData) => {
    try {
      // Use the first variant for logging (you might want to track which specific variant the user is viewing)
      const firstVariant = productData.variants[0];
      if (firstVariant) {
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}/view?variant_id=${firstVariant.variant_id}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // Include authorization header if user is logged in
            ...(localStorage.getItem('token') && {
              'Authorization': `Bearer ${localStorage.getItem('token')}`
            })
          }
        });
      }
    } catch (error) {
      console.log('Failed to log product view:', error);
      // Don't throw error as this is not critical for user experience
    }
  };

  // Fetch product data
  const fetchProduct = async () => {
    try {
      setLoading(true);
      setError(null);

      console.log('Fetching product:', productId);

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}`, {
        headers: {
          'Content-Type': 'application/json',
          // Include authorization header if user is logged in for personalized data (favorites)
          ...(localStorage.getItem('token') && {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          })
        }
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Product not found');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ProductResponse = await response.json();
      console.log('Product API response:', data);

      setProduct(data.product);

      // Log the product view
      await logProductView(data.product);

    } catch (err: any) {
      console.error('Error fetching product:', err);
      setError(err.message || 'Failed to fetch product');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  // Handle favorite toggle
  const handleFavoriteToggle = async (isFavorited: boolean) => {
    if (!product) return;

    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // Redirect to login or show login modal
        console.log('User needs to login to favorite products');
        return;
      }

      const method = isFavorited ? 'DELETE' : 'POST';
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/products/${productId}/favorite`, {
        method,
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        setProduct(prev => prev ? { ...prev, is_favorited: !isFavorited } : null);
      }
    } catch (error) {
      console.error('Failed to toggle favorite:', error);
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div className="animate-pulse space-y-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-200 h-96 rounded-lg"></div>
              <div className="space-y-4">
                <div className="bg-gray-200 h-8 rounded"></div>
                <div className="bg-gray-200 h-6 rounded w-2/3"></div>
                <div className="bg-gray-200 h-12 rounded"></div>
                <div className="bg-gray-200 h-32 rounded"></div>
              </div>
            </div>
            {/* Loading skeleton for other sections */}
            <div className="space-y-8">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="bg-gray-200 h-6 rounded w-1/4 mb-4"></div>
                  <div className="bg-gray-200 h-64 rounded"></div>
                </div>
              ))}
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <div className="w-24 h-24 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-12 w-12 text-red-500" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {error === 'Product not found' ? 'Product Not Found' : 'Something went wrong'}
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              {error === 'Product not found' 
                ? "The product you're looking for doesn't exist or may have been removed."
                : "We encountered an error while loading the product. Please try again."
              }
            </p>
            <div className="space-x-4">
              <Button 
                onClick={() => window.history.back()} 
                variant="outline"
              >
                Go Back
              </Button>
              <Button 
                onClick={fetchProduct}
                className="inline-flex items-center"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Try Again
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // Product not found
  if (!product) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
          <div className="text-center py-16">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
            <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
            <Button onClick={() => window.history.back()} variant="outline">
              Go Back
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8 space-y-12">
        {/* Product Details Section */}
        <ProductDetails 
          product={{
            ...product,
            // Map the API response to the format expected by ProductDetails component
            originalPrice: product.variants[0]?.original_price,
            price: product.variants[0]?.price,
            inStock: product.variants.some(v => v.is_available),
            discount: product.variants[0]?.discount || 0,
            retailerPhone: product.retailer_phone,
            retailerWhatsapp: product.retailer_whatsapp,
            specifications: {
              // You might want to add actual specifications from your API
              // For now, using placeholder data
              Brand: product.brand,
              Category: product.category,
              Variants: `${product.variants.length} available`,
              "In Stock": product.variants.filter(v => v.is_available).length.toString(),
            }
          }}
        />

        {/* Price History Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <PriceHistory productId={productId} />
        </div>

        {/* Price Forecasting Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <PriceForecasting productId={productId} />
        </div>

        {/* Anomaly Detection Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <AnomalyDetection productId={productId} />
        </div>

        {/* Similar Products Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <SimilarProducts productId={productId} />
        </div>

        {/* Product Recommendations Section */}
        <div className="bg-white rounded-lg shadow-sm">
          <ProductRecommendations productId={productId} />
        </div>
      </main>

      <Footer />
    </div>
  );
}