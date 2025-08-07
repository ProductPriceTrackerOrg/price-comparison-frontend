# Analytics & Forecasting API

## Overview

Handles advanced analytics, price forecasting, market insights, and business intelligence features.

## Database Tables Used

- `FactPriceForecast`
- `FactPriceAnomaly`
- `DimModel`
- `FactProductPrice`
- `DimCanonicalProduct`
- `DimVariant`
- `DimShop`
- `DimDate`
- `UserActivityLog`

## API Endpoints

### 1. Market Overview Analytics

```http
GET /api/analytics/market-overview
```

**Query Parameters:**

- `period` (optional): "day", "week", "month", "quarter" (default: "month")
- `category` (optional): Filter by category

**Response:**

```json
{
  "market_summary": {
    "total_products_tracked": 2500000,
    "total_retailers": 500,
    "total_price_points": 15000000,
    "avg_market_price": 425.5,
    "price_volatility_index": 0.15
  },
  "price_trends": {
    "overall_trend": "decreasing",
    "avg_price_change": -2.3,
    "categories_trending_up": 3,
    "categories_trending_down": 5,
    "stable_categories": 2
  },
  "market_activity": {
    "new_products_added": 1250,
    "price_changes_detected": 45000,
    "anomalies_flagged": 890,
    "retailers_with_updates": 456
  },
  "forecast_summary": {
    "next_period_trend": "stable",
    "predicted_price_change": -1.2,
    "confidence_level": 0.85,
    "forecast_accuracy": 89.5
  }
}
```

**Implementation:**

```sql
-- Market overview analytics
WITH MarketMetrics AS (
    SELECT
        COUNT(DISTINCT cp.canonical_product_id) as total_products,
        COUNT(DISTINCT s.shop_id) as total_retailers,
        COUNT(*) as total_price_points,
        AVG(fpp.current_price) as avg_price,
        STDEV(fpp.current_price) / AVG(fpp.current_price) as volatility_index
    FROM FactProductPrice fpp
    JOIN DimVariant v ON fpp.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN DimDate dd ON fpp.date_id = dd.date_id
    WHERE dd.full_date >= CASE
        WHEN ? = 'day' THEN DATEADD(day, -1, GETDATE())
        WHEN ? = 'week' THEN DATEADD(week, -1, GETDATE())
        WHEN ? = 'month' THEN DATEADD(month, -1, GETDATE())
        WHEN ? = 'quarter' THEN DATEADD(quarter, -1, GETDATE())
    END
),
PriceChanges AS (
    SELECT
        COUNT(*) as total_changes,
        AVG(current_price - previous_price) as avg_change
    FROM (
        SELECT
            fpp.current_price,
            LAG(fpp.current_price) OVER (PARTITION BY fpp.variant_id ORDER BY fpp.date_id) as previous_price
        FROM FactProductPrice fpp
        JOIN DimDate dd ON fpp.date_id = dd.date_id
        WHERE dd.full_date >= DATEADD(day, -30, GETDATE())
    ) price_comparison
    WHERE previous_price IS NOT NULL AND current_price != previous_price
),
AnomalyCount AS (
    SELECT COUNT(*) as anomaly_count
    FROM FactPriceAnomaly
    WHERE created_at >= DATEADD(day, -30, GETDATE())
)
SELECT
    mm.total_products,
    mm.total_retailers,
    mm.total_price_points,
    mm.avg_price,
    mm.volatility_index,
    pc.total_changes,
    pc.avg_change,
    ac.anomaly_count
FROM MarketMetrics mm
CROSS JOIN PriceChanges pc
CROSS JOIN AnomalyCount ac;
```

### 2. Price Forecast Analytics

```http
GET /api/analytics/price-forecasts
```

**Query Parameters:**

- `product_id` (optional): Specific product
- `category` (optional): Category filter
- `days` (optional): Forecast horizon (default: 7, max: 30)
- `confidence_level` (optional): Minimum confidence (default: 0.7)

**Response:**

