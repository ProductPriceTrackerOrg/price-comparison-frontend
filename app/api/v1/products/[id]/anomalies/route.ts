import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const days = searchParams.get("days") || "30";
  const minScore =
    searchParams.get("minScore") || searchParams.get("min_score");
  const retailerId =
    searchParams.get("retailerId") || searchParams.get("retailer_id");

  try {
    const queryParams = new URLSearchParams();
    if (days) {
      queryParams.append("days", days);
    }
    if (minScore) {
      queryParams.append("min_score", minScore);
    }
    if (retailerId) {
      queryParams.append("retailer_id", retailerId);
    }

    const queryString = queryParams.toString();
    const apiUrl = queryString
      ? `/api/v1/products/${id}/anomalies?${queryString}`
      : `/api/v1/products/${id}/anomalies`;
    const response = await api.get(apiUrl);

    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product price anomalies:", error);

    if (error.response?.status === 404) {
      return NextResponse.json({ anomalies: [] }, { status: 200 });
    }

    return NextResponse.json(
      { error: "Failed to fetch product price anomalies" },
      {
        status: error.response?.status || 500,
      }
    );
  }
}
