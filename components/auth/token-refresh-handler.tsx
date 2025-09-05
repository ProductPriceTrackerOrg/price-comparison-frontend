"use client";

import { useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";

// Time before expiry to refresh the token (10 minutes)
const REFRESH_TIME_BEFORE_EXPIRY = 10 * 60 * 1000;

export function TokenRefreshHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, refreshSession } = useAuth();

  // Set up automatic token refresh
  useEffect(() => {
    if (!session?.expires_at) return;

    // Calculate when the token expires
    const expiresAt = new Date(session.expires_at * 1000);
    const timeUntilExpiry = expiresAt.getTime() - Date.now();

    // If token is about to expire soon, refresh it immediately
    if (timeUntilExpiry < REFRESH_TIME_BEFORE_EXPIRY) {
      refreshSession();
    }

    // Set up refresh before token expiry
    const timeToRefresh = timeUntilExpiry - REFRESH_TIME_BEFORE_EXPIRY;
    const refreshTimeoutId = setTimeout(
      refreshSession,
      timeToRefresh > 0 ? timeToRefresh : 0
    );

    return () => clearTimeout(refreshTimeoutId);
  }, [session?.expires_at, refreshSession]);

  return <>{children}</>;
}
