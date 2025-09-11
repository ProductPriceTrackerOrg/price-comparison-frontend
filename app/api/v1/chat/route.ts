import { NextRequest, NextResponse } from "next/server";
import chatApi from "@/lib/chat-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { product_id, user_message, session_id } = body;

    if (!product_id || !user_message || !session_id) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: product_id, user_message, or session_id",
        },
        { status: 400 }
      );
    }

    // Log the incoming request
    console.log("Chat request:", { product_id, session_id });

    try {
      // Forward the request to the backend chat agent running on localhost:8001
      const chatEndpoint = "/api/v1/chat";

      const response = await chatApi.post(chatEndpoint, {
        product_id,
        user_message,
        session_id,
      });

      // Return the response from the backend agent
      return NextResponse.json(response.data);
    } catch (apiError: any) {
      console.error("Error from chat backend:", apiError);

      // If the backend service is not available, fall back to mock responses
      // This allows for development without the backend running
      if (apiError.code === "ECONNREFUSED" || !apiError.response) {
        console.warn("Chat backend not available, using fallback response");
        return generateFallbackResponse(user_message, session_id);
      }

      // Otherwise forward the error response from the backend
      return NextResponse.json(
        { error: apiError.response?.data?.detail || "Error from chat service" },
        { status: apiError.response?.status || 500 }
      );
    }
  } catch (error) {
    console.error("Error processing chat:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// Fallback function to provide mock responses when backend is unavailable
function generateFallbackResponse(user_message: string, session_id: string) {
  let response = "";
  let sources: string[] = [];

  // Generate mock response based on user's message content
  if (user_message.toLowerCase().includes("price")) {
    response =
      "The current price of this product is competitive within the market. We track multiple retailers and have found this to be among the best prices currently available.";
    sources = ["PriceTracker API", "RetailerCompare Service"];
  } else if (
    user_message.toLowerCase().includes("specification") ||
    user_message.toLowerCase().includes("specs")
  ) {
    response =
      "This product features the latest specifications in its category. Would you like me to highlight any specific aspect of the specifications?";
  } else if (
    user_message.toLowerCase().includes("discount") ||
    user_message.toLowerCase().includes("deal")
  ) {
    response =
      "This product currently has a discount applied. We predict prices may drop further in about 3 weeks based on historical trends.";
    sources = ["PriceHistory Analytics"];
  } else if (
    user_message.toLowerCase().includes("review") ||
    user_message.toLowerCase().includes("rating")
  ) {
    response =
      "This product has generally positive reviews with an average rating of 4.5/5 stars across multiple retailers. Users particularly praise its performance and design.";
    sources = ["ReviewAggregator", "CustomerFeedback API"];
  } else {
    response =
      "Thanks for your question! I can help you with price comparisons, specifications, availability, and more about this product. What specific information would you like to know?";
  }

  return NextResponse.json({
    response,
    sources,
    session_id,
    fallback: true, // Flag to indicate this is a fallback response
  });
}
