// Buyer Central API Response Types based on the database schema

// Buying Guide Categories
export interface BuyingGuideCategory {
  categoryId: number;
  categoryName: string;
  description: string;
  icon: string;
  guideCount: number;
  avgProductPrice: number;
  popularBrands: string[];
}

// Individual Buying Guide
export interface BuyingGuide {
  guideId: string;
  title: string;
  categoryName: string;
  content: string;
  lastUpdated: string;
  readTime: number; // in minutes
  tags: string[];
  featuredProducts?: BuyingGuideProduct[];
}

// Product featured in buying guides
export interface BuyingGuideProduct {
  variantId: number;
  productTitle: string;
  brand: string;
  currentPrice: number;
  retailerName: string;
  imageUrl: string;
  inStock: boolean;
  priceRating: "excellent" | "good" | "fair" | "high";
}

// Market Intelligence for Buyers
export interface MarketIntelligence {
  categoryName: string;
  bestBuyingPeriod: {
    month: string;
    discountPercentage: number;
    reason: string;
  };
  avgPriceRange: {
    min: number;
    max: number;
  };
  topRetailers: {
    retailerName: string;
    competitiveScore: number;
    avgDiscount: number;
  }[];
  priceVolatility: number;
  recommendedAction: "buy_now" | "wait" | "monitor";
}

// Price Comparison Tool Data
export interface PriceComparison {
  canonicalProductId: number;
  productTitle: string;
  brand: string;
  category: string;
  variants: {
    variantId: number;
    retailerName: string;
    currentPrice: number;
    originalPrice?: number;
    discount?: number;
    inStock: boolean;
    shippingInfo?: string;
    rating?: number;
    reviewCount?: number;
  }[];
  priceHistory: {
    date: string;
    lowestPrice: number;
    highestPrice: number;
    avgPrice: number;
  }[];
}

// Price Comparison Data for UI
export interface PriceComparisonData {
  productId: number;
  productName: string;
  categoryName: string;
  averagePrice?: number;
  retailerPrices: {
    retailerId: number;
    retailerName: string;
    price: number;
    stockStatus: "in_stock" | "low_stock" | "out_of_stock";
    rating: number;
    lastUpdated?: string;
  }[];
  priceHistory?: {
    priceChange: number; // percentage
    trend: "increasing" | "decreasing" | "stable";
  };
}

// Smart Buying Alerts
export interface BuyingAlert {
  alertId: string;
  alertType: "price_drop" | "stock_alert" | "new_arrival" | "deal_alert";
  categoryName: string;
  title: string;
  description: string;
  urgency: "low" | "medium" | "high";
  validUntil?: string;
  actionRequired: boolean;
  relatedProducts?: number[]; // variant IDs
}

// Retailer Comparison
export interface RetailerComparison {
  retailerId: number;
  retailerName: string;
  averageRating: number;
  overallRating: number;
  priceCompetitiveness: number;
  competitivenessScore: number;
  customerService: number;
  customerServiceRating: number;
  shippingSpeed: number;
  returnPolicy: number;
  deliverySpeed: string;
  specialties: string[];
  strengths: string[];
  averageDiscount: number;
  totalProducts: number;
}

// Seasonal Buying Insights
export interface SeasonalInsight {
  season: "spring" | "summer" | "fall" | "winter" | "holiday";
  categoryName: string;
  bestDeals: {
    month: string;
    avgDiscount: number;
    dealFrequency: number;
  };
  avoidPeriods: {
    month: string;
    reason: string;
    priceIncrease: number;
  }[];
  stockLevels: {
    month: string;
    availability: "high" | "medium" | "low";
  }[];
}

// Smart Purchase Recommendations
export interface PurchaseRecommendation {
  variantId: number;
  productTitle: string;
  retailerName: string;
  currentPrice: number;
  recommendationScore: number;
  reasons: string[];
  timing: "buy_now" | "wait_1_week" | "wait_1_month" | "seasonal_wait";
  expectedSavings?: number;
  riskLevel: "low" | "medium" | "high";
}

// Budget Planning Tool
export interface BudgetPlan {
  categoryName: string;
  budgetRange: {
    entry: number;
    mid: number;
    premium: number;
  };
  featuresComparison: {
    feature: string;
    entryLevel: boolean;
    midRange: boolean;
    premium: boolean;
  }[];
  bestValueProducts: PurchaseRecommendation[];
}

// Buyer Central Filters
export interface BuyerCentralFilters {
  category?: string;
  priceRange?: {
    min: number;
    max: number;
  };
  retailer?: string;
  urgency?: "low" | "medium" | "high";
  contentType?: "guides" | "alerts" | "comparisons" | "insights";
}

// API Response wrapper
export interface BuyerCentralApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  timestamp: string;
  metadata?: {
    totalRecords?: number;
    hasMore?: boolean;
    lastUpdated?: string;
  };
}
