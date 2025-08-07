# Product Details & Analytics API

## Overview

Handles individual product pages, price history, forecasting, recommendations, comparisons, and anomaly detection.

## Database Tables Used

- `DimCanonicalProduct`
- `DimVariant`
- `DimShop`
- `DimCategory`
- `FactProductPrice`
- `FactPriceForecast`
- `FactPriceAnomaly`
- `FactProductRecommendation`
- `UserFavorites`
- `UserActivityLog`

## API Endpoints

### 1. Product Details

```http
GET /api/products/{product_id}
```

**Path Parameters:**

- `product_id`: Canonical product ID

**Query Parameters:**

- `retailer_id` (optional): Specific retailer variant

**Response:**

```json
{
  "product": {
    "id": 1,
    "name": "Samsung Galaxy S24 Ultra",
    "brand": "Samsung",
    "category": "Smartphones",
    "description": "Latest flagship smartphone with advanced camera system...",
    "master_image": "https://example.com/master-image.jpg",
    "specifications": {
      "screen_size": "6.8 inches",
      "storage": "256GB",
      "ram": "12GB",
      "camera": "200MP"
    }
  },
  "variants": [
    {
      "variant_id": 1,
      "retailer": {
        "shop_id": 1,
        "name": "TechMart",
        "website_url": "https://techmart.com",
        "contact_phone": "+1-555-0123",
        "contact_whatsapp": "+1-555-0123"
      },
      "price": 1199.99,
      "original_price": 1299.99,
      "discount": 8,
      "in_stock": true,
      "sku": "SM-S928U-TM",
      "product_url": "https://techmart.com/galaxy-s24",
      "image": "https://techmart.com/images/galaxy-s24.jpg",
      "variant_title": "Samsung Galaxy S24 Ultra 256GB Titanium Black"
    }
  ],
  "price_analytics": {
    "current_min_price": 1199.99,
    "current_max_price": 1349.99,
    "price_trend": "decreasing",
    "avg_price_30d": 1249.99,
    "lowest_price_ever": 1149.99,
    "highest_price_ever": 1399.99,
    "price_volatility": "low"
  },
  "is_favorited": false
}
```

**Implementation:**

```sql
-- Get product with all variants
SELECT
    cp.canonical_product_id as id,
    cp.product_title as name,
    cp.brand,
    cat.category_name as category,
    cp.description,
    cp.master_image_url as master_image,
    v.variant_id,
    v.variant_title,
    v.sku_native as sku,
    v.product_url,
    v.image_url as image,
    s.shop_id,
    s.shop_name as retailer_name,
    s.website_url as retailer_website,
    s.contact_phone,
    s.contact_whatsapp,
    fpp.current_price as price,
    fpp.original_price,
    fpp.is_available as in_stock,
    CASE
        WHEN fpp.original_price > 0
        THEN ROUND(((fpp.original_price - fpp.current_price) / fpp.original_price) * 100, 0)
        ELSE 0
    END as discount
FROM DimCanonicalProduct cp
JOIN DimCategory cat ON cp.category_id = cat.category_id
LEFT JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
LEFT JOIN DimShop s ON v.shop_id = s.shop_id
LEFT JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    AND fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
WHERE cp.canonical_product_id = ?
ORDER BY fpp.current_price ASC;
```

### 2. Price History

```http
GET /api/products/{product_id}/price-history
```

**Query Parameters:**

- `retailer_id` (optional): Filter by specific retailer
- `days` (optional): Number of days (default: 90, max: 365)

**Response:**

```json
{
  "price_history": [
    {
      "date": "2025-08-06",
      "price": 1199.99,
      "original_price": 1299.99,
      "retailer": "TechMart",
      "retailer_id": 1,
      "change_from_previous": -50.0,
      "change_percentage": -4.0
    }
  ],
  "price_changes": [
    {
      "date": "2025-08-06",
      "old_price": 1249.99,
      "new_price": 1199.99,
      "change": -50.0,
      "percentage": -4.0,
      "retailer": "TechMart"
    }
  ],
  "statistics": {
    "avg_price": 1249.99,
    "min_price": 1149.99,
    "max_price": 1399.99,
    "price_volatility": 0.15,
    "total_changes": 12
  }
}
```

**Implementation:**

```sql
-- Price history with changes
WITH PriceHistory AS (
    SELECT
        dd.full_date as date,
        fpp.current_price as price,
        fpp.original_price,
        s.shop_name as retailer,
        s.shop_id as retailer_id,
        LAG(fpp.current_price) OVER (PARTITION BY v.variant_id ORDER BY dd.full_date) as previous_price
    FROM DimCanonicalProduct cp
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    JOIN DimDate dd ON fpp.date_id = dd.date_id
    WHERE cp.canonical_product_id = ?
        AND dd.full_date >= DATEADD(day, -?, GETDATE())
        AND (? IS NULL OR s.shop_id = ?)
    ORDER BY dd.full_date DESC
)
SELECT
    date,
    price,
    original_price,
    retailer,
    retailer_id,
    COALESCE(price - previous_price, 0) as change_from_previous,
    CASE
        WHEN previous_price > 0
        THEN ROUND(((price - previous_price) / previous_price) * 100, 2)
        ELSE 0
    END as change_percentage
FROM PriceHistory;
```

