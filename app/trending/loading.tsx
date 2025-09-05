"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Header } from "@/components/layout/header";
import { NavigationBar } from "@/components/layout/navigation-bar";
import { Footer } from "@/components/layout/footer";

export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      <Header />
      <NavigationBar />

      <main className="bg-gradient-to-br from-blue-50/30 via-white to-purple-50/30">
        <div className="container mx-auto px-4 py-8">
          {/* Breadcrumb & Header Skeleton */}
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <Skeleton className="h-4 w-10" />
              <Skeleton className="h-4 w-4" />
              <Skeleton className="h-4 w-20" />
            </div>

            <div className="flex items-center gap-3 mb-6">
              <Skeleton className="h-12 w-12 rounded-full" />
              <div>
                <Skeleton className="h-8 w-64 mb-2" />
                <Skeleton className="h-4 w-72" />
              </div>
            </div>
          </div>

          {/* Filter Skeleton */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-4">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="flex items-center gap-2">
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-40" />
                </div>
              ))}
            </div>
          </div>

          {/* Statistics Cards Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <Card key={i} className="hover:shadow-lg transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <Skeleton className="h-4 w-32 mb-2" />
                      <Skeleton className="h-7 w-16 mb-1" />
                      <Skeleton className="h-4 w-12" />
                    </div>
                    <Skeleton className="h-10 w-10 rounded-full" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Trending Products Skeleton */}
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Skeleton className="h-6 w-6" />
              <Skeleton className="h-8 w-48" />
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="relative group">
                  <Card className="overflow-hidden">
                    {/* Badge Skeleton */}
                    <div className="absolute top-3 left-3 z-20">
                      <Skeleton className="h-6 w-16 rounded-full" />
                    </div>

                    {/* Product Card Skeleton */}
                    <CardContent className="p-0">
                      <Skeleton className="w-full h-56" />
                      <div className="p-4 space-y-3">
                        <div className="flex justify-between">
                          <Skeleton className="h-4 w-16" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <Skeleton className="h-6 w-full" />
                        <div className="space-y-2">
                          <Skeleton className="h-7 w-24" />
                          <Skeleton className="h-4 w-16" />
                        </div>
                        <div className="p-3 rounded-lg">
                          <Skeleton className="h-4 w-full" />
                        </div>
                        <Skeleton className="h-10 w-full rounded-lg" />
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>

            {/* Load More Button Skeleton */}
            <div className="text-center mt-8">
              <Skeleton className="h-12 w-64 mx-auto rounded-full" />
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
