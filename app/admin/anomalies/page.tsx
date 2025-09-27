"use client";

import { useState, useEffect } from "react";
import {
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define types
interface Anomaly {
  id: number;
  productName: string;
  anomalousPrice: number;
  originalPrice: number;
  suggestedType: string;
  productPageUrl: string;
  vendorUrl: string;
}

export default function AnomalyReviewPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  useEffect(() => {
    // Simulate API call
    const fetchAnomalies = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch("/api/admin/anomalies")
        // const data = await response.json()

        // For now, use mock data
        const mockData: Anomaly[] = [
          {
            id: 123,
            productName: "ASUS Zenbook Duo (2025)",
            anomalousPrice: 25000.0,
            originalPrice: 250000.0,
            suggestedType: "POTENTIAL_DATA_ERROR",
            productPageUrl: "/product/456",
            vendorUrl: "http://example.com/product/456",
          },
          {
            id: 124,
            productName: "SuperGamer X Pro Mouse",
            anomalousPrice: 3500.0,
            originalPrice: 7000.0,
            suggestedType: "POTENTIAL_FLASH_SALE",
            productPageUrl: "/product/789",
            vendorUrl: "http://example.com/product/789",
          },
          {
            id: 125,
            productName: "Ultra HD 4K Monitor",
            anomalousPrice: 15000.0,
            originalPrice: 45000.0,
            suggestedType: "POTENTIAL_CLEARANCE",
            productPageUrl: "/product/101",
            vendorUrl: "http://example.com/product/101",
          },
          {
            id: 126,
            productName: "Mechanical Gaming Keyboard",
            anomalousPrice: 1200.0,
            originalPrice: 8000.0,
            suggestedType: "POTENTIAL_DATA_ERROR",
            productPageUrl: "/product/202",
            vendorUrl: "http://example.com/product/202",
          },
          {
            id: 127,
            productName: "Wireless Noise-Cancelling Headphones",
            anomalousPrice: 12000.0,
            originalPrice: 24000.0,
            suggestedType: "POTENTIAL_FLASH_SALE",
            productPageUrl: "/product/303",
            vendorUrl: "http://example.com/product/303",
          },
        ];

        setAnomalies(mockData);
      } catch (error) {
        console.error("Failed to fetch anomalies:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnomalies();
  }, []);

  // Calculate price difference percentage
  const calculatePriceDifference = (original: number, anomalous: number) => {
    const difference = ((anomalous - original) / original) * 100;
    return difference.toFixed(2);
  };

  // Handle anomaly actions
  const handleConfirmSale = (anomalyId: number) => {
    setAnomalies(anomalies.filter((anomaly) => anomaly.id !== anomalyId));
    // In a real application, you would call an API to update the anomaly status
    console.log(`Confirmed anomaly #${anomalyId} as a sale`);
  };

  const handleMarkDataError = (anomalyId: number) => {
    setAnomalies(anomalies.filter((anomaly) => anomaly.id !== anomalyId));
    // In a real application, you would call an API to update the anomaly status
    console.log(`Marked anomaly #${anomalyId} as data error`);
  };

  // Filter and sort anomalies
  const filteredAnomalies = anomalies
    .filter((anomaly) => {
      if (filter === "all") return true;
      return anomaly.suggestedType === `POTENTIAL_${filter.toUpperCase()}`;
    })
    .sort((a, b) => {
      const percentA = Math.abs(
        ((a.anomalousPrice - a.originalPrice) / a.originalPrice) * 100
      );
      const percentB = Math.abs(
        ((b.anomalousPrice - b.originalPrice) / b.originalPrice) * 100
      );

      return sortOrder === "desc" ? percentB - percentA : percentA - percentB;
    });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading anomalies...
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Anomaly Review</h1>

          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="data_error">Data Errors</SelectItem>
                <SelectItem value="flash_sale">Flash Sales</SelectItem>
                <SelectItem value="clearance">Clearance</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4" />
              Sort by {sortOrder === "asc" ? "Lowest" : "Highest"} Difference
            </Button>
          </div>
        </div>

        {filteredAnomalies.length === 0 ? (
          <Alert>
            <AlertTitle>No anomalies to review</AlertTitle>
            <AlertDescription>
              All price anomalies have been reviewed or there are none matching
              your filter criteria.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {filteredAnomalies.map((anomaly) => {
              const priceDifference = calculatePriceDifference(
                anomaly.originalPrice,
                anomaly.anomalousPrice
              );
              const isDataError =
                anomaly.suggestedType === "POTENTIAL_DATA_ERROR";

              return (
                <Card key={anomaly.id} className="overflow-hidden">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-1">
                          {anomaly.productName}
                        </CardTitle>
                        <CardDescription>Anomaly #{anomaly.id}</CardDescription>
                      </div>
                      <Badge
                        className={
                          isDataError
                            ? "bg-red-100 text-red-800"
                            : "bg-amber-100 text-amber-800"
                        }
                      >
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {anomaly.suggestedType
                          .replace("POTENTIAL_", "")
                          .replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Original Price:
                        </span>
                        <span className="font-mono">
                          ₹{anomaly.originalPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">
                          Anomalous Price:
                        </span>
                        <span className="font-mono font-bold text-lg">
                          ₹{anomaly.anomalousPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Difference:</span>
                        <span
                          className={`font-medium ${
                            Number(priceDifference) < 0
                              ? "text-red-500"
                              : "text-green-500"
                          }`}
                        >
                          {priceDifference}%
                        </span>
                      </div>

                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          asChild
                          className="flex-1"
                        >
                          <Link href={anomaly.productPageUrl}>
                            <Eye className="h-4 w-4 mr-1" />
                            View
                          </Link>
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          asChild
                        >
                          <a
                            href={anomaly.vendorUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            <ExternalLink className="h-4 w-4 mr-1" />
                            Vendor
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 bg-muted/50 pt-2">
                    <Button
                      variant={isDataError ? "outline" : "default"}
                      className="flex-1"
                      onClick={() => handleConfirmSale(anomaly.id)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" />
                      Confirm Sale
                    </Button>
                    <Button
                      variant={isDataError ? "destructive" : "outline"}
                      className="flex-1"
                      onClick={() => handleMarkDataError(anomaly.id)}
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Data Error
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </ProtectedRoute>
  );
}
