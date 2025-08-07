# Search & Filter API

## Overview

Handles product search, filtering, sorting, and search suggestions for the PricePulse platform.

## Database Tables Used

- `DimCanonicalProduct`
- `DimVariant`
- `DimShop`
- `DimCategory`
- `FactProductPrice`
- `UserActivityLog`

## API Endpoints

### 1. Product Search

```http
GET /api/search/products
```

**Query Parameters:**

- `q` (required): Search query string
- `category` (optional): Category filter
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter
- `retailer` (optional): Retailer filter
- `in_stock` (optional): Stock status filter (true/false)
- `sort` (optional): Sort order ("price_asc", "price_desc", "relevance", "newest")
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20, max: 100)

**Example Request:**

```
GET /api/search/products?q=Samsung%20Galaxy&category=smartphones&min_price=500&max_price=1500&in_stock=true&sort=price_asc&page=1&limit=20
```

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
      "discount": 8,
      "retailer": "TechMart",
      "retailer_id": 2,
      "in_stock": true,
      "image": "https://example.com/image.jpg",
      "rating": 4.7,
      "reviews_count": 1250,
      "relevance_score": 0.95,
      "sku": "SM-S928U",
      "product_url": "https://techmart.com/galaxy-s24"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 25,
    "total_items": 487,
    "items_per_page": 20,
    "has_next": true,
    "has_previous": false
  },
  "filters": {
    "categories": [
      {
        "category_id": 1,
        "name": "Smartphones",
        "count": 324
      },
      {
        "category_id": 2,
        "name": "Tablets",
        "count": 163
      }
    ],
    "retailers": [
      {
        "retailer_id": 1,
        "name": "TechMart",
        "count": 156
      },
      {
        "retailer_id": 2,
        "name": "MobileWorld",
        "count": 89
      }
    ],
    "price_ranges": [
      {
        "range": "0-500",
        "count": 123
      },
      {
        "range": "500-1000",
        "count": 234
      },
      {
        "range": "1000-1500",
        "count": 98
      },
      {
        "range": "1500+",
        "count": 32
      }
    ]
  },
  "search_metadata": {
    "query": "Samsung Galaxy",
    "search_time_ms": 45,
    "total_found": 487,
    "spell_check": null
  }
}
```

**Implementation:**

```sql
-- Main search query with filters
WITH SearchResults AS (
    SELECT
        cp.canonical_product_id as id,
        cp.product_title as name,
        cp.brand,
        cat.category_name as category,
        v.variant_id,
        v.variant_title,
        v.sku_native as sku,
        v.product_url,
        v.image_url as image,
        s.shop_name as retailer,
        s.shop_id as retailer_id,
        fpp.current_price as price,
        fpp.original_price,
        fpp.is_available as in_stock,
        CASE
            WHEN fpp.original_price > 0
            THEN ROUND(((fpp.original_price - fpp.current_price) / fpp.original_price) * 100, 0)
            ELSE 0
        END as discount,
        -- Relevance scoring
        (
            CASE WHEN cp.product_title LIKE ? THEN 100 ELSE 0 END +
            CASE WHEN cp.brand LIKE ? THEN 50 ELSE 0 END +
            CASE WHEN cat.category_name LIKE ? THEN 30 ELSE 0 END +
            CASE WHEN v.variant_title LIKE ? THEN 20 ELSE 0 END
        ) as relevance_score,
        ROW_NUMBER() OVER (
            ORDER BY
                CASE WHEN ? = 'relevance' THEN relevance_score END DESC,
                CASE WHEN ? = 'price_asc' THEN fpp.current_price END ASC,
                CASE WHEN ? = 'price_desc' THEN fpp.current_price END DESC,
                CASE WHEN ? = 'newest' THEN cp.canonical_product_id END DESC
        ) as row_num
    FROM DimCanonicalProduct cp
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    WHERE fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND (
            cp.product_title LIKE ? OR
            cp.brand LIKE ? OR
            v.variant_title LIKE ? OR
            cat.category_name LIKE ?
        )
        AND (? IS NULL OR cat.category_name = ?)
        AND (? IS NULL OR fpp.current_price >= ?)
        AND (? IS NULL OR fpp.current_price <= ?)
        AND (? IS NULL OR s.shop_name = ?)
        AND (? IS NULL OR fpp.is_available = ?)
)
SELECT * FROM SearchResults
WHERE row_num BETWEEN ? AND ?;
```

### 2. Search Suggestions

```http
GET /api/search/suggestions
```

**Query Parameters:**

- `q` (required): Partial search query
- `limit` (optional): Number of suggestions (default: 10)

**Example Request:**

```
GET /api/search/suggestions?q=Sam&limit=5
```

**Response:**

```json
{
  "suggestions": [
    {
      "text": "Samsung Galaxy S24",
      "type": "product",
      "count": 156
    },
    {
      "text": "Samsung",
      "type": "brand",
      "count": 890
    },
    {
      "text": "Samsung Galaxy Watch",
      "type": "product",
      "count": 67
    },
    {
      "text": "Samsung Galaxy Tab",
      "type": "product",
      "count": 34
    },
    {
      "text": "Samsung Galaxy Buds",
      "type": "product",
      "count": 23
    }
  ]
}
```

**Implementation:**

```sql
-- Product suggestions
(
    SELECT
        cp.product_title as text,
        'product' as type,
        COUNT(DISTINCT v.variant_id) as count
    FROM DimCanonicalProduct cp
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    WHERE cp.product_title LIKE ?
    GROUP BY cp.product_title
)
UNION ALL
-- Brand suggestions
(
    SELECT
        cp.brand as text,
        'brand' as type,
        COUNT(DISTINCT cp.canonical_product_id) as count
    FROM DimCanonicalProduct cp
    WHERE cp.brand LIKE ?
    GROUP BY cp.brand
)
UNION ALL
-- Category suggestions
(
    SELECT
        cat.category_name as text,
        'category' as type,
        COUNT(DISTINCT cp.canonical_product_id) as count
    FROM DimCategory cat
    JOIN DimCanonicalProduct cp ON cat.category_id = cp.category_id
    WHERE cat.category_name LIKE ?
    GROUP BY cat.category_name
)
ORDER BY count DESC
LIMIT ?;
```

### 3. Filter Options

```http
GET /api/search/filters
```

**Query Parameters:**

- `q` (optional): Search query to get contextual filters
- `category` (optional): Category context

**Response:**

```json
{
  "categories": [
    {
      "category_id": 1,
      "name": "Smartphones",
      "count": 450000,
      "subcategories": [
        {
          "category_id": 11,
          "name": "Android Phones",
          "count": 320000
        },
        {
          "category_id": 12,
          "name": "iPhones",
          "count": 130000
        }
      ]
    }
  ],
  "retailers": [
    {
      "retailer_id": 1,
      "name": "TechMart",
      "product_count": 25000
    }
  ],
  "brands": [
    {
      "name": "Samsung",
      "count": 15000
    },
    {
      "name": "Apple",
      "count": 12000
    }
  ],
  "price_ranges": [
    {
      "min": 0,
      "max": 500,
      "count": 45000
    },
    {
      "min": 500,
      "max": 1000,
      "count": 67000
    }
  ]
}
```

### 4. Popular Searches

```http
GET /api/search/popular
```

**Query Parameters:**

- `period` (optional): "day", "week", "month" (default: "week")
- `limit` (optional): Number of results (default: 10)

**Response:**

```json
{
  "popular_searches": [
    {
      "query": "iPhone 15",
      "search_count": 15420,
      "trend_direction": "up",
      "trend_percentage": 12.5
    },
    {
      "query": "Samsung Galaxy S24",
      "search_count": 12890,
      "trend_direction": "stable",
      "trend_percentage": 2.1
    }
  ],
  "period": "week"
}
```

**Implementation:**

```sql
-- Popular searches with trend analysis
WITH CurrentPeriod AS (
    SELECT
        search_query,
        COUNT(*) as current_count
    FROM UserActivityLog
    WHERE activity_type = 'SEARCH'
        AND search_query IS NOT NULL
        AND activity_timestamp >= CASE
            WHEN ? = 'day' THEN DATEADD(day, -1, GETDATE())
            WHEN ? = 'week' THEN DATEADD(week, -1, GETDATE())
            WHEN ? = 'month' THEN DATEADD(month, -1, GETDATE())
        END
    GROUP BY search_query
),
PreviousPeriod AS (
    SELECT
        search_query,
        COUNT(*) as previous_count
    FROM UserActivityLog
    WHERE activity_type = 'SEARCH'
        AND search_query IS NOT NULL
        AND activity_timestamp BETWEEN
            CASE
                WHEN ? = 'day' THEN DATEADD(day, -2, GETDATE())
                WHEN ? = 'week' THEN DATEADD(week, -2, GETDATE())
                WHEN ? = 'month' THEN DATEADD(month, -2, GETDATE())
            END
            AND
            CASE
                WHEN ? = 'day' THEN DATEADD(day, -1, GETDATE())
                WHEN ? = 'week' THEN DATEADD(week, -1, GETDATE())
                WHEN ? = 'month' THEN DATEADD(month, -1, GETDATE())
            END
    GROUP BY search_query
)
SELECT
    cp.search_query as query,
    cp.current_count as search_count,
    CASE
        WHEN pp.previous_count IS NULL THEN 'new'
        WHEN cp.current_count > pp.previous_count * 1.1 THEN 'up'
        WHEN cp.current_count < pp.previous_count * 0.9 THEN 'down'
        ELSE 'stable'
    END as trend_direction,
    CASE
        WHEN pp.previous_count IS NULL THEN 100
        ELSE ROUND(((cp.current_count - pp.previous_count) / CAST(pp.previous_count AS FLOAT)) * 100, 2)
    END as trend_percentage
