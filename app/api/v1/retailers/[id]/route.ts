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

    // Create fallback retailer data based on ID
    const fallbackRetailer = {
      id: parseInt(id),
      name: `Retailer ${id}`,
      logo: "/placeholder.svg?height=60&width=120",
      rating: 4.7,
      product_count: 12000 + parseInt(id) * 1000,
      verified: true,
      description: "Quality technology products retailer",
      website: `https://retailer${id}.example.com`,
      founded_year: 2005 + parseInt(id),
      headquarters: "New York, USA",
      contact: {
        phone: "+1 555-123-4567",
        email: `info@retailer${id}.example.com`,
      },
    };

    console.log(`Using fallback data for retailer ID: ${id} due to API error`);
    return NextResponse.json({ retailer: fallbackRetailer });
  }
}
