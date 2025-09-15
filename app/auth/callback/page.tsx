"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabase";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/auth-context";

export default function AuthCallback() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { toast } = useToast();
  const { user, redirectUrl, setRedirectUrl } = useAuth();
  const [isProcessing, setIsProcessing] = useState(true);

  useEffect(() => {
    const handleAuthCallback = async () => {
      const code = searchParams.get("code");
      const error = searchParams.get("error");

      if (error) {
        toast({
          title: "Authentication Error",
          description:
            "There was an error with your authentication. Please try again.",
          variant: "destructive",
        });
        setIsProcessing(false);
        router.push("/");
        return;
      }

      if (code) {
        try {
          // Exchange the code for a session
          const { data, error } = await supabase.auth.exchangeCodeForSession(
            code
          );

          if (error) {
            throw error;
          }

          if (data.session && data.user) {
            console.log("Session established:", data.user.email);

            toast({
              title: "Email Confirmed! 🎉",
              description:
                "Welcome to PricePulse! Your account is now active and you're signed in.",
            });

            setIsProcessing(false);

            // Wait a moment for the auth context to update, then redirect
            setTimeout(() => {
              // Redirect to the saved URL if available, otherwise to home
              if (redirectUrl) {
                router.push(redirectUrl);
                // Clear the redirect URL after using it
                setRedirectUrl(null);
              } else {
                router.push("/");
              }
            }, 1500);
          } else {
            throw new Error("No session or user data received");
          }
        } catch (error: any) {
          console.error("Error exchanging code for session:", error);
          toast({
            title: "Confirmation Failed",
            description:
              error.message ||
              "Failed to confirm your email. Please try again or contact support.",
            variant: "destructive",
          });
          setIsProcessing(false);
          router.push("/");
        }
      } else {
        // No code parameter, redirect to home
        setIsProcessing(false);
        router.push("/");
      }
    };

    handleAuthCallback();
  }, [searchParams, router, toast]);

  // If user is already authenticated (auth context updated), redirect immediately
  useEffect(() => {
    if (user && !isProcessing) {
      if (redirectUrl) {
        router.push(redirectUrl);
        setRedirectUrl(null);
      } else {
        router.push("/");
      }
    }
  }, [user, isProcessing, router, redirectUrl, setRedirectUrl]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center space-y-4">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <div className="space-y-2">
          <p className="text-lg font-medium text-gray-900">
            Confirming your email...
          </p>
          <p className="text-sm text-gray-600">
            Please wait while we set up your account
          </p>
        </div>
      </div>
    </div>
  );
}
