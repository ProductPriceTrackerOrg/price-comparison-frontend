// This file serves as a central repository for product data used across components
// It allows us to maintain consistent product information across the application

export interface Product {
  id: number;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  retailer: string;
  inStock: boolean;
  image: string;
  discount?: number;
  variantId?: number;
  variantTitle?: string;
}

export interface TrendingProduct extends Product {
  trendScore?: number;
  searchVolume?: string;
  priceChange?: number;
  trendingPosition?: number;
  trendingChange?: "up" | "down" | "neutral" | "new";
  lastWeekPosition?: number | null;
  daysInTrending?: number;
  isNew?: boolean;
}

export interface RecommendedProduct extends Product {
  recommendationType: string;
  recommendationScore: number;
}

// Categories available in the system
export const productCategories = [
  { value: "Smartphones", label: "Smartphones" },
  { value: "Laptops", label: "Laptops" },
  { value: "Audio", label: "Audio" },
  { value: "Monitors", label: "Monitors" },
  { value: "Tablets", label: "Tablets" },
  { value: "Accessories", label: "Accessories" },
  { value: "Gaming", label: "Gaming" },
  { value: "Wearables", label: "Wearables" },
  { value: "Printers", label: "Printers" },
  { value: "TVs", label: "TVs" },
];

// Retailers available in the system
export const productRetailers = [
  { value: "appleme", label: "AppleMe" },
  { value: "retailtech", label: "RetailTech" },
  { value: "lifemobile", label: "LifeMobile" },
  { value: "techmart", label: "TechMart" },
  { value: "geekay", label: "Geekay" },
  { value: "electromart", label: "ElectroMart" },
];

// Function to format currency with "Rs" prefix
export const formatCurrency = (amount: number) => {
  return (
    "Rs " +
    new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount)
  );
};

// Function to calculate discount percentage
export const calculateDiscount = (
  currentPrice: number,
  originalPrice?: number
) => {
  if (!originalPrice || originalPrice <= currentPrice) return null;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
};

// Example smartphones data
export const smartphones: Product[] = [
  {
    id: 1148492274,
    name: "Samsung Galaxy A14 5G 6GB RAM 128GB",
    brand: "Samsung",
    category: "Smartphones",
    price: 62755.32,
    retailer: "appleme",
    inStock: false,
    image: "https://appleme.lk/wp-content/uploads/2023/12/a14-5g.jpg",
  },
  {
    id: 1107942397,
    name: "Samsung Galaxy A16 5G 8GB RAM 256GB",
    brand: "Samsung",
    category: "Smartphones",
    price: 88244.68,
    retailer: "appleme",
    inStock: false,
    image: "https://appleme.lk/wp-content/uploads/2025/03/a16.webp",
  },
  {
    id: 2731712037,
    name: "Samsung Galaxy A04s 4GB RAM 64GB",
    brand: "Samsung",
    category: "Smartphones",
    price: 43074.47,
    retailer: "appleme",
    inStock: false,
    image: "https://appleme.lk/wp-content/uploads/2023/12/A04s.png",
  },
  {
    id: 546725477,
    name: "Redmi Note 13 4G 6GB RAM 128GB",
    brand: "Redmi",
    category: "Smartphones",
    price: 65957.45,
    retailer: "appleme",
    inStock: false,
    image: "https://appleme.lk/wp-content/uploads/2024/02/13_1.jpg",
  },
  {
    id: 3640395524,
    name: "Samsung Galaxy M14 4G 6GB RAM 128GB",
    brand: "Samsung",
    category: "Smartphones",
    price: 54787.23,
    retailer: "appleme",
    inStock: false,
    image:
      "https://appleme.lk/wp-content/uploads/2024/07/Samsung-M14-6GB-128GB-Dark-Blue-by-appleme.lk-in-srilanka-01.png",
  },
];

