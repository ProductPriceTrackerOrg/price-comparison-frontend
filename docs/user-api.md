# User Dashboard & Favorites API

## Overview

Handles user dashboard, favorite products tracking, notification settings, and personalized features.

## Database Tables Used

- `Users`
- `UserFavorites`
- `UserActivityLog`
- `UserNotificationSettings`
- `NotificationLog`
- `DimCanonicalProduct`
- `DimVariant`
- `FactProductPrice`
- `FactPriceAnomaly`

## API Endpoints

### 1. User Dashboard Summary

```http
GET /api/user/dashboard
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "user_summary": {
    "total_favorites": 25,
    "price_alerts_enabled": 18,
    "recent_activity_count": 147,
    "savings_alerts": 12,
    "account_created": "2024-12-15T10:30:00Z"
  },
  "recent_alerts": [
    {
      "alert_id": 1,
      "product_name": "iPhone 15 Pro Max",
      "alert_type": "price_drop",
      "old_price": 1299.99,
      "new_price": 1199.99,
      "savings": 100.0,
      "percentage": 7.7,
      "retailer": "TechMart",
      "date": "2025-08-06T09:15:00Z",
      "is_read": false
    }
  ],
  "trending_favorites": [
    {
      "product_id": 1,
      "name": "Samsung Galaxy S24",
      "current_price": 899.99,
      "trend": "decreasing",
      "image": "https://example.com/image.jpg"
    }
  ],
  "recommendations": [
    {
      "product_id": 5,
      "name": "Galaxy Watch 6",
      "price": 329.99,
      "reason": "Based on your Samsung preferences"
    }
  ]
}
```

**Implementation:**

```sql
-- Dashboard summary query
SELECT
    (SELECT COUNT(*) FROM UserFavorites WHERE user_id = ?) as total_favorites,
    (SELECT COUNT(*) FROM UserNotificationSettings WHERE user_id = ? AND notify_on_price_drop = 1) as price_alerts_enabled,
    (SELECT COUNT(*) FROM UserActivityLog WHERE user_id = ? AND activity_timestamp >= DATEADD(day, -30, GETDATE())) as recent_activity_count,
    (SELECT COUNT(*) FROM NotificationLog WHERE user_id = ? AND notification_type = 'PRICE_DROP' AND sent_timestamp >= DATEADD(day, -7, GETDATE())) as savings_alerts,
    (SELECT created_at FROM Users WHERE user_id = ?) as account_created;
```

### 2. User Favorites

```http
GET /api/user/favorites
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 20)
- `sort` (optional): "date_added", "price_asc", "price_desc", "name" (default: "date_added")
- `category` (optional): Filter by category

**Response:**

```json
{
  "favorites": [
    {
      "favorite_id": 1,
      "product": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "brand": "Apple",
        "category": "Smartphones",
        "image": "https://example.com/image.jpg"
      },
      "current_pricing": {
        "min_price": 1199.99,
        "max_price": 1349.99,
        "best_retailer": "TechMart",
        "avg_price": 1274.99,
        "in_stock_retailers": 8
      },
      "price_tracking": {
        "added_price": 1299.99,
        "current_min_price": 1199.99,
        "savings_potential": 100.0,
        "price_trend": "decreasing",
        "last_price_change": "2025-08-05T14:30:00Z"
      },
      "alerts": {
        "price_drop_enabled": true,
        "target_price": 1100.0,
        "anomaly_alerts": true
      },
      "date_added": "2025-07-15T10:00:00Z"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 3,
    "total_items": 25,
    "items_per_page": 20
  },
  "summary": {
    "total_favorites": 25,
    "total_potential_savings": 450.5,
    "active_alerts": 18,
    "categories": [
      { "name": "Smartphones", "count": 12 },
      { "name": "Laptops", "count": 8 },
      { "name": "Headphones", "count": 5 }
    ]
  }
}
```

**Implementation:**

```sql
-- User favorites with pricing
SELECT
    uf.favorite_id,
    cp.canonical_product_id as product_id,
    cp.product_title as product_name,
    cp.brand,
    cat.category_name as category,
    cp.master_image_url as image,
    MIN(fpp.current_price) as min_price,
    MAX(fpp.current_price) as max_price,
    AVG(fpp.current_price) as avg_price,
    COUNT(CASE WHEN fpp.is_available = 1 THEN 1 END) as in_stock_retailers,
    uf.created_at as date_added,
    uns.notify_on_price_drop as price_drop_enabled,
    uns.notify_on_anomaly as anomaly_alerts
FROM UserFavorites uf
JOIN DimVariant v ON uf.variant_id = v.variant_id
JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
JOIN DimCategory cat ON cp.category_id = cat.category_id
LEFT JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    AND fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
LEFT JOIN UserNotificationSettings uns ON uf.user_id = uns.user_id
WHERE uf.user_id = ?
    AND (? IS NULL OR cat.category_name = ?)