### 3. Price Forecast

```http
GET /api/products/{product_id}/forecast
```

**Query Parameters:**

- `days` (optional): Forecast period (default: 7, max: 30)
- `retailer_id` (optional): Specific retailer

**Response:**

```json
{
  "forecasts": [
    {
      "date": "2025-08-07",
      "predicted_price": 1189.99,
      "confidence_lower": 1169.99,
      "confidence_upper": 1209.99,
      "confidence_level": 0.85,
      "retailer": "TechMart",
      "retailer_id": 1
    }
  ],
  "model_info": {
    "model_name": "Price Forecasting Model",
    "model_version": "v2.1",
    "accuracy": 0.89,
    "last_trained": "2025-08-01T00:00:00Z"
  },
  "insights": [
    "Price expected to decrease by 1.2% over next 7 days",
    "Historical pattern suggests price stability",
    "Best time to buy: within next 3 days"
  ]
}
```

**Implementation:**

```sql
-- Get price forecasts
SELECT
    fpf.forecast_date as date,
    fpf.predicted_price,
    fpf.confidence_lower,
    fpf.confidence_upper,
    s.shop_name as retailer,
    s.shop_id as retailer_id,
    dm.model_name,
    dm.model_version,
    JSON_VALUE(dm.performance_metrics_json, '$.accuracy') as accuracy,
    dm.training_date as last_trained
FROM FactPriceForecast fpf
JOIN DimVariant v ON fpf.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN DimModel dm ON fpf.model_id = dm.model_id
WHERE cp.canonical_product_id = ?
    AND fpf.forecast_date > GETDATE()
    AND fpf.forecast_date <= DATEADD(day, ?, GETDATE())
    AND (? IS NULL OR s.shop_id = ?)
ORDER BY fpf.forecast_date ASC;
```

### 4. Price Anomalies

```http
GET /api/products/{product_id}/anomalies
```

**Query Parameters:**

- `days` (optional): Period to check (default: 30)
- `min_score` (optional): Minimum anomaly score (default: 0.7)

**Response:**

```json
{
  "anomalies": [
    {
      "anomaly_id": 1,
      "date": "2025-08-05",
      "price": 999.99,
      "expected_price": 1199.99,
      "anomaly_score": 0.95,
      "anomaly_type": "price_drop",
      "retailer": "QuickSell",
      "retailer_id": 5,
      "status": "CONFIRMED_SALE",
      "description": "Significant price drop detected - likely flash sale",
      "confidence": "high"
    }
  ],
  "summary": {
    "total_anomalies": 3,
    "high_confidence": 1,
    "medium_confidence": 2,
    "avg_anomaly_score": 0.78
  }
}
```

**Implementation:**

```sql
-- Get price anomalies
SELECT
    fpa.anomaly_id,
    dd.full_date as date,
    fpp.current_price as price,
    fpa.anomaly_score,
    fpa.anomaly_type,
    fpa.status,
    s.shop_name as retailer,
    s.shop_id as retailer_id,
    dm.model_name
FROM FactPriceAnomaly fpa
JOIN FactProductPrice fpp ON fpa.price_fact_id = fpp.price_fact_id
JOIN DimDate dd ON fpp.date_id = dd.date_id
JOIN DimVariant v ON fpp.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN DimModel dm ON fpa.model_id = dm.model_id
WHERE cp.canonical_product_id = ?
    AND dd.full_date >= DATEADD(day, -?, GETDATE())
    AND fpa.anomaly_score >= ?
ORDER BY fpa.anomaly_score DESC, dd.full_date DESC;
```

### 5. Similar Products

```http
GET /api/products/{product_id}/similar
```

**Query Parameters:**

- `limit` (optional): Number of products (default: 6)

**Response:**

```json
{
  "similar_products": [
    {
      "id": 2,
      "name": "Samsung Galaxy S24+",
      "brand": "Samsung",
      "category": "Smartphones",
      "price": 999.99,
      "original_price": 1099.99,
      "discount": 9,
      "retailer": "TechMart",
      "image": "https://example.com/image.jpg",
      "similarity_score": 0.92,
      "similarity_reason": "Same brand and category"
    }
  ]
}
```

**Implementation:**

