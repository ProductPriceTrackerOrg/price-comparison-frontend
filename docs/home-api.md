# Home Page API

## Overview

Provides data for all sections of the homepage including hero stats, categories, trending products, latest products, price changes, and retailer information.

## Database Tables Used

- `DimCanonicalProduct`
- `DimVariant`
- `DimShop`
- `DimCategory`
- `FactProductPrice`
- `FactPriceAnomaly`
- `FactProductRecommendation`

## API Endpoints

### 1. Homepage Statistics

```http
GET /api/home/stats
```

**Response:**

```json
{
  "total_products": "2.5M+",
  "product_categories": "150+",
  "total_users": "100K+",
  "total_suppliers": "500+",
  "price_updates_today": "1M+",
  "active_deals": "25K+"
}
```

**Implementation:**

```sql
-- Get aggregated statistics
SELECT
    (SELECT COUNT(*) FROM DimCanonicalProduct) as total_products,
    (SELECT COUNT(*) FROM DimCategory WHERE parent_category_id IS NULL) as product_categories,
    (SELECT COUNT(*) FROM Users WHERE is_active = 1) as total_users,
    (SELECT COUNT(*) FROM DimShop) as total_suppliers,
    (SELECT COUNT(*) FROM FactProductPrice WHERE date_id = TODAY()) as price_updates_today;
```

### 2. Product Categories

```http
GET /api/home/categories
```

**Response:**

```json
{
  "categories": [
    {
      "category_id": 1,
      "name": "Smartphones",
      "icon": "smartphone",
      "product_count": "450K+",
      "href": "/category/smartphones",
      "color": "blue",
      "trending_score": 95
    },
    {
      "category_id": 2,
      "name": "Laptops",
      "icon": "laptop",
      "product_count": "125K+",
      "href": "/category/laptops",
      "color": "green",
      "trending_score": 88
    }
  ]
}
```

**Implementation:**

```sql
-- Get categories with product counts
SELECT
    c.category_id,
    c.category_name as name,
    COUNT(DISTINCT cp.canonical_product_id) as product_count,
    AVG(CASE WHEN pa.anomaly_score IS NOT NULL THEN pa.anomaly_score ELSE 0 END) as trending_score
FROM DimCategory c
LEFT JOIN DimCanonicalProduct cp ON c.category_id = cp.category_id
LEFT JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
LEFT JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
LEFT JOIN FactPriceAnomaly pa ON fpp.price_fact_id = pa.price_fact_id
WHERE c.parent_category_id IS NULL
GROUP BY c.category_id, c.category_name
ORDER BY trending_score DESC;
```

### 3. Trending Products

```http
GET /api/home/trending
```

**Query Parameters:**

- `limit` (optional): Number of products to return (default: 8)
- `type` (optional): "trends" or "launches" (default: "trends")

**Response for Trends:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "brand": "Apple",
      "category": "Smartphones",
      "price": 1299.99,
      "original_price": 1399.99,
      "retailer": "MobileWorld",
      "retailer_id": 1,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "discount": 7,
      "trend_score": 98,
      "search_volume": "+245%",
      "price_change": -7.2,
      "is_trending": true
    }
  ],
  "stats": {
    "trending_searches": "2.5M+",
    "accuracy_rate": "95%",
    "update_frequency": "Real-time"
  }
}
```

**Response for New Launches:**

```json
{
  "products": [
    {
      "id": 11,
      "name": "Nothing Phone 2a",
      "brand": "Nothing",
      "category": "Smartphones",
      "price": 399.99,
      "retailer": "TechStore",
      "retailer_id": 5,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "launch_date": "2024-01-15",
      "pre_orders": 15420,
      "rating": 4.8,
      "is_new": true
    }
  ],
  "stats": {
    "new_launches": "450+",
    "update_frequency": "24h",
    "tracking_type": "Pre-order"
  }
}
```

**Implementation:**

```sql
-- Trending products query
SELECT
    cp.canonical_product_id as id,
    cp.product_title as name,
    cp.brand,
    cat.category_name as category,
    v.variant_id,
    v.variant_title,
    s.shop_name as retailer,
    s.shop_id as retailer_id,
    fpp.current_price as price,
    fpp.original_price,
    fpp.is_available as in_stock,
    v.image_url as image,
    CASE
        WHEN fpp.original_price > 0
        THEN ROUND(((fpp.original_price - fpp.current_price) / fpp.original_price) * 100, 0)
        ELSE 0
    END as discount,
    AVG(pa.anomaly_score) as trend_score,
    ROUND(fpp.original_price - fpp.current_price, 2) as price_change
