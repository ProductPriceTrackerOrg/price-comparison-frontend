# Buyer Central API Implementation Guide

This document provides comprehensive API endpoints for the Buyer Central features, including buying guides, market insights, smart alerts, and price comparison functionality.

## Overview

The Buyer Central API provides endpoints for buyer-focused features that help users make informed purchasing decisions through guides, alerts, and intelligent price comparisons.

## Database Schema Integration

### Core Tables Used

#### User & Operational Database

- **Users**: User management and preferences
- **UserPreferences**: Alert settings and notification preferences
- **UserWatchlist**: Tracked products for alerts
- **PriceAlerts**: User-configured price alerts
- **UserSessions**: Session management for personalized features

#### Data Warehouse

- **FactProductPrice**: Current and historical pricing data
- **DimCanonicalProduct**: Product information and details
- **DimVariant**: Product variants and specifications
- **DimCategory**: Product categorization
- **DimShop**: Retailer information
- **FactPriceAnomaly**: Price change anomalies and alerts
- **DimTimeMonth**: Temporal data for trend analysis

## API Endpoints

### 1. Buying Guides Management

#### GET /api/buyer-central/buying-guides

Get all buying guides with categories and featured content.

```python
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List, Optional
import json

@app.get("/api/buyer-central/buying-guides")
async def get_buying_guides(
    category_id: Optional[int] = None,
    featured_only: bool = False,
    db: Session = Depends(get_db)
):
    """
    Retrieve buying guides with optional filtering.

    Query includes:
    - Category-specific guides
    - Featured guides
    - Quick tips and recommendations
    """

    query = """
    SELECT
        bg.guide_id,
        bg.title,
        bg.description,
        bg.content,
        bg.difficulty_level,
        bg.estimated_read_time,
        bg.author,
        bg.created_date,
        bg.updated_date,
        bg.is_featured,
        c.category_id,
        c.category_name,
        COUNT(bgr.rating) as rating_count,
        AVG(bgr.rating) as average_rating
    FROM BuyingGuides bg
    JOIN DimCategory c ON bg.category_id = c.category_id
    LEFT JOIN BuyingGuideRatings bgr ON bg.guide_id = bgr.guide_id
    WHERE 1=1
    """

    params = {}

    if category_id:
        query += " AND bg.category_id = :category_id"
        params["category_id"] = category_id

    if featured_only:
        query += " AND bg.is_featured = true"

    query += """
    GROUP BY bg.guide_id, bg.title, bg.description, bg.content,
             bg.difficulty_level, bg.estimated_read_time, bg.author,
             bg.created_date, bg.updated_date, bg.is_featured,
             c.category_id, c.category_name
    ORDER BY bg.is_featured DESC, bg.created_date DESC
    """

    result = db.execute(text(query), params)
    guides = []

    for row in result:
        guides.append({
            "guideId": row.guide_id,
            "title": row.title,
            "description": row.description,
            "content": row.content,
            "difficultyLevel": row.difficulty_level,
            "estimatedReadTime": row.estimated_read_time,
            "author": row.author,
            "createdDate": row.created_date.isoformat(),
            "updatedDate": row.updated_date.isoformat(),
            "isFeatured": row.is_featured,
            "categoryId": row.category_id,
            "categoryName": row.category_name,
            "rating": {
                "average": float(row.average_rating) if row.average_rating else 0,
                "count": row.rating_count
            }
        })

    return {
        "success": True,
        "data": guides,
        "total": len(guides)
    }
```

#### GET /api/buyer-central/buying-guides/{guide_id}

Get detailed information for a specific buying guide.

```python
@app.get("/api/buyer-central/buying-guides/{guide_id}")
async def get_buying_guide_details(
    guide_id: int,
    db: Session = Depends(get_db)
):
    """
    Get detailed buying guide with related products and tips.
    """

    # Get guide details
    guide_query = """
    SELECT
        bg.*,
        c.category_name,
        AVG(bgr.rating) as average_rating,
        COUNT(bgr.rating) as rating_count
    FROM BuyingGuides bg
    JOIN DimCategory c ON bg.category_id = c.category_id
    LEFT JOIN BuyingGuideRatings bgr ON bg.guide_id = bgr.guide_id
    WHERE bg.guide_id = :guide_id
    GROUP BY bg.guide_id, c.category_name
    """

    # Get related products
    products_query = """
    SELECT
        p.canonical_product_id,
        p.product_name,
        p.description,
        v.variant_id,
        v.variant_name,
        v.specifications,
        MIN(fp.price) as min_price,
        MAX(fp.price) as max_price,
        AVG(fp.price) as avg_price
    FROM BuyingGuideProducts bgp
    JOIN DimCanonicalProduct p ON bgp.product_id = p.canonical_product_id
    JOIN DimVariant v ON p.canonical_product_id = v.canonical_product_id
    JOIN FactProductPrice fp ON v.variant_id = fp.variant_id
    WHERE bgp.guide_id = :guide_id
    AND fp.date_key = (SELECT MAX(date_key) FROM FactProductPrice)
    GROUP BY p.canonical_product_id, p.product_name, p.description,
             v.variant_id, v.variant_name, v.specifications
    ORDER BY bgp.display_order
    """

    guide_result = db.execute(text(guide_query), {"guide_id": guide_id})
    guide_row = guide_result.first()

    if not guide_row:
        raise HTTPException(status_code=404, detail="Buying guide not found")

    products_result = db.execute(text(products_query), {"guide_id": guide_id})

    return {
        "success": True,
        "data": {
            "guide": {
                "guideId": guide_row.guide_id,
                "title": guide_row.title,
                "description": guide_row.description,
                "content": guide_row.content,
                "difficultyLevel": guide_row.difficulty_level,
                "estimatedReadTime": guide_row.estimated_read_time,
                "author": guide_row.author,
                "categoryName": guide_row.category_name,
                "rating": {
                    "average": float(guide_row.average_rating) if guide_row.average_rating else 0,
                    "count": guide_row.rating_count
                }
            },
            "relatedProducts": [
                {
                    "productId": row.canonical_product_id,
                    "productName": row.product_name,
                    "description": row.description,
                    "variantId": row.variant_id,
                    "variantName": row.variant_name,
                    "specifications": json.loads(row.specifications) if row.specifications else {},
                    "priceRange": {
                        "min": float(row.min_price),
                        "max": float(row.max_price),
                        "average": float(row.avg_price)
                    }
                }
                for row in products_result
            ]
        }
    }
```

