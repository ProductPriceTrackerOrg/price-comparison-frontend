# Categories & Trending API

## Overview

Handles category browsing, trending products, new arrivals, price drops, and deals sections of the application.

## Database Tables Used

- `DimCategory`
- `DimCanonicalProduct`
- `DimVariant`
- `DimShop`
- `FactProductPrice`
- `FactPriceAnomaly`
- `UserActivityLog`

## API Endpoints

### 1. All Categories

```http
GET /api/categories
```

**Query Parameters:**

- `include_subcategories` (optional): Include child categories (default: true)
- `include_counts` (optional): Include product counts (default: true)

**Response:**

```json
{
  "categories": [
    {
      "category_id": 1,
      "name": "Smartphones",
      "description": "Mobile phones and accessories",
      "product_count": 450000,
      "parent_category_id": null,
      "subcategories": [
        {
          "category_id": 11,
          "name": "Android Phones",
          "product_count": 320000,
          "parent_category_id": 1
        },
        {
          "category_id": 12,
          "name": "iPhones",
          "product_count": 130000,
          "parent_category_id": 1
        }
      ],
      "trending_score": 95,
      "icon": "smartphone",
      "color": "blue"
    }
  ],
  "total_categories": 8,
  "total_products": 2500000
}
```

**Implementation:**

```sql
-- Categories with subcategories and counts
WITH CategoryCounts AS (
    SELECT
        c.category_id,
        COUNT(DISTINCT cp.canonical_product_id) as product_count,
        AVG(COALESCE(pa.anomaly_score, 0)) as trending_score
    FROM DimCategory c
    LEFT JOIN DimCanonicalProduct cp ON c.category_id = cp.category_id
    LEFT JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    LEFT JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    LEFT JOIN FactPriceAnomaly pa ON fpp.price_fact_id = pa.price_fact_id
    WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice) OR fpp.date_id IS NULL
    GROUP BY c.category_id
)
SELECT
    c.category_id,
    c.category_name as name,
    c.parent_category_id,
    COALESCE(cc.product_count, 0) as product_count,
    COALESCE(cc.trending_score, 0) as trending_score
FROM DimCategory c
LEFT JOIN CategoryCounts cc ON c.category_id = cc.category_id
ORDER BY c.parent_category_id ASC, cc.trending_score DESC;
```

### 2. Category Products

```http
GET /api/categories/{category_id}/products
```

**Path Parameters:**

- `category_id`: Category ID

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): "price_asc", "price_desc", "popularity", "newest" (default: "popularity")
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `retailer` (optional): Retailer filter
- `in_stock` (optional): Stock status filter

**Response:**

```json
{
  "category": {
    "category_id": 1,
    "name": "Smartphones",
    "description": "Mobile phones and accessories",
    "parent_category": null
  },
  "products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "brand": "Apple",
      "price": 1299.99,
      "original_price": 1399.99,
      "discount": 7,
      "retailer": "MobileWorld",
      "retailer_id": 1,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "rating": 4.8,
      "popularity_score": 95
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 150,
    "total_items": 3000,
    "items_per_page": 20
  },
  "filters": {
    "brands": [
      { "name": "Apple", "count": 500 },
      { "name": "Samsung", "count": 800 }
    ],
    "retailers": [{ "retailer_id": 1, "name": "MobileWorld", "count": 1200 }],
    "price_ranges": [
      { "range": "0-500", "count": 800 },
      { "range": "500-1000", "count": 1200 }
    ]
  }
}
```

### 3. Trending Products

```http
GET /api/trending
```

**Query Parameters:**

- `category` (optional): Filter by category
- `period` (optional): "day", "week", "month" (default: "week")
- `limit` (optional): Number of products (default: 20)
- `sort` (optional): "trend_score", "price_change", "search_volume" (default: "trend_score")

**Response:**

```json
{
  "trending_products": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max",
      "brand": "Apple",
      "category": "Smartphones",
      "price": 1299.99,
      "original_price": 1399.99,
      "discount": 7,
      "retailer": "MobileWorld",
      "retailer_id": 1,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "trend_metrics": {
        "trend_score": 98,
        "search_volume_change": "+245%",
        "price_change_7d": -7.2,
        "view_count_change": "+156%",
        "social_mentions": 15420
      },
      "trending_reason": "Viral social media buzz"
    }
  ],
  "trending_categories": [
    {
      "category_id": 1,
      "name": "Smartphones",
      "trend_score": 95,
      "product_count": 12
    }
  ],
  "period_summary": {
    "total_trending": 50,
    "avg_price_change": -5.2,
    "top_trend_score": 98
  }
}
```

**Implementation:**

