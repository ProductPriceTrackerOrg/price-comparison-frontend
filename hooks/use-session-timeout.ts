"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/auth-context";

// Session timeout durations in milliseconds
const NORMAL_USER_TIMEOUT = 12 * 60 * 60 * 1000; // 12 hours
const ADMIN_TIMEOUT = 1 * 60 * 60 * 1000; // 1 hour

export function useSessionTimeout() {
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [lastActivity, setLastActivity] = useState<number>(Date.now());
  const timeoutDuration = isAdmin ? ADMIN_TIMEOUT : NORMAL_USER_TIMEOUT;

  // Function to update the last activity timestamp
  const updateLastActivity = () => {
    setLastActivity(Date.now());
    // Also store in localStorage to persist across page refreshes
    localStorage.setItem("lastActivityTime", Date.now().toString());
  };

  // Function to check if session has timed out
  const checkSessionTimeout = () => {
    const storedLastActivity = localStorage.getItem("lastActivityTime");
    const lastActivityTime = storedLastActivity
      ? parseInt(storedLastActivity)
      : lastActivity;

    const currentTime = Date.now();
    const timeSinceLastActivity = currentTime - lastActivityTime;

    // If user has been inactive for longer than the timeout duration, log them out
    if (timeSinceLastActivity > timeoutDuration) {
      console.log("Session timed out due to inactivity");
      logout();

      // Clear the stored last activity time
      localStorage.removeItem("lastActivityTime");
    }
  };

  useEffect(() => {
    // Only setup listeners if the user is logged in
    if (!isLoggedIn) {
      return;
    }

    // Initialize last activity from localStorage if available
    const storedLastActivity = localStorage.getItem("lastActivityTime");
    if (storedLastActivity) {
      setLastActivity(parseInt(storedLastActivity));
    } else {
      // If not available, set current time and store it
      updateLastActivity();
    }

    // Events to track user activity
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keypress",
      "scroll",
      "touchstart",
      "click",
      "keydown",
    ];

    // Function to handle user activity
    const handleUserActivity = () => {
      updateLastActivity();
    };

    // Add event listeners for user activity
    activityEvents.forEach((event) => {
      window.addEventListener(event, handleUserActivity);
    });

    // Set up interval to check for session timeout regularly
    const timeoutIntervalId = setInterval(checkSessionTimeout, 60000); // Check every minute

    // Check for timeout immediately in case the page was refreshed after timeout
    checkSessionTimeout();

    // Clean up event listeners and interval on component unmount
    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleUserActivity);
      });
      clearInterval(timeoutIntervalId);
    };
  }, [isLoggedIn, isAdmin, timeoutDuration]);

  return {
    updateLastActivity,
    timeoutDuration,
  };
}
