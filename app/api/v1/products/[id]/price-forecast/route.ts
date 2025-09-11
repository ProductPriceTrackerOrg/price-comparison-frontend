import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "30";

  try {
    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("days", days);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/products/${id}/price-forecast?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product price forecast:", error);

    // If we don't have price forecasting implemented in backend yet,
    // return mock data with a 404 so the frontend can handle accordingly
    if (error.response?.status === 404) {
      return NextResponse.json(
        {
          error: "Price forecasting not available for this product",
          mock: true,
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { error: "Failed to fetch product price forecast" },
      { status: error.response?.status || 500 }
    );
  }
}