FROM DimCanonicalProduct cp
JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN DimCategory cat ON cp.category_id = cat.category_id
JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
LEFT JOIN FactPriceAnomaly pa ON fpp.price_fact_id = pa.price_fact_id
WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND fpp.is_available = 1
    AND pa.anomaly_score > 80
GROUP BY cp.canonical_product_id, v.variant_id, fpp.current_price, fpp.original_price
ORDER BY trend_score DESC
LIMIT ?;
```

### 4. Latest Products

```http
GET /api/home/latest
```

**Query Parameters:**

- `limit` (optional): Number of products to return (default: 12)

**Response:**

```json
{
  "products": [
    {
      "id": 1,
      "name": "Samsung Galaxy S24 Ultra",
      "brand": "Samsung",
      "category": "Smartphones",
      "price": 1199.99,
      "original_price": 1299.99,
      "retailer": "TechMart",
      "retailer_id": 2,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "discount": 8,
      "rating": 4.7,
      "reviews_count": 1250,
      "added_date": "2025-08-01T10:00:00Z"
    }
  ]
}
```

### 5. Top Price Changes

```http
GET /api/home/price-changes
```

**Query Parameters:**

- `limit` (optional): Number of products to return (default: 8)
- `type` (optional): "drops" or "increases" (default: "drops")

**Response:**

```json
{
  "price_changes": [
    {
      "id": 1,
      "name": "MacBook Pro 16-inch",
      "brand": "Apple",
      "category": "Laptops",
      "current_price": 2299.99,
      "previous_price": 2499.99,
      "price_change": -200.0,
      "percentage_change": -8.0,
      "retailer": "ComputerWorld",
      "retailer_id": 3,
      "image": "https://example.com/image.jpg",
      "change_date": "2025-08-06T08:00:00Z",
      "in_stock": true
    }
  ]
}
```

**Implementation:**

```sql
-- Price changes query
WITH PriceChanges AS (
    SELECT
        cp.canonical_product_id as id,
        cp.product_title as name,
        cp.brand,
        cat.category_name as category,
        current_prices.current_price,
        previous_prices.previous_price,
        (current_prices.current_price - previous_prices.previous_price) as price_change,
        ROUND(((current_prices.current_price - previous_prices.previous_price) / previous_prices.previous_price) * 100, 2) as percentage_change,
        s.shop_name as retailer,
        s.shop_id as retailer_id,
        v.image_url as image,
        current_prices.date_id as change_date,
        current_prices.is_available as in_stock
    FROM DimCanonicalProduct cp
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN (
        SELECT variant_id, current_price, date_id, is_available
        FROM FactProductPrice
        WHERE date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    ) current_prices ON v.variant_id = current_prices.variant_id
    JOIN (
        SELECT variant_id, current_price as previous_price
        FROM FactProductPrice
        WHERE date_id = (SELECT MAX(date_id) - 1 FROM FactProductPrice)
    ) previous_prices ON v.variant_id = previous_prices.variant_id
    WHERE current_prices.current_price != previous_prices.previous_price
)
SELECT * FROM PriceChanges
WHERE price_change < 0  -- For drops, use > 0 for increases
ORDER BY ABS(percentage_change) DESC
LIMIT ?;
```

### 6. Featured Retailers

```http
GET /api/home/retailers
```

**Response:**

```json
{
  "retailers": [
    {
      "shop_id": 1,
      "name": "TechMart",
      "logo": "https://example.com/logo1.jpg",
      "website_url": "https://techmart.com",
      "product_count": 25000,
      "avg_rating": 4.5,
      "specialty": "Electronics",
      "contact_phone": "+1-555-0123",
      "contact_whatsapp": "+1-555-0123"
    }
  ]
}
```

**Implementation:**

```sql
-- Featured retailers query
SELECT
    s.shop_id,
    s.shop_name as name,
    s.website_url,
    s.contact_phone,
    s.contact_whatsapp,
    COUNT(DISTINCT v.variant_id) as product_count,
    COALESCE(AVG(ratings.rating), 0) as avg_rating
