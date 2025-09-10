import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  // Extract filter parameters
  const category = searchParams.get("category");
  const retailer = searchParams.get("retailer");
  const minDiscount = searchParams.get("min_discount");
  const inStockOnly = searchParams.get("in_stock_only");
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "20";
  const sortBy = searchParams.get("sort_by") || "discount_desc";

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();

    // Add parameters only if they exist
    if (category) queryParams.append("category", category);
    if (retailer) queryParams.append("retailer", retailer);
    if (minDiscount !== null) queryParams.append("min_discount", minDiscount);
    if (inStockOnly !== null) queryParams.append("in_stock_only", inStockOnly);
    queryParams.append("page", page);
    queryParams.append("limit", limit);
    queryParams.append("sort_by", sortBy);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/top-deals/deals?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching top deals:", error);

    return NextResponse.json(
      { error: "Failed to fetch top deals" },
      { status: error.response?.status || 500 }
    );
  }
}
