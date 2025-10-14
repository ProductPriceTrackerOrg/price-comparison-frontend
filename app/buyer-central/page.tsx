"use client";

import { useState, useEffect } from "react";
import { ShoppingBag, AlertTriangle } from "lucide-react";
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

// Import API functions
import {
  getBuyerCentralBuyingGuides,
  getBuyerCentralPriceComparison,
  getRetailerComparisons,
} from "@/lib/buyer-central-api";
export default function BuyerCentralPage() {
  // Loading states for each data type
  const [loading, setLoading] = useState(true);
  const [guidesLoading, setGuidesLoading] = useState(true);
  const [retailersLoading, setRetailersLoading] = useState(true);
  const [priceDataLoading, setPriceDataLoading] = useState(true);

  // Error states for each data type
  const [guidesError, setGuidesError] = useState<string | null>(null);
  const [retailersError, setRetailersError] = useState<string | null>(null);
  const [priceDataError, setPriceDataError] = useState<string | null>(null);

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
    setLoading(true);

    // Load all data in parallel
    await Promise.all([
      loadBuyingGuides(),
      loadRetailerComparisons(),
      loadPriceComparisons(),
    ]);

    // When all data is loaded (whether successful or not), set overall loading to false
    setLoading(false);
  };

  const loadBuyingGuides = async () => {
    setGuidesLoading(true);
    setGuidesError(null);

    try {
      // Call the API function to get buying guides
      const response = await getBuyerCentralBuyingGuides();
      if (response && response.success && response.data) {
        setGuideCategories(response.data);
      } else {
        const errorMsg =
          "Failed to load buying guides: Invalid response format";
        console.error(errorMsg, response);
        setGuidesError(errorMsg);
        setGuideCategories([]);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error loading buying guides:", error);
      setGuidesError(`Failed to load buying guides: ${errorMsg}`);
      setGuideCategories([]);
    } finally {
      setGuidesLoading(false);
    }
  };

  // Market insights and Smart alerts are removed in this simplified version

  const loadRetailerComparisons = async () => {
    setRetailersLoading(true);
    setRetailersError(null);

    try {
      // Get retailer comparisons from API
      const retailers = await getRetailerComparisons();
      setRetailerComparisons(retailers);
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error loading retailer comparisons:", error);
      setRetailersError(`Failed to load retailer data: ${errorMsg}`);
      setRetailerComparisons([]);
    } finally {
      setRetailersLoading(false);
    }
  };

  const loadPriceComparisons = async () => {
    setPriceDataLoading(true);
    setPriceDataError(null);

    try {
      // Define a set of popular product IDs to compare
      // In a real application, these could be derived from:
      // - Recently viewed products
      // - Popular products in the system
      // - Products the user has added to a comparison list
      const popularProductIds = [1, 2, 3]; // Example product IDs

      // Call the API to get price comparison data
      const response = await getBuyerCentralPriceComparison(popularProductIds);

      if (response && response.success && response.data) {
        setComparisonData(response.data);
      } else {
        const errorMsg =
          "Failed to load price comparison: Invalid response format";
        console.error(errorMsg, response);
        setPriceDataError(errorMsg);
        setComparisonData([]);
      }
    } catch (error) {
      const errorMsg =
        error instanceof Error ? error.message : "Unknown error occurred";
      console.error("Error loading price comparisons:", error);
      setPriceDataError(`Failed to load price comparison: ${errorMsg}`);
      setComparisonData([]);
    } finally {
      setPriceDataLoading(false);
    }
  };

  // Define breadcrumb items for consistent header with other pages
  const breadcrumbItems = [
    // { label: "Home", href: "/" },
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
          {/* Display error message if there is one */}
          {(priceDataError || retailersError) && (
            <div className="flex items-center gap-2 p-4 mb-4 text-red-700 bg-red-50 rounded-md border border-red-200">
              <AlertTriangle className="h-5 w-5" />
              <span>{priceDataError || retailersError}</span>
            </div>
          )}

          <PriceComparisonSection
            comparisonData={comparisonData}
            retailerComparisons={retailerComparisons}
            loading={priceDataLoading || retailersLoading}
          />
        </TabsContent>

        <TabsContent value="guides" className="space-y-6">
          {/* Display error message if there is one */}
          {guidesError && (
            <div className="flex items-center gap-2 p-4 mb-4 text-red-700 bg-red-50 rounded-md border border-red-200">
              <AlertTriangle className="h-5 w-5" />
              <span>{guidesError}</span>
            </div>
          )}

          <BuyingGuidesSection
            categories={guideCategories}
            loading={guidesLoading}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
