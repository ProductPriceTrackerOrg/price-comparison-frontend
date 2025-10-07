# Buyer Central Backend Implementation Guide

This document provides comprehensive guidance for implementing the backend API for the Buyer Central features using Google BigQuery as the data warehouse.

## Overview

The Buyer Central backend provides APIs to support the following key functionalities:

1. **Price Comparison** - Compare prices across different retailers for specific products
2. **Buying Guides** - Information on optimal purchase timing and product selection

## Architecture

The backend implementation follows a layered architecture:

1. **API Layer** - FastAPI/Flask endpoints exposing the functionality
2. **Service Layer** - Business logic implementation
3. **Data Access Layer** - BigQuery queries and data retrieval

## Database Schema

We are using the following tables from the BigQuery data warehouse:

```sql
-- Dimension tables
price-pulse-470211.warehouse.DimCategory
price-pulse-470211.warehouse.DimDate
price-pulse-470211.warehouse.DimModel
price-pulse-470211.warehouse.DimProductImage
price-pulse-470211.warehouse.DimShop
price-pulse-470211.warehouse.DimShopProduct
price-pulse-470211.warehouse.DimVariant

-- Fact tables
price-pulse-470211.warehouse.FactPersonalizedRecommendation
price-pulse-470211.warehouse.FactPriceAnomaly
price-pulse-470211.warehouse.FactPriceForecast
price-pulse-470211.warehouse.FactProductMatch
price-pulse-470211.warehouse.FactProductPrice
price-pulse-470211.warehouse.FactProductRecommendation
```

## BigQuery Optimization Guidelines

When writing queries for BigQuery, follow these important guidelines:

1. **JOIN Predicates**: BigQuery does not allow using a subquery that returns a table or scalar inside a JOIN...ON clause directly. Subqueries in ON must be constants or literals, not a query referencing a table.

2. **Using Common Table Expressions (CTEs)**: BigQuery does not allow subqueries in JOIN predicates referencing other tables. Use CTEs instead and then join normally.

3. **CTEs in JOIN Conditions**: BigQuery does not allow a subquery that references a CTE inside a JOIN condition.

4. **Materialized Views**: Consider using materialized views for frequent complex queries to improve performance.

5. **Partition Pruning**: Design queries to take advantage of partitioned tables by filtering on partition columns.

6. **BigQuery ML**: For price forecasting and anomaly detection, leverage BigQuery ML rather than exporting data to external ML services.

## API Endpoints

### 1. Product Search API

This endpoint allows searching for products to compare prices.

**Endpoint**: `/api/buyer-central/search-products`

**Method**: `GET`

**Query Parameters**:

- `query` (string): The search query
- `limit` (integer, optional): Maximum number of results to return (default: 10)
- `category_id` (integer, optional): Filter by category ID

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "name": "iPhone 15 Pro Max 256GB",
      "brand": "Apple",
      "category": "Smartphones",
      "avgPrice": 1199,
      "image": "/placeholder.jpg"
    }
  ],
  "timestamp": "2025-10-06T14:32:45Z"
}
```

**BigQuery Implementation**:

```sql
WITH
  -- Get top matched products from the search term
  MatchedProducts AS (
    SELECT
      sp.shop_product_id,
      sp.product_title_native,
      sp.brand_native,
      c.category_name,
      pm.match_group_id
    FROM
      `price-pulse-470211.warehouse.DimShopProduct` sp
    JOIN
      `price-pulse-470211.warehouse.DimCategory` c
      ON sp.predicted_master_category_id = c.category_id
    JOIN
      `price-pulse-470211.warehouse.FactProductMatch` pm
      ON sp.shop_product_id = pm.shop_product_id
    WHERE
      LOWER(sp.product_title_native) LIKE CONCAT('%', LOWER(@query), '%')
      OR LOWER(sp.brand_native) LIKE CONCAT('%', LOWER(@query), '%')
    LIMIT 1000  -- Initial filter to process manageable data
  ),

  -- Get image URLs for the products
  ProductImages AS (
    SELECT
      shop_product_id,
      image_url
    FROM
      `price-pulse-470211.warehouse.DimProductImage`
    WHERE
      sort_order = 1 -- Primary images only
  ),

  -- Calculate average prices by match group
  AveragePrices AS (
    SELECT
      pm.match_group_id,
      AVG(pp.current_price) AS avg_price
    FROM
      `price-pulse-470211.warehouse.FactProductPrice` pp
    JOIN
      `price-pulse-470211.warehouse.DimVariant` v
      ON pp.variant_id = v.variant_id
    JOIN
      MatchedProducts pm
      ON v.shop_product_id = pm.shop_product_id
    WHERE
      pp.date_id = (
        SELECT MAX(date_id)
        FROM `price-pulse-470211.warehouse.FactProductPrice`
      )
    GROUP BY
      pm.match_group_id
  )

