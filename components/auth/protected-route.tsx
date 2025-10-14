"use client";

import type React from "react";

import { useAuth } from "@/contexts/auth-context";
import { useToast } from "@/hooks/use-toast";
import { useEffect } from "react";
import { redirect } from "next/navigation";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requireAdmin?: boolean;
}

export function ProtectedRoute({
  children,
  requireAdmin = false,
}: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (!isLoggedIn) {
      console.log("User not logged in, redirecting to home");
      toast({
        title: "Authentication Required",
        description: "Please log in to access this page",
        variant: "destructive",
      });
      redirect("/");
      return;
    }

    if (requireAdmin && !isAdmin) {
      console.log("User is not admin, redirecting to home");
      toast({
        title: "Access Denied",
        description: "You need administrator permissions to access this page",
        variant: "destructive",
      });
      redirect("/");
      return;
    }

    console.log("User access granted:", { isLoggedIn, isAdmin, requireAdmin });
  }, [isLoggedIn, isAdmin, requireAdmin, toast]);

  if (!isLoggedIn || (requireAdmin && !isAdmin)) {
    return null;
  }

  return <>{children}</>;
}