### 2. Market Insights and Intelligence

#### GET /api/buyer-central/market-insights

Get comprehensive market intelligence data.

```python
@app.get("/api/buyer-central/market-insights")
async def get_market_insights(
    category_id: Optional[int] = None,
    time_period: str = "30d",
    db: Session = Depends(get_db)
):
    """
    Get market insights including price forecasts, volatility analysis, and retailer comparisons.
    """

    # Price forecasting query
    forecast_query = """
    WITH price_trends AS (
        SELECT
            p.canonical_product_id,
            p.product_name,
            c.category_name,
            fp.price,
            fp.date_key,
            LAG(fp.price, 7) OVER (PARTITION BY p.canonical_product_id ORDER BY fp.date_key) as price_7d_ago,
            LAG(fp.price, 30) OVER (PARTITION BY p.canonical_product_id ORDER BY fp.date_key) as price_30d_ago
        FROM FactProductPrice fp
        JOIN DimVariant v ON fp.variant_id = v.variant_id
        JOIN DimCanonicalProduct p ON v.canonical_product_id = p.canonical_product_id
        JOIN DimCategory c ON p.category_id = c.category_id
        WHERE fp.date_key >= DATEADD(day, -90, GETDATE())
    )
    SELECT
        canonical_product_id,
        product_name,
        category_name,
        price as current_price,
        price_7d_ago,
        price_30d_ago,
        CASE
            WHEN price_7d_ago IS NOT NULL
            THEN ((price - price_7d_ago) / price_7d_ago) * 100
            ELSE 0
        END as price_change_7d,
        CASE
            WHEN price_30d_ago IS NOT NULL
            THEN ((price - price_30d_ago) / price_30d_ago) * 100
            ELSE 0
        END as price_change_30d
    FROM price_trends
    WHERE date_key = (SELECT MAX(date_key) FROM FactProductPrice)
    """

    # Volatility analysis
    volatility_query = """
    SELECT
        c.category_name,
        COUNT(*) as product_count,
        AVG(price_volatility.volatility_score) as avg_volatility,
        MIN(price_volatility.volatility_score) as min_volatility,
        MAX(price_volatility.volatility_score) as max_volatility
    FROM (
        SELECT
            p.canonical_product_id,
            p.category_id,
            STDEV(fp.price) / AVG(fp.price) * 100 as volatility_score
        FROM FactProductPrice fp
        JOIN DimVariant v ON fp.variant_id = v.variant_id
        JOIN DimCanonicalProduct p ON v.canonical_product_id = p.canonical_product_id
        WHERE fp.date_key >= DATEADD(day, -30, GETDATE())
        GROUP BY p.canonical_product_id, p.category_id
        HAVING COUNT(*) >= 10
    ) price_volatility
    JOIN DimCategory c ON price_volatility.category_id = c.category_id
    GROUP BY c.category_name
    ORDER BY avg_volatility DESC
    """

    # Retailer performance
    retailer_query = """
    SELECT
        s.shop_name,
        COUNT(DISTINCT v.canonical_product_id) as product_count,
        AVG(fp.price) as avg_price,
        MIN(fp.price) as min_price,
        MAX(fp.price) as max_price,
        COUNT(*) as total_listings,
        RANK() OVER (ORDER BY AVG(fp.price) ASC) as price_rank,
        RANK() OVER (ORDER BY COUNT(DISTINCT v.canonical_product_id) DESC) as selection_rank
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimShop s ON fp.shop_id = s.shop_id
    WHERE fp.date_key = (SELECT MAX(date_key) FROM FactProductPrice)
    GROUP BY s.shop_id, s.shop_name
    HAVING COUNT(DISTINCT v.canonical_product_id) >= 10
    ORDER BY price_rank, selection_rank
    """

    params = {}

    if category_id:
        forecast_query += " AND c.category_id = :category_id"
        params["category_id"] = category_id

    forecast_result = db.execute(text(forecast_query), params)
    volatility_result = db.execute(text(volatility_query))
    retailer_result = db.execute(text(retailer_query))

    return {
        "success": True,
        "data": {
            "priceForecasts": [
                {
                    "productId": row.canonical_product_id,
                    "productName": row.product_name,
                    "categoryName": row.category_name,
                    "currentPrice": float(row.current_price),
                    "priceChange7d": float(row.price_change_7d) if row.price_change_7d else 0,
                    "priceChange30d": float(row.price_change_30d) if row.price_change_30d else 0,
                    "prediction": "stable" if abs(row.price_change_7d or 0) < 2 else
                                "increasing" if (row.price_change_7d or 0) > 0 else "decreasing"
                }
                for row in forecast_result
            ],
            "volatilityAnalysis": [
                {
                    "categoryName": row.category_name,
                    "productCount": row.product_count,
                    "averageVolatility": float(row.avg_volatility),
                    "volatilityRange": {
                        "min": float(row.min_volatility),
                        "max": float(row.max_volatility)
                    },
                    "riskLevel": "high" if row.avg_volatility > 15 else
                               "medium" if row.avg_volatility > 8 else "low"
                }
                for row in volatility_result
            ],
            "retailerComparisons": [
                {
                    "retailerName": row.shop_name,
                    "productCount": row.product_count,
                    "averagePrice": float(row.avg_price),
                    "priceRange": {
                        "min": float(row.min_price),
                        "max": float(row.max_price)
                    },
                    "priceRank": row.price_rank,
                    "selectionRank": row.selection_rank,
                    "competitivenessScore": max(0, 100 - (row.price_rank * 10))
                }
                for row in retailer_result
            ]
        }
    }
```

### 3. Smart Alerts System

#### GET /api/buyer-central/alerts

Get user's active smart alerts.

