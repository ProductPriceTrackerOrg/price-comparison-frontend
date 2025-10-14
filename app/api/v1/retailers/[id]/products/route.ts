import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { handleApiError } from "@/lib/error-handling";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const searchParams = request.nextUrl.searchParams;

  // Get all query parameters
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const search = searchParams.get("search") || "";
  const category = searchParams.get("category") || "";
  const brand = searchParams.get("brand") || "";
  const minPrice = searchParams.get("min_price") || "";
  const maxPrice = searchParams.get("max_price") || "";
  const inStock = searchParams.get("in_stock") || "";
  const hasDiscount = searchParams.get("has_discount") || "";
  const sort = searchParams.get("sort") || "newest";

  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
    });

    if (search) queryParams.append("search", search);
    if (category) queryParams.append("category", category);
    if (brand) queryParams.append("brand", brand);
    if (minPrice) queryParams.append("min_price", minPrice);
    if (maxPrice) queryParams.append("max_price", maxPrice);
    if (inStock) queryParams.append("in_stock", inStock);
    if (hasDiscount) queryParams.append("has_discount", hasDiscount);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/retailers/${id}/products?${queryParams}`;
    console.log(`[API Route] Forwarding request to: ${apiUrl}`);

    const response = await api.get(apiUrl);
    console.log(
      `[API Route] Received response with status: ${
        response.status
      }, data keys: ${Object.keys(response.data || {})}`
    );

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      `[API Route] Error fetching retailer products for ID ${id}:`,
      error.message
    );

    // In development, we can provide mock data if the backend is not available
    if (
      process.env.NODE_ENV === "development" &&
      (error.code === "ECONNREFUSED" ||
        error.message?.includes("socket hang up"))
    ) {
      console.log("[API Route] Providing fallback data for development");
      console.log("[API Route] Generating fallback data for development mode");

      // Create fallback data with exact structure needed by the frontend
      return NextResponse.json({
        retailer: {
          id: parseInt(id),
          name: "Demo Retailer",
          description: "This is a fallback retailer for development",
          product_count: 42,
          rating: 4.5,
          verified: true,
        },
        products: Array(12)
          .fill(null)
          .map((_, i) => ({
            id: i + 1,
            name: `Demo Product ${i + 1}`,
            brand: "Demo Brand",
            category: "Electronics",
            category_name: "Electronics",
            price: 100 + i * 50,
            original_price: 150 + i * 50,
            discount: 10,
            in_stock: true,
            shop_id: parseInt(id),
            shop_name: "Demo Retailer",
            image: "/placeholder.svg?height=200&width=200",
            // Extra fields that might be used by components
            description: `This is a demo product ${
              i + 1
            } for development purposes.`,
          })),
        pagination: {
          total_pages: 3,
          total_items: 36,
          current_page: parseInt(page),
        },
        filters: {
          categories: [
            { id: 1, name: "Electronics", count: 20 },
            { id: 2, name: "Home", count: 12 },
          ],
          brands: [
            { id: 1, name: "Demo Brand", count: 18 },
            { id: 2, name: "Test Brand", count: 14 },
          ],
          minPrice: 100,
          maxPrice: 2000,
        },
      });
    }

    // Use our centralized error handler
    return handleApiError(error, `Fetching retailer products (ID: ${id})`);
  }
}
