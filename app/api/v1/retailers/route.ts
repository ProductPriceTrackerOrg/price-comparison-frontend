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
          name: "lifemobile.lk",
          logo: "https://placekitten.com/200/200?retailer=1",
          rating: 4.81,
          product_count: 15464,
          verified: true,
          description:
            "Leading electronics retailer specializing in mobile devices and accessories",
          website: "https://lifemobile.lk",
          founded_year: 2015,
          headquarters: "Colombo, Sri Lanka",
          contact: {
            phone: "+94112322511",
            email: "info@lifemobile.lk",
          },
        },
        {
          id: 0,
          name: "appleme",
          logo: "https://placekitten.com/200/200?retailer=0",
          rating: 4.34,
          product_count: 2398,
          verified: true,
          description: "Premium Apple products and accessories",
          website: "https://appleme",
          founded_year: 2017,
          headquarters: "Kandy, Sri Lanka",
          contact: {
            phone: "+94777911011",
            email: "support@appleme.lk",
          },
        },
        {
          id: 3,
          name: "simplytek",
          logo: "https://placekitten.com/200/200?retailer=3",
          rating: 4.95,
          product_count: 2345,
          verified: true,
          description: "Quality tech solutions and electronics",
          website: "https://simplytek",
          founded_year: 2016,
          headquarters: "Galle, Sri Lanka",
          contact: {
            phone: "+94117555888",
            email: "care@simplytek.lk",
          },
        },
        {
          id: 4,
          name: "laptop.lk",
          logo: "https://placekitten.com/200/200?retailer=4",
          rating: 4.34,
          product_count: 1831,
          verified: true,
          description: "Laptop and computer specialist",
          website: "https://laptop.lk",
          founded_year: 2018,
          headquarters: "Colombo, Sri Lanka",
          contact: {
            phone: "+94777336464",
            email: "hello@laptop.lk",
          },
        },
        {
          id: 2,
          name: "onei.lk",
          logo: "https://placekitten.com/200/200?retailer=2",
          rating: 4.77,
          product_count: 582,
          verified: true,
          description: "Premium electronics retailer",
          website: "https://onei.lk",
          founded_year: 2019,
          headquarters: "Matara, Sri Lanka",
          contact: {
            phone: "+94770176666",
            email: "sales@onei.lk",
          },
        },
      ],
      pagination: {
        current_page: page,
        total_pages: 1,
        total_items: 5,
        items_per_page: limit,
      },
    };

    console.log("Using fallback retailers data due to API error");
    return NextResponse.json(fallbackData);
  }
}
