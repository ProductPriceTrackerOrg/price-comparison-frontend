// Analytics API Response Types based on the database schema

// Market Overview Statistics
export interface MarketOverview {
  totalProducts: number;
  totalCategories: number;
  totalRetailers: number;
  averagePriceChange: number;
  totalPriceDrops: number;
  totalPriceIncreases: number;
  marketVolatility: number;
  lastUpdated: string;
}

// Price Trend Data for time series analysis
export interface PriceTrendData {
  date: string;
  avgPriceChange: number;
  totalChanges: number;
  volatility: number;
}

// Category Performance Metrics
export interface CategoryPerformance {
  categoryName: string;
  totalProducts: number;
  avgPriceChange: number;
  priceDrops: number;
  priceIncreases: number;
}

// Retailer Market Insights
export interface RetailerInsights {
  retailerName: string;
  totalProducts: number;
  avgPriceChange: number;
  competitiveRating: number;
  marketShare: number;
}

// Market Anomalies Summary
export interface MarketAnomalies {
  totalAnomalies: number;
  significantDrops: number;
  significantIncreases: number;
  highVolatilityProducts: number;
  averageAnomalyScore: number;
  topAnomalyCategory: string;
}

// Analytics Filters
export interface AnalyticsFilters {
  timeRange: "7d" | "30d" | "90d" | "1y";
  category: string;
  retailer: string;
  metric: "price_changes" | "volatility" | "anomalies" | "market_share";
}

// Price Movement Analysis
export interface PriceMovement {
  productId: number;
  productName: string;
  categoryName: string;
  retailerName: string;
  currentPrice: number;
  previousPrice: number;
  changeAmount: number;
  changePercentage: number;
  movementType: "drop" | "increase" | "stable";
  significanceScore: number;
}

// Top Performing Categories
export interface TopCategory {
  categoryId: number;
  categoryName: string;
  totalProducts: number;
  avgDiscount: number;
  totalSavings: number;
  popularityScore: number;
}

// Retailer Comparison Data
export interface RetailerComparison {
  retailerId: number;
  retailerName: string;
  averagePrice: number;
  discountFrequency: number;
  stockAvailability: number;
  priceCompetitiveness: number;
  userRating: number;
}

// Market Trend Prediction
export interface MarketTrendPrediction {
  nextWeekPrediction: "bullish" | "bearish" | "stable";
  confidenceScore: number;
  keyFactors: string[];
  expectedVolatility: number;
  recommendedActions: string[];
}

// Seasonal Analysis
export interface SeasonalAnalysis {
  season: "spring" | "summer" | "fall" | "winter";
  categoryTrends: {
    categoryName: string;
    seasonalImpact: number;
    peakMonth: string;
    averageDiscount: number;
  }[];
  bestBuyingPeriods: {
    categoryName: string;
    optimalMonth: string;
    expectedSavings: number;
  }[];
}

// API Response wrapper
export interface AnalyticsApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  metadata?: {
    totalRecords?: number;
    page?: number;
    limit?: number;
    hasMore?: boolean;
  };
}