FROM CurrentPeriod cp
LEFT JOIN PreviousPeriod pp ON cp.search_query = pp.search_query
ORDER BY cp.current_count DESC
LIMIT ?;
```

### 5. Search Analytics (Log Search Activity)

```http
POST /api/search/analytics
```

**Headers (Optional):**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "query": "Samsung Galaxy",
  "filters": {
    "category": "smartphones",
    "price_range": "500-1000"
  },
  "results_count": 156,
  "session_id": "session_abc123"
}
```

**Response:**

```json
{
  "logged": true,
  "search_id": "search_xyz789"
}
```

**Implementation:**

```sql
-- Log search activity
INSERT INTO UserActivityLog (
    user_id,
    session_id,
    activity_type,
    search_query,
    activity_timestamp
)
VALUES (?, ?, 'SEARCH', ?, GETDATE());
```

## Search Features

### Full-Text Search

- Support for partial matches
- Typo tolerance and spell checking
- Synonym matching
- Brand and model recognition

### Relevance Scoring

```sql
-- Relevance scoring algorithm
(
    CASE WHEN product_title LIKE 'exact_match%' THEN 100 ELSE 0 END +
    CASE WHEN brand = 'brand_match' THEN 50 ELSE 0 END +
    CASE WHEN category_name LIKE '%category%' THEN 30 ELSE 0 END +
    CASE WHEN variant_title LIKE '%query%' THEN 20 ELSE 0 END +
    -- Boost popular products
    CASE WHEN view_count > 1000 THEN 10 ELSE 0 END
) as relevance_score
```

