"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useRouter } from "next/navigation";

// Constants for session timeouts
const USER_SESSION_TIMEOUT = 12 * 60 * 60 * 1000; // 12 hours in milliseconds
const ADMIN_SESSION_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour in milliseconds
const WARNING_BEFORE_TIMEOUT = 5 * 60 * 1000; // 5 minutes warning before timeout

export function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user, isLoggedIn, isAdmin, logout } = useAuth();
  const { toast } = useToast();
  const router = useRouter();

  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const [warningShown, setWarningShown] = useState(false);

  // Reset the inactivity timer when user is active
  const handleActivity = () => {
    setLastActivity(Date.now());
    setWarningShown(false);
  };

  // Effect for monitoring user activity
  useEffect(() => {
    if (!isLoggedIn) return;

    // Track user activity
    const events = ["mousedown", "keydown", "touchstart", "scroll"];
    events.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      events.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [isLoggedIn]);

  // Effect for checking session timeout
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const sessionTimeout = isAdmin
      ? ADMIN_SESSION_TIMEOUT
      : USER_SESSION_TIMEOUT;
    const warningTime = sessionTimeout - WARNING_BEFORE_TIMEOUT;

    const intervalId = setInterval(() => {
      const now = Date.now();
      const timeElapsed = now - lastActivity;

      // Show warning before timeout
      if (timeElapsed > warningTime && !warningShown) {
        setWarningShown(true);
        const timeLeft = Math.ceil(WARNING_BEFORE_TIMEOUT / 60000); // minutes
        toast({
          title: "Session Expiring Soon",
          description: `Your session will expire in about ${timeLeft} minutes due to inactivity. Please continue using the app to stay logged in.`,
          duration: 10000, // 10 seconds
        });
      }

      // Logout when session expires
      if (timeElapsed > sessionTimeout) {
        toast({
          title: "Session Expired",
          description: "You have been logged out due to inactivity.",
          variant: "destructive",
        });
        logout();
        router.push("/");
      }
    }, 60000); // Check every minute

    return () => clearInterval(intervalId);
  }, [
    isLoggedIn,
    user,
    isAdmin,
    lastActivity,
    warningShown,
    logout,
    toast,
    router,
  ]);

  return <>{children}</>;
}
