import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Forward the request to our backend API
    const apiUrl = `/api/v1/retailers/${id}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching retailer details:", error);

    return NextResponse.json(
      { error: "Failed to fetch retailer details" },
      { status: error.response?.status || 500 }
    );
  }
}