```json
{
  "forecasts": [
    {
      "product_id": 1,
      "product_name": "iPhone 15 Pro Max",
      "current_price": 1299.99,
      "forecasts": [
        {
          "date": "2025-08-07",
          "predicted_price": 1289.99,
          "confidence_lower": 1269.99,
          "confidence_upper": 1309.99,
          "confidence_level": 0.85,
          "price_change": -10.0,
          "trend": "decreasing"
        }
      ],
      "forecast_summary": {
        "avg_predicted_change": -1.2,
        "volatility_forecast": "low",
        "recommendation": "wait",
        "optimal_buy_date": "2025-08-10"
      }
    }
  ],
  "model_performance": {
    "model_name": "Price Forecasting Model v2.1",
    "overall_accuracy": 89.5,
    "mae": 12.5,
    "rmse": 18.75,
    "last_trained": "2025-08-01T00:00:00Z"
  },
  "market_insights": [
    "Prices expected to decrease by 1.2% over next week",
    "Technology category showing highest volatility",
    "Best buying opportunities in next 3-5 days"
  ]
}
```

**Implementation:**

```sql
-- Price forecasts with analytics
SELECT
    cp.canonical_product_id as product_id,
    cp.product_title as product_name,
    current_prices.current_price,
    fpf.forecast_date as date,
    fpf.predicted_price,
    fpf.confidence_lower,
    fpf.confidence_upper,
    fpf.predicted_price - current_prices.current_price as price_change,
    dm.model_name,
    JSON_VALUE(dm.performance_metrics_json, '$.accuracy') as model_accuracy,
    JSON_VALUE(dm.performance_metrics_json, '$.mae') as mae,
    JSON_VALUE(dm.performance_metrics_json, '$.rmse') as rmse
FROM FactPriceForecast fpf
JOIN DimVariant v ON fpf.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
JOIN DimModel dm ON fpf.model_id = dm.model_id
JOIN (
    SELECT
        v2.canonical_product_id,
        AVG(fpp2.current_price) as current_price
    FROM DimVariant v2
    JOIN FactProductPrice fpp2 ON v2.variant_id = fpp2.variant_id
    WHERE fpp2.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    GROUP BY v2.canonical_product_id
) current_prices ON cp.canonical_product_id = current_prices.canonical_product_id
WHERE fpf.forecast_date BETWEEN GETDATE() AND DATEADD(day, ?, GETDATE())
    AND (? IS NULL OR cp.canonical_product_id = ?)
    AND (fpf.confidence_upper - fpf.confidence_lower) / fpf.predicted_price <= (1 - ?)
ORDER BY fpf.forecast_date ASC;
```

### 3. Anomaly Detection Analytics

```http
GET /api/analytics/anomalies
```

**Query Parameters:**

- `days` (optional): Analysis period (default: 30)
- `min_score` (optional): Minimum anomaly score (default: 0.8)
- `anomaly_type` (optional): "price_drop", "price_spike", "volatility"
- `status` (optional): "PENDING_REVIEW", "CONFIRMED", "FALSE_POSITIVE"

**Response:**

```json
{
  "anomalies": [
    {
      "anomaly_id": 1,
      "product_id": 1,
      "product_name": "MacBook Pro 16-inch",
      "retailer": "DiscountTech",
      "detection_date": "2025-08-05T10:30:00Z",
      "anomaly_type": "price_drop",
      "anomaly_score": 0.95,
      "price_info": {
        "current_price": 1899.99,
        "expected_price": 2399.99,
        "price_deviation": -499.0,
        "deviation_percentage": -20.8
      },
      "confidence": "high",
      "status": "CONFIRMED_SALE",
      "impact_assessment": "Significant market disruption",
      "recommended_action": "Monitor competitor response"
    }
  ],
  "anomaly_summary": {
    "total_anomalies": 156,
    "high_confidence": 45,
    "medium_confidence": 78,
    "low_confidence": 33,
    "confirmed_deals": 89,
    "false_positives": 12
  },
  "anomaly_trends": {
    "anomalies_per_day": 5.2,
    "trending_types": [
      { "type": "price_drop", "count": 89 },
      { "type": "price_spike", "count": 34 }
    ],
    "most_affected_category": "Electronics"
  }
}
```

**Implementation:**

