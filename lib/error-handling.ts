import { AxiosError } from "axios";
import { NextResponse } from "next/server";

/**
 * Handles API request errors consistently across all API routes
 * @param error The error object from axios
 * @param context Additional context about the failed request
 * @returns A standardized NextResponse with appropriate status and error message
 */
export function handleApiError(
  error: any,
  context: string = "API request"
): NextResponse {
  // Log the error with context
  console.error(`Error in ${context}:`, error.message);

  // Determine the specific error type for better error handling
  if (error.code === "ECONNABORTED") {
    console.error(
      `${context}: Request timeout. The server took too long to respond.`
    );
    return NextResponse.json(
      { error: "Request timed out. Please try again later." },
      { status: 504 } // Gateway Timeout
    );
  }

  if (error.code === "ECONNREFUSED") {
    console.error(
      `${context}: Connection refused. The server may be down or unreachable.`
    );
    return NextResponse.json(
      { error: "Service temporarily unavailable. Please try again later." },
      { status: 503 } // Service Unavailable
    );
  }

  if (error.message && error.message.includes("socket hang up")) {
    console.error(
      `${context}: Socket hang up error. Connection terminated unexpectedly.`
    );
    return NextResponse.json(
      { error: "Connection interrupted. Please try again." },
      { status: 502 } // Bad Gateway
    );
  }

  if (error.message && error.message.includes("network timeout")) {
    console.error(`${context}: Network timeout error.`);
    return NextResponse.json(
      { error: "Network timeout. Please check your connection and try again." },
      { status: 504 } // Gateway Timeout
    );
  }

  // Handle axios specific errors
  if (error.response) {
    // The request was made and the server responded with a status code outside of 2xx range
    console.error(
      `${context}: Server responded with status ${error.response.status}`
    );
    return NextResponse.json(
      {
        error:
          error.response.data?.detail ||
          error.response.data?.error ||
          "Request failed with server error",
        status: error.response.status,
      },
      { status: error.response.status }
    );
  }

  // Generic error fallback
  return NextResponse.json(
    { error: "An unexpected error occurred. Please try again later." },
    { status: 500 }
  );
}
