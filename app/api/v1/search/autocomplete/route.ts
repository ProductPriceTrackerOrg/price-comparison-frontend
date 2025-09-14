import { NextResponse } from "next/server";
import axios from "axios";

/**
 * API handler for search autocomplete suggestions
 *
 * This endpoint proxies requests to the backend API for search autocomplete
 * It takes a query parameter 'q' and returns an array of suggestion strings
 */
export async function GET(request: Request) {
  try {
    // Get the query parameter
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");
    const limit = searchParams.get("limit") || "10";

    // Validate the query
    if (!query || query.length < 2) {
      return NextResponse.json({ suggestions: [] });
    }

    // Get the API URL from environment variables
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("API URL not configured");
      return NextResponse.json(
        { error: "API configuration error" },
        { status: 500 }
      );
    }

    // Forward the request to the backend API
    const response = await axios.get(`${apiUrl}/api/v1/search/autocomplete`, {
      params: {
        q: query,
        limit: parseInt(limit, 10),
      },
    });

    // Return the response data
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching search suggestions:", error.message);

    // Return an empty array on error rather than failing
    return NextResponse.json(
      { suggestions: [] },
      { status: error.response?.status || 500 }
    );
  }
}
