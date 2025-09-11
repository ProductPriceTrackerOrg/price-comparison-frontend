// API Response Types for New Arrivals based on the database schema

// New Arrival Product Response
export interface NewArrivalResponse {
  variant_id: number;
  shop_product_id: number;
  product_title: string;
  brand: string;
  category_name: string;
  variant_title: string;
  shop_name: string;
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

// API response format for listings
export interface NewArrivalsListResponse {
  items: NewArrivalResponse[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
}

// Filter options for the New Arrivals API
export interface NewArrivalFilters {
  timeRange: "24h" | "7d" | "30d" | "3m";
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
export interface NewArrivalsStats {
  total_new_arrivals: number;
  average_price: number;
  in_stock_count: number;
  category_count: number;
}