```sql
-- Anomaly detection analytics
WITH AnomalyMetrics AS (
    SELECT
        fpa.anomaly_id,
        cp.canonical_product_id as product_id,
        cp.product_title as product_name,
        s.shop_name as retailer,
        fpa.created_at as detection_date,
        fpa.anomaly_type,
        fpa.anomaly_score,
        fpa.status,
        fpp.current_price,
        -- Calculate expected price based on recent average
        AVG(fpp_recent.current_price) OVER (
            PARTITION BY fpp.variant_id
            ORDER BY fpp_recent.date_id
            ROWS BETWEEN 30 PRECEDING AND 1 PRECEDING
        ) as expected_price
    FROM FactPriceAnomaly fpa
    JOIN FactProductPrice fpp ON fpa.price_fact_id = fpp.price_fact_id
    JOIN DimVariant v ON fpp.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    LEFT JOIN FactProductPrice fpp_recent ON v.variant_id = fpp_recent.variant_id
    WHERE fpa.created_at >= DATEADD(day, -?, GETDATE())
        AND fpa.anomaly_score >= ?
        AND (? IS NULL OR fpa.anomaly_type = ?)
        AND (? IS NULL OR fpa.status = ?)
)
SELECT
    anomaly_id,
    product_id,
    product_name,
    retailer,
    detection_date,
    anomaly_type,
    anomaly_score,
    status,
    current_price,
    expected_price,
    current_price - expected_price as price_deviation,
    ROUND(((current_price - expected_price) / expected_price) * 100, 2) as deviation_percentage,
    CASE
        WHEN anomaly_score >= 0.9 THEN 'high'
        WHEN anomaly_score >= 0.7 THEN 'medium'
        ELSE 'low'
    END as confidence
FROM AnomalyMetrics
ORDER BY anomaly_score DESC, detection_date DESC;
```

### 4. Competitor Analysis

```http
GET /api/analytics/competitors
```

**Query Parameters:**

- `product_id` (required): Product to analyze
- `analysis_period` (optional): Days to analyze (default: 30)

**Response:**

```json
{
  "product_analysis": {
    "product_id": 1,
    "product_name": "iPhone 15 Pro Max",
    "market_position": "premium",
    "total_retailers": 12
  },
  "retailer_comparison": [
    {
      "retailer_id": 1,
      "retailer_name": "TechMart",
      "current_price": 1299.99,
      "avg_price_30d": 1324.5,
      "price_rank": 1,
      "stock_availability": 95.5,
      "price_stability": "high",
      "competitive_advantage": "lowest_price"
    }
  ],
  "price_analytics": {
    "price_spread": 149.99,
    "market_price_leader": "TechMart",
    "most_expensive": "PremiumStore",
    "avg_market_price": 1324.99,
    "price_volatility": "low"
  },
  "market_insights": [
    "TechMart consistently offers lowest prices",
    "Price gap between retailers increasing",
    "Premium retailers maintaining 10% markup"
  ]
}
```

### 5. Trending Analysis

```http
GET /api/analytics/trending
```

**Query Parameters:**

- `period` (optional): "hour", "day", "week", "month" (default: "day")
- `metric` (optional): "search_volume", "price_changes", "new_products"

**Response:**

```json
{
  "trending_metrics": {
    "period": "day",
    "timestamp": "2025-08-06T00:00:00Z",
    "search_trends": [
      {
        "query": "iPhone 15",
        "search_count": 15420,
        "trend_change": "+25%",
        "trend_direction": "up"
      }
    ],
    "product_trends": [
      {
        "product_id": 1,
        "product_name": "Samsung Galaxy S24",
        "view_count": 8920,
        "view_change": "+156%",
        "category": "Smartphones"
      }
    ],
    "category_trends": [
      {
        "category": "Smartphones",
        "trend_score": 95,
        "price_movement": -2.5,
        "activity_level": "high"
      }
    ]
  },
  "predictions": {
    "next_trending": [
      {
        "product_name": "Nothing Phone 2a",
        "predicted_trend_score": 88,
        "confidence": 0.82
      }
    ],
    "declining_trends": [
      {
        "product_name": "iPhone 14",
        "trend_decline": -15,
        "reason": "new_model_available"
      }
    ]
  }
}
```

### 6. Price Distribution Analysis

```http
GET /api/analytics/price-distribution
```

**Query Parameters:**

- `category` (optional): Category filter
- `brand` (optional): Brand filter
- `bins` (optional): Number of price bins (default: 10)

**Response:**

