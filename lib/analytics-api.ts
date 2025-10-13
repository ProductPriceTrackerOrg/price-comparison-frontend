import api from "./api";
import { handleApiError } from "./error-handling";
import { PriceAlert } from "@/components/analytics/price-alerts";

// Types for the API responses
export interface PriceHistoryPoint {
  date: string;
  avg_price: number;
  lowest_price: number;
  price_drops: number;
  is_good_time_to_buy: boolean;
}

// Price Change API response type
export interface PriceChangeItem {
  id: string | number;
  name: string;
  brand: string;
  category: string;
  current_price: number;
  previous_price: number;
  price_change: number;
  percentage_change: number;
  retailer: string;
  retailer_id: number;
  image: string;
  change_date: string;
  in_stock: boolean;
}

export interface PriceChangeResponse {
  price_changes: PriceChangeItem[];
}

export interface PriceHistoryResponse {
  price_history: PriceHistoryPoint[];
  best_time_to_buy: {
    recommendation: string;
    confidence: number;
  };
}

export interface CategoryDistribution {
  name: string;
  value: number;
  color: string;
}

export interface MarketSummaryResponse {
  summary: {
    total_products: number;
    total_shops: number;
    average_price_change: number;
    price_drop_percentage: number;
    best_buying_score: number;
    category_distribution: CategoryDistribution[];
  };
}

// New API response interfaces for Category Insights and Shop Comparison
export interface CategoryInsightItem {
  category_name: string;
  avg_price: number;
  price_change: number;
  price_volatility: number;
  product_count: number;
  deal_count: number;
}

export interface CategoryInsightsResponse {
  insights: CategoryInsightItem[];
}

export interface ShopInsightItem {
  shop_name: string;
  product_count: number;
  avg_price_rating: number;
  reliability_score: number;
  availability_percentage: number;
  best_categories: string[];
}

export interface ShopComparisonResponse {
  insights: ShopInsightItem[];
}

export interface AnalyticsFilters {
  timeRange: string; // "7d" | "30d" | "90d" | "1y"
  category: string;
  retailer: string;
}

/**
 * Fetch category insights data from the API
 *
 * @param filters - Time range and retailer filters
 * @returns Category insights data
 */