GROUP BY uf.favorite_id, cp.canonical_product_id, cp.product_title, cp.brand, cat.category_name, cp.master_image_url, uf.created_at, uns.notify_on_price_drop, uns.notify_on_anomaly
ORDER BY
    CASE WHEN ? = 'date_added' THEN uf.created_at END DESC,
    CASE WHEN ? = 'price_asc' THEN MIN(fpp.current_price) END ASC,
    CASE WHEN ? = 'price_desc' THEN MIN(fpp.current_price) END DESC,
    CASE WHEN ? = 'name' THEN cp.product_title END ASC
OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;
```

### 3. Add Product to Favorites

```http
POST /api/user/favorites
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "product_id": 1,
  "variant_id": 1,
  "target_price": 1100.0,
  "enable_alerts": true
}
```

**Response:**

```json
{
  "favorite_id": 123,
  "message": "Product added to favorites",
  "alerts_configured": true
}
```

### 4. Remove from Favorites

```http
DELETE /api/user/favorites/{favorite_id}
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Response:**

```json
{
  "message": "Product removed from favorites"
}
```

### 5. Update Favorite Settings

```http
PUT /api/user/favorites/{favorite_id}
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Request Body:**

```json
{
  "target_price": 1050.0,
  "enable_price_alerts": true,
  "enable_anomaly_alerts": false
}
```

**Response:**

```json
{
  "message": "Favorite settings updated",
  "favorite": {
    "favorite_id": 123,
    "target_price": 1050.0,
    "alerts_enabled": true
  }
}
```

### 6. User Activity History

```http
GET /api/user/activity
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `activity_type` (optional): "SEARCH", "PRODUCT_VIEW", "FAVORITE_ADD"
- `days` (optional): Number of days (default: 30)
- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 50)

**Response:**

```json
{
  "activities": [
    {
      "log_id": 1,
      "activity_type": "PRODUCT_VIEW",
      "product": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "image": "https://example.com/image.jpg"
      },
      "timestamp": "2025-08-06T10:15:00Z",
      "session_id": "session_abc123"
    },
    {
      "log_id": 2,
      "activity_type": "SEARCH",
      "search_query": "Samsung Galaxy",
      "timestamp": "2025-08-06T09:30:00Z",
      "session_id": "session_abc123"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 5,
    "total_items": 147
  },
  "activity_summary": {
    "total_searches": 45,
    "total_product_views": 89,
    "total_favorites_added": 13,
    "most_active_day": "Monday"
  }
}
```

**Implementation:**

```sql
-- User activity history
SELECT
    ual.log_id,
    ual.activity_type,
    ual.search_query,
    ual.activity_timestamp as timestamp,
    ual.session_id,
    cp.canonical_product_id as product_id,
    cp.product_title as product_name,
    cp.master_image_url as product_image
FROM UserActivityLog ual
LEFT JOIN DimVariant v ON ual.variant_id = v.variant_id
LEFT JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
WHERE ual.user_id = ?
    AND ual.activity_timestamp >= DATEADD(day, -?, GETDATE())
    AND (? IS NULL OR ual.activity_type = ?)
ORDER BY ual.activity_timestamp DESC
OFFSET ? ROWS FETCH NEXT ? ROWS ONLY;
```

### 7. Notification Settings

```http
GET /api/user/notification-settings
PUT /api/user/notification-settings
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**GET Response:**

```json
{
  "settings": {
    "notify_on_price_drop": true,
    "notify_on_anomaly": false,
    "price_drop_threshold_percent": 10,
    "receive_weekly_report": true,
    "weekly_report_day": "SUNDAY",
    "email_notifications": true,
    "push_notifications": false,
    "last_updated": "2025-08-01T10:00:00Z"
  }
}
```

**PUT Request Body:**

```json
{
  "notify_on_price_drop": true,
  "notify_on_anomaly": true,
  "price_drop_threshold_percent": 15,
  "receive_weekly_report": false,
  "weekly_report_day": "MONDAY",
  "email_notifications": true,
  "push_notifications": true
}
```

**PUT Response:**

```json
{
  "message": "Notification settings updated",
  "settings": {
    "notify_on_price_drop": true,
    "notify_on_anomaly": true,
    "price_drop_threshold_percent": 15,
    "receive_weekly_report": false,
    "email_notifications": true,
    "push_notifications": true
  }
}
```

### 8. Notification History

```http
GET /api/user/notifications
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `type` (optional): "PRICE_DROP", "ANOMALY", "WEEKLY_REPORT"
- `days` (optional): Number of days (default: 30)
- `status` (optional): "SENT", "FAILED"

**Response:**

```json
{
  "notifications": [
    {
      "log_id": 1,
      "notification_type": "PRICE_DROP",
      "product": {
        "id": 1,
        "name": "iPhone 15 Pro Max",
        "image": "https://example.com/image.jpg"
      },
      "content_summary": "Price dropped from $1299.99 to $1199.99 (7.7% off)",
      "status": "SENT",
      "sent_timestamp": "2025-08-06T09:15:00Z"
    }
  ],
  "summary": {
    "total_notifications": 45,
    "price_drop_alerts": 32,
    "anomaly_alerts": 8,
    "weekly_reports": 5
  }
}
```

### 9. Weekly Report Data

