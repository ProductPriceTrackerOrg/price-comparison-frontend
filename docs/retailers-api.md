# Backend API Documentation for Retailers and Products

This documentation describes the required backend API endpoints for the retailer and product functionality in the Price Comparison Frontend application.

## Table of Contents

1. [Retailers API](#retailers-api)

   - [Get All Retailers](#get-all-retailers)
   - [Get Retailer by ID](#get-retailer-by-id)
   - [Get Retailer Stats](#get-retailer-stats)

2. [Retailer Products API](#retailer-products-api)
   - [Get Products by Retailer](#get-products-by-retailer)
   - [Get Product Categories by Retailer](#get-product-categories-by-retailer)
   - [Get Product Brands by Retailer](#get-product-brands-by-retailer)

## Retailers API

### Get All Retailers

Retrieve a paginated list of retailers with optional filtering.

**Endpoint:** `GET /api/v1/retailers`

**Query Parameters:**

| Parameter | Type    | Description                                                                 |
| --------- | ------- | --------------------------------------------------------------------------- |
| `page`    | integer | Page number for pagination (default: 1)                                     |
| `limit`   | integer | Number of retailers per page (default: 10)                                  |
| `search`  | string  | Search query for retailer name or description                               |
| `sort`    | string  | Sort by field (options: 'name', 'product_count', 'rating', default: 'name') |
| `order`   | string  | Sort order (options: 'asc', 'desc', default: 'asc')                         |

**Response Format:**

```json
{
  "retailers": [
    {
      "id": 1,
      "name": "RetailTech",
      "logo": "https://example.com/logo.png",
      "website": "https://retailtech.lk",
      "rating": 4.8,
      "product_count": 1250,
      "description": "Leading electronics retailer",
      "verified": true,
      "is_featured": true,
      "headquarters": "Colombo, Sri Lanka",
      "founded_year": 2015,
      "contact": {
        "email": "info@retailtech.lk",
        "phone": "+94 11 123 4567",
        "address": "123 Main St, Colombo 03, Sri Lanka"
      }
    }
    // More retailers...
  ],
  "meta": {
    "total_count": 50,
    "total_pages": 5,
    "current_page": 1,
    "limit": 10
  }
}
```

### Get Retailer by ID

Retrieve detailed information about a specific retailer.

**Endpoint:** `GET /api/v1/retailers/:id`

**URL Parameters:**

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `id`      | integer | Unique identifier of the retailer |

**Response Format:**

```json
{
  "retailer": {
    "id": 1,
    "name": "RetailTech",
    "logo": "https://example.com/logo.png",
    "website": "https://retailtech.lk",
    "rating": 4.8,
    "product_count": 1250,
    "description": "Leading electronics retailer",
    "verified": true,
    "is_featured": true,
    "headquarters": "Colombo, Sri Lanka",
    "founded_year": 2015,
    "contact": {
      "email": "info@retailtech.lk",
      "phone": "+94 11 123 4567",
      "address": "123 Main St, Colombo 03, Sri Lanka"
    }
  }
}
```

### Get Retailer Stats

Retrieve aggregate statistics about retailers.

**Endpoint:** `GET /api/v1/retailers/stats`

**Response Format:**

```json
{
  "stats": {
    "total_retailers": 50,
    "verified_retailers": 35,
    "total_products": 25000,
    "average_rating": 4.5
  }
}
```

## Retailer Products API

### Get Products by Retailer

Retrieve a paginated list of products from a specific retailer with advanced filtering and sorting.

**Endpoint:** `GET /api/v1/retailers/:id/products`

**URL Parameters:**

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `id`      | integer | Unique identifier of the retailer |

**Query Parameters:**

| Parameter      | Type    | Description                                                                                              |
| -------------- | ------- | -------------------------------------------------------------------------------------------------------- |
| `page`         | integer | Page number for pagination (default: 1)                                                                  |
| `limit`        | integer | Number of products per page (default: 20)                                                                |
| `search`       | string  | Search query for product name, brand, or description                                                     |
| `category`     | string  | Filter by product category                                                                               |
| `brand`        | string  | Filter by product brand                                                                                  |
| `min_price`    | number  | Filter by minimum price                                                                                  |
| `max_price`    | number  | Filter by maximum price                                                                                  |
| `in_stock`     | boolean | Filter by availability status (true/false)                                                               |
| `has_discount` | boolean | Filter products with discounts (true/false)                                                              |
| `sort`         | string  | Sort by field (options: 'newest', 'price_asc', 'price_desc', 'name_asc', 'name_desc', default: 'newest') |

**Response Format:**

```json
{
  "products": [
    {
      "id": 12345,
      "name": "Samsung Galaxy A14 5G 6GB RAM 128GB",
      "brand": "Samsung",
      "category": "Smartphones",
      "price": 62755.32,
      "original_price": 70000.0,
      "discount": 10,
      "retailer": "RetailTech",
      "retailer_id": 1,
      "in_stock": true,
      "image": "https://example.com/product.jpg",
      "images": [
        "https://example.com/product-1.jpg",
        "https://example.com/product-2.jpg"
      ],
      "description": "Feature-packed budget smartphone with excellent battery life",
      "created_at": "2025-09-15T14:30:00Z",
      "updated_at": "2025-10-01T10:15:00Z",
      "specifications": {
        "display": "6.6-inch LCD",
        "processor": "Exynos 1280",
        "camera": "50MP + 5MP + 2MP",
        "battery": "5000mAh"
      }
    }
    // More products...
  ],
  "meta": {
    "total_count": 150,
    "total_pages": 8,
    "current_page": 1,
    "limit": 20
  }
}
```

### Get Product Categories by Retailer

Retrieve a list of all product categories available from a specific retailer.

**Endpoint:** `GET /api/v1/retailers/:id/categories`

**URL Parameters:**

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `id`      | integer | Unique identifier of the retailer |

**Response Format:**

```json
{
  "categories": [
    {
      "id": 1,
      "name": "Smartphones",
      "product_count": 45
    },
    {
      "id": 2,
      "name": "Laptops",
      "product_count": 30
    }
    // More categories...
  ]
}
```

### Get Product Brands by Retailer

Retrieve a list of all product brands available from a specific retailer.

**Endpoint:** `GET /api/v1/retailers/:id/brands`

**URL Parameters:**

| Parameter | Type    | Description                       |
| --------- | ------- | --------------------------------- |
| `id`      | integer | Unique identifier of the retailer |

**Response Format:**

```json
{
  "brands": [
    {
      "id": 1,
      "name": "Samsung",
      "product_count": 25
    },
    {
      "id": 2,
      "name": "Apple",
      "product_count": 18
    }
    // More brands...
  ]
}
```

## Implementation Guide

### Database Design Considerations

1. **Retailers Table**:

   - Store basic retailer information: name, description, logo URL, rating
   - Include verification status and feature flags
   - Consider storing contact information in a JSON field or separate table

2. **Products Table**:

   - Store product details: name, description, price, original_price, images
   - Include foreign keys to retailers, categories, and brands
   - Consider storing specifications in a JSON field or separate table

3. **Indexes**:
   - Add indexes for frequently searched fields: product name, brand, category
   - Add indexes for price ranges for efficient filtering
   - Add composite indexes for retailer_id combined with other filter fields

### API Implementation Tips

1. **Pagination**:

   - Implement cursor-based pagination for large datasets
   - Return total counts and page metadata with each response

2. **Search Optimization**:

   - Consider using full-text search for product and retailer search
   - Implement proper indexing for search fields

3. **Caching**:

   - Cache frequently accessed retailer data
   - Use Redis or a similar solution for storing cached results
   - Implement proper cache invalidation when data changes

4. **Rate Limiting**:

   - Implement rate limiting to prevent abuse
   - Consider different rate limits for authenticated and unauthenticated requests

5. **Error Handling**:
   - Return appropriate HTTP status codes (404 for not found, 400 for bad requests)
   - Include descriptive error messages to help debug issues
