import type React from "react";
import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth-context";
import { SessionTimeoutProvider } from "@/components/auth/session-timeout-provider";
import { TokenRefreshHandler } from "@/components/auth/token-refresh-handler";
import { PageLoadingIndicator } from "@/components/layout/page-loading-indicator";
import { NavigationProgressBar } from "@/components/layout/navigation-progress-bar";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PricePluse",
  description:
    "Advanced price tracking and analytics platform for e-commerce data with AI-powered insights",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="overflow-x-hidden">
      <body className={`${inter.className} overflow-x-hidden`}>
        <AuthProvider>
          <TokenRefreshHandler>
            <SessionTimeoutProvider>
              <PageLoadingIndicator />
              <NavigationProgressBar />
              {children}
              <Toaster />
            </SessionTimeoutProvider>
          </TokenRefreshHandler>
        </AuthProvider>
      </body>
    </html>
  );
}
