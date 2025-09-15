# Category Products API Implementation Guide

## Overview

This document outlines the required API endpoints for the Category Products feature. The Category Products page displays all products within a specific category, allowing users to filter and sort results by various criteria including retailer, price, and name.

## Endpoints Required

### 1. Get Products by Category

**Endpoint:** `/api/v1/categories/{slug}/products`

**Method:** `GET`

**Description:** Retrieves a paginated list of products for a specific category.

**URL Parameters:**

- `slug` (required): The category slug (e.g., "smartphones", "laptops", "gaming-peripherals")

**Query Parameters:**

- `page` (optional, default: 1): Page number for pagination
- `limit` (optional, default: 20): Number of products per page
- `retailer` (optional): Filter by retailer name
- `sortBy` (optional, default: "price_asc"): Sorting method
  - Valid values: "price_asc", "price_desc", "name_asc", "name_desc"
- `inStockOnly` (optional, boolean): Filter to only show products that are in stock

**Response Format:**

```json
{
  "success": true,
  "data": {
    "products": [
      {
        "id": 1234,
        "name": "Product Name",
        "brand": "Brand Name",
        "category": "Category Name",
        "price": 12500,
        "originalPrice": 15000,
        "retailer": "Retailer Name",
        "inStock": true,
        "image": "https://example.com/image.jpg",
        "rating": 4.5,
        "discount": 16.7,
        "specifications": {
          "key1": "value1",
          "key2": "value2"
        }
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 10,
      "totalProducts": 243,
      "hasNextPage": true,
      "hasPreviousPage": false
    },
    "stats": {
      "totalProducts": 243,
      "avgPrice": 35750,
      "inStockCount": 187,
      "minPrice": 5000,
      "maxPrice": 150000,
      "retailerCount": 5
    }
  }
}
```

**Error Response:**

```json
{
  "success": false,
  "error": {
    "code": "CATEGORY_NOT_FOUND",
    "message": "Category not found",
    "details": "The requested category does not exist"
  }
}
```

### 2. Get Category Details

**Endpoint:** `/api/v1/categories/{slug}`

**Method:** `GET`

**Description:** Retrieves detailed information about a specific category.

**URL Parameters:**

- `slug` (required): The category slug

**Response Format:**

```json
{
  "success": true,
  "data": {
    "id": 123,
    "name": "Smartphones",
    "slug": "smartphones",
    "description": "Mobile phones with advanced features",
    "image": "https://example.com/category-image.jpg",
    "iconName": "Phone",
    "color": "blue",
    "trending": true,
    "stats": {
      "totalProducts": 243,
      "avgPrice": 35750,
      "inStockCount": 187,
      "minPrice": 5000,
      "maxPrice": 150000,
      "retailerCount": 5
    }
  }
}
```

### 3. Get Category Retailers

**Endpoint:** `/api/v1/categories/{slug}/retailers`

**Method:** `GET`

**Description:** Retrieves a list of retailers that have products in the specified category.

**URL Parameters:**

- `slug` (required): The category slug

**Response Format:**

```json
{
  "success": true,
  "data": {
    "retailers": [
      {
        "id": 1,
        "name": "simplytek",
        "logo": "https://example.com/simplytek-logo.png",
        "productCount": 43
      },
      {
        "id": 2,
        "name": "onei.lk",
        "logo": "https://example.com/oneilk-logo.png",
        "productCount": 56
      }
    ]
  }
}
```

## Data Models

### Product

```typescript
interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  inStock: boolean;
  image: string;
  rating?: number;
  discount?: number;
  specifications?: Record<string, string>;
  dateAdded: string;
  lastUpdated: string;
}
```

### Category

```typescript
interface Category {
  id: number;
  name: string;
  slug: string;
  description: string;
  image?: string;
  iconName: string;
  color: string;
  trending: boolean;
  stats: CategoryStats;
}
```

### Retailer

```typescript
interface Retailer {
  id: number;
  name: string;
  logo?: string;
  productCount: number;
}
```

### CategoryStats

```typescript
interface CategoryStats {
  totalProducts: number;
  avgPrice: number;
  inStockCount: number;
  minPrice: number;
  maxPrice: number;
  retailerCount: number;
}
```

## Implementation Guidelines

### Backend Requirements

1. **Database Indexing**

   - Ensure proper indexing on category_id, retailer_id, and price fields for efficient querying
   - Consider composite indexes for common filter combinations

2. **Caching Strategy**

   - Implement Redis caching for category statistics and filter options
   - Cache lifetime: 1 hour for category details, 15 minutes for product listings

3. **Performance Considerations**

   - Optimize image delivery through a CDN
   - Use cursor-based pagination for large result sets
   - Implement query optimization for complex filters

4. **Error Handling**
   - Provide clear error messages with appropriate HTTP status codes
   - Log all API errors with request parameters for debugging

### Integration Tips

1. Ensure consistent naming conventions between frontend and backend
2. Use environment variables for API base URLs
3. Implement proper rate limiting to prevent abuse
4. Set up monitoring for slow-performing queries
5. Consider implementing GraphQL for more flexible querying if needed in the future

## Example API Calls

### Fetch Products in Smartphones Category

```
GET /api/v1/categories/smartphones/products?page=1&limit=20&sortBy=price_asc&inStockOnly=true
```

### Get Category Statistics

```
GET /api/v1/categories/smartphones
```

### Get Retailers for Gaming Peripherals

```
GET /api/v1/categories/gaming-peripherals/retailers
```
