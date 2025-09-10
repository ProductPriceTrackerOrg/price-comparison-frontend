// Types for deals API responses

export interface Deal {
  variant_id: number;
  shop_product_id: number;
  product_id: number;
  product_title: string;
  brand: string;
  category_name: string;
  variant_title: string;
  shop_name: string;
  current_price: number;
  original_price: number;
  image_url: string;
  product_url: string;
  is_available: boolean;
  updated_date: string;
  discount_percentage: number;
  discount_amount: number;
  deal_score: number;
}

export interface DealsStats {
  total_deals: number;
  average_discount: number;
  highest_discount: number;
  total_savings: number;
  categories_with_deals: number;
  retailers_with_deals: number;
}

export interface DealsListResponse {
  items: Deal[];
  total: number;
  page: number;
  limit: number;
  has_next: boolean;
  stats: DealsStats;
}

export interface CategoryDealsStats {
  category_name: string;
  deal_count: number;
  average_discount: number;
  highest_discount: number;
}

export interface RetailerDealsStats {
  shop_name: string;
  deal_count: number;
  average_discount: number;
  highest_discount: number;
}

export interface DealsAnalyticsResponse {
  overall_stats: DealsStats;
  category_breakdown: CategoryDealsStats[];
  retailer_breakdown: RetailerDealsStats[];
  trending_categories: string[];
  top_retailers: string[];
}

export interface DealsQuery {
  category?: string;
  retailer?: string;
  brand?: string;
  min_discount?: number;
  max_discount?: number;
  min_price?: number;
  max_price?: number;
  sort_by?: string;
  in_stock_only?: boolean;
  limit?: number;
  page?: number;
}