FROM DimShop s
LEFT JOIN DimVariant v ON s.shop_id = v.shop_id
LEFT JOIN (
    -- Assuming we have ratings somewhere or calculate from user activity
    SELECT shop_id, 4.5 as rating FROM DimShop LIMIT 1
) ratings ON s.shop_id = ratings.shop_id
GROUP BY s.shop_id, s.shop_name, s.website_url, s.contact_phone, s.contact_whatsapp
HAVING product_count > 1000
ORDER BY product_count DESC, avg_rating DESC
LIMIT 8;
```

### 7. Search Suggestions

```http
GET /api/home/search-suggestions
```

**Response:**

```json
{
  "popular_searches": [
    "iPhone 15",
    "Samsung Galaxy S24",
    "MacBook Pro",
    "AirPods Pro",
    "PlayStation 5"
  ],
  "trending_searches": ["Nothing Phone 2a", "Google Pixel 8", "Steam Deck OLED"]
}
```

**Implementation:**

```sql
-- Popular search suggestions from user activity
SELECT
    search_query,
    COUNT(*) as search_count
FROM UserActivityLog
WHERE activity_type = 'SEARCH'
    AND search_query IS NOT NULL
    AND activity_timestamp >= DATEADD(day, -30, GETDATE())
GROUP BY search_query
ORDER BY search_count DESC
LIMIT 8;
```

### 8. Personalized Recommendations (Authenticated Users)

```http
GET /api/home/recommendations
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "recommended_products": [
    {
      "id": 1,
      "name": "Recommended Product",
      "brand": "Brand",
      "category": "Category",
      "price": 299.99,
      "original_price": 349.99,
      "retailer": "Shop",
      "image": "https://example.com/image.jpg",
      "recommendation_score": 0.95,
      "recommendation_reason": "Based on your interests in smartphones"
    }
  ]
}
```

**Implementation:**

```sql
-- Get personalized recommendations
SELECT
    cp.canonical_product_id as id,
    cp.product_title as name,
    cp.brand,
    cat.category_name as category,
    fpp.current_price as price,
    fpp.original_price,
    s.shop_name as retailer,
    v.image_url as image,
    fpr.recommendation_score,
    fpr.recommendation_type as recommendation_reason
FROM FactProductRecommendation fpr
JOIN DimVariant v ON fpr.recommended_variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
JOIN DimCategory cat ON cp.category_id = cat.category_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
WHERE fpr.user_id = ?
    AND fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND fpp.is_available = 1
ORDER BY fpr.recommendation_score DESC
LIMIT 6;
```

## Caching Strategy

### Redis Cache Keys

- `home:stats` - TTL: 1 hour
- `home:categories` - TTL: 6 hours
- `home:trending:{type}` - TTL: 30 minutes
- `home:latest` - TTL: 1 hour
- `home:price-changes:{type}` - TTL: 15 minutes
- `home:retailers` - TTL: 6 hours
- `home:search-suggestions` - TTL: 1 hour

### Cache Invalidation

- Price changes: Invalidate price-related caches
- New products: Invalidate latest products cache
- Category changes: Invalidate categories cache

## Performance Optimization

### Database Indexes

```sql
-- Indexes for better performance
CREATE INDEX IX_FactProductPrice_DateId_VariantId ON FactProductPrice(date_id, variant_id);
CREATE INDEX IX_FactPriceAnomaly_Score ON FactPriceAnomaly(anomaly_score);
CREATE INDEX IX_UserActivityLog_Type_Timestamp ON UserActivityLog(activity_type, activity_timestamp);
CREATE INDEX IX_FactProductRecommendation_UserId_Score ON FactProductRecommendation(user_id, recommendation_score);
```

### Query Optimization

- Use connection pooling
- Implement query result pagination
- Use read replicas for analytics queries
- Cache frequently accessed data in Redis

## Error Handling

### Common Error Responses

```json
{
  "detail": "Service temporarily unavailable",
  "error_code": "HOME_001",
  "retry_after": 30
}
```

## Frontend Integration

The home page expects these data structures to populate:

- HeroSection: stats data
- CategoriesSection: categories data
- TrendingSection: trending products with tabs
- LatestProductsSection: latest products
- TopPriceChangesSection: price changes data
- RetailersSection: retailer information
- RecommendationsSection: personalized recommendations (if authenticated)