```sql
-- Trending products with analytics
WITH TrendingMetrics AS (
    SELECT
        v.variant_id,
        cp.canonical_product_id,
        AVG(pa.anomaly_score) as trend_score,
        COUNT(ual.log_id) as view_count,
        COUNT(CASE WHEN ual.activity_timestamp >= DATEADD(day, -7, GETDATE()) THEN 1 END) as recent_views
    FROM DimVariant v
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    LEFT JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    LEFT JOIN FactPriceAnomaly pa ON fpp.price_fact_id = pa.price_fact_id
    LEFT JOIN UserActivityLog ual ON v.variant_id = ual.variant_id AND ual.activity_type = 'PRODUCT_VIEW'
    WHERE pa.created_at >= CASE
        WHEN ? = 'day' THEN DATEADD(day, -1, GETDATE())
        WHEN ? = 'week' THEN DATEADD(week, -1, GETDATE())
        WHEN ? = 'month' THEN DATEADD(month, -1, GETDATE())
    END
    GROUP BY v.variant_id, cp.canonical_product_id
),
PriceChanges AS (
    SELECT
        fpp_current.variant_id,
        fpp_current.current_price - fpp_previous.current_price as price_change_7d
    FROM FactProductPrice fpp_current
    JOIN FactProductPrice fpp_previous ON fpp_current.variant_id = fpp_previous.variant_id
    WHERE fpp_current.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fpp_previous.date_id = (SELECT MAX(date_id) - 7 FROM FactProductPrice)
)
SELECT
    cp.canonical_product_id as id,
    cp.product_title as name,
    cp.brand,
    cat.category_name as category,
    fpp.current_price as price,
    fpp.original_price,
    s.shop_name as retailer,
    s.shop_id as retailer_id,
    fpp.is_available as in_stock,
    v.image_url as image,
    tm.trend_score,
    pc.price_change_7d,
    tm.recent_views
FROM TrendingMetrics tm
JOIN DimVariant v ON tm.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON tm.canonical_product_id = cp.canonical_product_id
JOIN DimCategory cat ON cp.category_id = cat.category_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
LEFT JOIN PriceChanges pc ON v.variant_id = pc.variant_id
WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND tm.trend_score > 70
    AND (? IS NULL OR cat.category_name = ?)
ORDER BY
    CASE WHEN ? = 'trend_score' THEN tm.trend_score END DESC,
    CASE WHEN ? = 'price_change' THEN ABS(pc.price_change_7d) END DESC,
    CASE WHEN ? = 'search_volume' THEN tm.recent_views END DESC
LIMIT ?;
```

### 4. New Arrivals

```http
GET /api/new-arrivals
```

**Query Parameters:**

- `category` (optional): Filter by category
- `days` (optional): Days since launch (default: 30)
- `limit` (optional): Number of products (default: 20)
- `sort` (optional): "launch_date", "price_asc", "price_desc", "popularity" (default: "launch_date")

**Response:**

```json
{
  "new_arrivals": [
    {
      "id": 1,
      "name": "Nothing Phone 2a",
      "brand": "Nothing",
      "category": "Smartphones",
      "price": 399.99,
      "retailer": "TechStore",
      "retailer_id": 5,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "launch_info": {
        "launch_date": "2024-01-15",
        "days_since_launch": 15,
        "pre_orders": 15420,
        "initial_price": 429.99,
        "price_change_since_launch": -30.0
      },
      "rating": 4.8,
      "reviews_count": 245,
      "is_new": true
    }
  ],
  "launch_summary": {
    "total_new_products": 45,
    "avg_rating": 4.5,
    "most_popular_category": "Smartphones"
  }
}
```

### 5. Price Drops

```http
GET /api/price-drops
```

**Query Parameters:**

- `category` (optional): Filter by category
- `min_discount` (optional): Minimum discount percentage (default: 5)
- `days` (optional): Price drop period (default: 7)
- `limit` (optional): Number of products (default: 20)
- `sort` (optional): "discount_percent", "discount_amount", "price_asc" (default: "discount_percent")

**Response:**

```json
{
  "price_drops": [
    {
      "id": 1,
      "name": "MacBook Pro 16-inch",
      "brand": "Apple",
      "category": "Laptops",
      "current_price": 2299.99,
      "previous_price": 2499.99,
      "original_price": 2699.99,
      "retailer": "ComputerWorld",
      "retailer_id": 3,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "price_drop": {
        "amount": 200.0,
        "percentage": 8.0,
        "drop_date": "2025-08-05T14:30:00Z",
        "days_since_drop": 1,
        "total_savings_from_original": 399.01
      },
      "is_deal": true,
      "deal_type": "flash_sale"
    }
  ],
  "drop_summary": {
    "total_drops": 156,
    "avg_discount": 12.5,
    "best_deal": {
      "product_name": "MacBook Pro 16-inch",
      "discount": 200.0
    }
  }
}
```

**Implementation:**

