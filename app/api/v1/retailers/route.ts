import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const page = parseInt(searchParams.get("page") || "1", 10);
  const limit = parseInt(searchParams.get("limit") || "10", 10);
  const search = searchParams.get("search") || "";
  const sort = searchParams.get("sort") || "name";
  const order = searchParams.get("order") || "asc";

  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
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

    // Provide fallback data when API is unavailable
    const fallbackData = {
      retailers: [
        {
          id: 1,
          name: "TechMart",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.8,
          product_count: 12500,
          verified: true,
          description: "Leading electronics retailer",
          website: "https://techmart.example.com",
          founded_year: 2005,
          headquarters: "New York, USA",
          contact: {
            phone: "+1 555-123-4567",
            email: "info@techmart.example.com",
          },
        },
        {
          id: 2,
          name: "ElectroHub",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.6,
          product_count: 9800,
          verified: true,
          description: "Premium gadgets & accessories",
          website: "https://electrohub.example.com",
          founded_year: 2008,
          headquarters: "San Francisco, USA",
          contact: {
            phone: "+1 555-987-6543",
            email: "support@electrohub.example.com",
          },
        },
        {
          id: 3,
          name: "GadgetWorld",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.7,
          product_count: 15600,
          verified: true,
          description: "Latest tech innovations",
          website: "https://gadgetworld.example.com",
          founded_year: 2010,
          headquarters: "London, UK",
          contact: {
            phone: "+44 20 1234 5678",
            email: "contact@gadgetworld.example.com",
          },
        },
        {
          id: 4,
          name: "DigitalStore",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.5,
          product_count: 8700,
          verified: true,
          description: "Digital lifestyle products",
          website: "https://digitalstore.example.com",
          founded_year: 2012,
          headquarters: "Tokyo, Japan",
          contact: {
            phone: "+81 3 1234 5678",
            email: "info@digitalstore.example.com",
          },
        },
        {
          id: 5,
          name: "TechZone",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.9,
          product_count: 20300,
          verified: true,
          description: "Professional tech solutions",
          website: "https://techzone.example.com",
          founded_year: 2007,
          headquarters: "Berlin, Germany",
          contact: {
            phone: "+49 30 1234 5678",
            email: "support@techzone.example.com",
          },
        },
        {
          id: 6,
          name: "ElectroMax",
          logo: "/placeholder.svg?height=60&width=120",
          rating: 4.4,
          product_count: 7600,
          verified: true,
          description: "Consumer electronics",
          website: "https://electromax.example.com",
          founded_year: 2009,
          headquarters: "Sydney, Australia",
          contact: {
            phone: "+61 2 1234 5678",
            email: "info@electromax.example.com",
          },
        },
      ],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_items: 6,
        items_per_page: limit,
      },
    };

    console.log("Using fallback retailers data due to API error");
    return NextResponse.json(fallbackData);
  }
}