```python
@app.get("/api/buyer-central/alerts")
async def get_smart_alerts(
    user_id: int,
    alert_type: Optional[str] = None,
    active_only: bool = True,
    db: Session = Depends(get_db)
):
    """
    Retrieve user's smart alerts with filtering options.
    """

    query = """
    SELECT
        pa.alert_id,
        pa.alert_type,
        pa.title,
        pa.description,
        pa.threshold_value,
        pa.comparison_operator,
        pa.is_active,
        pa.created_date,
        pa.last_triggered,
        pa.trigger_count,
        pa.urgency_level,
        pa.valid_until,
        c.category_name,
        COUNT(apt.product_id) as related_product_count
    FROM PriceAlerts pa
    LEFT JOIN DimCategory c ON pa.category_id = c.category_id
    LEFT JOIN AlertProductTargets apt ON pa.alert_id = apt.alert_id
    WHERE pa.user_id = :user_id
    """

    params = {"user_id": user_id}

    if alert_type:
        query += " AND pa.alert_type = :alert_type"
        params["alert_type"] = alert_type

    if active_only:
        query += " AND pa.is_active = true AND (pa.valid_until IS NULL OR pa.valid_until > GETDATE())"

    query += """
    GROUP BY pa.alert_id, pa.alert_type, pa.title, pa.description,
             pa.threshold_value, pa.comparison_operator, pa.is_active,
             pa.created_date, pa.last_triggered, pa.trigger_count,
             pa.urgency_level, pa.valid_until, c.category_name
    ORDER BY pa.urgency_level DESC, pa.created_date DESC
    """

    result = db.execute(text(query), params)

    alerts = []
    for row in result:
        # Determine urgency based on alert type and recent triggers
        urgency = "low"
        if row.alert_type in ["price_drop", "stock_alert"] and row.trigger_count > 0:
            urgency = "high"
        elif row.trigger_count > 5:
            urgency = "medium"

        alerts.append({
            "alertId": row.alert_id,
            "alertType": row.alert_type,
            "title": row.title,
            "description": row.description,
            "urgency": urgency,
            "categoryName": row.category_name,
            "isActive": row.is_active,
            "createdDate": row.created_date.isoformat(),
            "lastTriggered": row.last_triggered.isoformat() if row.last_triggered else None,
            "triggerCount": row.trigger_count,
            "validUntil": row.valid_until.isoformat() if row.valid_until else None,
            "relatedProducts": [],  # Can be populated with additional query
            "actionRequired": row.trigger_count > 0 and row.alert_type in ["price_drop", "stock_alert"]
        })

    return {
        "success": True,
        "data": alerts,
        "total": len(alerts)
    }
```

#### POST /api/buyer-central/alerts

Create a new smart alert.

```python
@app.post("/api/buyer-central/alerts")
async def create_smart_alert(
    alert_data: dict,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Create a new smart alert for price drops, stock changes, etc.
    """

    insert_query = """
    INSERT INTO PriceAlerts (
        user_id, alert_type, title, description, category_id,
        threshold_value, comparison_operator, is_active,
        urgency_level, valid_until, created_date
    ) VALUES (
        :user_id, :alert_type, :title, :description, :category_id,
        :threshold_value, :comparison_operator, true,
        :urgency_level, :valid_until, GETDATE()
    )
    """

    params = {
        "user_id": user_id,
        "alert_type": alert_data["alertType"],
        "title": alert_data["title"],
        "description": alert_data.get("description", ""),
        "category_id": alert_data.get("categoryId"),
        "threshold_value": alert_data.get("thresholdValue"),
        "comparison_operator": alert_data.get("comparisonOperator", "<="),
        "urgency_level": alert_data.get("urgencyLevel", "medium"),
        "valid_until": alert_data.get("validUntil")
    }

    result = db.execute(text(insert_query), params)
    alert_id = result.lastrowid

    # Add specific products if provided
    if "productIds" in alert_data:
        product_insert = """
        INSERT INTO AlertProductTargets (alert_id, product_id)
        VALUES (:alert_id, :product_id)
        """

        for product_id in alert_data["productIds"]:
            db.execute(text(product_insert), {
                "alert_id": alert_id,
                "product_id": product_id
            })

    db.commit()

    return {
        "success": True,
        "data": {
            "alertId": alert_id,
            "message": "Alert created successfully"
        }
    }
```

### 4. Price Comparison Engine

#### GET /api/buyer-central/search-products

Search for products to add to price comparison.

```python
@app.get("/api/buyer-central/search-products")
async def search_products_for_comparison(
    query: str,
    category_id: Optional[int] = None,
    min_price: Optional[float] = None,
    max_price: Optional[float] = None,
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Search for products to add to price comparison with real-time suggestions.
    """

    if len(query) < 2:
        return {
            "success": False,
            "message": "Query must be at least 2 characters long",
            "data": []
        }

    search_query = """
    SELECT
        cp.canonical_product_id,
        cp.product_title,
        cp.brand,
        cp.description,
        cp.master_image_url,
        cat.category_name,
        AVG(fp.price) as avg_price,
        MIN(fp.price) as min_price,
        MAX(fp.price) as max_price,
        COUNT(DISTINCT fp.shop_id) as retailer_count,
        -- Calculate search relevance score
        (
            CASE WHEN cp.product_title LIKE :exact_query THEN 100 ELSE 0 END +
            CASE WHEN cp.brand LIKE :exact_query THEN 80 ELSE 0 END +
            CASE WHEN cp.product_title LIKE :partial_query THEN 60 ELSE 0 END +
            CASE WHEN cp.brand LIKE :partial_query THEN 40 ELSE 0 END +
            CASE WHEN cp.description LIKE :partial_query THEN 20 ELSE 0 END
        ) as relevance_score
    FROM DimCanonicalProduct cp
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    JOIN FactProductPrice fp ON v.variant_id = fp.variant_id
    WHERE fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    AND fp.is_available = 1
    AND (
        cp.product_title LIKE :partial_query OR
        cp.brand LIKE :partial_query OR
        cp.description LIKE :partial_query
    )
    """

    # Build query parameters
    exact_query = f"%{query}%"
    partial_query = f"%{query}%"
    params = {
        "exact_query": exact_query,
        "partial_query": partial_query
    }

    # Add filters
    if category_id:
        search_query += " AND cat.category_id = :category_id"
        params["category_id"] = category_id

    if min_price:
        search_query += " AND fp.price >= :min_price"
        params["min_price"] = min_price

    if max_price:
        search_query += " AND fp.price <= :max_price"
        params["max_price"] = max_price

    search_query += """
    GROUP BY cp.canonical_product_id, cp.product_title, cp.brand,
             cp.description, cp.master_image_url, cat.category_name
    HAVING COUNT(DISTINCT fp.shop_id) >= 2  -- At least 2 retailers
    AND relevance_score > 0
    ORDER BY relevance_score DESC, retailer_count DESC
    LIMIT :limit
    """

    params["limit"] = limit

    result = db.execute(text(search_query), params)

    products = []
    for row in result:
        products.append({
            "id": row.canonical_product_id,
            "name": row.product_title,
            "brand": row.brand,
            "category": row.category_name,
            "description": row.description[:100] + "..." if row.description and len(row.description) > 100 else row.description,
            "image": row.master_image_url,
            "pricing": {
                "avgPrice": float(row.avg_price),
                "minPrice": float(row.min_price),
                "maxPrice": float(row.max_price),
                "priceRange": float(row.max_price - row.min_price)
            },
            "retailerCount": row.retailer_count,
            "relevanceScore": row.relevance_score
        })

    return {
        "success": True,
        "data": products,
        "total": len(products),
        "query": query
    }
```