### Search Performance

- Elasticsearch integration for advanced search
- Database indexes on searchable fields
- Query result caching
- Search suggestion caching

## Database Indexes

```sql
-- Search performance indexes
CREATE INDEX IX_CanonicalProduct_Title_Brand ON DimCanonicalProduct(product_title, brand);
CREATE INDEX IX_Variant_Title ON DimVariant(variant_title);
CREATE INDEX IX_Category_Name ON DimCategory(category_name);
CREATE INDEX IX_ProductPrice_DateId_Available ON FactProductPrice(date_id, is_available);
CREATE INDEX IX_UserActivityLog_Search ON UserActivityLog(activity_type, search_query, activity_timestamp);

-- Full-text search indexes (if using SQL Server)
CREATE FULLTEXT INDEX ON DimCanonicalProduct(product_title, brand);
CREATE FULLTEXT INDEX ON DimVariant(variant_title);
```

## Caching Strategy

### Redis Cache Keys

- `search:suggestions:{query}` - TTL: 1 hour
- `search:filters:{category}` - TTL: 6 hours
- `search:popular:{period}` - TTL: 1 hour
- `search:results:{query_hash}` - TTL: 15 minutes

## Error Handling

### Validation Errors

```json
{
  "detail": "Invalid search parameters",
  "errors": {
    "min_price": "Must be a positive number",
    "max_price": "Must be greater than min_price"
  }
}
```

### Search Errors

```json
{
  "detail": "Search service temporarily unavailable",
  "error_code": "SEARCH_001",
  "suggestions": ["Try again in a few moments", "Use fewer filters"]
}
```

## Frontend Integration

The search page `/search` expects:

- Product results with pagination
- Filter options with counts
- Sort options
- Search suggestions for autocomplete
- Loading states for search operations
- Error handling for failed searches

### Search State Management

```typescript
interface SearchState {
  query: string;
  filters: SearchFilters;
  results: Product[];
  pagination: PaginationInfo;
  loading: boolean;
  error: string | null;
}
```