```http
GET /api/user/weekly-report
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `week_offset` (optional): Weeks back (default: 0 for current week)

**Response:**

```json
{
  "report_period": {
    "start_date": "2025-08-01",
    "end_date": "2025-08-07"
  },
  "summary": {
    "total_favorites": 25,
    "price_changes": 12,
    "new_anomalies": 3,
    "potential_savings": 234.5,
    "best_deal": {
      "product_name": "MacBook Pro",
      "savings": 200.0,
      "percentage": 8.0
    }
  },
  "price_changes": [
    {
      "product_name": "iPhone 15 Pro Max",
      "old_price": 1299.99,
      "new_price": 1199.99,
      "change": -100.0,
      "percentage": -7.7,
      "retailer": "TechMart"
    }
  ],
  "recommendations": [
    {
      "product_id": 10,
      "name": "Galaxy Watch 6",
      "price": 329.99,
      "reason": "Great deal on complementary product"
    }
  ]
}
```

### 10. Export User Data

```http
GET /api/user/export
```

**Headers:**

```
Authorization: Bearer <access_token>
```

**Query Parameters:**

- `format` (optional): "json", "csv" (default: "json")

**Response:**

```json
{
  "export_data": {
    "user_profile": {
      "user_id": 1,
      "email": "user@example.com",
      "full_name": "John Doe",
      "created_at": "2024-12-15T10:30:00Z"
    },
    "favorites": [
      {
        "product_name": "iPhone 15 Pro Max",
        "date_added": "2025-07-15T10:00:00Z",
        "current_price": 1199.99
      }
    ],
    "activity_summary": {
      "total_searches": 156,
      "total_product_views": 432,
      "total_favorites": 25
    },
    "notification_history": {
      "total_sent": 45,
      "price_drop_alerts": 32,
      "weekly_reports": 5
    }
  },
  "generated_at": "2025-08-06T10:30:00Z"
}
```

## Database Queries

### Favorite Products with Price Tracking

```sql
-- Complex query for favorite products with price analytics
WITH FavoritePrices AS (
    SELECT
        uf.favorite_id,
        uf.user_id,
        cp.canonical_product_id,
        cp.product_title,
        v.variant_id,
        s.shop_name,
        fpp.current_price,
        fpp.is_available,
        ROW_NUMBER() OVER (PARTITION BY cp.canonical_product_id ORDER BY fpp.current_price ASC) as price_rank
    FROM UserFavorites uf
    JOIN DimVariant v ON uf.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    WHERE uf.user_id = ?
        AND fpp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fpp.is_available = 1
),
PriceHistory AS (
    SELECT
        fp.canonical_product_id,
        AVG(fpp.current_price) as avg_price_30d,
        MIN(fpp.current_price) as lowest_price_30d,
        MAX(fpp.current_price) as highest_price_30d
    FROM FavoritePrices fp
    JOIN DimVariant v ON fp.canonical_product_id = v.canonical_product_id
    JOIN FactProductPrice fpp ON v.variant_id = fpp.variant_id
    JOIN DimDate dd ON fpp.date_id = dd.date_id
    WHERE dd.full_date >= DATEADD(day, -30, GETDATE())
    GROUP BY fp.canonical_product_id
)
SELECT
    fp.favorite_id,
    fp.canonical_product_id,
    fp.product_title,
    fp.current_price as best_current_price,
    fp.shop_name as best_retailer,
    ph.avg_price_30d,
    ph.lowest_price_30d,
    ph.highest_price_30d,
    CASE
        WHEN fp.current_price < ph.avg_price_30d THEN 'below_average'
        WHEN fp.current_price > ph.avg_price_30d THEN 'above_average'
        ELSE 'average'
    END as price_status
FROM FavoritePrices fp
JOIN PriceHistory ph ON fp.canonical_product_id = ph.canonical_product_id
WHERE fp.price_rank = 1
ORDER BY fp.current_price ASC;
```

## Performance Optimization

### Database Indexes

```sql
CREATE INDEX IX_UserFavorites_UserId_Created ON UserFavorites(user_id, created_at);
CREATE INDEX IX_UserActivityLog_UserId_Type_Timestamp ON UserActivityLog(user_id, activity_type, activity_timestamp);
CREATE INDEX IX_NotificationLog_UserId_Type_Timestamp ON NotificationLog(user_id, notification_type, sent_timestamp);
CREATE INDEX IX_UserNotificationSettings_UserId ON UserNotificationSettings(user_id);
```

### Caching Strategy

- `user:{id}:dashboard` - TTL: 15 minutes
- `user:{id}:favorites` - TTL: 30 minutes
- `user:{id}:settings` - TTL: 1 hour
- `user:{id}:activity` - TTL: 10 minutes

## Error Handling

### Unauthorized Access

```json
{
  "detail": "Authentication required",
  "error_code": "USER_001"
}
```

### Invalid Favorite

```json
{
  "detail": "Favorite not found or not owned by user",
  "error_code": "USER_002"
}
```

## Frontend Integration

The user dashboard and settings pages expect:

- Dashboard summary with stats and recent alerts
- Paginated favorites list with filtering
- Activity history with search/filter
- Notification settings form
- Real-time favorite status updates
- Price alert indicators
