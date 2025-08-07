# Analytics Implementation - FastAPI Backend Guide

## Overview

This document outlines the required FastAPI backend implementation for the `/analytics` page. The analytics section provides market insights for common users (non-authenticated) focusing on general market trends, category performance, and retailer comparisons.

## Database Schema Analysis

Based on your provided database schema, the analytics endpoints will primarily query these tables:

### Data Warehouse (Analytical Storage)

- `FactProductPrice` - Daily price and availability data
- `DimCanonicalProduct` - Master product information
- `DimVariant` - Product variants per retailer
- `DimCategory` - Product categories
- `DimShop` - Retailer information
- `DimDate` - Date dimension for time-based analysis
- `FactPriceAnomaly` - Anomaly detection results (public aggregated data only)

## Required API Endpoints

### 1. Market Overview Endpoint

```
GET /api/analytics/market-overview
```

**Query Parameters:**

- `time_range`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `category`: string (optional, filter by category)
- `retailer`: string (optional, filter by retailer)

**Response Type:**

```typescript
{
  success: boolean;
  data: {
    totalProducts: number;
    totalCategories: number;
    totalRetailers: number;
    averagePriceChange: number;
    totalPriceDrops: number;
    totalPriceIncreases: number;
    marketVolatility: number;
    lastUpdated: string;
  }
  timestamp: string;
}
```

**SQL Query Logic:**

```sql
-- Total products and retailers
SELECT
    COUNT(DISTINCT cp.canonical_product_id) as totalProducts,
    COUNT(DISTINCT v.shop_id) as totalRetailers,
    COUNT(DISTINCT cp.category_id) as totalCategories
FROM DimCanonicalProduct cp
JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
JOIN DimShop s ON v.shop_id = s.shop_id;

-- Price changes and volatility (last 30 days)
WITH PriceChanges AS (
    SELECT
        v.variant_id,
        LAG(fp.current_price) OVER (PARTITION BY v.variant_id ORDER BY d.full_date) as prev_price,
        fp.current_price,
        d.full_date
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimDate d ON fp.date_id = d.date_id
    WHERE d.full_date >= DATEADD(day, -30, GETDATE())
)
SELECT
    AVG(((current_price - prev_price) / prev_price) * 100) as averagePriceChange,
    STDEV(((current_price - prev_price) / prev_price) * 100) as marketVolatility,
    SUM(CASE WHEN current_price < prev_price THEN 1 ELSE 0 END) as totalPriceDrops,
    SUM(CASE WHEN current_price > prev_price THEN 1 ELSE 0 END) as totalPriceIncreases
FROM PriceChanges
WHERE prev_price IS NOT NULL;
```

### 2. Price Trends Endpoint

```
GET /api/analytics/price-trends
```

**Query Parameters:**

- `time_range`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `category`: string (optional)
- `retailer`: string (optional)
- `granularity`: "daily" | "weekly" | "monthly" (default: "weekly")

**Response Type:**

```typescript
{
  success: boolean;
  data: Array<{
    date: string;
    avgPriceChange: number;
    totalChanges: number;
    volatility: number;
  }>;
  metadata: {
    totalRecords: number;
    dateRange: {
      start: string;
      end: string;
    }
  }
}
```

**SQL Query Logic:**

```sql
WITH WeeklyTrends AS (
    SELECT
        DATEPART(week, d.full_date) as week_num,
        YEAR(d.full_date) as year,
        MIN(d.full_date) as week_start,
        v.variant_id,
        FIRST_VALUE(fp.current_price) OVER (
            PARTITION BY v.variant_id, DATEPART(week, d.full_date), YEAR(d.full_date)
            ORDER BY d.full_date ASC
        ) as week_start_price,
        LAST_VALUE(fp.current_price) OVER (
            PARTITION BY v.variant_id, DATEPART(week, d.full_date), YEAR(d.full_date)
            ORDER BY d.full_date ASC
            ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING
        ) as week_end_price
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimDate d ON fp.date_id = d.date_id
    WHERE d.full_date >= DATEADD(day, -30, GETDATE())
)
SELECT
    week_start as date,
    AVG(((week_end_price - week_start_price) / week_start_price) * 100) as avgPriceChange,
    COUNT(*) as totalChanges,
    STDEV(((week_end_price - week_start_price) / week_start_price) * 100) as volatility
FROM WeeklyTrends
WHERE week_start_price > 0
GROUP BY week_start, week_num, year
ORDER BY week_start;
```

### 3. Category Performance Endpoint

```
GET /api/analytics/category-performance
```

**Query Parameters:**

- `time_range`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `limit`: number (default: 10)
- `sort_by`: "price_change" | "total_products" | "price_drops" (default: "price_change")

**Response Type:**

