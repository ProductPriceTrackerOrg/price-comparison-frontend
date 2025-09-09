"use client";

import { useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/contexts/auth-context";

// Constants for token refresh
const REFRESH_THRESHOLD = 10 * 60 * 1000; // 10 minutes before expiration

export function TokenRefreshHandler({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoggedIn } = useAuth();

  useEffect(() => {
    if (!isLoggedIn || !session) return;

    // Calculate when to refresh the token (10 minutes before expiration)
    const calculateRefreshTime = () => {
      if (!session?.expires_at) return null;

      // expires_at is in seconds, convert to milliseconds
      const expiresAt = session.expires_at * 1000;
      const refreshAt = expiresAt - REFRESH_THRESHOLD;
      return refreshAt;
    };

    const refreshAt = calculateRefreshTime();
    if (!refreshAt) return;

    // Set up a timer to refresh the token
    const timeUntilRefresh = refreshAt - Date.now();
    if (timeUntilRefresh <= 0) {
      // Token is about to expire, refresh now
      supabase.auth.refreshSession();
      return;
    }

    // Schedule token refresh
    const refreshTimeout = setTimeout(() => {
      supabase.auth.refreshSession();
    }, timeUntilRefresh);

    return () => clearTimeout(refreshTimeout);
  }, [session, isLoggedIn]);

  return <>{children}</>;
}
