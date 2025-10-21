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
  product_url?: string;
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

// Types for price forecasting

export interface PriceForecastPoint {
  date: string;
  predicted_price: number;
  upper_bound?: number | null;
  lower_bound?: number | null;
  confidence?: number | null;
}

export interface PriceForecastModelInfo {
  model_name: string;
  model_version: string;
  last_trained: string;
  variant_id: number;
}

export interface PriceForecastResponse {
  forecasts: PriceForecastPoint[];
  model_info?: PriceForecastModelInfo | null;
}

// Types for anomaly detection

export interface ProductAnomaly {
  anomaly_id: number;
  date: string;
  price: number | null;
  previous_price: number | null;
  change_percentage: number | null;
  anomaly_score: number | null;
  anomaly_type: string;
  model_name?: string | null;
  model_version?: string | null;
  last_trained?: string | null;
}

export interface ProductAnomalyResponse {
  anomalies: ProductAnomaly[];
}
