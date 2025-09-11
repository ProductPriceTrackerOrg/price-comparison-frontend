import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Forward the request to our backend API
    const apiUrl = `/api/v1/products/${id}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product details:", error);

    return NextResponse.json(
      { error: "Failed to fetch product details" },
      { status: error.response?.status || 500 }
    );
  }
}