#### GET /api/buyer-central/price-comparison

Get comprehensive price comparison data across retailers for the same products.

```python
@app.get("/api/buyer-central/price-comparison")
async def get_price_comparison(
    product_ids: Optional[str] = None,
    category_id: Optional[int] = None,
    include_history: bool = False,
    comparison_type: str = "same_product", # "same_product" or "similar_products"
    db: Session = Depends(get_db)
):
    """
    Get price comparison data across multiple retailers with history and recommendations.
    Focus on comparing the SAME products across different retailers for better buying decisions.
    """

    # Enhanced query for same product comparison across retailers
    base_query = """
    WITH product_retailer_matrix AS (
        SELECT
            cp.canonical_product_id,
            cp.product_name,
            cat.category_name,
            v.variant_id,
            s.shop_id,
            s.shop_name,
            s.rating as shop_rating,
            s.contact_phone,
            s.contact_whatsapp,
            fp.price as current_price,
            fp.is_available as stock_status,
            fp.date_id as last_updated,
            -- Calculate if this is the best price for this product
            ROW_NUMBER() OVER (PARTITION BY cp.canonical_product_id ORDER BY fp.price ASC) as price_rank,
            -- Get average price for this product across all retailers
            AVG(fp.price) OVER (PARTITION BY cp.canonical_product_id) as avg_price_all_retailers,
            -- Count how many retailers sell this product
            COUNT(*) OVER (PARTITION BY cp.canonical_product_id) as retailer_count
        FROM FactProductPrice fp
        JOIN DimVariant v ON fp.variant_id = v.variant_id
        JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
        JOIN DimCategory cat ON cp.category_id = cat.category_id
        JOIN DimShop s ON fp.shop_id = s.shop_id
        WHERE fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fp.is_available = 1  -- Only show available products
    ),
    price_savings_analysis AS (
        SELECT
            *,
            current_price - (SELECT MIN(current_price) FROM product_retailer_matrix p2
                           WHERE p2.canonical_product_id = product_retailer_matrix.canonical_product_id) as potential_savings,
            ((avg_price_all_retailers - current_price) / avg_price_all_retailers * 100) as discount_vs_avg
        FROM product_retailer_matrix
    )
    SELECT
        canonical_product_id,
        product_name,
        category_name,
        shop_id,
        shop_name,
        shop_rating,
        contact_phone,
        contact_whatsapp,
        current_price,
        stock_status,
        last_updated,
        price_rank,
        CASE WHEN price_rank = 1 THEN 1 ELSE 0 END as is_best_price,
        avg_price_all_retailers,
        retailer_count,
        potential_savings,
        discount_vs_avg,
        -- Retailer performance metrics
        CASE
            WHEN price_rank <= 2 THEN 'excellent'
            WHEN price_rank <= 4 THEN 'good'
            WHEN discount_vs_avg >= 0 THEN 'fair'
            ELSE 'high'
        END as price_rating
    FROM price_savings_analysis
    WHERE retailer_count >= 2  -- Only show products available from multiple retailers
    """

    params = {}

    if product_ids:
        product_list = [int(x.strip()) for x in product_ids.split(",")]
        placeholders = ",".join([f":product_{i}" for i in range(len(product_list))])
        base_query += f" AND canonical_product_id IN ({placeholders})"
        for i, product_id in enumerate(product_list):
            params[f"product_{i}"] = product_id

    if category_id:
        base_query += " AND cat.category_id = :category_id"
        params["category_id"] = category_id

    base_query += " ORDER BY canonical_product_id, current_price ASC"

    result = db.execute(text(base_query), params)

    # Group results by product for better comparison view
    products = {}
    for row in result:
        product_id = row.canonical_product_id

        if product_id not in products:
            products[product_id] = {
                "productId": product_id,
                "productName": row.product_name,
                "categoryName": row.category_name,
                "averagePrice": float(row.avg_price_all_retailers),
                "bestPrice": None,
                "maxSavings": 0,
                "retailerCount": row.retailer_count,
                "retailerPrices": []
            }

        retailer_data = {
            "retailerId": row.shop_id,
            "retailerName": row.shop_name,
            "price": float(row.current_price),
            "stockStatus": "in_stock" if row.stock_status else "out_of_stock",
            "rating": float(row.shop_rating) if row.shop_rating else 0,
            "lastUpdated": row.last_updated.isoformat() if row.last_updated else None,
            "isBestPrice": bool(row.is_best_price),
            "priceRating": row.price_rating,
            "potentialSavings": float(row.potential_savings) if row.potential_savings else 0,
            "discountVsAverage": round(float(row.discount_vs_avg), 2) if row.discount_vs_avg else 0,
            "contactInfo": {
                "phone": row.contact_phone,
                "whatsapp": row.contact_whatsapp
            }
        }

        products[product_id]["retailerPrices"].append(retailer_data)

        # Track best price and max savings
        if row.is_best_price:
            products[product_id]["bestPrice"] = float(row.current_price)

        if row.potential_savings and row.potential_savings > products[product_id]["maxSavings"]:
            products[product_id]["maxSavings"] = float(row.potential_savings)

    # Get price history if requested
    price_history = {}
    if include_history:
        history_query = """
        SELECT
            cp.canonical_product_id,
            d.full_date,
            MIN(fp.price) as min_price_day,
            MAX(fp.price) as max_price_day,
            AVG(fp.price) as avg_price_day,
            COUNT(DISTINCT s.shop_id) as retailers_tracking
        FROM FactProductPrice fp
        JOIN DimVariant v ON fp.variant_id = v.variant_id
        JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
        JOIN DimDate d ON fp.date_id = d.date_id
        JOIN DimShop s ON fp.shop_id = s.shop_id
        WHERE d.full_date >= DATEADD(day, -30, GETDATE())
        AND fp.is_available = 1
        """

        if product_ids:
            history_query += f" AND cp.canonical_product_id IN ({placeholders})"

        history_query += """
        GROUP BY cp.canonical_product_id, d.full_date
        ORDER BY cp.canonical_product_id, d.full_date DESC
        """

        history_result = db.execute(text(history_query), params)

        for row in history_result:
            product_id = row.canonical_product_id
            if product_id not in price_history:
                price_history[product_id] = {
                    "priceChange": 0,
                    "trend": "stable",
                    "volatility": "low",
                    "bestPriceLast30Days": float(row.min_price_day),
                    "priceRange": {
                        "min": float(row.min_price_day),
                        "max": float(row.max_price_day)
                    }
                }

            # Calculate trend based on first and latest prices
            # This is simplified - in production, use proper trend analysis
            if row.min_price_day < price_history[product_id]["priceRange"]["min"]:
                price_history[product_id]["priceRange"]["min"] = float(row.min_price_day)
            if row.max_price_day > price_history[product_id]["priceRange"]["max"]:
                price_history[product_id]["priceRange"]["max"] = float(row.max_price_day)

    # Add price history to products
    for product_id in products:
        if product_id in price_history:
            products[product_id]["priceHistory"] = price_history[product_id]

            # Add buying recommendation based on current price vs history
            current_best = products[product_id]["bestPrice"]
            historical_best = price_history[product_id]["bestPriceLast30Days"]

            if current_best <= historical_best * 1.02:  # Within 2% of best price
                products[product_id]["buyingRecommendation"] = {
                    "action": "buy_now",
                    "confidence": "high",
                    "reason": "Price is at or near 30-day low"
                }
            elif current_best <= historical_best * 1.05:  # Within 5% of best price
                products[product_id]["buyingRecommendation"] = {
                    "action": "good_time",
                    "confidence": "medium",
                    "reason": "Good price, consider buying"
                }
            else:
                products[product_id]["buyingRecommendation"] = {
                    "action": "wait",
                    "confidence": "medium",
                    "reason": "Price could drop further"
                }

    return {
        "success": True,
        "data": list(products.values()),
        "total": len(products),
        "metadata": {
            "comparisonType": comparison_type,
            "includesHistory": include_history,
            "avgRetailersPerProduct": sum(p["retailerCount"] for p in products.values()) / len(products) if products else 0
        }
    }
```