```sql
-- Find similar products by category and brand
SELECT TOP (?)
    cp2.canonical_product_id as id,
    cp2.product_title as name,
    cp2.brand,
    cat.category_name as category,
    MIN(fpp.current_price) as price,
    MIN(fpp.original_price) as original_price,
    s.shop_name as retailer,
    v.image_url as image,
    -- Similarity scoring
    (
        CASE WHEN cp2.brand = cp1.brand THEN 50 ELSE 0 END +
        CASE WHEN cp2.category_id = cp1.category_id THEN 40 ELSE 0 END +
        CASE WHEN ABS(fpp.current_price - base_price.price) / base_price.price < 0.2 THEN 10 ELSE 0 END
    ) as similarity_score
FROM DimCanonicalProduct cp1
CROSS JOIN DimCanonicalProduct cp2
JOIN DimCategory cat ON cp2.category_id = cat.category_id
JOIN DimVariant v ON cp2.canonical_product_id = v.canonical_product_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
JOIN (
    SELECT AVG(fpp2.current_price) as price
    FROM DimVariant v2
    JOIN FactProductPrice fpp2 ON v2.variant_id = fpp2.variant_id
    WHERE v2.canonical_product_id = ?
        AND fpp2.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
) base_price ON 1=1
WHERE cp1.canonical_product_id = ?
    AND cp2.canonical_product_id != ?
    AND fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND fpp.is_available = 1
GROUP BY cp2.canonical_product_id, cp2.product_title, cp2.brand, cat.category_name, s.shop_name, v.image_url, cp1.brand, cp1.category_id
HAVING similarity_score > 30
ORDER BY similarity_score DESC;
```

### 6. Product Recommendations

```http
GET /api/products/{product_id}/recommendations
```

**Headers (Optional):**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "recommendations": [
    {
      "id": 3,
      "name": "Samsung Galaxy Buds Pro",
      "brand": "Samsung",
      "category": "Audio",
      "price": 199.99,
      "original_price": 229.99,
      "discount": 13,
      "retailer": "AudioWorld",
      "image": "https://example.com/image.jpg",
      "recommendation_score": 0.88,
      "recommendation_reason": "Frequently bought together"
    }
  ],
  "recommendation_type": "cross_sell"
}
```

### 7. Product Comparison

```http
GET /api/products/compare
```

**Query Parameters:**

- `product_ids` (required): Comma-separated product IDs
- `retailer_id` (optional): Compare prices from specific retailer

**Response:**

```json
{
  "comparison": [
    {
      "product": {
        "id": 1,
        "name": "Samsung Galaxy S24 Ultra",
        "brand": "Samsung",
        "image": "https://example.com/image.jpg"
      },
      "pricing": {
        "min_price": 1199.99,
        "max_price": 1349.99,
        "avg_price": 1274.99,
        "best_retailer": "TechMart"
      },
      "specifications": {
        "screen_size": "6.8 inches",
        "storage": "256GB",
        "ram": "12GB"
      }
    }
  ],
  "comparison_matrix": {
    "winner_categories": {
      "best_price": 1,
      "best_features": 2,
      "best_value": 1
    }
  }
}
```

### 8. Add/Remove Favorite

```http
POST /api/products/{product_id}/favorite
DELETE /api/products/{product_id}/favorite
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "is_favorited": true,
  "message": "Product added to favorites"
}
```

**Implementation:**

```sql
-- Add to favorites
INSERT INTO UserFavorites (user_id, variant_id)
SELECT ?, v.variant_id
FROM DimVariant v
WHERE v.canonical_product_id = ?
    AND NOT EXISTS (
        SELECT 1 FROM UserFavorites uf
        WHERE uf.user_id = ? AND uf.variant_id = v.variant_id
    );

-- Remove from favorites
DELETE FROM UserFavorites
WHERE user_id = ?
    AND variant_id IN (
        SELECT variant_id FROM DimVariant WHERE canonical_product_id = ?
    );
```

### 9. Log Product View

```http
POST /api/products/{product_id}/view
```

**Headers (Optional):**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "session_id": "session_abc123",
  "referrer": "search",
  "variant_id": 1
}
```

**Response:**

```json
{
  "logged": true
}
```

**Implementation:**

```sql
-- Log product view
INSERT INTO UserActivityLog (
    user_id,
    session_id,
    activity_type,
    variant_id,
    activity_timestamp
)
VALUES (?, ?, 'PRODUCT_VIEW', ?, GETDATE());
```

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX IX_ProductPrice_VariantId_DateId ON FactProductPrice(variant_id, date_id);
CREATE INDEX IX_PriceForecast_VariantId_Date ON FactPriceForecast(variant_id, forecast_date);
CREATE INDEX IX_PriceAnomaly_Score_Date ON FactPriceAnomaly(anomaly_score, created_at);
CREATE INDEX IX_UserFavorites_UserId ON UserFavorites(user_id);
CREATE INDEX IX_ActivityLog_VariantId ON UserActivityLog(variant_id, activity_type);
```

### Caching Strategy

- `product:{id}` - TTL: 1 hour
- `product:{id}:history` - TTL: 30 minutes
- `product:{id}:forecast` - TTL: 6 hours
- `product:{id}:similar` - TTL: 24 hours

## Error Handling

### Product Not Found

```json
{
  "detail": "Product not found",
  "error_code": "PRODUCT_001"
}
```

### Insufficient Data

```json
{
  "detail": "Price forecast unavailable",
  "error_code": "PRODUCT_002",
  "reason": "Insufficient historical data"
}
```

## Frontend Integration

The product page `/product/[id]` expects:

- Product details with variants
- Price history charts
- Forecast visualizations
- Anomaly alerts
- Similar products grid
- Recommendations section
- Favorite toggle functionality
- Retailer comparison tools
