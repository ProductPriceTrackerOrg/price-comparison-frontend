import api from "./api";

/**
 * Get all categories from the API
 * @param includeSubcategories Whether to include subcategories in the response
 * @returns List of categories with counts and other metadata
 */
export async function getAllCategories(includeSubcategories: boolean = true) {
  try {
    const response = await api.get(`/api/v1/categories`, {
      params: {
        include_subcategories: includeSubcategories,
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching categories:", error);
    throw error;
  }
}

/**
 * Get products for a specific category
 * @param categoryId The ID of the category
 * @param options Optional parameters for pagination, filtering, and sorting
 * @returns Products for the specified category with pagination and filter metadata
 */
export async function getCategoryProducts(
  categoryId: number,
  options: {
    page?: number;
    limit?: number;
    sortBy?: "price_asc" | "price_desc" | "name_asc";
    brand?: string;
    minPrice?: number;
    maxPrice?: number;
  } = {}
) {
  try {
    const {
      page = 1,
      limit = 20,
      sortBy = "price_asc",
      brand,
      minPrice,
      maxPrice,
    } = options;

    const params: Record<string, string | number | boolean> = {
      page,
      limit,
      sort_by: sortBy,
    };

    if (brand) params.brand = brand;
    if (minPrice !== undefined) params.min_price = minPrice;
    if (maxPrice !== undefined) params.max_price = maxPrice;

    const response = await api.get(
      `/api/v1/categories/${categoryId}/products`,
      { params }
    );
    return response.data;
  } catch (error) {
    console.error(`Error fetching products for category ${categoryId}:`, error);
    throw error;
  }
}
