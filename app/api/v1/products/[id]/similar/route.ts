import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "5"; // Default to 5 similar products

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/products/${id}/similar?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching similar products:", error);

    // If endpoint not implemented yet, return a 404
    if (error.response?.status === 404) {
      return NextResponse.json(
        { error: "Similar products not available for this product" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch similar products" },
      { status: error.response?.status || 500 }
    );
  }
}