```json
{
  "distribution_analysis": {
    "total_products": 45000,
    "price_range": {
      "min": 99.99,
      "max": 1599.99,
      "median": 649.99,
      "mean": 672.45,
      "std_deviation": 285.5
    },
    "price_bins": [
      {
        "range": "0-200",
        "count": 8500,
        "percentage": 18.9,
        "avg_price": 149.99
      },
      {
        "range": "200-400",
        "count": 12000,
        "percentage": 26.7,
        "avg_price": 299.5
      }
    ],
    "outliers": [
      {
        "product_id": 123,
        "product_name": "Premium Gaming Phone",
        "price": 2999.99,
        "deviation_score": 3.2
      }
    ]
  },
  "market_segments": [
    {
      "segment": "Budget (0-300)",
      "percentage": 35.2,
      "top_brands": ["Xiaomi", "Realme"]
    },
    {
      "segment": "Mid-range (300-800)",
      "percentage": 45.8,
      "top_brands": ["Samsung", "OnePlus"]
    },
    {
      "segment": "Premium (800+)",
      "percentage": 19.0,
      "top_brands": ["Apple", "Samsung"]
    }
  ]
}
```

### 7. Model Performance Analytics

```http
GET /api/analytics/models
```

**Response:**

```json
{
  "models": [
    {
      "model_id": 1,
      "model_name": "Price Forecasting Model",
      "model_version": "v2.1",
      "model_type": "forecasting",
      "performance_metrics": {
        "accuracy": 89.5,
        "mae": 12.5,
        "rmse": 18.75,
        "mape": 2.8,
        "r2_score": 0.91
      },
      "training_info": {
        "training_date": "2025-08-01T00:00:00Z",
        "training_samples": 1000000,
        "validation_samples": 200000,
        "features_used": 25
      },
      "recent_predictions": {
        "total_predictions": 45000,
        "successful_predictions": 40275,
        "success_rate": 89.5
      }
    }
  ],
  "model_comparison": {
    "best_forecasting_model": "Price Forecasting Model v2.1",
    "best_anomaly_model": "Anomaly Detection Model v1.8",
    "overall_system_accuracy": 88.2
  }
}
```

### 8. Custom Analytics Query

```http
POST /api/analytics/custom
```

**Request Body:**

```json
{
  "analysis_type": "price_correlation",
  "parameters": {
    "category": "smartphones",
    "time_period": 90,
    "metrics": ["price", "search_volume", "reviews"],
    "grouping": "brand"
  },
  "filters": {
    "min_price": 200,
    "max_price": 1500,
    "brands": ["Samsung", "Apple", "Google"]
  }
}
```

**Response:**

```json
{
  "analysis_results": {
    "correlation_matrix": [
      {
        "metric1": "price",
        "metric2": "search_volume",
        "correlation": -0.65,
        "significance": "high"
      }
    ],
    "insights": [
      "Higher prices correlate with lower search volume",
      "Samsung shows strongest price-performance correlation",
      "Apple maintains premium positioning regardless of features"
    ],
    "recommendations": [
      "Consider price adjustments for Samsung mid-range models",
      "Monitor Apple pricing strategies for market response"
    ]
  }
}
```

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX IX_PriceForecast_Date_Confidence ON FactPriceForecast(forecast_date, confidence_lower, confidence_upper);
CREATE INDEX IX_Anomaly_Score_Type_Date ON FactPriceAnomaly(anomaly_score, anomaly_type, created_at);
CREATE INDEX IX_Model_Performance ON DimModel(model_type, training_date);
CREATE INDEX IX_ProductPrice_Variant_Date ON FactProductPrice(variant_id, date_id);
```

### Caching Strategy

- `analytics:market-overview:{period}` - TTL: 30 minutes
- `analytics:forecasts:{product_id}` - TTL: 6 hours
- `analytics:anomalies:{days}` - TTL: 15 minutes
- `analytics:trending:{period}` - TTL: 5 minutes
- `analytics:models` - TTL: 24 hours

## Error Handling

### Insufficient Data

```json
{
  "detail": "Insufficient data for analysis",
  "error_code": "ANALYTICS_001",
  "minimum_required": 30,
  "available": 15
}
```

### Model Unavailable

```json
{
  "detail": "Forecasting model temporarily unavailable",
  "error_code": "ANALYTICS_002",
  "retry_after": 300
}
```

## Frontend Integration

The analytics pages expect:

- Interactive charts and visualizations
- Real-time data updates
- Drill-down capabilities
- Export functionality
- Filter and comparison tools
- Performance dashboards
