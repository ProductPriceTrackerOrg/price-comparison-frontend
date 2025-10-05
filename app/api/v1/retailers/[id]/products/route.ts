import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

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
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching retailer products:", error);

    return NextResponse.json(
      { error: "Failed to fetch retailer products" },
      { status: error.response?.status || 500 }
    );
  }
}
