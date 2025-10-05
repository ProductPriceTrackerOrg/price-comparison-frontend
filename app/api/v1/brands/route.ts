import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;

  // Get query parameters
  const retailerId = searchParams.get("shop_id") || "";

  try {
    // Construct query params if retailer ID is provided
    let queryParams = new URLSearchParams();
    if (retailerId) {
      queryParams.append("shop_id", retailerId);
    }

    // Forward the request to our backend API
    const paramString = queryParams.toString()
      ? `?${queryParams.toString()}`
      : "";
    const apiUrl = `/api/v1/brands${paramString}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching brands:", error);

    return NextResponse.json(
      { error: "Failed to fetch brands" },
      { status: error.response?.status || 500 }
    );
  }
}