```typescript
{
  success: boolean;
  data: Array<{
    categoryName: string;
    totalProducts: number;
    avgPriceChange: number;
    priceDrops: number;
    priceIncreases: number;
  }>;
}
```

**SQL Query Logic:**

```sql
WITH CategoryStats AS (
    SELECT
        c.category_name,
        v.variant_id,
        LAG(fp.current_price) OVER (PARTITION BY v.variant_id ORDER BY d.full_date) as prev_price,
        fp.current_price,
        d.full_date
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimCategory c ON cp.category_id = c.category_id
    JOIN DimDate d ON fp.date_id = d.date_id
    WHERE d.full_date >= DATEADD(day, -30, GETDATE())
)
SELECT
    category_name as categoryName,
    COUNT(DISTINCT variant_id) as totalProducts,
    AVG(((current_price - prev_price) / prev_price) * 100) as avgPriceChange,
    SUM(CASE WHEN current_price < prev_price THEN 1 ELSE 0 END) as priceDrops,
    SUM(CASE WHEN current_price > prev_price THEN 1 ELSE 0 END) as priceIncreases
FROM CategoryStats
WHERE prev_price IS NOT NULL
GROUP BY category_name
ORDER BY ABS(AVG(((current_price - prev_price) / prev_price) * 100)) DESC;
```

### 4. Retailer Insights Endpoint

```
GET /api/analytics/retailer-insights
```

**Query Parameters:**

- `time_range`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `category`: string (optional)
- `limit`: number (default: 10)

**Response Type:**

```typescript
{
  success: boolean;
  data: Array<{
    retailerName: string;
    totalProducts: number;
    avgPriceChange: number;
    competitiveRating: number;
    marketShare: number;
  }>;
}
```

**SQL Query Logic:**

```sql
WITH RetailerStats AS (
    SELECT
        s.shop_name,
        v.variant_id,
        LAG(fp.current_price) OVER (PARTITION BY v.variant_id ORDER BY d.full_date) as prev_price,
        fp.current_price
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimShop s ON v.shop_id = s.shop_id
    JOIN DimDate d ON fp.date_id = d.date_id
    WHERE d.full_date >= DATEADD(day, -30, GETDATE())
),
TotalProducts AS (
    SELECT COUNT(DISTINCT variant_id) as total_market_products
    FROM DimVariant
)
SELECT
    rs.shop_name as retailerName,
    COUNT(DISTINCT rs.variant_id) as totalProducts,
    AVG(((rs.current_price - rs.prev_price) / rs.prev_price) * 100) as avgPriceChange,
    -- Competitive rating based on price competitiveness (simplified)
    10 - (ABS(AVG(((rs.current_price - rs.prev_price) / rs.prev_price) * 100)) / 2) as competitiveRating,
    (COUNT(DISTINCT rs.variant_id) * 100.0 / tp.total_market_products) as marketShare
FROM RetailerStats rs
CROSS JOIN TotalProducts tp
WHERE rs.prev_price IS NOT NULL
GROUP BY rs.shop_name, tp.total_market_products
ORDER BY marketShare DESC;
```

### 5. Market Anomalies Endpoint

```
GET /api/analytics/market-anomalies
```

**Query Parameters:**

- `time_range`: "7d" | "30d" | "90d" | "1y" (default: "30d")
- `anomaly_type`: string (optional)

**Response Type:**

```typescript
{
  success: boolean;
  data: {
    totalAnomalies: number;
    significantDrops: number;
    significantIncreases: number;
    highVolatilityProducts: number;
    averageAnomalyScore: number;
    topAnomalyCategory: string;
  }
}
```

**SQL Query Logic:**

```sql
WITH AnomalyStats AS (
    SELECT
        pa.anomaly_id,
        pa.anomaly_score,
        pa.anomaly_type,
        c.category_name,
        CASE
            WHEN pa.anomaly_type LIKE '%DROP%' THEN 'drop'
            WHEN pa.anomaly_type LIKE '%INCREASE%' THEN 'increase'
            ELSE 'volatility'
        END as movement_type
    FROM FactPriceAnomaly pa
    JOIN FactProductPrice fp ON pa.price_fact_id = fp.price_fact_id
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimCategory c ON cp.category_id = c.category_id
    JOIN DimDate d ON fp.date_id = d.date_id
    WHERE d.full_date >= DATEADD(day, -30, GETDATE())
)
SELECT
    COUNT(*) as totalAnomalies,
    SUM(CASE WHEN movement_type = 'drop' THEN 1 ELSE 0 END) as significantDrops,
    SUM(CASE WHEN movement_type = 'increase' THEN 1 ELSE 0 END) as significantIncreases,
    SUM(CASE WHEN movement_type = 'volatility' THEN 1 ELSE 0 END) as highVolatilityProducts,
    AVG(anomaly_score) as averageAnomalyScore,
    (
        SELECT TOP 1 category_name
        FROM AnomalyStats
        GROUP BY category_name
        ORDER BY COUNT(*) DESC
    ) as topAnomalyCategory
FROM AnomalyStats;
```