-- Final result combining all data
SELECT
  mp.match_group_id AS id,
  mp.product_title_native AS name,
  mp.brand_native AS brand,
  mp.category_name AS category,
  COALESCE(ap.avg_price, 0) AS avgPrice,
  pi.image_url AS image
FROM
  MatchedProducts mp
LEFT JOIN
  ProductImages pi
  ON mp.shop_product_id = pi.shop_product_id
LEFT JOIN
  AveragePrices ap
  ON mp.match_group_id = ap.match_group_id
WHERE
  (@category_id IS NULL OR mp.predicted_master_category_id = @category_id)
GROUP BY
  mp.match_group_id,
  mp.product_title_native,
  mp.brand_native,
  mp.category_name,
  ap.avg_price,
  pi.image_url
ORDER BY
  ap.avg_price IS NULL,
  ap.avg_price DESC
LIMIT
  @limit
```

### 2. Price Comparison API

This endpoint retrieves price comparison data across retailers for specific products.

**Endpoint**: `/api/buyer-central/price-comparison`

**Method**: `GET`

**Query Parameters**:

- `product_ids` (string): Comma-separated list of product IDs
- `limit` (integer, optional): Maximum number of retailers per product (default: 5)

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "productId": 1,
      "productName": "iPhone 15 Pro Max 256GB",
      "categoryName": "Smartphones",
      "averagePrice": 1199,
      "retailerPrices": [
        {
          "retailerId": 1,
          "retailerName": "TechMart",
          "price": 1149,
          "stockStatus": "in_stock",
          "rating": 4.8,
          "lastUpdated": "2025-10-05"
        }
      ],
      "priceHistory": {
        "priceChange": -3.2,
        "trend": "decreasing"
      }
    }
  ],
  "timestamp": "2025-10-06T14:32:45Z"
}
```

**BigQuery Implementation**:

```sql
-- Parse product IDs from comma-separated string
WITH
  ProductIDs AS (
    SELECT CAST(value AS INT64) as product_id
    FROM UNNEST(SPLIT(@product_ids, ',')) as value
  ),

  -- Get product info including latest prices
  ProductInfo AS (
    SELECT
      pm.match_group_id AS product_id,
      sp.product_title_native AS product_name,
      c.category_name,
      v.variant_id,
      s.shop_id AS retailer_id,
      s.shop_name AS retailer_name,
      pp.current_price AS price,
      pp.is_available,
      d.full_date AS price_date
    FROM
      `price-pulse-470211.warehouse.FactProductMatch` pm
    JOIN
      `price-pulse-470211.warehouse.DimShopProduct` sp
      ON pm.shop_product_id = sp.shop_product_id
    JOIN
      `price-pulse-470211.warehouse.DimCategory` c
      ON sp.predicted_master_category_id = c.category_id
    JOIN
      `price-pulse-470211.warehouse.DimVariant` v
      ON sp.shop_product_id = v.shop_product_id
    JOIN
      `price-pulse-470211.warehouse.DimShop` s
      ON sp.shop_id = s.shop_id
    JOIN
      `price-pulse-470211.warehouse.FactProductPrice` pp
      ON v.variant_id = pp.variant_id
    JOIN
      `price-pulse-470211.warehouse.DimDate` d
      ON pp.date_id = d.date_id
    JOIN
      ProductIDs p
      ON pm.match_group_id = p.product_id
    WHERE
      pp.date_id = (
        SELECT MAX(date_id)
        FROM `price-pulse-470211.warehouse.FactProductPrice`
      )
  ),

  -- Calculate average prices by product
  AvgPrices AS (
    SELECT
      product_id,
      AVG(price) AS avg_price
    FROM
      ProductInfo
    GROUP BY
      product_id
  ),

  -- Calculate price history trends
  PriceHistory AS (
    SELECT
      pi.product_id,
      (
        (AVG(current.price) - AVG(previous.price)) / AVG(previous.price)
      ) * 100 AS price_change,
      CASE
        WHEN (AVG(current.price) - AVG(previous.price)) < -1 THEN 'decreasing'
        WHEN (AVG(current.price) - AVG(previous.price)) > 1 THEN 'increasing'
        ELSE 'stable'
      END AS trend
    FROM
      ProductInfo pi
    JOIN
      `price-pulse-470211.warehouse.FactProductPrice` current
      ON pi.variant_id = current.variant_id
    JOIN
      `price-pulse-470211.warehouse.DimDate` current_date
      ON current.date_id = current_date.date_id
    JOIN
      `price-pulse-470211.warehouse.FactProductPrice` previous
      ON pi.variant_id = previous.variant_id
    JOIN
      `price-pulse-470211.warehouse.DimDate` previous_date
      ON previous.date_id = previous_date.date_id
    WHERE
      current_date.full_date = (
        SELECT MAX(full_date)
        FROM `price-pulse-470211.warehouse.DimDate`
      )
      AND previous_date.full_date = (
        SELECT MAX(full_date)
        FROM `price-pulse-470211.warehouse.DimDate`
        WHERE full_date < (SELECT MAX(full_date) FROM `price-pulse-470211.warehouse.DimDate`)
                AND full_date >= DATE_SUB(
                  (SELECT MAX(full_date) FROM `price-pulse-470211.warehouse.DimDate`),
                  INTERVAL 30 DAY
                )
      )
    GROUP BY
      pi.product_id
  )

-- Final result with structured response
SELECT
  pi.product_id AS productId,
  MAX(pi.product_name) AS productName,
  MAX(pi.category_name) AS categoryName,
  ap.avg_price AS averagePrice,
  ARRAY_AGG(
    STRUCT(
      pi.retailer_id,
      pi.retailer_name,
      pi.price,
      CASE
        WHEN pi.is_available = TRUE THEN 'in_stock'
        ELSE 'out_of_stock'
      END AS stockStatus,
      4.5 AS rating, -- Placeholder; would be from actual ratings table
      FORMAT_DATE('%Y-%m-%d', pi.price_date) AS lastUpdated
    )
    ORDER BY pi.price ASC
    LIMIT @limit
  ) AS retailerPrices,
  STRUCT(
    COALESCE(ph.price_change, 0) AS priceChange,
    COALESCE(ph.trend, 'stable') AS trend
  ) AS priceHistory
FROM
  ProductInfo pi
JOIN
  AvgPrices ap
  ON pi.product_id = ap.product_id
LEFT JOIN
  PriceHistory ph
  ON pi.product_id = ph.product_id
GROUP BY
  pi.product_id,
  ap.avg_price,
  ph.price_change,
  ph.trend
ORDER BY
  pi.product_id
```

