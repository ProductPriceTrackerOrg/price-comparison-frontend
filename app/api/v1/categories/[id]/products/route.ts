import { NextResponse } from "next/server";
import { findCategoryById } from "@/lib/category-data";

// Mock product data generator function
const generateMockProducts = (
  categoryId: number,
  count: number,
  page: number
) => {
  const products = [];
  const startIndex = (page - 1) * count;

  // Get brands for this category
  const brands = [
    "Samsung",
    "Apple",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Acer",
    "MSI",
  ];
  const retailers = [
    "simplytek",
    "onei.lk",
    "appleme",
    "laptops.lk",
    "lifemobile",
  ];

  for (let i = 0; i < count; i++) {
    const id = startIndex + i + 1;
    const price = Math.floor(Math.random() * 100000) + 5000; // Between 5,000 and 105,000
    const discountPercent = Math.floor(Math.random() * 30); // 0-30% discount
    const originalPrice = Math.floor(price * (100 / (100 - discountPercent)));
    const brandIndex = Math.floor(Math.random() * brands.length);
    const retailerIndex = Math.floor(Math.random() * retailers.length);
    const rating = (Math.random() * 4 + 1).toFixed(1); // 1.0-5.0 rating

    products.push({
      id: id,
      name: `Product ${id} in Category ${categoryId}`,
      brand: brands[brandIndex],
      category: categoryId,
      price: price,
      originalPrice: discountPercent > 0 ? originalPrice : undefined,
      retailer: retailers[retailerIndex],
      retailer_id: retailerIndex + 1,
      inStock: Math.random() > 0.2, // 80% chance of being in stock
      image: `/images/product-${(id % 10) + 1}.jpg`, // Cycle through 10 images
      rating: parseFloat(rating),
      discount: discountPercent > 0 ? discountPercent : undefined,
    });
  }

  return products;
};

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const categoryId = parseInt(params.id, 10);

  // Get the category from our data
  const category = findCategoryById(categoryId);

  if (!category) {
    return NextResponse.json({ error: "Category not found" }, { status: 404 });
  }

  // Parse query parameters
  const { searchParams } = new URL(request.url);
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "20", 10);
  const brand = searchParams.get("brand") || undefined;
  const minPrice = searchParams.get("min_price")
    ? parseInt(searchParams.get("min_price") || "0", 10)
    : undefined;
  const maxPrice = searchParams.get("max_price")
    ? parseInt(searchParams.get("max_price") || "1000000", 10)
    : undefined;
  const sortBy = searchParams.get("sort_by") || "price_asc";

  // Generate mock products
  const totalItems = category.product_count;
  const totalPages = Math.ceil(totalItems / limit);

  let products = generateMockProducts(categoryId, limit, page);

  // Apply brand filter if specified
  if (brand && brand !== "all") {
    products = products.filter((product) => product.brand === brand);
  }

  // Apply price filters if specified
  if (minPrice !== undefined) {
    products = products.filter((product) => product.price >= minPrice);
  }

  if (maxPrice !== undefined) {
    products = products.filter((product) => product.price <= maxPrice);
  }

  // Apply sorting
  if (sortBy === "price_asc") {
    products.sort((a, b) => a.price - b.price);
  } else if (sortBy === "price_desc") {
    products.sort((a, b) => b.price - a.price);
  } else if (sortBy === "name_asc") {
    products.sort((a, b) => a.name.localeCompare(b.name));
  } else if (sortBy === "name_desc") {
    products.sort((a, b) => b.name.localeCompare(a.name));
  }

  // Get unique brands from products for filtering
  const allBrands = [
    "Samsung",
    "Apple",
    "Sony",
    "LG",
    "Dell",
    "HP",
    "Lenovo",
    "Asus",
    "Acer",
    "MSI",
  ];
  const brandFilters = allBrands.map((name) => ({
    name,
    count: Math.floor(Math.random() * 100) + 10, // Random count between 10-110
  }));

  // Construct the response
  const response = {
    category: {
      category_id: category.category_id,
      name: category.name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      parent_category_id: category.parent_category_id,
      product_count: category.product_count,
    },
    products: products,
    pagination: {
      current_page: page,
      total_pages: totalPages,
      total_items: totalItems,
      items_per_page: limit,
    },
    filters: {
      brands: brandFilters,
    },
  };

  return NextResponse.json(response);
}
