import { NextResponse } from "next/server";
import api from "@/lib/api";
import { handleApiError } from "@/lib/error-handling";

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

    // Forward the request to the backend API using our configured API client
    // that now has retry logic and better error handling
    const response = await api.get("/api/v1/search/autocomplete", {
      params: {
        q: query,
        limit: parseInt(limit, 10),
      },
    });

    // Return the response data
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching search suggestions:", error.message);

    // For autocomplete, we can return an empty array rather than an error
    // This creates a better UX since autocomplete is non-critical functionality
    if (
      error.code === "ECONNABORTED" ||
      error.code === "ECONNREFUSED" ||
      error.message?.includes("socket hang up") ||
      (error.response && error.response.status >= 500)
    ) {
      console.warn("Search autocomplete unavailable, returning empty results");
      return NextResponse.json({ suggestions: [] });
    }

    // For other errors, use the standard error handler
    return handleApiError(error, "Search autocomplete");
  }
}
