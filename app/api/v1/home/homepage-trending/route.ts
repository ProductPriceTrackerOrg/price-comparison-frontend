import { NextRequest, NextResponse } from "next/server";
import api from "@/lib/api";
import { supabase } from "@/lib/supabase";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  try {
    // Construct query params
    const queryParams = new URLSearchParams({
      limit: limit.toString(),
    });

    // Extract the Authorization header from the incoming request
    const authHeader = request.headers.get('Authorization');
    
    // Use header from request or get from Supabase
    let headers = {};
    
    if (authHeader) {
      // If request has Authorization header, use it
      headers = { Authorization: authHeader };
      console.log("Using Authorization header from request for trending");
    } else {
      // Try to get from Supabase session
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.access_token) {
          headers = { Authorization: `Bearer ${session.access_token}` };
          console.log("Using Supabase session for trending auth");
        }
      } catch (e) {
        console.error("Error getting Supabase session:", e);
      }
    }
    
    // Forward the request to our backend API
    const apiUrl = `/api/v1/home/homepage-trending?${queryParams}`;
    const response = await api.get(apiUrl, {
      headers,
      timeout: 20000 // 20 seconds timeout
    });

    // Return the backend response
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error fetching homepage trending products:", error.message);
    
    // Check for timeout errors
    if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
      console.error("Request timed out, returning fallback data");
    }

    // Provide fallback data when API is unavailable
    const fallbackData = {
      products: [
        {
          id: 3568948440,
          name: "UGREEN 3.5mm Male to 3.5mm Male Braided Cable 1m",
          brand: "SimplyTek",
          category: "Accessories",
          price: 999,
          original_price: 1499,
          retailer: "simplytek",
          retailer_id: 3,
          in_stock: true,
          image:
            "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/UGREEN3.5mmMaleto3.5mmMaleCableGoldPlatedMetalCasewithBraid1m_Black_50361_SimplyTek_Srilanka.webp?v=1697530979",
          discount: 33.36,
          trend_score: 95,
          search_volume: "1.2K+",
          price_change: -33.36,
          is_trending: true
        },
        {
          id: 2752769646,
          name: "Aspor A907 Car Charger",
          brand: "SimplyTek",
          category: "Car Accessories",
          price: 999,
          original_price: 1499,
          retailer: "simplytek",
          retailer_id: 3,
          in_stock: true,
          image:
            "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/buy-aspor-a907-power-delivery-fast-car-charger-20w-white-simplytek-lk.png?v=1694426768",
          discount: 33.36,
          trend_score: 87,
          search_volume: "950+",
          price_change: -33.36,
          is_trending: true
        },
        {
          id: 1237805095,
          name: "Ugreen 10625 3.5mm Male To 6.35 Male Stereo Audio Cable",
          brand: "Ugreen",
          category: "Accessories",
          price: 2340.43,
          original_price: 3500,
          retailer: "appleme",
          retailer_id: 0,
          in_stock: true,
          image:
            "https://appleme.lk/wp-content/uploads/2024/02/Ugreen-10625-3.5mm-Male-To-6.35-Male-Stereo-Audio-Cable-1M-by-otc.lk-in-Sri-Lanka.jpg",
          discount: 33.13,
          trend_score: 79,
          search_volume: "800+",
          price_change: -33.13,
          is_trending: true
        },
        {
          id: 2479411966,
          name: "Addlink micro SD 64GB XC (Class U3) 100MB/s",
          brand: "SimplyTek",
          category: "Memory Cards",
          price: 2999,
          original_price: 4499,
          retailer: "simplytek",
          retailer_id: 3,
          in_stock: true,
          image:
            "https://cdn.shopify.com/s/files/1/0822/2058/1183/files/addlink-64gb-micro-sd-card-sri-lanka.jpg?v=1694424386",
          discount: 33.34,
          trend_score: 91,
          search_volume: "1.5K+",
          price_change: -33.34,
          is_trending: true
        }
      ],
      stats: {
        trending_searches: "2.5M+",
        accuracy_rate: "95%",
        update_frequency: "Real-time",
        tracking_type: "Price & Popularity"
      }
    };

    console.log("Using fallback trending products data due to API error");
    return NextResponse.json(fallbackData);
  }
}