// Example audio products data
export const audioProducts: RecommendedProduct[] = [
  {
    id: 2471247207,
    name: "NDR-1222 Speaker",
    brand: "NDR-1222",
    category: "Audio",
    price: 74351.06,
    retailer: "appleme",
    inStock: false,
    image:
      "https://appleme.lk/wp-content/uploads/2024/03/NDR-1222-Speaker-by-otc.lk-in-Sri-Lanka.jpg",
    recommendationType: "COMPLEMENTARY",
    recommendationScore: 0.92,
  },
  {
    id: 3393339538,
    name: "WIWU Thunder P20 Bluetooth Speaker",
    brand: "WIWU",
    category: "Audio",
    price: 46797.87,
    retailer: "appleme",
    inStock: false,
    image:
      "https://appleme.lk/wp-content/uploads/2024/02/wiwu-p20-thunder-bluetooth-speaker-and-karaoke-bluetooth-microphone-speaker-wiwu-323379-29-B.jpg",
    recommendationType: "COMPLEMENTARY",
    recommendationScore: 0.88,
  },
  {
    id: 379023707,
    name: "SOUNARC M1 Karaoke Party Speaker",
    brand: "SOUNARC",
    category: "Audio",
    price: 34031.91,
    retailer: "appleme",
    inStock: false,
    image:
      "https://appleme.lk/wp-content/uploads/2024/02/b431d3d052521bd0b6880158d755c576.webp",
    recommendationType: "COLLABORATIVE",
    recommendationScore: 0.87,
  },
  {
    id: 3614605393,
    name: "SOUNARC A1 Karaoke Party Speaker",
    brand: "SOUNARC",
    category: "Audio",
    price: 31904.26,
    retailer: "appleme",
    inStock: false,
    image: "https://appleme.lk/wp-content/uploads/2024/02/A1-1.webp",
    recommendationType: "COLLABORATIVE",
    recommendationScore: 0.85,
  },
  {
    id: 5647894321,
    name: "Bose SoundLink Flex Bluetooth Speaker",
    brand: "Bose",
    category: "Audio",
    price: 32978.72,
    originalPrice: 38297.87,
    retailer: "retailtech",
    inStock: true,
    image:
      "https://www.retailtech.lk/wp-content/uploads/2023/07/Bose-SoundLink-Flex-Black.jpg",
    recommendationType: "COMPLEMENTARY",
    recommendationScore: 0.86,
  },
  {
    id: 3987645221,
    name: "JBL PartyBox 110 Portable Party Speaker",
    brand: "JBL",
    category: "Audio",
    price: 85106.38,
    retailer: "retailtech",
    inStock: true,
    image:
      "https://www.retailtech.lk/wp-content/uploads/2022/01/JBL-PartyBox-110-1.jpg",
    recommendationType: "COLLABORATIVE",
    recommendationScore: 0.83,
  },
];

// Example laptops data
export const laptops: Product[] = [
  {
    id: 9387462510,
    name: "Apple MacBook Air M2 8GB RAM 256GB SSD",
    brand: "Apple",
    category: "Laptops",
    price: 298936.17,
    originalPrice: 319148.94,
    retailer: "appleme",
    inStock: true,
    image:
      "https://appleme.lk/wp-content/uploads/2023/01/macbook-air-m2-midnight.jpeg",
    discount: 6,
  },
  {
    id: 6473829105,
    name: "Lenovo IdeaPad 3 15ITL6 Core i5 8GB RAM 512GB SSD",
    brand: "Lenovo",
    category: "Laptops",
    price: 148936.17,
    retailer: "techmart",
    inStock: true,
    image:
      "https://www.techmart.lk/wp-content/uploads/2023/08/lenovo-ideapad-3-15itl6.jpg",
  },
  {
    id: 5367821904,
    name: "ASUS VivoBook 15 OLED K513EA Core i7 16GB RAM 512GB SSD",
    brand: "ASUS",
    category: "Laptops",
    price: 212765.96,
    originalPrice: 234042.55,
    retailer: "techmart",
    inStock: true,
    image:
      "https://www.techmart.lk/wp-content/uploads/2023/06/asus-vivobook-15-oled.jpg",
    discount: 9,
  },
  {
    id: 8293746510,
    name: "HP Pavilion 15 Core i5 16GB RAM 1TB SSD",
    brand: "HP",
    category: "Laptops",
    price: 181914.89,
    retailer: "electromart",
    inStock: true,
    image:
      "https://www.electromart.lk/wp-content/uploads/2023/10/hp-pavilion-15.jpg",
  },
  {
    id: 7382910456,
    name: "Dell XPS 13 Core i7 16GB RAM 512GB SSD",
    brand: "Dell",
    category: "Laptops",
    price: 319148.94,
    retailer: "techmart",
    inStock: false,
    image: "https://www.techmart.lk/wp-content/uploads/2024/01/dell-xps-13.jpg",
  },
];