#### GET /api/buyer-central/product-comparison/{product_id}

Get detailed comparison for a specific product across all retailers.

```python
@app.get("/api/buyer-central/product-comparison/{product_id}")
async def get_product_detailed_comparison(
    product_id: int,
    include_similar: bool = False,
    db: Session = Depends(get_db)
):
    """
    Get detailed comparison for a specific product including:
    - All retailer prices and availability
    - Historical price trends
    - Similar product suggestions
    - Best buying time recommendations
    """

    # Main product comparison query
    main_query = """
    SELECT
        cp.canonical_product_id,
        cp.product_title,
        cp.brand,
        cp.description,
        cp.master_image_url,
        cat.category_name,
        s.shop_id,
        s.shop_name,
        s.website_url,
        s.contact_phone,
        s.contact_whatsapp,
        fp.price as current_price,
        fp.original_price,
        fp.is_available,
        fp.date_id as last_updated,
        v.variant_title,
        v.product_url,
        v.image_url as variant_image,
        -- Calculate discount if original price exists
        CASE
            WHEN fp.original_price IS NOT NULL AND fp.original_price > fp.price
            THEN ((fp.original_price - fp.price) / fp.original_price * 100)
            ELSE 0
        END as discount_percentage,
        -- Rank by price
        ROW_NUMBER() OVER (ORDER BY fp.price ASC) as price_rank,
        -- Get price statistics
        MIN(fp.price) OVER () as min_price_all,
        MAX(fp.price) OVER () as max_price_all,
        AVG(fp.price) OVER () as avg_price_all,
        COUNT(*) OVER () as total_retailers
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimCanonicalProduct cp ON v.canonical_product_id = cp.canonical_product_id
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN DimShop s ON fp.shop_id = s.shop_id
    WHERE cp.canonical_product_id = :product_id
    AND fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    ORDER BY fp.price ASC, s.shop_name
    """

    result = db.execute(text(main_query), {"product_id": product_id})
    retailers_data = []
    product_info = None

    for row in result:
        if product_info is None:
            product_info = {
                "productId": row.canonical_product_id,
                "productTitle": row.product_title,
                "brand": row.brand,
                "description": row.description,
                "categoryName": row.category_name,
                "masterImage": row.master_image_url,
                "priceStats": {
                    "minPrice": float(row.min_price_all),
                    "maxPrice": float(row.max_price_all),
                    "avgPrice": float(row.avg_price_all),
                    "totalRetailers": row.total_retailers,
                    "maxSavings": float(row.max_price_all - row.min_price_all),
                    "savingsPercentage": round(((row.max_price_all - row.min_price_all) / row.max_price_all * 100), 2)
                }
            }

        retailers_data.append({
            "retailerId": row.shop_id,
            "retailerName": row.shop_name,
            "websiteUrl": row.website_url,
            "contactPhone": row.contact_phone,
            "contactWhatsapp": row.contact_whatsapp,
            "currentPrice": float(row.current_price),
            "originalPrice": float(row.original_price) if row.original_price else None,
            "discountPercentage": round(float(row.discount_percentage), 2),
            "isAvailable": bool(row.is_available),
            "lastUpdated": row.last_updated.isoformat() if row.last_updated else None,
            "variantTitle": row.variant_title,
            "productUrl": row.product_url,
            "variantImage": row.variant_image,
            "priceRank": row.price_rank,
            "isBestPrice": row.price_rank == 1,
            "savingsVsBest": float(row.current_price - row.min_price_all),
            "priceRating": "excellent" if row.price_rank <= 2 else
                          "good" if row.price_rank <= 4 else "fair"
        })

    if not product_info:
        raise HTTPException(status_code=404, detail="Product not found")

    # Get 30-day price history
    history_query = """
    SELECT
        d.full_date,
        s.shop_name,
        fp.price,
        fp.is_available,
        ROW_NUMBER() OVER (PARTITION BY d.full_date ORDER BY fp.price ASC) as daily_rank
    FROM FactProductPrice fp
    JOIN DimVariant v ON fp.variant_id = v.variant_id
    JOIN DimDate d ON fp.date_id = d.date_id
    JOIN DimShop s ON fp.shop_id = s.shop_id
    WHERE v.canonical_product_id = :product_id
    AND d.full_date >= DATEADD(day, -30, GETDATE())
    AND fp.is_available = 1
    ORDER BY d.full_date DESC, fp.price ASC
    """

    history_result = db.execute(text(history_query), {"product_id": product_id})
    price_history = []
    daily_best_prices = {}

    for row in history_result:
        date_str = row.full_date.strftime("%Y-%m-%d")

        # Track daily best price
        if date_str not in daily_best_prices or row.daily_rank == 1:
            daily_best_prices[date_str] = float(row.price)

        price_history.append({
            "date": date_str,
            "retailer": row.shop_name,
            "price": float(row.price),
            "isDailyBest": row.daily_rank == 1
        })

    # Calculate price trend
    dates_sorted = sorted(daily_best_prices.keys())
    price_trend = "stable"
    trend_percentage = 0

    if len(dates_sorted) >= 7:
        recent_prices = [daily_best_prices[date] for date in dates_sorted[-7:]]
        older_prices = [daily_best_prices[date] for date in dates_sorted[:7]]

        recent_avg = sum(recent_prices) / len(recent_prices)
        older_avg = sum(older_prices) / len(older_prices)

        trend_percentage = ((recent_avg - older_avg) / older_avg * 100)

        if trend_percentage > 2:
            price_trend = "increasing"
        elif trend_percentage < -2:
            price_trend = "decreasing"

    # Get similar products if requested
    similar_products = []
    if include_similar:
        similar_query = """
        SELECT TOP 5
            cp2.canonical_product_id,
            cp2.product_title,
            cp2.brand,
            MIN(fp2.price) as min_price,
            AVG(fp2.price) as avg_price
        FROM DimCanonicalProduct cp2
        JOIN DimVariant v2 ON cp2.canonical_product_id = v2.canonical_product_id
        JOIN FactProductPrice fp2 ON v2.variant_id = fp2.variant_id
        WHERE cp2.category_id = (SELECT category_id FROM DimCanonicalProduct WHERE canonical_product_id = :product_id)
        AND cp2.canonical_product_id != :product_id
        AND fp2.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fp2.is_available = 1
        GROUP BY cp2.canonical_product_id, cp2.product_title, cp2.brand
        ORDER BY ABS(AVG(fp2.price) - :current_avg_price)
        """

        similar_result = db.execute(text(similar_query), {
            "product_id": product_id,
            "current_avg_price": product_info["priceStats"]["avgPrice"]
        })

        for row in similar_result:
            similar_products.append({
                "productId": row.canonical_product_id,
                "productTitle": row.product_title,
                "brand": row.brand,
                "minPrice": float(row.min_price),
                "avgPrice": float(row.avg_price)
            })

    return {
        "success": True,
        "data": {
            "productInfo": product_info,
            "retailers": retailers_data,
            "priceHistory": {
                "dailyBestPrices": [
                    {"date": date, "price": price}
                    for date, price in sorted(daily_best_prices.items())
                ],
                "trend": price_trend,
                "trendPercentage": round(trend_percentage, 2),
                "volatility": "high" if abs(trend_percentage) > 10 else
                             "medium" if abs(trend_percentage) > 5 else "low"
            },
            "buyingRecommendation": {
                "action": "buy_now" if price_trend == "decreasing" or
                         retailers_data[0]["currentPrice"] <= product_info["priceStats"]["avgPrice"] * 0.95
                         else "wait" if price_trend == "increasing"
                         else "good_time",
                "confidence": "high" if abs(trend_percentage) > 5 else "medium",
                "reasoning": f"Price trend is {price_trend} ({trend_percentage:+.1f}% vs last week)"
            },
            "similarProducts": similar_products if include_similar else []
        }
    }
```

