// API Response Types based on the database schema

// Price Drop API Response
export interface PriceDropResponse {
  variant_id: number;
  canonical_product_id: number;
  product_title: string;
  brand: string;
  category_name: string;
  variant_title: string;
  shop_name: string;
  shop_id: number;
  current_price: number;
  previous_price: number;
  price_change: number;
  percentage_change: number;
  drop_date: string;
  image_url: string;
  product_url: string;
  is_available: boolean;
  days_since_drop: number;
  // Additional fields that might be useful
  contact_phone?: string;
  contact_whatsapp?: string;
  website_url?: string;
}

// Price History for detailed view
export interface PriceHistoryEntry {
  date_id: number;
  full_date: string;
  current_price: number;
  original_price?: number;
  is_available: boolean;
}

// Anomaly data that might be shown on price drops
export interface PriceAnomaly {
  anomaly_id: number;
  price_fact_id: number;
  anomaly_score: number;
  anomaly_type: string;
  status: "PENDING_REVIEW" | "CONFIRMED_SALE" | "DATA_ERROR";
  created_at: string;
}

// Filter options for the API
export interface PriceDropFilters {
  timeRange: "1d" | "7d" | "30d" | "90d";
  category?: string;
  retailer?: string;
  minDiscount?: number;
  maxDiscount?: number;
  sortBy:
    | "percentage_desc"
    | "percentage_asc"
    | "amount_desc"
    | "amount_asc"
    | "recent";
  page?: number;
  limit?: number;
}

// API Response wrapper
export interface ApiResponse<T> {
  data: T;
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

// User Favorite Response
export interface UserFavoriteResponse {
  favorite_id: number;
  user_id: number;
  variant_id: number;
  created_at: string;
}

// Categories and Retailers for filters
export interface Category {
  category_id: number;
  category_name: string;
  parent_category_id?: number;
}

export interface Retailer {
  shop_id: number;
  shop_name: string;
  website_url?: string;
  contact_phone?: string;
  contact_whatsapp?: string;
}

// Statistics for the price drops page
export interface PriceDropStats {
  totalDrops: number;
  avgDiscount: number;
  retailerCount: number;
  categoryCount: number;
  biggestDrop: {
    product_title: string;
    percentage_change: number;
    price_change: number;
  };
  topCategory: string;
}
