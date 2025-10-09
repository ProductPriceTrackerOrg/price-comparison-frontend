import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    // Get user session from Supabase
    const {
      data: { session },
    } = await supabase.auth.getSession();

    // Construct query params
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    // Forward the request to our backend API
    const apiUrl = `/api/v1/home/recommendations?${queryParams}`;

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
      "Fetching recommendations with auth:",
      !!(authHeader || session?.access_token)
    );

    // Set timeout to 20 seconds
    const response = await api.get(apiUrl, {
      headers,
      timeout: 20000, // 20 seconds timeout
    });

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(
      "Error fetching personalized recommendations:",
      error.message
    );

    // Check for timeout errors
    if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
      console.error("Request timed out, returning fallback data");
    }

    // Provide fallback data when API is unavailable
    const fallbackData = {
      recommended_products: [
        {
          id: 3568948440,
          name: "UGREEN 3.5mm Male to 3.5mm Male Braided Cable 1m",
          brand: "SimplyTek",
          category: "Accessories",
          price: 999,
          original_price: 1499,
          retailer: "simplytek",
          in_stock: true,
          image:
            "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/UGREEN3.5mmMaleto3.5mmMaleCableGoldPlatedMetalCasewithBraid1m_Black_50361_SimplyTek_Srilanka.webp?v=1697530979",
          recommendation_score: 95,
          recommendation_reason: "Based on your browsing history",
        },
        {
          id: 2752769646,
          name: "Aspor A907 Car Charger",
          brand: "SimplyTek",
          category: "Car Accessories",
          price: 999,
          original_price: 1499,
          retailer: "simplytek",
          in_stock: true,
          image:
            "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/buy-aspor-a907-power-delivery-fast-car-charger-20w-white-simplytek-lk.png?v=1694426768",
          recommendation_score: 87,
          recommendation_reason: "Similar to products you've viewed",
        },
        {
          id: 1237805095,
          name: "Ugreen 10625 3.5mm Male To 6.35 Male Stereo Audio Cable",
          brand: "Ugreen",
          category: "Accessories",
          price: 2340.43,
          original_price: 3500,
          retailer: "appleme",
          in_stock: true,
          image:
            "https://appleme.lk/wp-content/uploads/2024/02/Ugreen-10625-3.5mm-Male-To-6.35-Male-Stereo-Audio-Cable-1M-by-otc.lk-in-Sri-Lanka.jpg",
          recommendation_score: 79,
          recommendation_reason: "Popular in your area",
        },
        {
          id: 1062839221,
          name: "Phone Mount for Car CZ019-30",
          brand: "Phone",
          category: "Car Accessories",
          price: 895,
          original_price: 1341,
          retailer: "appleme",
          in_stock: true,
          image:
            "https://appleme.lk/wp-content/uploads/2023/07/Phone-Mount-for-Car-CZ019-30-by-otc.lk-in-Sri-Lanka8.jpg",
          recommendation_score: 72,
          recommendation_reason: "Frequently bought together",
        },
      ],
    };

    console.log("Using fallback recommendation data due to API error");
    return NextResponse.json(fallbackData);
  }
}
