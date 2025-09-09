import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "90";
  const retailerId = searchParams.get("retailerId");

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("days", days);
    if (retailerId) queryParams.append("retailer_id", retailerId);
    
    // Forward the request to our backend API
    const apiUrl = `/api/v1/products/${id}/price-history?${queryParams}`;
    const response = await api.get(apiUrl);
    
    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product price history:", error);
    
    return NextResponse.json(
      { error: "Failed to fetch product price history" },
      { status: error.response?.status || 500 }
    );
  }
}
