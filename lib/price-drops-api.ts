import {
  PriceDropResponse,
  PriceDropStats,
  Category,
  Retailer,
} from "./types/price-drops";

// Import filters type but rename to prevent conflict
import { PriceDropFilters as FrontendFilters } from "./types/price-drops";

// API response types from backend
export interface PriceDropItem {
  id: number;
  name: string;
  brand: string | null;
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

export interface PriceDropsResponse {
  price_drops: PriceDropItem[];
  total_count: number;
  next_page: number | null;
}

export interface BackendPriceDropStats {
  total_drops: number;
  average_discount_percentage: number;
  retailers_with_drops: number;
  categories_with_drops: number;
  largest_drop_percentage: number;
  total_savings: number;
  drops_last_24h: number;
  drops_last_7d: number;
}

export interface PriceDropStatsResponse {
  stats: BackendPriceDropStats;
}

// Filter types
export type TimeRange = "24h" | "7d" | "30d" | "90d";
export type SortBy =
  | "discount_percentage"
  | "discount_amount"
  | "most_recent"
  | "price";

// Backend API parameter types
type BackendTimeRange = "24h" | "7d" | "30d" | "90d";
type BackendSortBy =
  | "discount_percentage"
  | "discount_amount"
  | "most_recent"
  | "price";

// Mapping between frontend and backend sort options
const sortByMapping: Record<string, BackendSortBy> = {
  percentage_desc: "discount_percentage",
  percentage_asc: "discount_percentage", // We'll handle this in the component by reversing
  amount_desc: "discount_amount",
  amount_asc: "discount_amount", // We'll handle this in the component by reversing
  recent: "most_recent",
};

/**
 * Fetches price drops data from the backend API
 */
export async function fetchPriceDrops(
  filters: FrontendFilters
): Promise<PriceDropsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const params = new URLSearchParams({
    time_range: filters.timeRange,
    min_discount: filters.minDiscount?.toString() || "0",
    sort_by: sortByMapping[filters.sortBy] || "discount_percentage",
    page: (filters.page || 1).toString(),
    limit: (filters.limit || 20).toString(),
  });

  if (filters.category && filters.category !== "all") {
    params.append("category", filters.category);
  }

  if (filters.retailer && filters.retailer !== "all") {
    params.append("retailer", filters.retailer);
  }

  try {
    const response = await fetch(`${apiUrl}/api/v1/price-drops?${params}`);

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PriceDropsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching price drops:", error);
    throw error;
  }
}

/**
 * Fetches price drops statistics from the backend API
 */
export async function fetchPriceDropStats(
  timeRange: string,
  category?: string,
  retailer?: string
): Promise<PriceDropStatsResponse> {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";

  const params = new URLSearchParams({
    time_range: timeRange,
  });

  if (category && category !== "all") {
    params.append("category", category);
  }

  if (retailer && retailer !== "all") {
    params.append("retailer", retailer);
  }

  try {
    const response = await fetch(
      `${apiUrl}/api/v1/price-drops/stats?${params}`
    );

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    const data: PriceDropStatsResponse = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching price drop stats:", error);
    throw error;
  }
}

/**
 * Maps backend PriceDropItem to frontend PriceDropResponse format
 */
export function mapToPriceDropResponse(item: PriceDropItem): PriceDropResponse {
  // Calculate days since drop
  const dropDate = new Date(item.change_date);
  const today = new Date();
  const timeDiff = today.getTime() - dropDate.getTime();
  const daysSinceDrop = Math.floor(timeDiff / (1000 * 3600 * 24));

  return {
    variant_id: item.id,
    canonical_product_id: item.id, // Using the same ID as both might be the same
    product_title: item.name,
    brand: item.brand || "",
    category_name: item.category,
    variant_title: item.name, // Using the same name for variant title
    shop_name: item.retailer,
    shop_id: item.retailer_id,
    current_price: item.current_price,
    previous_price: item.previous_price,
    price_change: item.price_change,
    percentage_change: item.percentage_change,
    drop_date: item.change_date,
    image_url: item.image || "/placeholder.svg",
    product_url: "", // This data isn't provided by the backend
    is_available: item.in_stock,
    days_since_drop: daysSinceDrop,
  };
}

/**
 * Maps backend stats to frontend PriceDropStats format
 */
export function mapToFrontendStats(
  backendStats: BackendPriceDropStats
): PriceDropStats {
  return {
    totalDrops: backendStats.total_drops,
    avgDiscount: backendStats.average_discount_percentage,
    retailerCount: backendStats.retailers_with_drops,
    categoryCount: backendStats.categories_with_drops,
    // Since we don't have the complete biggest drop product information,
    // we'll create a partial object with the data we have
    biggestDrop: {
      product_title: "Top Price Drop", // This would be filled with real data in production
      percentage_change: backendStats.largest_drop_percentage,
      price_change: 0, // Would be filled with real data
    },
    topCategory: "", // Would be filled with real data from backend
  };
}
