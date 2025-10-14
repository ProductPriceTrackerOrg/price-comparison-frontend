# Backend Implementation Guide for User-Centric Analytics

This guide provides a comprehensive approach to implementing the backend services needed for the user-focused analytics features. It details the API endpoints, data transformations, and database queries required to support the frontend analytics components.

## Table of Contents

1. [Frontend Optimizations](#frontend-optimizations)
2. [Architecture Overview](#architecture-overview)
3. [Data Access Layer](#data-access-layer)
4. [API Endpoints](#api-endpoints)
5. [Data Transformation Services](#data-transformation-services)
6. [Caching Strategy](#caching-strategy)
7. [Performance Considerations](#performance-considerations)

## Frontend Optimizations

The frontend components have been optimized to enhance user experience, improve performance, and reduce visual clutter. These optimizations should be considered when implementing backend services to ensure proper data delivery.

### 1. Redundancy Elimination

- **Tab-specific Content**: Each tab now displays unique content instead of repeating the same components
- **Component Specialization**: Components are tailored to their specific tabs, reducing duplicate data requests
- **Information Hierarchy**: The main analytics page layout is reorganized for better information flow

### 2. Visual Enhancements

- **Pie Chart Optimization**:

  - Eliminated overlapping labels in pie charts
  - Added separate legends with percentage calculations
  - Improved color contrast and readability

- **Chart Axis Improvements**:

  - Added proper spacing and margins to chart axes
  - Reduced font sizes for axis labels (now 10px)
  - Limited tick counts to prevent crowding
  - Added truncation for long category names
  - Optimized bar sizes for better proportion

- **Streamlined Alerts Display**:
  - Compact version for the overview tab with limited entries (3 max)
  - Tab-specific contextual information instead of repeated alerts
  - Clearer visual hierarchy

### 3. Backend Support Requirements

The backend should support these optimizations by:

- Enabling efficient partial data loading for tab-specific views
- Supporting pagination and data limiting for compact displays
- Providing data transformation options for different visualization needs

## Architecture Overview

The analytics backend architecture follows a modular approach with these key components:

- **API Layer**: REST endpoints that the frontend components call
- **Service Layer**: Business logic and data processing
- **Data Access Layer**: SQL queries to extract and aggregate data from the warehouse
- **Caching Layer**: For performance optimization and reduced load on the data warehouse

### Technology Stack

- Node.js/Express.js for the API server
- Google BigQuery client for accessing the data warehouse
- Redis for caching frequently accessed data

## Data Access Layer

This section provides the SQL queries needed to extract data from your warehouse schema.

### 1. Price History Data

```sql
-- For PriceTrends component
-- Parameters: category_id (optional), shop_id (optional), time_range (7d, 30d, 90d, 1y)

WITH date_range AS (
  SELECT date_id, full_date
  FROM `price-pulse-470211.warehouse.DimDate`
  WHERE full_date >= DATE_SUB(CURRENT_DATE(), INTERVAL [time_range_value] DAY)
),
category_filter AS (
  SELECT variant_id
  FROM `price-pulse-470211.warehouse.DimShopProduct` sp
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON sp.shop_product_id = v.shop_product_id
  WHERE [category_filter_condition]
),
shop_filter AS (
  SELECT v.variant_id
  FROM `price-pulse-470211.warehouse.DimShopProduct` sp
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON sp.shop_product_id = v.shop_product_id
  JOIN `price-pulse-470211.warehouse.DimShop` s ON sp.shop_id = s.shop_id
  WHERE [shop_filter_condition]
),
daily_prices AS (
  SELECT
    d.full_date as date,
    AVG(pp.current_price) as avg_price,
    MIN(pp.current_price) as lowest_price,
    COUNT(CASE WHEN pp.current_price < LAG(pp.current_price)
               OVER(PARTITION BY pp.variant_id ORDER BY d.full_date) THEN 1 END) as price_drops
  FROM `price-pulse-470211.warehouse.FactProductPrice` pp
  JOIN date_range d ON pp.date_id = d.date_id
  JOIN category_filter cf ON pp.variant_id = cf.variant_id
  JOIN shop_filter sf ON pp.variant_id = sf.variant_id
  WHERE pp.is_available = TRUE
  GROUP BY d.full_date
  ORDER BY d.full_date
)
SELECT
  date,
  avg_price,
  lowest_price,
  price_drops,
  -- Logic to determine if it's a good time to buy
  CASE WHEN price_drops > (SELECT AVG(price_drops) * 1.5 FROM daily_prices)
       THEN TRUE ELSE FALSE END as is_good_time_to_buy
FROM daily_prices
```

### 2. Category Insights

```sql
-- For CategoryInsights component
-- Parameters: time_range (7d, 30d, 90d, 1y), shop_id (optional)

WITH category_stats AS (
  SELECT
    c.category_id,
    c.category_name,
    COUNT(DISTINCT v.variant_id) as product_count,
    AVG(current_pp.current_price) as current_avg_price,
    AVG(
      CASE WHEN historical_pp.current_price IS NOT NULL
      THEN (current_pp.current_price - historical_pp.current_price) / historical_pp.current_price * 100
      ELSE 0 END
    ) as price_change_pct,
    -- Calculate price volatility as standard deviation / average
    STDDEV(daily_pp.current_price) / AVG(daily_pp.current_price) as price_volatility,
    COUNT(CASE WHEN current_pp.current_price < historical_pp.current_price THEN 1 END) as deal_count
  FROM `price-pulse-470211.warehouse.DimCategory` c
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON c.category_id = sp.predicted_master_category_id
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON sp.shop_product_id = v.shop_product_id
  JOIN `price-pulse-470211.warehouse.DimShop` s ON sp.shop_id = s.shop_id
  -- Current prices (today)
  JOIN `price-pulse-470211.warehouse.FactProductPrice` current_pp
    ON v.variant_id = current_pp.variant_id
    AND current_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = CURRENT_DATE()
    )
  -- Historical prices (for comparison)
  LEFT JOIN `price-pulse-470211.warehouse.FactProductPrice` historical_pp
    ON v.variant_id = historical_pp.variant_id
    AND historical_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = DATE_SUB(CURRENT_DATE(), INTERVAL [time_range_value] DAY)
    )
  -- Daily prices (for volatility)
  JOIN `price-pulse-470211.warehouse.FactProductPrice` daily_pp
    ON v.variant_id = daily_pp.variant_id
    JOIN `price-pulse-470211.warehouse.DimDate` d ON daily_pp.date_id = d.date_id
    AND d.full_date BETWEEN DATE_SUB(CURRENT_DATE(), INTERVAL [time_range_value] DAY) AND CURRENT_DATE()
  WHERE
    current_pp.is_available = TRUE
    [shop_filter_condition]
  GROUP BY c.category_id, c.category_name
)
SELECT
  category_name,
  current_avg_price as avg_price,
  price_change_pct as price_change,
  price_volatility as price_volatility,
  product_count,
  deal_count
FROM category_stats
ORDER BY deal_count DESC
LIMIT 10
```

### 3. Shop Comparison

```sql
-- For ShopComparison component
-- Parameters: category_id (optional), time_range (7d, 30d, 90d, 1y)

WITH shop_stats AS (
  SELECT
    s.shop_id,
    s.shop_name,
    COUNT(DISTINCT v.variant_id) as product_count,
    -- Price competitiveness rating (100 scale)
    100 - (AVG(pp.current_price) /
      (SELECT AVG(pp2.current_price)
       FROM `price-pulse-470211.warehouse.FactProductPrice` pp2
       WHERE pp2.date_id = (SELECT date_id FROM `price-pulse-470211.warehouse.DimDate` WHERE full_date = CURRENT_DATE())
       AND pp2.variant_id = pp.variant_id) * 100) as price_rating,
    -- Reliability score based on consistent inventory
    (COUNT(CASE WHEN pp.is_available = TRUE THEN 1 END) * 100.0 /
      COUNT(pp.variant_id)) as reliability_score,
    -- Availability percentage
    (SUM(CASE WHEN pp.is_available = TRUE THEN 1 ELSE 0 END) * 100.0 /
      COUNT(pp.variant_id)) as availability_percentage
  FROM `price-pulse-470211.warehouse.DimShop` s
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON s.shop_id = sp.shop_id
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON sp.shop_product_id = v.shop_product_id
  JOIN `price-pulse-470211.warehouse.FactProductPrice` pp
    ON v.variant_id = pp.variant_id
    AND pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = CURRENT_DATE()
    )
  WHERE
    [category_filter_condition]
  GROUP BY s.shop_id, s.shop_name
),
best_categories AS (
  SELECT
    s.shop_id,
    c.category_name,
    ROW_NUMBER() OVER (PARTITION BY s.shop_id ORDER BY COUNT(*) DESC) as category_rank
  FROM `price-pulse-470211.warehouse.DimShop` s
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON s.shop_id = sp.shop_id
  JOIN `price-pulse-470211.warehouse.DimCategory` c ON sp.predicted_master_category_id = c.category_id
  WHERE
    [time_range_condition]
  GROUP BY s.shop_id, c.category_name
)
SELECT
  ss.shop_name,
  ss.product_count,
  ss.price_rating as avg_price_rating,
  ss.reliability_score,
  ss.availability_percentage,
  ARRAY_AGG(bc.category_name ORDER BY bc.category_rank LIMIT 3) as best_categories
FROM shop_stats ss
LEFT JOIN best_categories bc ON ss.shop_id = bc.shop_id AND bc.category_rank <= 3
GROUP BY ss.shop_name, ss.product_count, ss.price_rating, ss.reliability_score, ss.availability_percentage
ORDER BY ss.price_rating DESC
LIMIT 10
```

### 4. Price Alerts

```sql
-- For PriceAlerts component
-- Parameters: category_id (optional), shop_id (optional), limit (default 10)

WITH recent_anomalies AS (
  SELECT
    pa.anomaly_id,
    pa.anomaly_type,
    pa.price_fact_id,
    pa.anomaly_score,
    v.variant_id,
    sp.shop_product_id,
    pa.created_at as detected_date
  FROM `price-pulse-470211.warehouse.FactPriceAnomaly` pa
  JOIN `price-pulse-470211.warehouse.FactProductPrice` pp ON pa.price_fact_id = pp.price_fact_id
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON pp.variant_id = v.variant_id
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON v.shop_product_id = sp.shop_product_id
  WHERE
    pa.created_at >= TIMESTAMP_SUB(CURRENT_TIMESTAMP(), INTERVAL 14 DAY)
    AND pa.anomaly_score >= 0.7
    [category_filter_condition]
    [shop_filter_condition]
  ORDER BY pa.anomaly_score DESC
  LIMIT 100
),
alert_details AS (
  SELECT
    ra.anomaly_id,
    sp.product_title_native as product_title,
    COALESCE((SELECT image_url FROM `price-pulse-470211.warehouse.DimProductImage`
              WHERE shop_product_id = sp.shop_product_id
              ORDER BY sort_order ASC LIMIT 1), 'placeholder.jpg') as image_url,
    historical_pp.current_price as original_price,
    current_pp.current_price as current_price,
    ((current_pp.current_price - historical_pp.current_price) / historical_pp.current_price) * 100 as percentage_change,
    s.shop_name,
    FORMAT_TIMESTAMP('%Y-%m-%d', ra.detected_date) as detected_date,
    CONCAT('/product/', CAST(sp.shop_product_id AS STRING)) as product_url,
    CASE
      WHEN ra.anomaly_type = 'PRICE_DROP' THEN 'price_drop'
      WHEN ra.anomaly_type = 'FLASH_SALE' THEN 'flash_sale'
      WHEN ra.anomaly_type = 'BACK_IN_STOCK' THEN 'back_in_stock'
      ELSE 'unusual_discount'
    END as type
  FROM recent_anomalies ra
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON ra.shop_product_id = sp.shop_product_id
  JOIN `price-pulse-470211.warehouse.DimShop` s ON sp.shop_id = s.shop_id
  JOIN `price-pulse-470211.warehouse.FactProductPrice` current_pp
    ON ra.variant_id = current_pp.variant_id
    AND current_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = CURRENT_DATE()
    )
  JOIN `price-pulse-470211.warehouse.FactProductPrice` historical_pp
    ON ra.variant_id = historical_pp.variant_id
    AND historical_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = DATE_SUB(CURRENT_DATE(), INTERVAL 14 DAY)
    )
  WHERE current_pp.is_available = TRUE
)
SELECT
  TO_JSON_STRING(ad) as price_alert
FROM alert_details ad
ORDER BY detected_date DESC, ABS(percentage_change) DESC
LIMIT [limit_value]
```

### 5. Market Summary

```sql
-- For MarketSummary component
-- Parameters: category_id (optional), shop_id (optional), time_range (7d, 30d, 90d, 1y)

WITH market_metrics AS (
  SELECT
    COUNT(DISTINCT v.variant_id) as total_products,
    COUNT(DISTINCT sp.shop_id) as total_shops,
    AVG(
      CASE WHEN historical_pp.current_price IS NOT NULL
      THEN (current_pp.current_price - historical_pp.current_price) / historical_pp.current_price * 100
      ELSE 0 END
    ) as avg_price_change,
    (COUNT(CASE WHEN current_pp.current_price < historical_pp.current_price THEN 1 END) * 100.0 /
      COUNT(v.variant_id)) as price_drop_percentage
  FROM `price-pulse-470211.warehouse.DimVariant` v
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON v.shop_product_id = sp.shop_product_id
  -- Current prices (today)
  JOIN `price-pulse-470211.warehouse.FactProductPrice` current_pp
    ON v.variant_id = current_pp.variant_id
    AND current_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = CURRENT_DATE()
    )
  -- Historical prices (for comparison)
  LEFT JOIN `price-pulse-470211.warehouse.FactProductPrice` historical_pp
    ON v.variant_id = historical_pp.variant_id
    AND historical_pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = DATE_SUB(CURRENT_DATE(), INTERVAL [time_range_value] DAY)
    )
  WHERE
    current_pp.is_available = TRUE
    [category_filter_condition]
    [shop_filter_condition]
),
category_distribution AS (
  SELECT
    c.category_name,
    COUNT(DISTINCT v.variant_id) as product_count,
    ROW_NUMBER() OVER (ORDER BY COUNT(DISTINCT v.variant_id) DESC) as category_rank
  FROM `price-pulse-470211.warehouse.DimCategory` c
  JOIN `price-pulse-470211.warehouse.DimShopProduct` sp ON c.category_id = sp.predicted_master_category_id
  JOIN `price-pulse-470211.warehouse.DimVariant` v ON sp.shop_product_id = v.shop_product_id
  JOIN `price-pulse-470211.warehouse.FactProductPrice` pp
    ON v.variant_id = pp.variant_id
    AND pp.date_id = (
      SELECT date_id FROM `price-pulse-470211.warehouse.DimDate`
      WHERE full_date = CURRENT_DATE()
    )
  WHERE
    pp.is_available = TRUE
    [shop_filter_condition]
  GROUP BY c.category_name
)
SELECT
  mm.total_products,
  mm.total_shops,
  mm.avg_price_change,
  mm.price_drop_percentage,
  -- Calculate buying score based on price drops and availability
  CASE
    WHEN mm.avg_price_change < -5 AND mm.price_drop_percentage > 40 THEN 85
    WHEN mm.avg_price_change < -3 AND mm.price_drop_percentage > 30 THEN 75
    WHEN mm.avg_price_change < 0 THEN 65
    WHEN mm.avg_price_change < 3 THEN 45
    ELSE 30
  END as best_buying_score,
  ARRAY_AGG(
    STRUCT(
      cd.category_name as name,
      cd.product_count as value,
      CASE
        WHEN cd.category_rank = 1 THEN '#3B82F6'
        WHEN cd.category_rank = 2 THEN '#10B981'
        WHEN cd.category_rank = 3 THEN '#F59E0B'
        WHEN cd.category_rank = 4 THEN '#EF4444'
        ELSE '#8B5CF6'
      END as color
    )
    ORDER BY cd.category_rank ASC
    LIMIT 5
  ) as category_distribution
FROM market_metrics mm, category_distribution cd
WHERE cd.category_rank <= 5
GROUP BY mm.total_products, mm.total_shops, mm.avg_price_change, mm.price_drop_percentage
```

## API Endpoints

The backend should expose these RESTful endpoints:

### 1. GET /api/analytics/price-history

Provides historical price data for the PriceTrends component. Note that this endpoint now serves multiple views with different data presentation requirements.

**Query Parameters:**

- `timeRange`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `category`: Category ID or "all" (default: "all")
- `retailer`: Shop ID or "all" (default: "all")
- `view`: "detailed" | "compact" (default: "detailed") - Controls data granularity based on display context

**Response:**

```json
{
  "priceHistory": [
    {
      "date": "2025-09-07",
      "avgPrice": 899,
      "lowestPrice": 849,
      "priceDrops": 12,
      "isGoodTimeToBuy": false
    }
    // ...more data points
  ],
  "bestTimeToBuy": {
    "recommendation": "Consider buying now. Prices have been trending downward recently.",
    "confidence": 75
  }
}
```

### 2. GET /api/analytics/category-insights

Provides category performance metrics for the CategoryInsights component.

**Query Parameters:**

- `timeRange`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `retailer`: Shop ID or "all" (default: "all")

**Response:**

```json
{
  "insights": [
    {
      "categoryName": "Smartphones",
      "avgPrice": 799,
      "priceChange": -8.4,
      "priceVolatility": 0.32,
      "productCount": 1250,
      "dealCount": 85
    }
    // ...more categories
  ]
}
```

### 3. GET /api/analytics/shop-comparison

Provides retailer comparison data for the ShopComparison component.

**Query Parameters:**

- `category`: Category ID or "all" (default: "all")
- `timeRange`: "7d" | "30d" | "90d" | "1y" (default: "30d")

**Response:**

```json
{
  "insights": [
    {
      "shopName": "TechMart",
      "productCount": 4250,
      "avgPriceRating": 87,
      "reliabilityScore": 92,
      "availabilityPercentage": 94,
      "bestCategories": ["Smartphones", "Laptops"]
    }
    // ...more shops
  ]
}
```

### 4. GET /api/analytics/price-alerts

Provides significant price changes and anomalies for the PriceAlerts component. This endpoint now supports compact display formats for the overview tab and more detailed formats for dedicated views.

**Query Parameters:**

- `category`: Category ID or "all" (default: "all")
- `retailer`: Shop ID or "all" (default: "all")
- `limit`: Number of alerts to return (default: 10, max: 50)
- `format`: "compact" | "detailed" (default: "detailed")
  - "compact": Returns minimal data for each alert (title, image, percentage, id)
  - "detailed": Returns full alert information

**Response:**

```json
{
  "alerts": [
    {
      "id": "alert-1",
      "productTitle": "Samsung Galaxy S26 Ultra - 512GB - Phantom Black",
      "imageUrl": "/placeholder.jpg",
      "originalPrice": 1299,
      "currentPrice": 1099,
      "percentageChange": -15.4,
      "shopName": "TechMart",
      "detectedDate": "2025-10-06",
      "productUrl": "/product/samsung-galaxy-s26-ultra",
      "type": "price_drop"
    }
    // ...more alerts
  ]
}
```

### 5. GET /api/analytics/market-summary

Provides market overview data for the MarketSummary component. This endpoint now supports optimized pie chart data with simplified labels and legend information.

**Query Parameters:**

- `category`: Category ID or "all" (default: "all")
- `retailer`: Shop ID or "all" (default: "all")
- `timeRange`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `maxCategories`: Number of distinct categories to return in distribution (default: 5, max: 10)
  - Additional categories are grouped as "Other" to prevent visual clutter

**Response:**

```json
{
  "summary": {
    "totalProducts": 450000,
    "totalShops": 47,
    "averagePriceChange": -3.2,
    "priceDropPercentage": 38,
    "bestBuyingScore": 72,
    "categoryDistribution": [
      { "name": "Smartphones", "value": 45000, "color": "#3B82F6" }
      // ...more categories
    ]
  }
}
```

## Data Transformation Services

This section outlines the service layer that sits between the data access and API layers.

### 1. Price History Service

```javascript
// priceHistoryService.js

const { BigQuery } = require("@google-cloud/bigquery");
const bigquery = new BigQuery();
const cache = require("../utils/cache");

async function getPriceHistory(filters) {
  const cacheKey = `price_history:${filters.timeRange}:${filters.category}:${filters.retailer}`;
  const cachedData = await cache.get(cacheKey);

  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Build SQL query with filter conditions
  let query = `[BASE_PRICE_HISTORY_QUERY]`.replace(
    "[time_range_value]",
    getTimeRangeValue(filters.timeRange)
  );

  if (filters.category !== "all") {
    query = query.replace(
      "[category_filter_condition]",
      `sp.predicted_master_category_id = ${filters.category}`
    );
  } else {
    query = query.replace("[category_filter_condition]", "TRUE");
  }

  if (filters.retailer !== "all") {
    query = query.replace(
      "[shop_filter_condition]",
      `s.shop_id = ${filters.retailer}`
    );
  } else {
    query = query.replace("[shop_filter_condition]", "TRUE");
  }

  const [rows] = await bigquery.query({ query });

  // Transform data as needed
  const priceHistory = rows.map((row) => ({
    date: row.date,
    avgPrice: parseFloat(row.avg_price),
    lowestPrice: parseFloat(row.lowest_price),
    priceDrops: parseInt(row.price_drops, 10),
    isGoodTimeToBuy: row.is_good_time_to_buy,
  }));

  // Generate buying recommendation
  const bestTimeToBuy = generateBuyingRecommendation(priceHistory);

  // Apply view-specific transformations
  let formattedPriceHistory = priceHistory;
  if (filters.view === "compact") {
    // For compact view, reduce data points to prevent overcrowding
    formattedPriceHistory = downsampleData(priceHistory, 5);
  }

  const result = {
    priceHistory: formattedPriceHistory,
    bestTimeToBuy,
  };

  // Cache for 1 hour
  await cache.set(cacheKey, JSON.stringify(result), 3600);

  return result;
}

function generateBuyingRecommendation(priceHistory) {
  // Logic to determine best time to buy based on price trends
  // Similar to the frontend implementation but with more sophisticated analysis
  // ...
}

function getTimeRangeValue(timeRange) {
  switch (timeRange) {
    case "7d":
      return 7;
    case "90d":
      return 90;
    case "1y":
      return 365;
    default:
      return 30; // 30d is default
  }
}

// Helper function to reduce data points for compact views
function downsampleData(data, targetPoints) {
  if (data.length <= targetPoints) {
    return data;
  }

  const result = [];
  const step = Math.floor(data.length / targetPoints);

  for (let i = 0; i < data.length; i += step) {
    result.push(data[i]);
  }

  // Ensure we always include the most recent data point
  if (result[result.length - 1] !== data[data.length - 1]) {
    result.push(data[data.length - 1]);
  }

  return result;
}

module.exports = {
  getPriceHistory,
};
```

### 2-5. Other Services

Implement similar service patterns for the remaining data components (categoryInsightsService, shopComparisonService, etc.), following the same structure as above.

## Caching Strategy

Implement a Redis-based caching system to reduce load on BigQuery and improve response times:

```javascript
// cache.js

const redis = require("redis");
const { promisify } = require("util");
const client = redis.createClient(process.env.REDIS_URL);

const getAsync = promisify(client.get).bind(client);
const setAsync = promisify(client.set).bind(client);
const expireAsync = promisify(client.expire).bind(client);

module.exports = {
  async get(key) {
    return await getAsync(key);
  },

  async set(key, value, expiry = 3600) {
    await setAsync(key, value);
    await expireAsync(key, expiry);
  },
};
```

### Cache Invalidation Strategy

1. **Time-based expiration**: Set reasonable TTLs based on data volatility

   - Price history: 1 hour
   - Category insights: 3 hours
   - Shop comparisons: 6 hours
   - Market summary: 3 hours
   - Price alerts: 15 minutes (most time-sensitive)

2. **Forced refresh**: Implement an admin API to force cache invalidation after significant data imports

## Performance Considerations

1. **Query Optimization**

   - Use partitioned tables in BigQuery where possible
   - Pre-compute aggregations for common time periods
   - Create materialized views for frequent queries
   - Optimize queries for specific display formats (compact vs. detailed)

2. **Data Volume Management**

   - Implement pagination for large result sets
   - Use data sampling for trend analysis on massive datasets
   - Apply adaptive downsampling based on view requirements:
     - Fewer data points for overview displays
     - Full resolution for dedicated analysis views
   - Truncate text values (like category names) at the database level for efficiency

3. **Frontend-Specific Optimizations**

   - Generate pre-calculated legend data for pie charts
   - Limit category distribution data to prevent overcrowding
   - Provide truncated text values with tooltips for full information
   - Support variable chart axis configurations to prevent overlap

4. **Scaling Strategy**
   - Implement horizontal scaling for the API layer
   - Consider read replicas or data marts for analytics-specific queries
   - Separate high-frequency endpoints (like price alerts) into dedicated services
   - Cache specialized views separately to optimize for different display contexts

## Deployment and Monitoring

1. **Deployment**

   - Use containerization (Docker) for consistent environments
   - Implement blue-green deployment for zero downtime updates
   - Set up CI/CD pipelines for automated testing and deployment

2. **Monitoring**

   - Track query performance and optimize slow queries
   - Monitor API response times and error rates
   - Set up alerts for abnormal patterns or system failures
   - Track rendering performance and client-side response times
   - Monitor chart rendering times across different devices

3. **Cost Management**
   - Implement BigQuery best practices to reduce costs
   - Monitor API usage patterns and optimize high-traffic endpoints
   - Consider implementing usage quotas for different client types
   - Use adaptive data loading based on device capabilities

## UI Optimization Support

The backend should provide specific support for the UI optimizations implemented in the frontend:

1. **Redundancy Prevention**

   - Support conditional field selection to load only needed data for each view
   - Enable tab-specific endpoints for optimized data loading
   - Provide configuration options to control data granularity

2. **Chart Optimization Support**

   - Offer server-side text truncation for axis labels
   - Pre-calculate legend data for pie charts to avoid client-side processing
   - Support variable tick counts based on viewport size
   - Provide optimization hints for client rendering

3. **Responsive Data Support**
   - Detect client capabilities and adapt data density accordingly
   - Support progressive loading for detailed views
   - Enable partial updates for real-time data without full reloads
