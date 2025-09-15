import { NextResponse } from 'next/server';
import { categoriesData } from '@/lib/category-data';

export async function GET(request: Request) {
  // Get query parameters
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit') || '20', 10);
  const page = parseInt(searchParams.get('page') || '1', 10);
  
  // Calculate pagination
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  const paginatedCategories = categoriesData.slice(startIndex, endIndex);
  
  // Count total products across all categories
  const totalProducts = categoriesData.reduce(
    (sum, category) => sum + category.product_count, 
    0
  );
  
  const response = {
    categories: paginatedCategories,
    total_categories: categoriesData.length,
    total_products: totalProducts,
    pagination: {
      current_page: page,
      total_pages: Math.ceil(categoriesData.length / limit),
      total_items: categoriesData.length,
      items_per_page: limit
    }
  };
  
  return NextResponse.json(response);
}