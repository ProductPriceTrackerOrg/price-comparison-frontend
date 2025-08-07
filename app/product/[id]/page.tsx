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

export default function ProductPage() {
  const params = useParams();
  const productId = params.id as string;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  // Mock product data
  const mockProduct = {
    id: 1,
    name: "Samsung Galaxy S24 Ultra 256GB",
    brand: "Samsung",
    category: "Smartphones",
    price: 1199.99,
    originalPrice: 1299.99,
    retailer: "TechStore",
    retailerPhone: "+1-555-0123",
    retailerWhatsapp: "+1-555-0123",
    inStock: true,
    image:
      "https://imagedelivery.net/7D3NQGy_afPWwbfcO5Acjw/celltronics.lk/2023/07/galaxy-watch6-kv-pc.jpg/w=9999",
    description:
      "The Samsung Galaxy S24 Ultra features a stunning 6.8-inch Dynamic AMOLED display, powerful Snapdragon 8 Gen 3 processor, and an advanced camera system with 200MP main sensor. Perfect for photography enthusiasts and power users.",
    discount: 8,
    specifications: {
      Display: '6.8" Dynamic AMOLED 2X',
      Processor: "Snapdragon 8 Gen 3",
      RAM: "12GB",
      Storage: "256GB",
      Camera: "200MP + 50MP + 12MP + 10MP",
      Battery: "5000mAh",
      OS: "Android 14",
    },
  };

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setProduct(mockProduct);
      setLoading(false);
    }, 1000);
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <NavigationBar />
        <main className="container mx-auto px-4 py-8">
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

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8 space-y-12">
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
