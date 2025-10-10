import api from './api';
import { handleApiError } from './error-handling';

// Types for the API responses
export interface PriceHistoryPoint {
  date: string;
  avg_price: number;
  lowest_price: number;
  price_drops: number;
  is_good_time_to_buy: boolean;
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

export interface AnalyticsFilters {
  timeRange: string; // "7d" | "30d" | "90d" | "1y"
  category: string;
  retailer: string;
}

/**
 * Fetch price history data from the API
 * 
 * @param filters - Time range, category, and retailer filters
 * @param view - Detailed or compact view
 * @returns Price history data and buying recommendations
 */
export const fetchPriceHistoryData = async (
  filters: AnalyticsFilters,
  view: 'detailed' | 'compact' = 'detailed'
): Promise<PriceHistoryResponse> => {
  try {
    const { timeRange, category, retailer } = filters;
    const response = await api.get<PriceHistoryResponse>('/api/v1/analytics/price-history', {
      params: {
        time_range: timeRange,
        category,
        retailer,
        view
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch price history data:', error);
    // Return empty data structure instead of NextResponse
    return {
      price_history: [],
      best_time_to_buy: {
        recommendation: "Unable to load data at this time.",
        confidence: 0
      }
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
    const response = await api.get<MarketSummaryResponse>('/api/v1/analytics/market-summary', {
      params: {
        time_range: timeRange,
        category,
        retailer,
        max_categories: maxCategories
      }
    });
    
    return response.data;
  } catch (error) {
    console.error('Failed to fetch market summary data:', error);
    // Return empty data structure instead of NextResponse
    return {
      summary: {
        total_products: 0,
        total_shops: 0,
        average_price_change: 0,
        price_drop_percentage: 0,
        best_buying_score: 0,
        category_distribution: []
      }
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
    priceHistory: response.price_history.map(item => ({
      date: item.date,
      avgPrice: item.avg_price,
      lowestPrice: item.lowest_price,
      priceDrops: item.price_drops,
      isGoodTimeToBuy: item.is_good_time_to_buy
    })),
    bestTimeToBuy: response.best_time_to_buy
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
    categoryDistribution: summary.category_distribution
  };
};