### 3. Buying Guides Categories API

This endpoint retrieves categories for buying guides.

**Endpoint**: `/api/buyer-central/buying-guides`

**Method**: `GET`

**Response**:

```json
{
  "success": true,
  "data": [
    {
      "categoryId": 1,
      "categoryName": "Smartphones",
      "description": "Complete guides for choosing the perfect smartphone",
      "icon": "📱",
      "guideCount": 12,
      "avgProductPrice": 899,
      "popularBrands": ["Apple", "Samsung", "Google"]
    }
  ],
  "timestamp": "2025-10-06T14:32:45Z"
}
```

**BigQuery Implementation**:

```sql
-- Get category information
WITH
  CategoryStats AS (
    SELECT
      c.category_id,
      c.category_name,
      COUNT(DISTINCT pm.match_group_id) AS product_count,
      AVG(pp.current_price) AS avg_price
    FROM
      `price-pulse-470211.warehouse.DimCategory` c
    JOIN
      `price-pulse-470211.warehouse.DimShopProduct` sp
      ON c.category_id = sp.predicted_master_category_id
    JOIN
      `price-pulse-470211.warehouse.FactProductMatch` pm
      ON sp.shop_product_id = pm.shop_product_id
    JOIN
      `price-pulse-470211.warehouse.DimVariant` v
      ON sp.shop_product_id = v.shop_product_id
    JOIN
      `price-pulse-470211.warehouse.FactProductPrice` pp
      ON v.variant_id = pp.variant_id
    WHERE
      pp.date_id = (
        SELECT MAX(date_id)
        FROM `price-pulse-470211.warehouse.FactProductPrice`
      )
    GROUP BY
      c.category_id,
      c.category_name
  ),

  -- Get popular brands for each category
  CategoryBrands AS (
    SELECT
      sp.predicted_master_category_id AS category_id,
      sp.brand_native,
      COUNT(DISTINCT sp.shop_product_id) AS product_count
    FROM
      `price-pulse-470211.warehouse.DimShopProduct` sp
    WHERE
      sp.brand_native IS NOT NULL
    GROUP BY
      sp.predicted_master_category_id,
      sp.brand_native
  ),

  TopBrands AS (
    SELECT
      category_id,
      ARRAY_AGG(brand_native ORDER BY product_count DESC LIMIT 3) AS popular_brands
    FROM (
      SELECT
        category_id,
        brand_native,
        product_count,
        ROW_NUMBER() OVER (PARTITION BY category_id ORDER BY product_count DESC) AS rank
      FROM
        CategoryBrands
    )
    WHERE
      rank <= 3
    GROUP BY
      category_id
  )

-- Final result
SELECT
  cs.category_id AS categoryId,
  cs.category_name AS categoryName,
  CASE
    WHEN cs.category_name = 'Smartphones' THEN 'Complete guides for choosing the perfect smartphone'
    WHEN cs.category_name = 'Laptops' THEN 'Expert advice for laptop purchases'
    WHEN cs.category_name = 'Audio' THEN 'Find the best headphones and speakers'
    WHEN cs.category_name = 'Smart Watches' THEN 'Everything you need to know about smart watches'
    ELSE CONCAT('Buying guides for ', cs.category_name)
  END AS description,
  CASE
    WHEN cs.category_name = 'Smartphones' THEN '📱'
    WHEN cs.category_name = 'Laptops' THEN '💻'
    WHEN cs.category_name = 'Audio' THEN '🎧'
    WHEN cs.category_name = 'Smart Watches' THEN '⌚'
    WHEN cs.category_name = 'Cameras' THEN '📷'
    WHEN cs.category_name = 'Tablets' THEN '📱'
    WHEN cs.category_name = 'Gaming' THEN '🎮'
    ELSE '📦'
  END AS icon,
  FLOOR(SQRT(cs.product_count) * 2) AS guideCount, -- Simulated guide count
  cs.avg_price AS avgProductPrice,
  tb.popular_brands AS popularBrands
FROM
  CategoryStats cs
JOIN
  TopBrands tb
  ON cs.category_id = tb.category_id
ORDER BY
  cs.product_count DESC
LIMIT 10
```

