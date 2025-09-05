"use client";

import { useSessionTimeout } from "@/hooks/use-session-timeout";
import { useAuth } from "@/contexts/auth-context";
import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Clock } from "lucide-react";

export function SessionTimeoutProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoggedIn, isAdmin } = useAuth();
  const { timeoutDuration } = useSessionTimeout();
  const [showWarning, setShowWarning] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(5 * 60); // 5 minutes in seconds

  // Show warning dialog 5 minutes before timeout
  useEffect(() => {
    if (!isLoggedIn) return;

    const warningTime = timeoutDuration - 5 * 60 * 1000; // 5 minutes before timeout

    const checkForWarning = () => {
      const lastActivity = localStorage.getItem("lastActivityTime");
      if (!lastActivity) return;

      const timeSinceLastActivity = Date.now() - parseInt(lastActivity);

      // If approaching timeout, show warning
      if (timeSinceLastActivity > warningTime) {
        setShowWarning(true);

        // Calculate remaining time in seconds
        const remaining = Math.floor(
          (timeoutDuration - timeSinceLastActivity) / 1000
        );
        setTimeRemaining(remaining > 0 ? remaining : 0);
      } else {
        setShowWarning(false);
      }
    };

    const intervalId = setInterval(checkForWarning, 10000); // Check every 10 seconds

    return () => clearInterval(intervalId);
  }, [isLoggedIn, timeoutDuration]);

  // Update countdown timer
  useEffect(() => {
    if (!showWarning) return;

    const countdownInterval = setInterval(() => {
      setTimeRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(countdownInterval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdownInterval);
  }, [showWarning]);

  // Format remaining time as mm:ss
  const formatTimeRemaining = () => {
    const minutes = Math.floor(timeRemaining / 60);
    const seconds = timeRemaining % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };

  // Function to continue session
  const { refreshSession } = useAuth();

  const continueSession = async () => {
    // Refresh the session token
    await refreshSession();

    // Update last activity time
    localStorage.setItem("lastActivityTime", Date.now().toString());
    setShowWarning(false);
  };

  if (!isLoggedIn) {
    return <>{children}</>;
  }

  return (
    <>
      {children}

      <Dialog open={showWarning} onOpenChange={setShowWarning}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-amber-500" />
              Session Timeout Warning
            </DialogTitle>
            <DialogDescription>
              Your session will expire in {formatTimeRemaining()} due to
              inactivity.
              {isAdmin
                ? " Admin sessions timeout after 1 hour of inactivity."
                : " User sessions timeout after 12 hours of inactivity."}
            </DialogDescription>
          </DialogHeader>

          <div className="flex justify-end space-x-2 pt-4">
            <Button variant="outline" onClick={continueSession}>
              Continue Session
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
