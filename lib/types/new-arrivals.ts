// API Response Types for New Arrivals based on the database schema

// New Arrival Product Response
export interface NewArrivalResponse {
  id?: number; // Main product ID from API response
  variant_id: number;
  shop_product_id?: number; // Correct product ID for navigation - this is what we need!
  canonical_product_id?: number; // Make optional since it might not be in API response
  product_title: string;
  brand?: string; // Make optional for safety
  category_name?: string; // Make optional for safety
  variant_title?: string;
  shop_name?: string; // Make optional for safety
  shop_id?: number; // Make optional for safety
  current_price: number;
  original_price?: number;
  image_url?: string; // Make optional for safety
  product_url?: string; // Make optional for safety
  is_available?: boolean; // Make optional for safety
  arrival_date?: string; // Make optional for safety
  days_since_arrival?: number; // Make optional for safety
  // Additional fields that might be useful
  contact_phone?: string;
  contact_whatsapp?: string;
  website_url?: string;
  sku_native?: string;
  description?: string;
}

// Filter options for the New Arrivals API
export interface NewArrivalFilters {
  timeRange: "1d" | "7d" | "30d" | "90d";
  category?: string;
  retailer?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy:
    | "newest"
    | "oldest"
    | "price_asc"
    | "price_desc"
    | "name_asc"
    | "name_desc";
  page?: number;
  limit?: number;
  inStockOnly?: boolean;
}

// Statistics for the new arrivals page
export interface NewArrivalStats {
  totalArrivals: number;
  avgPrice: number;
  retailerCount: number;
  categoryCount: number;
  newestProduct: {
    product_title: string;
    arrival_date: string;
    brand: string;
  };
  topCategory: string;
  inStockCount: number;
}
