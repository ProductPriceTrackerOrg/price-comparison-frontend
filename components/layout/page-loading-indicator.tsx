"use client";

import { useRouteChangeLoading } from "@/hooks/use-route-loading";
import { useEffect } from "react";

export function PageLoadingIndicator() {
  const isLoading = useRouteChangeLoading();

  // Update favicon and title when loading state changes
  useEffect(() => {
    // Get existing favicon
    const existingFavicon = document.querySelector(
      'link[rel="icon"]'
    ) as HTMLLinkElement;
    const existingTitle = document.title;

    // Store original favicon href
    const originalHref = existingFavicon?.href || "/favicon.ico";

    if (isLoading) {
      // Show loading in tab title
      document.title = "Loading... " + existingTitle;

      // Create loading favicon (a simple pulsing effect)
      if (existingFavicon) {
        const loadingFaviconUrl = getLoadingFaviconUrl();
        existingFavicon.href = loadingFaviconUrl;
      }
    } else {
      // Restore original title and favicon
      document.title = existingTitle.replace("Loading... ", "");
      if (existingFavicon) {
        existingFavicon.href = originalHref;
      }
    }
  }, [isLoading]);

  // This is a simple way to generate a "loading" version of the favicon
  // For a more sophisticated approach, you could use a canvas to modify
  // the existing favicon or use pre-generated loading favicon images
  const getLoadingFaviconUrl = () => {
    // Return a data URL for a simple loading indicator
    // This is a basic blue circle as a placeholder
    return "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Cstyle%3E .spinner %7B animation: spin 1s linear infinite; transform-origin: center; %7D @keyframes spin %7B to %7B transform: rotate(360deg); %7D %7D %3C/style%3E%3Ccircle cx='50' cy='50' r='45' fill='%23f5f5f5' stroke='%232563eb' stroke-width='10' class='spinner'/%3E%3C/svg%3E";
  };

  // This component doesn't render anything visible - it just handles the favicon changes
  return null;
}
