"use client";

import { useState, useEffect } from "react";
import { ShoppingBag } from "lucide-react";
import { PageHeader } from "@/components/layout/page-header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// Import only the components we need for the simplified implementation
import { PriceComparisonSection } from "@/components/buyer-central/price-comparison-section";
import { BuyingGuidesSection } from "@/components/buyer-central/buying-guides-section";

// Import types
import {
  BuyingGuideCategory,
  RetailerComparison,
  PriceComparisonData,
} from "@/lib/types/buyer-central";
export default function BuyerCentralPage() {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("compare");

  // Data states - simplified to only include what we need
  const [guideCategories, setGuideCategories] = useState<BuyingGuideCategory[]>(
    []
  );
  const [comparisonData, setComparisonData] = useState<PriceComparisonData[]>(
    []
  );
  const [retailerComparisons, setRetailerComparisons] = useState<
    RetailerComparison[]
  >([]);

  useEffect(() => {
    loadBuyerCentralData();
  }, []);

  const loadBuyerCentralData = async () => {
    try {
      setLoading(true);
      await Promise.all([
        loadBuyingGuides(),
        loadRetailerComparisons(),
        loadPriceComparisons(),
      ]);
    } catch (error) {
      console.error("Failed to load buyer central data:", error);
    } finally {
      setLoading(false);
    }
  };

  const loadBuyingGuides = async () => {
    // Mock data - replace with actual API call
    const mockCategories: BuyingGuideCategory[] = [
      {
        categoryId: 1,
        categoryName: "Smartphones",
        description: "Complete guides for choosing the perfect smartphone",
        icon: "📱",
        guideCount: 12,
        avgProductPrice: 899,
        popularBrands: ["Apple", "Samsung", "Google"],
      },
      {
        categoryId: 2,
        categoryName: "Laptops",
        description: "Expert advice for laptop purchases",
        icon: "💻",
        guideCount: 15,
        avgProductPrice: 1299,
        popularBrands: ["Apple", "Dell", "HP"],
      },
      {
        categoryId: 3,
        categoryName: "Smart Watches",
        description: "Everything you need to know about smart watches",
        icon: "⌚",
        guideCount: 8,
        avgProductPrice: 349,
        popularBrands: ["Apple", "Samsung", "Fitbit"],
      },
    ];
    setGuideCategories(mockCategories);
  };

  // Market insights and Smart alerts are removed in this simplified version

  const loadRetailerComparisons = async () => {
    // Mock data - replace with actual API call
    const mockRetailers: RetailerComparison[] = [
      {
        retailerId: 1,
        retailerName: "TechMart",
        averageRating: 4.8,
        overallRating: 4.8,
        priceCompetitiveness: 9.2,
        competitivenessScore: 92,
        customerService: 4.5,
        customerServiceRating: 4.5,
        shippingSpeed: 4.7,
        returnPolicy: 4.9,
        deliverySpeed: "2-3 days",
        specialties: ["Electronics", "Gaming"],
        strengths: ["Competitive Pricing", "Fast Delivery", "Customer Support"],
        averageDiscount: 15,
        totalProducts: 25840,
      },
      {
        retailerId: 2,
        retailerName: "ElectroHub",
        averageRating: 4.6,
        overallRating: 4.6,
        priceCompetitiveness: 8.8,
        competitivenessScore: 88,
        customerService: 4.2,
        customerServiceRating: 4.2,
        shippingSpeed: 4.5,
        returnPolicy: 4.6,
        deliverySpeed: "1-2 days",
        specialties: ["Mobile", "Accessories"],
        strengths: ["Wide Selection", "Fast Shipping"],
        averageDiscount: 12,
        totalProducts: 18650,
      },
      {
        retailerId: 3,
        retailerName: "MegaStore",
        averageRating: 4.4,
        overallRating: 4.4,
        priceCompetitiveness: 8.5,
        competitivenessScore: 85,
        customerService: 4.0,
        customerServiceRating: 4.0,
        shippingSpeed: 4.3,
        returnPolicy: 4.5,
        deliverySpeed: "3-5 days",
        specialties: ["Appliances", "Electronics"],
        strengths: ["Good Prices", "Reliable"],
        averageDiscount: 10,
        totalProducts: 32100,
      },
    ];
    setRetailerComparisons(mockRetailers);
  };

  const loadPriceComparisons = async () => {
    // Mock data - replace with actual API call
    const mockComparisonData: PriceComparisonData[] = [
      {
        productId: 1,
        productName: "iPhone 15 Pro Max 256GB",
        categoryName: "Smartphones",
        averagePrice: 1199,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 1149,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 1199,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 3,
            retailerName: "MegaStore",
            price: 1229,
            stockStatus: "in_stock",
            rating: 4.4,
            lastUpdated: "2024-08-05",
          },
          {
            retailerId: 4,
            retailerName: "QuickBuy",
            price: 1179,
            stockStatus: "low_stock",
            rating: 4.2,
            lastUpdated: "2024-08-06",
          },
        ],
        priceHistory: {
          priceChange: -3.2,
          trend: "decreasing",
        },
      },
      {
        productId: 2,
        productName: "Samsung Galaxy S24 Ultra 512GB",
        categoryName: "Smartphones",
        averagePrice: 1399,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 1359,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 1399,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 3,
            retailerName: "MegaStore",
            price: 1449,
            stockStatus: "in_stock",
            rating: 4.4,
            lastUpdated: "2024-08-05",
          },
        ],
        priceHistory: {
          priceChange: -1.8,
          trend: "stable",
        },
      },
      {
        productId: 3,
        productName: "MacBook Pro 14-inch M3 Pro",
        categoryName: "Laptops",
        averagePrice: 2499,
        retailerPrices: [
          {
            retailerId: 1,
            retailerName: "TechMart",
            price: 2399,
            stockStatus: "in_stock",
            rating: 4.8,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 2,
            retailerName: "ElectroHub",
            price: 2499,
            stockStatus: "in_stock",
            rating: 4.6,
            lastUpdated: "2024-08-06",
          },
          {
            retailerId: 4,
            retailerName: "QuickBuy",
            price: 2449,
            stockStatus: "in_stock",
            rating: 4.2,
            lastUpdated: "2024-08-06",
          },
        ],
        priceHistory: {
          priceChange: -4.1,
          trend: "decreasing",
        },
      },
    ];
    setComparisonData(mockComparisonData);
  };

  // Define breadcrumb items for consistent header with other pages
  const breadcrumbItems = [
    { label: "Home", href: "/" },
    { label: "Buyer Central", href: "/buyer-central" },
  ];

  return (
    <div className="container mx-auto px-4 py-8">
      <PageHeader
        title="Buyer Central"
        icon={ShoppingBag}
        breadcrumbItems={breadcrumbItems}
      />

      <Tabs
        value={activeTab}
        onValueChange={setActiveTab}
        className="space-y-6"
      >
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="compare">Price Comparison</TabsTrigger>
          <TabsTrigger value="guides">Buying Guides</TabsTrigger>
        </TabsList>

        <TabsContent value="compare" className="space-y-6">
          <PriceComparisonSection
            comparisonData={comparisonData}
            retailerComparisons={retailerComparisons}
            loading={loading}
          />
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          <BuyingGuidesSection categories={guideCategories} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
