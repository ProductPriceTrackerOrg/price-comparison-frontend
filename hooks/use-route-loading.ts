"use client";

import { useState, useEffect } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function useRouteChangeLoading() {
  const [isLoading, setIsLoading] = useState(false);
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    // Create a timeout to avoid flickering for fast page loads
    const startLoading = () => {
      setIsLoading(true);
    };

    const stopLoading = () => {
      setIsLoading(false);
    };

    // Start loading immediately
    startLoading();

    // Stop loading after the page has loaded
    const timeoutId = setTimeout(() => {
      stopLoading();
    }, 500); // Set a minimum time the loading indicator will show

    // Clean up the timeout if component unmounts
    return () => clearTimeout(timeoutId);
  }, [pathname, searchParams]); // Re-run when the route changes

  return isLoading;
}
