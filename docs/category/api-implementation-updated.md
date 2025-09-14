# Category Products API Implementation Guide

## Overview

This document outlines the implemented API endpoints for the Category Products feature. The Category Products page displays all products within a specific category, allowing users to filter and sort results by various criteria including retailer, brand, price range, and more.

## Implemented Endpoints

### 1. Get Products by Category

**Endpoint:** `/api/v1/categories/{category_id}/products`

**Method:** `GET`

**Description:** Retrieves a paginated list of products for a specific category.

**URL Parameters:**

- `category_id` (required): The numeric ID of the category (e.g., "16" for Mobile Phones, "13" for Laptops)

**Query Parameters:**

- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 20): Number of products per page
- `sort_by` (optional, default: "price_asc"): Sorting method
  - Valid values: "price_asc", "price_desc", "name_asc"
- `brand` (optional): Filter by brand name
- `min_price` (optional): Minimum price filter
- `max_price` (optional): Maximum price filter

**Response Format:**

```json
{
  "category": {
    "category_id": 16,
    "name": "Mobile Phones",
    "description": "Mobile Phones and accessories",
    "icon": "mobile_phones",
    "color": "blue",
    "parent_category_id": null,
    "product_count": 1650
  },
  "products": [
    {
      "id": 12345,
      "name": "iPhone 14 Pro Max",
      "brand": "Apple",
      "price": 325000,
      "retailer": "simplytek",
      "retailer_id": 1,
      "original_price": 350000,
      "discount": 7.14,
      "in_stock": true,
      "image": "https://example.com/iphone14.jpg"
    }
  ],
  "pagination": {
    "current_page": 1,
    "total_pages": 83,
    "total_items": 1650,
    "items_per_page": 20
  },
  "filters": {
    "brands": [
      {
        "name": "Apple",
        "count": 42
      },
      {
        "name": "Samsung",
        "count": 36
      }
    ]
  }
}
```

**Error Response:**

```json
{
  "status_code": 404,
  "detail": "Category with ID 999 not found"
}
```

## Data Models

### Product

```typescript
interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  retailer: string;
  retailer_id: number;
  original_price?: number;
  discount?: number;
  in_stock: boolean;
  image: string;
}
```

### Category

```typescript
interface Category {
  category_id: number;
  name: string;
  description: string;
  icon: string;
  color: string;
  parent_category_id: number | null;
  product_count: number;
}
```

### BrandFilter

```typescript
interface BrandFilter {
  name: string;
  count: number;
}
```

### Response Structure

```typescript
interface CategoryProductsResponse {
  category: Category;
  products: Product[];
  pagination: {
    current_page: number;
    total_pages: number;
    total_items: number;
    items_per_page: number;
  };
  filters: {
    brands: BrandFilter[];
  };
}
```

## Integration Details

### Backend Implementation

The backend implementation for this feature uses:

1. **BigQuery for Data Storage**

   - Product data is stored in the following tables:
     - DimCategory: Category information
     - DimShopProduct: Basic product details
     - DimVariant: Product variants
     - FactProductPrice: Price data with history
     - DimShop: Retailer information
     - DimProductImage: Product images

2. **Optimized Query Performance**

   - Uses CTE (Common Table Expressions) to break down complex queries
   - Pre-filters data at the source to minimize processing
   - Implements efficient aggregations for statistics

3. **Caching Strategy**
   - Redis cache for frequently accessed data
   - Cache key format: `category:{id}:products:page{page}:limit{limit}:sort{sort_by}:min{min_price}:max{max_price}:brand{brand}`
   - 15-minute TTL for product listings

### Frontend Integration

The frontend implementation:

1. Passes category ID from the URL slug (`/category/{slug}`) to the API after mapping slug to ID
2. Preserves filter state between pagination requests
3. Implements both server-side and client-side filtering for optimal performance
4. Handles loading states, empty results, and error conditions

## Example API Calls

### Get Laptops with Price Range Filter

```
GET /api/v1/categories/13/products?page=1&limit=20&sort_by=price_asc&min_price=50000&max_price=150000
```

### Get Samsung Mobile Phones

```
GET /api/v1/categories/16/products?brand=Samsung&sort_by=name_asc
```