## Implementation Recommendations

### 1. Caching Strategy

To optimize performance and reduce BigQuery costs:

1. Implement an in-memory cache (Redis) for frequently accessed data like:

   - Product search results
   - Price comparison for popular products
   - Buying guide categories

2. Set appropriate TTLs (time-to-live) for different data types:

   - Product search: 1 hour
   - Price comparison: 4 hours
   - Category information: 24 hours

3. Implement a background job to refresh cache for popular items proactively

### 2. Data Processing Pipeline

For the best performance of the Buyer Central features:

1. **Pre-aggregation**: Create materialized views or scheduled queries in BigQuery to pre-aggregate:

   - Daily average prices by product
   - Best retailers by category
   - Price trends and volatility metrics

2. **Price Trend Analysis**:

   - Implement BigQuery ML models for price forecasting
   - Create scheduled jobs to update price trend analysis daily
   - Store results in dedicated tables for faster access

3. **Data Freshness**:
   - Set up a real-time data pipeline for critical price updates
   - Use batch processing for historical analysis and trends

### 3. Error Handling

Implement comprehensive error handling for the BigQuery operations:

1. **Retry Mechanism**:

   - Implement exponential backoff for failed queries
   - Handle quota limits gracefully

2. **Fallback Strategy**:

   - When BigQuery is unavailable or returns errors, serve cached data
   - Clearly indicate to users when data might be stale

3. **Monitoring**:
   - Set up alerts for failed queries, slow response times, and high costs
   - Track BigQuery usage metrics to optimize cost

## Development and Deployment

### Local Development

1. Set up a local development environment with:

   - Python 3.9+ with FastAPI or Flask
   - BigQuery client libraries
   - Docker for containerization

2. Use BigQuery emulator or a staging project for development

### Deployment

1. **Containerization**:

   - Package the API service using Docker
   - Use multi-stage builds to minimize container size

2. **CI/CD Pipeline**:

   - Implement automated tests for API endpoints
   - Set up continuous deployment to staging and production environments

3. **Monitoring and Logging**:
   - Configure structured logging
   - Set up monitoring for API performance and BigQuery costs

## Conclusion

This implementation guide provides a comprehensive approach to building the backend for the Buyer Central features using BigQuery. By following these guidelines and optimizations, you can create a performant and cost-effective solution that delivers valuable price comparison and buying guide information to users.

Key points to remember:

- Use CTEs instead of subqueries in JOIN conditions
- Implement appropriate caching strategies
- Consider materialized views for frequent complex queries
- Monitor BigQuery costs and optimize queries accordingly