export const fetchCategoryInsights = async (
  filters: AnalyticsFilters
): Promise<CategoryInsightsResponse> => {
  try {
    const { timeRange, retailer } = filters;
    const response = await api.get<CategoryInsightsResponse>(
      "/api/v1/analytics/category-insights",
      {
        params: {
          time_range: timeRange,
          retailer: retailer !== "all" ? retailer : undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch category insights data:", error);
    // Return empty data structure
    return { insights: [] };
  }
};

/**
 * Fetch shop comparison data from the API
 *
 * @param filters - Time range and category filters
 * @returns Shop comparison data
 */
export const fetchShopComparison = async (
  filters: AnalyticsFilters
): Promise<ShopComparisonResponse> => {
  try {
    const { timeRange, category } = filters;
    const response = await api.get<ShopComparisonResponse>(
      "/api/v1/analytics/shop-comparison",
      {
        params: {
          time_range: timeRange,
          category: category !== "all" ? category : undefined,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch shop comparison data:", error);
    // Return empty data structure
    return { insights: [] };
  }
};

/**
 * Fetch price history data from the API
 *
 * @param filters - Time range, category, and retailer filters
 * @param view - Detailed or compact view
 * @returns Price history data and buying recommendations
 */
export const fetchPriceHistoryData = async (
  filters: AnalyticsFilters,
  view: "detailed" | "compact" = "detailed"
): Promise<PriceHistoryResponse> => {
  try {
    const { timeRange, category, retailer } = filters;
    const response = await api.get<PriceHistoryResponse>(
      "/api/v1/analytics/price-history",
      {
        params: {
          time_range: timeRange,
          category,
          retailer,
          view,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch price history data:", error);
    // Return empty data structure instead of NextResponse
    return {
      price_history: [],
      best_time_to_buy: {
        recommendation: "Unable to load data at this time.",
        confidence: 0,
      },
    };
  }
};

/**
 * Fetch market summary data from the API
 *
 * @param filters - Time range, category, and retailer filters
 * @param maxCategories - Maximum number of categories to include in the distribution
 * @returns Market summary data
 */
export const fetchMarketSummaryData = async (
  filters: AnalyticsFilters,
  maxCategories: number = 5
): Promise<MarketSummaryResponse> => {
  try {
    const { timeRange, category, retailer } = filters;
    const response = await api.get<MarketSummaryResponse>(
      "/api/v1/analytics/market-summary",
      {
        params: {
          time_range: timeRange,
          category,
          retailer,
          max_categories: maxCategories,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.error("Failed to fetch market summary data:", error);
    // Return empty data structure instead of NextResponse
    return {
      summary: {
        total_products: 0,
        total_shops: 0,
        average_price_change: 0,
        price_drop_percentage: 0,
        best_buying_score: 0,
        category_distribution: [],
      },
    };
  }
};

/**
 * Map the API price history response to the frontend component props format
 *
 * @param response - Price history response from the API
 * @returns Formatted price history data for frontend components
 */
export const mapPriceHistoryResponse = (response: PriceHistoryResponse) => {
  return {
    priceHistory: response.price_history.map((item) => ({
      date: item.date,
      avgPrice: item.avg_price,
      lowestPrice: item.lowest_price,
      priceDrops: item.price_drops,
      isGoodTimeToBuy: item.is_good_time_to_buy,
    })),
    bestTimeToBuy: response.best_time_to_buy,
  };
};

/**
 * Map the API market summary response to the frontend component props format
 *
 * @param response - Market summary response from the API
 * @returns Formatted market summary data for frontend components
 */
export const mapMarketSummaryResponse = (response: MarketSummaryResponse) => {
  const { summary } = response;
  return {
    totalProducts: summary.total_products,
    totalShops: summary.total_shops,
    averagePriceChange: summary.average_price_change,
    priceDropPercentage: summary.price_drop_percentage,
    bestBuyingScore: summary.best_buying_score,
    categoryDistribution: summary.category_distribution,
  };
};

/**
 * Map the API category insights response to the frontend component props format
 *
 * @param response - Category insights response from the API
 * @returns Formatted category insights data for frontend components
 */
export const mapCategoryInsightsResponse = (
  response: CategoryInsightsResponse
) => {
  return response.insights.map((item) => ({
    categoryName: item.category_name,
    avgPrice: item.avg_price,
    priceChange: item.price_change,
    priceVolatility: item.price_volatility,
    productCount: item.product_count,
    dealCount: item.deal_count,
  }));
};

/**
 * Map the API shop comparison response to the frontend component props format
 *
 * @param response - Shop comparison response from the API
 * @returns Formatted shop comparison data for frontend components
 */
export const mapShopComparisonResponse = (response: ShopComparisonResponse) => {
  return response.insights.map((item) => ({
    shopName: item.shop_name,
    productCount: item.product_count,
    avgPriceRating: item.avg_price_rating,
    reliabilityScore: item.reliability_score,
    availabilityPercentage: item.availability_percentage,
    bestCategories: item.best_categories || [],
  }));
};

/**
 * Fetch price alerts (significant price changes) from the API
 *
 * @param limit - Maximum number of price alerts to fetch (default: 5)
 * @param type - Type of price changes to fetch: "drops" or "increases" (default: "drops")
 * @returns Price change data
 */
export const fetchPriceAlerts = async (
  limit: number = 5,
  type: "drops" | "increases" = "drops"
): Promise<PriceAlert[]> => {
  try {
    const response = await fetch(
      `/api/v1/home/price-changes?limit=${limit}&type=${type}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }

    const data: PriceChangeResponse = await response.json();

    // Transform the API response to match our PriceAlert type
    return data.price_changes.map((item) => ({
      id: String(item.id),
      productTitle: item.name,
      imageUrl: item.image || "/placeholder.jpg",
      originalPrice: item.previous_price,
      currentPrice: item.current_price,
      percentageChange: item.percentage_change,
      shopName: item.retailer,
      detectedDate: item.change_date,
      productUrl: `/product/${item.id}`,
      type: getAlertType(item.percentage_change),
    }));
  } catch (error) {
    console.error("Failed to fetch price alerts:", error);
    // Return empty array on error
    return [];
  }
};

/**
 * Determine the alert type based on percentage change
 *
 * @param percentageChange - The percentage price change
 * @returns The alert type
 */
function getAlertType(
  percentageChange: number
): "price_drop" | "flash_sale" | "back_in_stock" | "unusual_discount" {
  const absChange = Math.abs(percentageChange);

  if (percentageChange < 0) {
    if (absChange >= 25) {
      return "flash_sale";
    } else if (absChange >= 15) {
      return "unusual_discount";
    } else {
      return "price_drop";
    }
  } else {
    // For increases, we'll classify them as back in stock
    // In a real application, you'd have more specific logic
    return "back_in_stock";
  }
}
