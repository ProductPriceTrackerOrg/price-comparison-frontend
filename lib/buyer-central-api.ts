import api from "./api";
import {
  BuyerCentralApiResponse,
  BuyingGuideCategory,
  PriceComparisonData,
  RetailerComparison,
} from "./types/buyer-central";

/**
 * Search for products in the buyer central system by exact product name
 * @param query The full product name to search for
 * @param limit Maximum number of results to return (optional, default 4)
 * @param categoryId Filter by category ID (optional)
 * @returns List of matching products across retailers with their prices and URLs
 */
export interface SearchProductResult {
  id: number;
  name: string;
  brand: string;
  category: string;
  retailer: string;
  currentPrice: number;
  productUrl: string;
  image: string;
}

export const searchBuyerCentralProducts = async (
  query: string,
  limit: number = 4,
  categoryId?: number
): Promise<BuyerCentralApiResponse<SearchProductResult[]>> => {
  try {
    const params: Record<string, string | number> = {
      query,
      limit,
    };

    if (categoryId !== undefined) {
      params.category_id = categoryId;
    }

    const response = await api.get<BuyerCentralApiResponse<SearchProductResult[]>>(
      "/api/v1/buyer-central/search-products",
      { params }
    );
    return response.data;
  } catch (error) {
    console.error("Error searching products:", error);
    throw error;
  }
};

/**
 * Get price comparison data for specific products
 * @param productIds Array of product IDs to compare
 * @param limit Maximum number of retailers per product (optional, default 5)
 * @returns Price comparison data across retailers
 */
export const getBuyerCentralPriceComparison = async (
  productIds: number[],
  limit: number = 5
): Promise<BuyerCentralApiResponse<PriceComparisonData[]>> => {
  try {
    const params = {
      product_ids: productIds.join(","),
      limit,
    };

    const response = await api.get<
      BuyerCentralApiResponse<PriceComparisonData[]>
    >("/api/v1/buyer-central/price-comparison", { params });
    return response.data;
  } catch (error) {
    console.error("Error fetching price comparison:", error);
    throw error;
  }
};

/**
 * Get buying guides categories
 * @returns List of buying guide categories with metadata
 */
export const getBuyerCentralBuyingGuides = async (): Promise<
  BuyerCentralApiResponse<BuyingGuideCategory[]>
> => {
  try {
    const response = await api.get<
      BuyerCentralApiResponse<BuyingGuideCategory[]>
    >("/api/v1/buyer-central/buying-guides");
    return response.data;
  } catch (error) {
    console.error("Error fetching buying guides:", error);
    throw error;
  }
};

/**
 * Get retailer comparison data (this is a placeholder as this endpoint isn't
 * explicitly defined in the backend implementation you provided)
 */
export const getRetailerComparisons = async (): Promise<
  RetailerComparison[]
> => {
  try {
    // For now we'll return mock data since there's no explicit endpoint for this in your backend implementation
    // In a real implementation, you would call an endpoint like:
    // const response = await api.get<BuyerCentralApiResponse<RetailerComparison[]>>("/api/v1/buyer-central/retailers");
    // return response.data.data;

    // Mock data
    return [
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
  } catch (error) {
    console.error("Error fetching retailer comparisons:", error);
    throw error;
  }
};

/**
 * Get search autocomplete suggestions
 * @param query Search query string (minimum 2 characters)
 * @param limit Maximum number of suggestions to return (optional, default 50)
 * @returns Array of product name suggestions
 */
export const getSearchAutocomplete = async (
  query: string,
  limit: number = 50
): Promise<string[]> => {
  try {
    if (query.length < 2) {
      return [];
    }
    
    const params = {
      q: query,
      limit,
    };

    const response = await api.get<{ suggestions: string[] }>(
      "/api/v1/search/autocomplete",
      { params }
    );
    
    return response.data.suggestions;
  } catch (error) {
    console.error("Error fetching search autocomplete:", error);
    // Return empty array on error instead of throwing
    return [];
  }
};