## FastAPI Implementation Structure

### 1. Router Setup

```python
from fastapi import APIRouter, Depends, Query
from typing import Optional, Literal
from datetime import datetime, timedelta

router = APIRouter(prefix="/api/analytics", tags=["analytics"])

@router.get("/market-overview")
async def get_market_overview(
    time_range: Literal["7d", "30d", "90d", "1y"] = "30d",
    category: Optional[str] = None,
    retailer: Optional[str] = None,
    db: Session = Depends(get_db)
):
    # Implementation here
    pass
```

### 2. Database Connection

```python
from sqlalchemy.orm import Session
from sqlalchemy import text

def execute_analytics_query(db: Session, query: str, params: dict = None):
    """Execute analytics queries with proper error handling"""
    try:
        result = db.execute(text(query), params or {})
        return result.fetchall()
    except Exception as e:
        logger.error(f"Analytics query failed: {e}")
        raise HTTPException(status_code=500, detail="Analytics data unavailable")
```

### 3. Response Models

```python
from pydantic import BaseModel
from typing import List, Optional

class MarketOverviewResponse(BaseModel):
    totalProducts: int
    totalCategories: int
    totalRetailers: int
    averagePriceChange: float
    totalPriceDrops: int
    totalPriceIncreases: int
    marketVolatility: float
    lastUpdated: str

class PriceTrendData(BaseModel):
    date: str
    avgPriceChange: float
    totalChanges: int
    volatility: float

class CategoryPerformance(BaseModel):
    categoryName: str
    totalProducts: int
    avgPriceChange: float
    priceDrops: int
    priceIncreases: int
```

### 4. Caching Strategy

```python
from functools import lru_cache
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache

@cache(expire=3600)  # Cache for 1 hour
async def get_cached_market_overview(time_range: str, category: str, retailer: str):
    # Expensive database operations here
    pass
```

### 5. Error Handling

```python
from fastapi import HTTPException
import logging

logger = logging.getLogger(__name__)

async def safe_analytics_operation(operation_func, *args, **kwargs):
    try:
        return await operation_func(*args, **kwargs)
    except Exception as e:
        logger.error(f"Analytics operation failed: {e}")
        raise HTTPException(
            status_code=500,
            detail="Analytics service temporarily unavailable"
        )
```

## Performance Considerations

### 1. Indexing Strategy

```sql
-- Recommended indexes for analytics queries
CREATE INDEX IX_FactProductPrice_DateVariant ON FactProductPrice(date_id, variant_id);
CREATE INDEX IX_FactProductPrice_DatePrice ON FactProductPrice(date_id, current_price);
CREATE INDEX IX_DimVariant_ShopCategory ON DimVariant(shop_id, canonical_product_id);
CREATE INDEX IX_FactPriceAnomaly_Date ON FactPriceAnomaly(created_at);
```

### 2. Query Optimization

- Use appropriate date ranges to limit data scope
- Implement pagination for large result sets
- Use materialized views for frequently accessed aggregations
- Consider pre-calculating daily/weekly summaries

### 3. Caching Strategy

- Cache expensive aggregations for 1-4 hours
- Use Redis for distributed caching
- Implement cache invalidation on data updates
- Cache static data (categories, retailers) for longer periods

## Security Considerations

### 1. Rate Limiting

```python
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address

limiter = Limiter(key_func=get_remote_address)

@router.get("/market-overview")
@limiter.limit("30/minute")  # 30 requests per minute
async def get_market_overview(request: Request, ...):
    pass
```

### 2. Data Privacy

- Only return aggregated data (no individual user data)
- Exclude sensitive retailer-specific information
- Implement data anonymization for competitive data

## Testing Strategy

### 1. Unit Tests

```python
import pytest
from fastapi.testclient import TestClient

def test_market_overview_endpoint():
    response = client.get("/api/analytics/market-overview?time_range=7d")
    assert response.status_code == 200
    data = response.json()
    assert "totalProducts" in data["data"]
    assert data["data"]["totalProducts"] > 0
```

### 2. Load Testing

- Test with realistic data volumes
- Verify response times under load
- Test caching effectiveness

## Deployment Notes

### 1. Environment Variables

```env
DATABASE_URL=your_warehouse_connection_string
REDIS_URL=your_redis_connection_string
ANALYTICS_CACHE_TTL=3600
LOG_LEVEL=INFO
```

### 2. Monitoring

- Set up alerts for query performance degradation
- Monitor cache hit rates
- Track API usage patterns
- Monitor database connection pool usage

This implementation provides a robust analytics backend that aligns with your database schema and provides valuable market insights for users visiting your PricePulse platform.