```sql
-- Price drops in specified period
WITH RecentPriceChanges AS (
    SELECT
        v.variant_id,
        cp.canonical_product_id,
        fpp_current.current_price,
        fpp_current.original_price,
        fpp_previous.current_price as previous_price,
        fpp_current.current_price - fpp_previous.current_price as price_change,
        ROUND(((fpp_previous.current_price - fpp_current.current_price) / fpp_previous.current_price) * 100, 2) as discount_percentage,
        fpp_current.date_id as change_date
    FROM DimVariant v
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN FactProductPrice fpp_current ON v.variant_id = fpp_current.variant_id
    JOIN FactProductPrice fpp_previous ON v.variant_id = fpp_previous.variant_id
    WHERE fpp_current.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fpp_previous.date_id = fpp_current.date_id - ?
        AND fpp_current.current_price < fpp_previous.current_price
        AND ((fpp_previous.current_price - fpp_current.current_price) / fpp_previous.current_price) * 100 >= ?
)
SELECT
    cp.canonical_product_id as id,
    cp.product_title as name,
    cp.brand,
    cat.category_name as category,
    rpc.current_price,
    rpc.previous_price,
    rpc.original_price,
    s.shop_name as retailer,
    s.shop_id as retailer_id,
    fpp.is_available as in_stock,
    v.image_url as image,
    ABS(rpc.price_change) as drop_amount,
    rpc.discount_percentage,
    dd.full_date as drop_date
FROM RecentPriceChanges rpc
JOIN DimVariant v ON rpc.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON rpc.canonical_product_id = cp.canonical_product_id
JOIN DimCategory cat ON cp.category_id = cat.category_id
JOIN DimShop s ON v.shop_id = s.shop_id
JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
JOIN DimDate dd ON rpc.change_date = dd.date_id
WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND fpp.is_available = 1
    AND (? IS NULL OR cat.category_name = ?)
ORDER BY
    CASE WHEN ? = 'discount_percent' THEN rpc.discount_percentage END DESC,
    CASE WHEN ? = 'discount_amount' THEN ABS(rpc.price_change) END DESC,
    CASE WHEN ? = 'price_asc' THEN rpc.current_price END ASC
LIMIT ?;
```

### 6. Deals & Offers

```http
GET /api/deals
```

**Query Parameters:**

- `deal_type` (optional): "flash_sale", "clearance", "bundle", "promotion"
- `category` (optional): Filter by category
- `min_discount` (optional): Minimum discount percentage
- `limit` (optional): Number of deals (default: 20)

**Response:**

```json
{
  "deals": [
    {
      "id": 1,
      "name": "Gaming Bundle - PS5 + Extra Controller",
      "brand": "Sony",
      "category": "Gaming",
      "bundle_price": 549.99,
      "individual_price": 629.98,
      "savings": 79.99,
      "discount_percentage": 12.7,
      "retailer": "GameZone",
      "retailer_id": 8,
      "image": "https://example.com/bundle.jpg",
      "deal_info": {
        "deal_type": "bundle",
        "expires_at": "2025-08-15T23:59:59Z",
        "remaining_stock": 25,
        "deal_description": "PS5 Console + DualSense Controller Bundle"
      },
      "is_limited_time": true,
      "is_featured": true
    }
  ],
  "deal_categories": [
    {
      "category": "Gaming",
      "deal_count": 15,
      "avg_discount": 18.5
    }
  ]
}
```

### 7. Category Analytics

```http
GET /api/categories/{category_id}/analytics
```

**Response:**

```json
{
  "category_analytics": {
    "category_id": 1,
    "name": "Smartphones",
    "metrics": {
      "total_products": 45000,
      "avg_price": 649.99,
      "price_range": {
        "min": 99.99,
        "max": 1599.99
      },
      "trending_score": 95,
      "market_share": 35.2
    },
    "price_trends": {
      "avg_price_change_7d": -2.5,
      "avg_price_change_30d": -5.8,
      "price_volatility": "medium"
    },
    "top_brands": [
      {
        "brand": "Samsung",
        "product_count": 15000,
        "market_share": 33.3,
        "avg_price": 699.99
      }
    ],
    "popular_price_ranges": [
      {
        "range": "400-800",
        "percentage": 45.2,
        "product_count": 20340
      }
    ]
  }
}
```

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX IX_Category_Parent ON DimCategory(parent_category_id);
CREATE INDEX IX_Product_Category ON DimCanonicalProduct(category_id);
CREATE INDEX IX_ProductPrice_DateId_Available ON FactProductPrice(date_id, is_available);
CREATE INDEX IX_PriceAnomaly_Score_Date ON FactPriceAnomaly(anomaly_score, created_at);
CREATE INDEX IX_ActivityLog_Type_Timestamp ON UserActivityLog(activity_type, activity_timestamp);
```

### Caching Strategy

- `categories:all` - TTL: 6 hours
- `categories:{id}:products` - TTL: 30 minutes
- `trending:products:{period}` - TTL: 15 minutes
- `new-arrivals:{days}` - TTL: 1 hour
- `price-drops:{days}` - TTL: 10 minutes
- `deals:active` - TTL: 5 minutes

## Error Handling

### Category Not Found

```json
{
  "detail": "Category not found",
  "error_code": "CATEGORY_001"
}
```

### Invalid Parameters

```json
{
  "detail": "Invalid filter parameters",
  "error_code": "CATEGORY_002",
  "errors": {
    "min_price": "Must be a positive number"
  }
}
```

## Frontend Integration

The category and trending pages expect:

- Category hierarchy with product counts
- Filtered product listings with pagination
- Trending analytics and metrics
- Price drop notifications
- Deal badges and timers
- Sort and filter options
- Real-time stock status