#### POST /api/buyer-central/configure-retailer-comparison

Allow users to configure which retailers to compare for specific products.

```python
@app.post("/api/buyer-central/configure-retailer-comparison")
async def configure_retailer_comparison(
    config_data: dict,
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Configure user's preferred retailers for price comparison.

    Request format:
    {
        "productId": 123,
        "selectedRetailers": [1, 2, 5, 8],
        "comparisonName": "iPhone 15 Pro Comparison",
        "alertOnPriceChange": true,
        "alertThreshold": 5.0  // percentage
    }
    """

    # Delete existing configuration
    delete_query = """
    DELETE FROM UserRetailerPreferences
    WHERE user_id = :user_id AND product_id = :product_id
    """

    db.execute(text(delete_query), {
        "user_id": user_id,
        "product_id": config_data["productId"]
    })

    # Insert new configuration
    insert_query = """
    INSERT INTO UserRetailerPreferences (
        user_id, product_id, retailer_id, comparison_name,
        alert_on_price_change, alert_threshold, created_at
    ) VALUES (
        :user_id, :product_id, :retailer_id, :comparison_name,
        :alert_on_price_change, :alert_threshold, GETDATE()
    )
    """

    for retailer_id in config_data["selectedRetailers"]:
        db.execute(text(insert_query), {
            "user_id": user_id,
            "product_id": config_data["productId"],
            "retailer_id": retailer_id,
            "comparison_name": config_data.get("comparisonName", ""),
            "alert_on_price_change": config_data.get("alertOnPriceChange", False),
            "alert_threshold": config_data.get("alertThreshold", 0)
        })

    db.commit()

    return {
        "success": True,
        "message": "Retailer comparison configuration saved",
        "data": {
            "productId": config_data["productId"],
            "configuredRetailers": len(config_data["selectedRetailers"])
        }
    }
```

