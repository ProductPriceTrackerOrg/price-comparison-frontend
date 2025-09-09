import { NextRequest, NextResponse } from "next/server";
import chatApi from "@/lib/chat-api";

export async function DELETE(
  request: NextRequest,
  { params }: { params: { session_id: string } }
) {
  const sessionId = params.session_id;

  try {
    // Forward the delete request to the backend
    const response = await chatApi.delete(`/api/v1/chat/${sessionId}`);
    return NextResponse.json(response.data);
  } catch (error: any) {
    console.error(`Error clearing chat session ${sessionId}:`, error);

    if (error.code === "ECONNREFUSED" || !error.response) {
      return NextResponse.json(
        { error: "Chat service unavailable" },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: error.response?.data?.detail || "Error clearing chat session" },
      { status: error.response?.status || 500 }
    );
  }
}
