import { Product } from "./product-data";

export interface Retailer {
  id: number; // maps to shop_id from BigQuery
  name: string;
  logo: string;
  rating: number; // maps to avg_rating from BigQuery
  productCount: number; // maps to product_count from BigQuery
  verified: boolean;
  description: string; // derived from specialty in BigQuery
  website?: string; // maps to website_url from BigQuery
  foundedYear?: number;
  headquarters?: string;
  contact?: {
    email?: string;
    phone?: string; // maps to contact_phone from BigQuery
    whatsapp?: string; // maps to contact_whatsapp from BigQuery
    address?: string;
  };
}

export const retailers: Retailer[] = [
  {
    id: 1, // shop_id
    name: "lifemobile.lk",
    logo: "https://placekitten.com/200/200?retailer=1",
    rating: 4.81, // avg_rating
    productCount: 15464, // product_count
    verified: true,
    description: "Specializes in Electronics", // derived from specialty
    website: "https://lifemobile.lk", // website_url
    foundedYear: 2015,
    headquarters: "Colombo, Sri Lanka",
    contact: {
      email: "info@lifemobile.lk",
      phone: "+94112322511", // contact_phone
      whatsapp: "+94770000111", // contact_whatsapp
      address: "123 Main St, Colombo 03, Sri Lanka",
    },
  },
  {
    id: 0, // shop_id
    name: "appleme",
    logo: "https://placekitten.com/200/200?retailer=0",
    rating: 4.34, // avg_rating
    productCount: 2398, // product_count
    verified: true,
    description: "Specializes in Electronics", // derived from specialty
    website: "https://appleme.lk", // website_url
    foundedYear: 2017,
    headquarters: "Kandy, Sri Lanka",
    contact: {
      email: "support@appleme.lk",
      phone: "+94777911011", // contact_phone
      whatsapp: "+94777911022", // contact_whatsapp
      address: "456 Tech Park, Kandy, Sri Lanka",
    },
  },
  {
    id: 3, // shop_id
    name: "simplytek",
    logo: "https://placekitten.com/200/200?retailer=3",
    rating: 4.95, // avg_rating
    productCount: 2345, // product_count
    verified: true,
    description: "Specializes in Electronics", // derived from specialty
    website: "https://simplytek.lk", // website_url
    foundedYear: 2016,
    headquarters: "Galle, Sri Lanka",
    contact: {
      email: "care@simplytek.lk",
      phone: "+94117555888", // contact_phone
      whatsapp: "+94117555889", // contact_whatsapp
      address: "789 Smart Plaza, Galle, Sri Lanka",
    },
  },
  {
    id: 4, // shop_id
    name: "laptop.lk",
    logo: "https://placekitten.com/200/200?retailer=4",
    rating: 4.34, // avg_rating
    productCount: 1831, // product_count
    verified: true,
    description: "Specializes in Electronics", // derived from specialty
    website: "https://laptop.lk", // website_url
    foundedYear: 2018,
    headquarters: "Colombo, Sri Lanka",
    contact: {
      email: "hello@laptop.lk",
      phone: "+94777336464", // contact_phone
      whatsapp: "+94777336465", // contact_whatsapp
      address: "321 Digital Avenue, Colombo 05, Sri Lanka",
    },
  },
  {
    id: 2, // shop_id
    name: "onei.lk",
    logo: "https://placekitten.com/200/200?retailer=2",
    rating: 4.77, // avg_rating
    productCount: 582, // product_count
    verified: true,
    description: "Specializes in Electronics", // derived from specialty
    website: "https://onei.lk", // website_url
    foundedYear: 2019,
    headquarters: "Matara, Sri Lanka",
    contact: {
      email: "sales@onei.lk",
      phone: "+94770176666", // contact_phone
      whatsapp: "+94770176667", // contact_whatsapp
      address: "987 Electronic Square, Matara, Sri Lanka",
    },
  },
];

// Function to get retailers with pagination
export function getRetailers(
  page: number = 1,
  limit: number = 10,
  searchQuery?: string
) {
  let filteredRetailers = [...retailers];

  // Apply search filter if provided
  if (searchQuery) {
    const query = searchQuery.toLowerCase();
    filteredRetailers = filteredRetailers.filter(
      (retailer) =>
        retailer.name.toLowerCase().includes(query) ||
        retailer.description.toLowerCase().includes(query)
    );
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedRetailers = filteredRetailers.slice(startIndex, endIndex);

  return {
    retailers: paginatedRetailers,
    totalCount: filteredRetailers.length,
    totalPages: Math.ceil(filteredRetailers.length / limit),
    currentPage: page,
    limit,
  };
}

// Function to get a specific retailer by ID
export function getRetailerById(id: number) {
  return retailers.find((retailer) => retailer.id === id) || null;
}

// Map products to retailers based on the retailer name in the product
export function getProductsByRetailerId(
  retailerId: number,
  page: number = 1,
  limit: number = 20,
  filters?: any
) {
  const retailer = getRetailerById(retailerId);
  if (!retailer)
    return {
      products: [],
      totalCount: 0,
      totalPages: 0,
      currentPage: page,
      limit,
    };

  // Import product data from the existing file
  const { smartphones, audioProducts } = require("./product-data");

  // Combine all product arrays
  let allProducts: Product[] = [...smartphones, ...audioProducts];

  // Filter products by retailer name (converting to lowercase for case-insensitive comparison)
  const retailerName = retailer.name.toLowerCase();
  let filteredProducts = allProducts.filter(
    (product) =>
      product.retailer && product.retailer.toLowerCase() === retailerName
  );

  // Apply additional filters if provided
  if (filters) {
    // Filter by search query
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(query) ||
          (product.brand && product.brand.toLowerCase().includes(query)) ||
          (product.category && product.category.toLowerCase().includes(query))
      );
    }

    // Filter by price range
    if (filters.minPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price >= filters.minPrice
      );
    }

    if (filters.maxPrice !== undefined) {
      filteredProducts = filteredProducts.filter(
        (product) => product.price <= filters.maxPrice
      );
    }

    // Filter by availability
    if (filters.inStockOnly) {
      filteredProducts = filteredProducts.filter((product) => product.inStock);
    }

    // Filter by discount
    if (filters.hasDiscount) {
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.originalPrice !== undefined &&
          product.originalPrice > product.price
      );
    }

    // Apply sorting
    if (filters.sortBy) {
      switch (filters.sortBy) {
        case "price_asc":
          filteredProducts.sort((a, b) => a.price - b.price);
          break;
        case "price_desc":
          filteredProducts.sort((a, b) => b.price - a.price);
          break;
        case "name_asc":
          filteredProducts.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name_desc":
          filteredProducts.sort((a, b) => b.name.localeCompare(a.name));
          break;
        // Additional sorting options can be added here
        default:
          // Default sort, perhaps by popularity or newest
          break;
      }
    }
  }

  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  return {
    products: paginatedProducts,
    totalCount: filteredProducts.length,
    totalPages: Math.ceil(filteredProducts.length / limit),
    currentPage: page,
    limit,
  };
}