#### GET /api/buyer-central/user-comparisons/{user_id}

Get user's configured price comparisons.

```python
@app.get("/api/buyer-central/user-comparisons/{user_id}")
async def get_user_comparisons(
    user_id: int,
    db: Session = Depends(get_db)
):
    """
    Get all configured price comparisons for a user.
    """

    query = """
    SELECT
        urp.product_id,
        urp.comparison_name,
        urp.alert_on_price_change,
        urp.alert_threshold,
        cp.product_title,
        cp.brand,
        cat.category_name,
        COUNT(urp.retailer_id) as retailer_count,
        STRING_AGG(s.shop_name, ', ') as retailer_names,
        MIN(fp.price) as min_current_price,
        MAX(fp.price) as max_current_price,
        AVG(fp.price) as avg_current_price
    FROM UserRetailerPreferences urp
    JOIN DimCanonicalProduct cp ON urp.product_id = cp.canonical_product_id
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN DimShop s ON urp.retailer_id = s.shop_id
    LEFT JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    LEFT JOIN FactProductPrice fp ON v.variant_id = fp.variant_id
        AND urp.retailer_id = fp.shop_id
        AND fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    WHERE urp.user_id = :user_id
    GROUP BY urp.product_id, urp.comparison_name, urp.alert_on_price_change,
             urp.alert_threshold, cp.product_title, cp.brand, cat.category_name
    ORDER BY urp.product_id
    """

    result = db.execute(text(query), {"user_id": user_id})

    comparisons = []
    for row in result:
        comparisons.append({
            "productId": row.product_id,
            "comparisonName": row.comparison_name,
            "productTitle": row.product_title,
            "brand": row.brand,
            "categoryName": row.category_name,
            "retailerCount": row.retailer_count,
            "retailerNames": row.retailer_names.split(', ') if row.retailer_names else [],
            "alertEnabled": row.alert_on_price_change,
            "alertThreshold": float(row.alert_threshold) if row.alert_threshold else 0,
            "currentPricing": {
                "minPrice": float(row.min_current_price) if row.min_current_price else 0,
                "maxPrice": float(row.max_current_price) if row.max_current_price else 0,
                "avgPrice": float(row.avg_current_price) if row.avg_current_price else 0,
                "priceRange": float(row.max_current_price - row.min_current_price) if row.min_current_price and row.max_current_price else 0
            }
        })

    return {
        "success": True,
        "data": comparisons,
        "total": len(comparisons)
    }
```

#### GET /api/buyer-central/similar-products/{product_id}

Get similar products for comparison and alternative recommendations.

```python
@app.get("/api/buyer-central/similar-products/{product_id}")
async def get_similar_products(
    product_id: int,
    price_range_percentage: float = 20.0,  # ±20% of original price
    limit: int = 10,
    db: Session = Depends(get_db)
):
    """
    Find similar products based on category, brand, and price range.
    """

    # Get original product info
    original_query = """
    SELECT
        cp.product_title,
        cp.brand,
        cp.category_id,
        cat.category_name,
        AVG(fp.price) as avg_price
    FROM DimCanonicalProduct cp
    JOIN DimCategory cat ON cp.category_id = cat.category_id
    JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
    JOIN FactProductPrice fp ON v.variant_id = fp.variant_id
    WHERE cp.canonical_product_id = :product_id
    AND fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
    GROUP BY cp.product_title, cp.brand, cp.category_id, cat.category_name
    """

    original_result = db.execute(text(original_query), {"product_id": product_id})
    original = original_result.first()

    if not original:
        raise HTTPException(status_code=404, detail="Original product not found")

    # Calculate price range
    min_price = original.avg_price * (1 - price_range_percentage / 100)
    max_price = original.avg_price * (1 + price_range_percentage / 100)

    # Find similar products
    similar_query = """
    WITH similar_products AS (
        SELECT
            cp.canonical_product_id,
            cp.product_title,
            cp.brand,
            cp.description,
            cp.master_image_url,
            AVG(fp.price) as avg_price,
            MIN(fp.price) as min_price,
            MAX(fp.price) as max_price,
            COUNT(DISTINCT fp.shop_id) as retailer_count,
            -- Similarity scoring
            CASE
                WHEN cp.brand = :original_brand THEN 3
                ELSE 0
            END +
            CASE
                WHEN ABS(AVG(fp.price) - :original_price) / :original_price <= 0.1 THEN 2
                WHEN ABS(AVG(fp.price) - :original_price) / :original_price <= 0.2 THEN 1
                ELSE 0
            END as similarity_score
        FROM DimCanonicalProduct cp
        JOIN DimVariant v ON cp.canonical_product_id = v.canonical_product_id
        JOIN FactProductPrice fp ON v.variant_id = fp.variant_id
        WHERE cp.category_id = :category_id
        AND cp.canonical_product_id != :product_id
        AND fp.date_id = (SELECT MAX(date_id) FROM FactProductPrice)
        AND fp.is_available = 1
        GROUP BY cp.canonical_product_id, cp.product_title, cp.brand,
                 cp.description, cp.master_image_url
        HAVING AVG(fp.price) BETWEEN :min_price AND :max_price
        AND COUNT(DISTINCT fp.shop_id) >= 2
    )
    SELECT TOP (@limit)
        *,
        -- Price comparison with original
        ((avg_price - :original_price) / :original_price * 100) as price_difference_percentage
    FROM similar_products
    ORDER BY similarity_score DESC, ABS(avg_price - :original_price) ASC
    """

    similar_result = db.execute(text(similar_query), {
        "product_id": product_id,
        "category_id": original.category_id,
        "original_brand": original.brand,
        "original_price": original.avg_price,
        "min_price": min_price,
        "max_price": max_price,
        "limit": limit
    })

    similar_products = []
    for row in similar_result:
        similar_products.append({
            "productId": row.canonical_product_id,
            "productTitle": row.product_title,
            "brand": row.brand,
            "description": row.description,
            "masterImage": row.master_image_url,
            "pricing": {
                "avgPrice": float(row.avg_price),
                "minPrice": float(row.min_price),
                "maxPrice": float(row.max_price),
                "priceRange": float(row.max_price - row.min_price)
            },
            "retailerCount": row.retailer_count,
            "similarityScore": row.similarity_score,
            "priceComparison": {
                "differencePercentage": round(float(row.price_difference_percentage), 2),
                "comparison": "cheaper" if row.price_difference_percentage < -2 else
                            "more_expensive" if row.price_difference_percentage > 2 else "similar",
                "savingsAmount": float(original.avg_price - row.avg_price)
            }
        })

    return {
        "success": True,
        "data": {
            "originalProduct": {
                "productId": product_id,
                "productTitle": original.product_title,
                "brand": original.brand,
                "categoryName": original.category_name,
                "avgPrice": float(original.avg_price)
            },
            "similarProducts": similar_products,
            "searchCriteria": {
                "priceRangePercentage": price_range_percentage,
                "minPrice": round(min_price, 2),
                "maxPrice": round(max_price, 2),
                "category": original.category_name
            }
        },
        "total": len(similar_products)
    }
```

