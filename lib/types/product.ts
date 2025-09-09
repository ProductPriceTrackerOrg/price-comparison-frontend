// Types for product details

export interface ProductVariant {
  variant_id: number;
  title: string;
  price: number;
  original_price?: number;
  is_available: boolean;
  discount: number;
}

export interface ProductDetails {
  id: number;
  name: string;
  brand: string;
  description: string;
  category: string;
  category_id: number;
  image: string;
  images: string[];
  retailer: string;
  retailer_phone?: string;
  retailer_whatsapp?: string;
  variants: ProductVariant[];
  is_favorited: boolean;
}

export interface ProductDetailsResponse {
  product: ProductDetails;
}

// Types for price history

export interface PriceHistoryPoint {
  date: string;
  price: number;
  change?: number;
  change_percentage?: number;
  is_minimum: boolean;
  is_maximum: boolean;
}

export interface PriceHistoryStatistics {
  current_price: number;
  min_price: number;
  max_price: number;
  price_drop_percent: number;
  total_days: number;
  price_changes: number;
}

export interface PriceHistoryResponse {
  price_history: PriceHistoryPoint[];
  statistics: PriceHistoryStatistics;
}
