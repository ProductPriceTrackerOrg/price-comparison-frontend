"use client";

import { useRouteChangeLoading } from "@/hooks/use-route-loading";
import { useState, useEffect } from "react";

export function NavigationProgressBar() {
  const isLoading = useRouteChangeLoading();
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isLoading) {
      // Reset progress when loading starts
      setProgress(0);

      // Simulate progress
      const interval = setInterval(() => {
        setProgress((prevProgress) => {
          // Go to 90% quickly, then slow down
          if (prevProgress < 90) {
            return prevProgress + (90 - prevProgress) * 0.1;
          }
          return prevProgress;
        });
      }, 100);

      return () => {
        clearInterval(interval);
        // When loading completes, quickly finish the progress bar
        setProgress(100);

        // After animation completes, reset to 0
        timeout = setTimeout(() => {
          setProgress(0);
        }, 500); // This should match the CSS transition time
      };
    }

    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);

  if (!isLoading && progress === 0) {
    return null;
  }

  return (
    <div
      className="fixed top-0 left-0 right-0 h-1 bg-blue-600 z-50"
      style={{
        width: `${progress}%`,
        transition: "width 0.3s ease-in-out, opacity 0.5s ease-in-out",
        opacity: progress === 100 ? 0 : 1,
      }}
    />
  );
}
