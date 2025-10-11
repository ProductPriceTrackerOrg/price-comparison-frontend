import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = params.id;
  const { searchParams } = new URL(request.url);
  const limit = searchParams.get("limit") || "4"; // Default to 4 recommendations

  try {
    // Get user session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Build query parameters
    const queryParams = new URLSearchParams();
    queryParams.append("limit", limit);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/products/${id}/recommendations?${queryParams}`;

    // Extract the Authorization header from the incoming request
    const authHeader = request.headers.get("Authorization");

    // Use header from request first, fall back to session token
    let headers = {};

    if (authHeader) {
      // If request has Authorization header, use it directly
      headers = { Authorization: authHeader };
      console.log("Using Authorization header from request");
    } else if (session?.access_token) {
      // Otherwise use session token if available
      headers = { Authorization: `Bearer ${session.access_token}` };
      console.log("Using session token for auth");
    } else {
      console.log("No authentication token available");
    }

    console.log(
      "Fetching product recommendations with auth:",
      !!(authHeader || session?.access_token)
    );

    // Set timeout to 20 seconds
    const response = await api.get(apiUrl, {
      headers,
      timeout: 20000, // 20 seconds timeout
    });

    // Log the backend response
    console.log("Backend API response structure:", Object.keys(response.data));
    console.log(
      "Has recommended_products:",
      !!response.data.recommended_products
    );

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching product recommendations:", error);

    // Provide fallback empty response
    return NextResponse.json(
      {
        error: "Failed to fetch product recommendations",
        recommended_products: [],
      },
      { status: error.response?.status || 500 }
    );
  }
}