```python
@app.get("/api/buyer-central/retailer-comparison")
async def get_retailer_comparison(
    category_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    """
    Get comprehensive retailer comparison including performance metrics.
    """

    query = """
    WITH retailer_stats AS (
        SELECT
            s.shop_id,
            s.shop_name,
            s.rating as base_rating,
            COUNT(DISTINCT v.canonical_product_id) as total_products,
            AVG(fp.price) as avg_price,
            MIN(fp.price) as min_price,
            MAX(fp.price) as max_price,
            COUNT(CASE WHEN fp.stock_status = 'in_stock' THEN 1 END) * 100.0 / COUNT(*) as stock_availability,
            AVG(CASE WHEN fp.price = min_price_per_product.min_price THEN 100 ELSE 0 END) as best_price_percentage
        FROM DimShop s
        JOIN FactProductPrice fp ON s.shop_id = fp.shop_id
        JOIN DimVariant v ON fp.variant_id = v.variant_id
        JOIN DimCanonicalProduct p ON v.canonical_product_id = p.canonical_product_id
        LEFT JOIN (
            SELECT
                v2.canonical_product_id,
                MIN(fp2.price) as min_price
            FROM FactProductPrice fp2
            JOIN DimVariant v2 ON fp2.variant_id = v2.variant_id
            WHERE fp2.date_key = (SELECT MAX(date_key) FROM FactProductPrice)
            GROUP BY v2.canonical_product_id
        ) min_price_per_product ON p.canonical_product_id = min_price_per_product.canonical_product_id
        WHERE fp.date_key = (SELECT MAX(date_key) FROM FactProductPrice)
        GROUP BY s.shop_id, s.shop_name, s.rating
        HAVING COUNT(DISTINCT v.canonical_product_id) >= 5
    )
    SELECT
        shop_id,
        shop_name,
        base_rating,
        total_products,
        avg_price,
        stock_availability,
        best_price_percentage,
        -- Calculate competitiveness score
        (
            (best_price_percentage * 0.4) +
            (stock_availability * 0.3) +
            (base_rating * 20 * 0.2) +
            (CASE WHEN total_products > 1000 THEN 10 ELSE total_products / 100.0 END * 0.1)
        ) as competitiveness_score
    FROM retailer_stats
    ORDER BY competitiveness_score DESC
    """

    result = db.execute(text(query))

    retailers = []
    for row in result:
        # Determine strengths based on metrics
        strengths = []
        if row.best_price_percentage > 20:
            strengths.append("Competitive Pricing")
        if row.stock_availability > 90:
            strengths.append("High Availability")
        if row.base_rating > 4.0:
            strengths.append("Customer Satisfaction")
        if row.total_products > 1000:
            strengths.append("Wide Selection")

        retailers.append({
            "retailerId": row.shop_id,
            "retailerName": row.shop_name,
            "averageRating": float(row.base_rating) if row.base_rating else 0,
            "totalProducts": row.total_products,
            "competitivenessScore": round(row.competitiveness_score, 1),
            "stockAvailability": round(row.stock_availability, 1),
            "bestPricePercentage": round(row.best_price_percentage, 1),
            "deliverySpeed": "2-3 days",  # This would come from retailer profile
            "returnPolicy": "30 days",    # This would come from retailer profile
            "customerServiceRating": float(row.base_rating) if row.base_rating else 0,
            "strengths": strengths
        })

    return {
        "success": True,
        "data": retailers,
        "total": len(retailers)
    }
```

## Error Handling

```python
from fastapi import HTTPException
from sqlalchemy.exc import SQLAlchemyError

@app.exception_handler(SQLAlchemyError)
async def sqlalchemy_exception_handler(request, exc):
    return {
        "success": False,
        "error": "Database operation failed",
        "detail": str(exc)
    }

@app.exception_handler(ValueError)
async def value_error_handler(request, exc):
    return {
        "success": False,
        "error": "Invalid parameter value",
        "detail": str(exc)
    }
```

## Authentication & Security

```python
from fastapi.security import HTTPBearer
from jose import jwt
import os

security = HTTPBearer()

async def get_current_user(token: str = Depends(security)):
    try:
        payload = jwt.decode(token.credentials, os.getenv("SECRET_KEY"), algorithms=["HS256"])
        user_id = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return user_id
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")
```

## Performance Optimization

### Caching Strategy

```python
from fastapi_cache import FastAPICache
from fastapi_cache.decorator import cache
from fastapi_cache.backends.redis import RedisBackend

@cache(expire=300)  # 5 minutes
async def get_cached_market_insights(category_id: int = None):
    # Implementation here
    pass
```

### Database Indexing Recommendations

```sql
-- Indexes for optimal performance
CREATE INDEX idx_factproductprice_date_variant ON FactProductPrice(date_key, variant_id);
CREATE INDEX idx_factproductprice_product_shop ON FactProductPrice(variant_id, shop_id);
CREATE INDEX idx_pricealerts_user_active ON PriceAlerts(user_id, is_active);
CREATE INDEX idx_buyingguides_category_featured ON BuyingGuides(category_id, is_featured);
```

This comprehensive API implementation provides all the backend functionality needed for the Buyer Central features, with proper error handling, authentication, and performance considerations.
