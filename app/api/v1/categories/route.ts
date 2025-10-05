import { NextRequest, NextResponse } from 'next/server';
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  
  // Get query parameters
  const page = searchParams.get('page') || '1';
  const limit = searchParams.get('limit') || '20';
  const retailerId = searchParams.get('shop_id') || '';
  
  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      page,
      limit,
    });
    
    if (retailerId) {
      queryParams.append('shop_id', retailerId);
    }
    
    // Forward the request to our backend API
    const apiUrl = `/api/v1/categories?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching categories:", error);

    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: error.response?.status || 500 }
    );
  }
}