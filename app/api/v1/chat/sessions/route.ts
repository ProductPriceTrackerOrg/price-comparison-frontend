import { NextRequest, NextResponse } from "next/server";
import chatApi from "@/lib/chat-api";

export async function GET(request: NextRequest) {
  try {
    // Forward the request to the backend to list all active sessions
    const response = await chatApi.get("/api/v1/chat/sessions");
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error("Error listing chat sessions:", error);

    if (error.code === "ECONNREFUSED" || !error.response) {
      return NextResponse.json(
        { error: "Chat service unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.response?.data?.detail || "Error listing chat sessions" },
      { status: error.response?.status || 500 }
    );
  }
}
