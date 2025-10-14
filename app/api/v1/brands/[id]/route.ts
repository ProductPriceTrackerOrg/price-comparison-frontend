import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;

  try {
    // Forward the request to our backend API
    const apiUrl = `/api/v1/brands/${id}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching brand:", error);
    
    if (error.response?.status === 404) {
      return NextResponse.json({ error: "Brand not found" }, { status: 404 });
    }

    return NextResponse.json(
      { error: "Failed to fetch brand" },
      { status: error.response?.status || 500 }
    );
  }
}