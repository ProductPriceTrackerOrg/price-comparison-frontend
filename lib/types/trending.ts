export interface TrendingProduct {
  id: number;
  name: string;
  brand?: string;
  category: string;
  price: number;
  original_price?: number;
  retailer: string;
  retailer_id: number;
  in_stock: boolean;
  image?: string;
  trend_score?: number;
  discount?: number;
  search_volume?: string;
  price_change?: number;
  is_trending?: boolean;
  variant_id?: number;
  variant_title?: string;
}

export interface TrendingStats {
  trending_searches?: string;
  accuracy_rate?: string;
  update_frequency?: string;
  new_launches?: string;
  tracking_type?: string;
}

export interface TrendingResponse {
  products: TrendingProduct[];
  stats: TrendingStats;
}
