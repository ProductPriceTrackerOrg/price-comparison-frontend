import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  try {
    // Forward the request to our backend API
    const apiUrl = `/api/v1/home/price-changes?${searchParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching price changes:", error);

    return NextResponse.json(
      { error: "Failed to fetch price changes" },
      { status: error.response?.status || 500 }
    );
  }
}
