"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { AuthDialog } from "@/components/auth/auth-dialog";

interface SignInDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  message?: string;
  title?: string;
}

export function SignInDialog({
  isOpen,
  setIsOpen,
  message = "You need to be logged in to perform this action.",
  title = "Sign in required",
}: SignInDialogProps) {
  const router = useRouter();
  const [showAuthDialog, setShowAuthDialog] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");

  const handleLogin = () => {
    setIsOpen(false);
    setShowAuthDialog(true);
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            <DialogDescription>{message}</DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex sm:justify-between">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleLogin}>Sign In</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Include the actual Auth Dialog that will be shown after clicking Sign In */}
      <AuthDialog
        isOpen={showAuthDialog}
        onClose={() => setShowAuthDialog(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </>
  );
}
