// Category data based on the provided API response
export interface Category {
  category_id: number;
  name: string;
  description: string;
  product_count: number;
  parent_category_id: number | null;
  subcategories: any[];
  trending_score: number;
  icon: string;
  color: string;
}

export interface CategoryResponse {
  categories: Category[];
  total_categories: number;
  total_products: number;
}

// Static category data from the API
export const categoriesData: Category[] = [
  {
    category_id: 6,
    name: "Cases & Screen Protectors",
    description: "Cases & Screen Protectors and accessories",
    product_count: 2354,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "cases_&_screen_protectors",
    color: "blue",
  },
  {
    category_id: 7,
    name: "Chargers & Power Banks",
    description: "Chargers & Power Banks and accessories",
    product_count: 2004,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "chargers_&_power_banks",
    color: "blue",
  },
  {
    category_id: 16,
    name: "Mobile Phones",
    description: "Mobile Phones and accessories",
    product_count: 1650,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "mobile_phones",
    color: "blue",
  },
  {
    category_id: 2,
    name: "Cables & Adapters",
    description: "Cables & Adapters and accessories",
    product_count: 1599,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "cables_&_adapters",
    color: "blue",
  },
  {
    category_id: 10,
    name: "Headphones & Earbuds",
    description: "Headphones & Earbuds and accessories",
    product_count: 1378,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "headphones_&_earbuds",
    color: "blue",
  },
  {
    category_id: 23,
    name: "Smart Watches & Accessories",
    description: "Smart Watches & Accessories and accessories",
    product_count: 1183,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "smart_watches_&_accessories",
    color: "blue",
  },
  {
    category_id: 13,
    name: "Laptops",
    description: "Laptops and accessories",
    product_count: 1057,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "laptops",
    color: "blue",
  },
  {
    category_id: 24,
    name: "Speakers",
    description: "Speakers and accessories",
    product_count: 927,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "speakers",
    color: "blue",
  },
  {
    category_id: 26,
    name: "Tablets",
    description: "Tablets and accessories",
    product_count: 436,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "tablets",
    color: "blue",
  },
  {
    category_id: 22,
    name: "Smart Home & Office Accessories",
    description: "Smart Home & Office Accessories and accessories",
    product_count: 431,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "smart_home_&_office_accessories",
    color: "blue",
  },
  {
    category_id: 5,
    name: "Car Accessories",
    description: "Car Accessories and accessories",
    product_count: 402,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "car_accessories",
    color: "blue",
  },
  {
    category_id: 25,
    name: "Storage",
    description: "Storage and accessories",
    product_count: 380,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "storage",
    color: "blue",
  },
  {
    category_id: 15,
    name: "Mice",
    description: "Mice and accessories",
    product_count: 359,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "mice",
    color: "blue",
  },
  {
    category_id: 21,
    name: "Printers & Scanners",
    description: "Printers & Scanners and accessories",
    product_count: 307,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "printers_&_scanners",
    color: "blue",
  },
  {
    category_id: 0,
    name: "Bags, Sleeves & Backpacks",
    description: "Bags, Sleeves & Backpacks and accessories",
    product_count: 278,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "bags,_sleeves_&_backpacks",
    color: "blue",
  },
  {
    category_id: 3,
    name: "Camera Accessories",
    description: "Camera Accessories and accessories",
    product_count: 271,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "camera_accessories",
    color: "blue",
  },
  {
    category_id: 17,
    name: "Monitors",
    description: "Monitors and accessories",
    product_count: 268,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "monitors",
    color: "blue",
  },
  {
    category_id: 4,
    name: "Cameras & Drones",
    description: "Cameras & Drones and accessories",
    product_count: 209,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "cameras_&_drones",
    color: "blue",
  },
  {
    category_id: 12,
    name: "Keyboards",
    description: "Keyboards and accessories",
    product_count: 199,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "keyboards",
    color: "blue",
  },
  {
    category_id: 11,
    name: "Health & Personal Care Electronics",
    description: "Health & Personal Care Electronics and accessories",
    product_count: 162,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "health_&_personal_care_electronics",
    color: "blue",
  },
  {
    category_id: 19,
    name: "Networking",
    description: "Networking and accessories",
    product_count: 159,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "networking",
    color: "blue",
  },
  {
    category_id: 27,
    name: "Webcams & Microphones",
    description: "Webcams & Microphones and accessories",
    product_count: 114,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "webcams_&_microphones",
    color: "blue",
  },
  {
    category_id: 8,
    name: "Gaming Peripherals",
    description: "Gaming Peripherals and accessories",
    product_count: 65,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "gaming_peripherals",
    color: "blue",
  },
  {
    category_id: 14,
    name: "Memory",
    description: "Memory and accessories",
    product_count: 59,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "memory",
    color: "blue",
  },
  {
    category_id: 9,
    name: "Graphic Cards",
    description: "Graphic Cards and accessories",
    product_count: 50,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "graphic_cards",
    color: "blue",
  },
  {
    category_id: 20,
    name: "Power Supplies & PC Cooling",
    description: "Power Supplies & PC Cooling and accessories",
    product_count: 35,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "power_supplies_&_pc_cooling",
    color: "blue",
  },
  {
    category_id: 1,
    name: "CPUs",
    description: "CPUs and accessories",
    product_count: 34,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "cpus",
    color: "blue",
  },
  {
    category_id: 18,
    name: "Motherboards",
    description: "Motherboards and accessories",
    product_count: 30,
    parent_category_id: null,
    subcategories: [],
    trending_score: 0,
    icon: "motherboards",
    color: "blue",
  },
];

/**
 * Helper function to convert category name to slug
 */
export const categoryNameToSlug = (name: string): string => {
  return name
    .toLowerCase()
    .replace(/&+/g, "and") // Replace & with 'and'
    .replace(/[^\w\s-]/g, "") // Remove any special chars except spaces and hyphens
    .replace(/\s+/g, "-") // Replace spaces with hyphens
    .replace(/-+/g, "-"); // Replace multiple hyphens with single one
};

/**
 * Helper function to convert category slug to name
 */
export const categorySlugToName = (slug: string): string => {
  // First replace "and" with "&" to handle special case
  const nameWithAnds = slug
    .split("-")
    .map((word) => {
      if (word === "and") return "&";
      return word.charAt(0).toUpperCase() + word.slice(1);
    })
    .join(" ");

  // Handle case where "and" was part of the slug but not meant to be an ampersand
  return nameWithAnds.replace(/\s+And\s+/g, " & ");
};

/**
 * Find category by ID
 */
export const findCategoryById = (id: number): Category | undefined => {
  return categoriesData.find((category) => category.category_id === id);
};

/**
 * Find category ID by slug
 */
export const findCategoryIdBySlug = (slug: string): number | undefined => {
  const categoryName = categorySlugToName(slug);
  const category = categoriesData.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
  return category?.category_id;
};

/**
 * Find category by slug
 */
export const findCategoryBySlug = (slug: string): Category | undefined => {
  const categoryName = categorySlugToName(slug);
  return categoriesData.find(
    (cat) => cat.name.toLowerCase() === categoryName.toLowerCase()
  );
};

/**
 * Get top categories by product count
 */
export const getTopCategories = (count: number = 8): Category[] => {
  return [...categoriesData]
    .sort((a, b) => b.product_count - a.product_count)
    .slice(0, count);
};
