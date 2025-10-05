import { Product } from "./product-data";

export interface Retailer {
  id: number;
  name: string;
  logo: string;
  rating: number;
  productCount: number;
  verified: boolean;
  description: string;
  website?: string;
  foundedYear?: number;
  headquarters?: string;
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };
}

export const retailers: Retailer[] = [
  {
    id: 1,
    name: "AppleMe",
    logo: "/placeholder-logo.svg",
    rating: 4.8,
    productCount: 1250,
    verified: true,
    description:
      "Leading electronics retailer specializing in mobile devices and accessories",
    website: "https://appleme.lk",
    foundedYear: 2015,
    headquarters: "Colombo, Sri Lanka",
    contact: {
      email: "info@appleme.lk",
      phone: "+94 11 123 4567",
      address: "123 Main St, Colombo 03, Sri Lanka",
    },
  },
  {
    id: 2,
    name: "RetailTech",
    logo: "/placeholder-logo.svg",
    rating: 4.6,
    productCount: 980,
    verified: true,
    description: "Premium gadgets & accessories for tech enthusiasts",
    website: "https://retailtech.lk",
    foundedYear: 2017,
    headquarters: "Kandy, Sri Lanka",
    contact: {
      email: "support@retailtech.lk",
      phone: "+94 11 234 5678",
      address: "456 Tech Park, Kandy, Sri Lanka",
    },
  },
  {
    id: 3,
    name: "LifeMobile",
    logo: "/placeholder-logo.svg",
    rating: 4.7,
    productCount: 1560,
    verified: true,
    description: "Latest mobile phones and smart devices at competitive prices",
    website: "https://lifemobile.lk",
    foundedYear: 2016,
    headquarters: "Galle, Sri Lanka",
    contact: {
      email: "care@lifemobile.lk",
      phone: "+94 11 345 6789",
      address: "789 Smart Plaza, Galle, Sri Lanka",
    },
  },
  {
    id: 4,
    name: "TechMart",
    logo: "/placeholder-logo.svg",
    rating: 4.5,
    productCount: 870,
    verified: true,
    description: "Digital lifestyle products for modern consumers",
    website: "https://techmart.lk",
    foundedYear: 2018,
    headquarters: "Colombo, Sri Lanka",
    contact: {
      email: "hello@techmart.lk",
      phone: "+94 11 456 7890",
      address: "321 Digital Avenue, Colombo 05, Sri Lanka",
    },
  },
  {
    id: 5,
    name: "Geekay",
    logo: "/placeholder-logo.svg",
    rating: 4.9,
    productCount: 2030,
    verified: true,
    description: "Professional tech solutions for businesses and individuals",
    website: "https://geekay.lk",
    foundedYear: 2014,
    headquarters: "Negombo, Sri Lanka",
    contact: {
      email: "business@geekay.lk",
      phone: "+94 11 567 8901",
      address: "654 Tech Tower, Negombo, Sri Lanka",
    },
  },
  {
    id: 6,
    name: "ElectroMart",
    logo: "/placeholder-logo.svg",
    rating: 4.4,
    productCount: 760,
    verified: true,
    description: "Consumer electronics for home and office",
    website: "https://electromart.lk",
    foundedYear: 2019,
    headquarters: "Matara, Sri Lanka",
    contact: {
      email: "sales@electromart.lk",
      phone: "+94 11 678 9012",
      address: "987 Electronic Square, Matara, Sri Lanka",
    },
  },
  {
    id: 7,
    name: "MobiTech",
    logo: "/placeholder-logo.svg",
    rating: 4.3,
    productCount: 550,
    verified: false,
    description: "Smartphones and accessories with excellent customer service",
    website: "https://mobitech.lk",
    foundedYear: 2020,
    headquarters: "Jaffna, Sri Lanka",
    contact: {
      email: "help@mobitech.lk",
      phone: "+94 11 789 0123",
      address: "246 Mobile Center, Jaffna, Sri Lanka",
    },
  },
  {
    id: 8,
    name: "GadgetGalaxy",
    logo: "/placeholder-logo.svg",
    rating: 4.2,
    productCount: 480,
    verified: false,
    description:
      "Innovative gadgets and tech accessories for modern lifestyles",
    website: "https://gadgetgalaxy.lk",
    foundedYear: 2021,
    headquarters: "Batticaloa, Sri Lanka",
    contact: {
      email: "contact@gadgetgalaxy.lk",
      phone: "+94 11 890 1234",
      address: "135 Innovation Hub, Batticaloa, Sri Lanka",
    },
  },
  {
    id: 9,
    name: "TechHub",
    logo: "/placeholder-logo.svg",
    rating: 4.6,
    productCount: 920,
    verified: true,
    description: "One-stop shop for all your technology needs",
    website: "https://techhub.lk",
    foundedYear: 2016,
    headquarters: "Anuradhapura, Sri Lanka",
    contact: {
      email: "info@techhub.lk",
      phone: "+94 11 901 2345",
      address: "579 Tech Plaza, Anuradhapura, Sri Lanka",
    },
  },
  {
    id: 10,
    name: "SmartStore",
    logo: "/placeholder-logo.svg",
    rating: 4.5,
    productCount: 680,
    verified: true,
    description: "Smart devices and solutions for the modern home",
    website: "https://smartstore.lk",
    foundedYear: 2018,
    headquarters: "Kurunegala, Sri Lanka",
    contact: {
      email: "care@smartstore.lk",
      phone: "+94 11 012 3456",
      address: "864 Smart Building, Kurunegala, Sri Lanka",
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
