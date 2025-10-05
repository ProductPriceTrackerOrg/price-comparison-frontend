import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = searchParams.get("page") || "1";
  const limit = searchParams.get("limit") || "10";
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "name";
  const order = searchParams.get("order") || "asc";

  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      page,
      limit,
      sort,
      order,
    });

    if (search) queryParams.append("search", search);

    // Forward the request to our backend API
    const apiUrl = `/api/v1/retailers/?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching retailers:", error);

    return NextResponse.json(
      { error: "Failed to fetch retailers" },
      { status: error.response?.status || 500 }
    );
  }
}
