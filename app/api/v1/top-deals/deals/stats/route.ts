import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to our backend API
    const apiUrl = `/api/v1/top-deals/deals/stats`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching top deals stats:", error);

    return NextResponse.json(
      { error: "Failed to fetch top deals statistics" },
      { status: error.response?.status || 500 }
    );
  }
}
