// API Response Types for New Arrivals based on the database schema

// New Arrival Product Response
export interface NewArrivalResponse {
  variant_id: number;
  canonical_product_id: number;
  product_title: string;
  brand: string;
  category_name: string;
  variant_title: string;
  shop_name: string;
  shop_id: number;
  current_price: number;
  original_price?: number;
  image_url: string;
  product_url: string;
  is_available: boolean;
  arrival_date: string;
  days_since_arrival: number;
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
