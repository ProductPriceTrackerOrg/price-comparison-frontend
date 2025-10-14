# API Error Handling Guide

This guide explains how to properly handle API errors in our Next.js API routes to prevent socket hang up and other connection issues.

## Overview

We've implemented a robust error handling system to manage various types of network errors, including:

- Socket hang ups
- Connection timeouts
- Connection refusals
- Network errors
- Backend server errors

## Implementation Details

### 1. API Client Configuration

We've configured our API clients (`api.ts` and `chat-api.ts`) with:

- Increased timeout (15 seconds)
- Automatic retry logic using axios-retry
- Exponential backoff for retries

### 2. Centralized Error Handler

Use the `handleApiError` function from `lib/error-handling.ts` in all API routes to ensure consistent error handling:

```typescript
import { handleApiError } from "@/lib/error-handling";

export async function GET(request: NextRequest) {
  try {
    // API call logic here
    const response = await api.get("/some-endpoint");
    return NextResponse.json(response.data);
  } catch (error: any) {
    // Use the centralized error handler with context
    return handleApiError(error, "Descriptive context of what you were doing");
  }
}
```

### 3. Special Case: Graceful Degradation

For non-critical features like autocomplete search, you can implement graceful degradation:

```typescript
try {
  // API call logic
} catch (error: any) {
  // For non-critical features, return fallback data
  if (error.code === "ECONNABORTED" || error.code === "ECONNREFUSED") {
    return NextResponse.json({ suggestions: [] }); // Fallback empty data
  }

  // Otherwise use standard error handling
  return handleApiError(error, "Feature context");
}
```

### 4. Fallback Content

For features that should provide fallbacks when the backend is unavailable (like the chat system), implement fallback generators:

```typescript
if (
  error.code === "ECONNREFUSED" ||
  error.message?.includes("socket hang up")
) {
  return generateFallbackResponse(/* parameters */);
}
```

## Error Types Handled

| Error Type         | HTTP Status | Description                        |
| ------------------ | ----------- | ---------------------------------- |
| Connection Timeout | 504         | Request took too long to complete  |
| Connection Refused | 503         | Backend server unreachable         |
| Socket Hang Up     | 502         | Connection terminated unexpectedly |
| Network Timeout    | 504         | Network connection issues          |
| Backend Error      | 5XX         | Backend server returned error      |

## Testing

You can test the error handling by:

1. Turning off your backend server
2. Setting an invalid API URL
3. Adding network throttling in browser dev tools
