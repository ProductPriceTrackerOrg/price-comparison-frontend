"use client";

import { useEffect } from "react";
import { redirect } from "next/navigation";
import { useAuth } from "@/contexts/auth-context";
import { ProtectedRoute } from "@/components/auth/protected-route";

export default function AdminRedirect() {
  const { isLoggedIn, isAdmin } = useAuth();

  useEffect(() => {
    console.log("Admin redirect page:", { isLoggedIn, isAdmin });

    // Only redirect to dashboard if logged in and admin
    if (isLoggedIn && isAdmin) {
      console.log("Redirecting admin to dashboard");
      redirect("/admin/dashboard");
    } else if (isLoggedIn && !isAdmin) {
      console.log("Non-admin user detected, redirecting to home");
      redirect("/");
    } else if (!isLoggedIn) {
      console.log("User not logged in, redirecting to home");
      redirect("/");
    }
  }, [isLoggedIn, isAdmin]);

  return (
    <ProtectedRoute requireAdmin={true}>
      <div>Redirecting to dashboard...</div>
    </ProtectedRoute>
  );
}
