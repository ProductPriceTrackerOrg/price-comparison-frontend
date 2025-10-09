import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "8", 10);

  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    // Forward the request to our backend API
    const apiUrl = `/api/v1/home/retailers?${queryParams}`;
    const response = await api.get(apiUrl);

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching home retailers:", error);

    // Provide fallback data matching the BigQuery schema
    const fallbackData = {
      retailers: [
        {
          shop_id: 1,
          name: "lifemobile.lk",
          website_url: "https://lifemobile.lk",
          contact_phone: "+94112322511",
          contact_whatsapp: "+94770000111",
          product_count: 15464,
          avg_rating: 4.81,
          specialty: "Electronics",
          logo: "https://placekitten.com/200/200?retailer=1",
        },
        {
          shop_id: 0,
          name: "appleme",
          website_url: "https://appleme.lk",
          contact_phone: "+94777911011",
          contact_whatsapp: "+94777911022",
          product_count: 2398,
          avg_rating: 4.34,
          specialty: "Electronics",
          logo: "https://placekitten.com/200/200?retailer=0",
        },
        {
          shop_id: 3,
          name: "simplytek",
          website_url: "https://simplytek.lk",
          contact_phone: "+94117555888",
          contact_whatsapp: "+94117555889",
          product_count: 2345,
          avg_rating: 4.95,
          specialty: "Electronics",
          logo: "https://placekitten.com/200/200?retailer=3",
        },
        {
          shop_id: 4,
          name: "laptop.lk",
          website_url: "https://laptop.lk",
          contact_phone: "+94777336464",
          contact_whatsapp: "+94777336465",
          product_count: 1831,
          avg_rating: 4.34,
          specialty: "Electronics",
          logo: "https://placekitten.com/200/200?retailer=4",
        },
        {
          shop_id: 2,
          name: "onei.lk",
          website_url: "https://onei.lk",
          contact_phone: "+94770176666",
          contact_whatsapp: "+94770176667",
          product_count: 582,
          avg_rating: 4.77,
          specialty: "Electronics",
          logo: "https://placekitten.com/200/200?retailer=2",
        },
      ],
    };

    console.log("Using fallback home retailers data due to API error");
    return NextResponse.json(fallbackData);
  }
}
