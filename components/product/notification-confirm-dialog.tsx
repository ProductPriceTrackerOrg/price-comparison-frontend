"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Bell, Clock } from "lucide-react";

interface NotificationConfirmDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  onConfirm: () => void;
  onCancel: () => void;
  title?: string;
  message?: string;
  productName?: string;
}

export function NotificationConfirmDialog({
  isOpen,
  setIsOpen,
  onConfirm,
  onCancel,
  title = "Enable Price Drop Notifications?",
  message = "Would you like to receive notifications when the price of this product changes?",
  productName,
}: NotificationConfirmDialogProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
    setIsOpen(false);
  };

  const handleCancel = () => {
    onCancel();
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center">
            <Bell className="mr-2 h-5 w-5 text-primary" />
            {title}
          </DialogTitle>
          <DialogDescription>
            {productName && (
              <span className="font-medium text-foreground block mt-1">
                {productName}
              </span>
            )}
            <p className="mt-2">{message}</p>
            <div className="mt-4 space-y-2 bg-muted p-3 rounded-md">
              <div className="flex items-start">
                <Bell className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Price Drop Alerts</p>
                  <p className="text-sm text-muted-foreground">
                    Get notified when prices fall on your tracked products
                  </p>
                </div>
              </div>
              <div className="flex items-start">
                <Clock className="h-5 w-5 mr-2 text-primary mt-0.5" />
                <div>
                  <p className="font-medium">Weekly Reports</p>
                  <p className="text-sm text-muted-foreground">
                    Receive weekly summaries of price changes and deals
                  </p>
                </div>
              </div>
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter className="sm:justify-between">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="mt-2 sm:mt-0"
          >
            No Thanks
          </Button>
          <Button onClick={handleConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-2 h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Setting Up...
              </>
            ) : (
              "Yes, Enable Notifications"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
