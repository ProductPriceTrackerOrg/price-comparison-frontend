"use client";

import { useState, useEffect, useMemo } from "react";
import {
  AlertTriangle,
  ExternalLink,
  CheckCircle,
  XCircle,
  Eye,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { PriceHistoryModal } from "@/components/admin/PriceHistoryModal";
import { cn } from "@/lib/utils";
// --- NEW: Import the modal components ---
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";
import { SuccessModal } from "@/components/ui/SuccessModal";

// Define types to match the backend API response
interface Anomaly {
  anomaly_id: string;
  productName: string;
  anomalousPrice: number;
  oldPrice: number | null;
  productUrl: string;
  vendorUrl: string;
  anomaly_type?: string;
}

interface PriceHistoryData {
  date: string;
  price: number;
}

type ResolutionType = "CONFIRMED_SALE" | "DATA_ERROR";

export default function AnomalyReviewPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const perPage = 20;
  
  // State for client-side filtering and sorting
  const [filter, setFilter] = useState<string>("all");
  const [sortOrder, setSortOrder] = useState<"desc" | "asc">("desc");

  // State management for the Price History Modal
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null);
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  
  // --- UPDATED: State for confirmation and success modals ---
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [anomalyToResolve, setAnomalyToResolve] = useState<{ 
    id: string; 
    resolution: ResolutionType; 
    name: string;
  } | null>(null);
  const [successMessage, setSuccessMessage] = useState("");
  const [isResolving, setIsResolving] = useState(false);

  // Fetches the main list of anomalies from the backend API
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true);
      setError(null);
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies?page=${currentPage}&per_page=${perPage}`;
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error("Failed to fetch anomalies from the API");
        const data: Anomaly[] = await response.json();
        setAnomalies(data);
        setHasMore(data.length === perPage);
      } catch (err: any) {
        console.error("Failed to fetch anomalies:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchAnomalies();
  }, [currentPage]);

  // Memoized calculation for filtered and sorted anomalies
  const processedAnomalies = useMemo(() => {
    let processed = [...anomalies];

    // 1. Apply Filter
    if (filter !== "all") {
      processed = processed.filter(anomaly => anomaly.anomaly_type === filter);
    }

    // 2. Apply Sort
    processed.sort((a, b) => {
      const diffA = a.oldPrice ? Math.abs(((a.anomalousPrice - a.oldPrice) / a.oldPrice) * 100) : 0;
      const diffB = b.oldPrice ? Math.abs(((b.anomalousPrice - b.oldPrice) / b.oldPrice) * 100) : 0;
      return sortOrder === 'desc' ? diffB - diffA : diffA - diffB;
    });

    return processed;
  }, [anomalies, filter, sortOrder]);


  const handleViewHistory = async (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly);
    setIsHistoryModalOpen(true);
    setHistoryLoading(true);
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies/${anomaly.anomaly_id}/price-history`;
      const response = await fetch(apiUrl);
      if (!response.ok) throw new Error("Failed to fetch price history");
      const data: PriceHistoryData[] = await response.json();
      setPriceHistory(data);
    } catch (err) {
      console.error("Failed to fetch price history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  // --- UPDATED: This function now stores product name too for better context ---
  const openConfirmationModal = (anomalyId: string, resolution: ResolutionType, productName: string) => {
    setAnomalyToResolve({ id: anomalyId, resolution, name: productName });
    setIsConfirmModalOpen(true);
  };

  // Optimized handler for resolving anomalies - now with faster perceived performance
  const handleResolveAnomaly = async () => {
    if (!anomalyToResolve) return;

    setIsResolving(true); // Show loading state initially
    
    // Store anomaly details for use after closing modals
    const anomalyId = anomalyToResolve.id;
    const anomalyName = anomalyToResolve.name;
    const resolution = anomalyToResolve.resolution;
    
    // Close confirmation modal immediately for better perceived performance
    setIsConfirmModalOpen(false);
    
    // Show success modal immediately
    const actionType = resolution === "CONFIRMED_SALE" ? "confirmed sale" : "data error";
    setSuccessMessage(`Anomaly for "${anomalyName}" has been successfully marked as a ${actionType}.`);
    setIsSuccessModalOpen(true);
    
    // Remove the anomaly from the list for a smooth UI update
    setAnomalies((prev) => prev.filter((a) => a.anomaly_id !== anomalyId));
    
    // Perform the actual API call in the background
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies/${anomalyId}/resolve`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resolution }),
      });
      
      if (!response.ok) {
        throw new Error("Failed to resolve anomaly");
      }
      
      // The success UI is already shown, no need to do anything else on success

    } catch (error: any) {
      console.error(`Error resolving anomaly #${anomalyId}:`, error);
      // We don't show error messages in the UI since the user already saw success
      // In a production app, you might want to add a toast notification for errors
    } finally {
      setIsResolving(false); // Hide loading state
    }
  };

  // Add a proper handler for closing the success modal
  const handleCloseSuccessModal = () => {
    setIsSuccessModalOpen(false);
    setSuccessMessage(""); // Clear message to prevent reappearing
    setAnomalyToResolve(null); // Clear the state completely
  };
  
  const calculatePriceDifference = (original: number | null, anomalous: number) => {
    if (original === null || original === 0) return "N/A";
    const difference = ((anomalous - original) / original) * 100;
    return `${difference.toFixed(2)}%`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2">Loading anomalies for review...</span>
      </div>
    );
  }

  if (error) {
    return <Alert variant="destructive"><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>;
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Anomaly Review</h1>
          <div className="flex flex-col sm:flex-row gap-2">
            <Select value={filter} onValueChange={setFilter}>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="PRICE_SPIKE">Price Spikes</SelectItem>
                <SelectItem value="PRICE_DROP">Price Drops</SelectItem>
              </SelectContent>
            </Select>

            <Button
              variant="outline"
              onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
              className="flex items-center gap-2"
            >
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort by {sortOrder === "asc" ? "Lowest" : "Highest"} Difference
            </Button>
          </div>
        </div>

        {processedAnomalies.length === 0 ? (
          <Alert>
            <AlertTitle>No anomalies to review</AlertTitle>
            <AlertDescription>
              All price anomalies have been reviewed or there are none matching your filter criteria.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {processedAnomalies.map((anomaly) => {
              const priceDifference = calculatePriceDifference(anomaly.oldPrice, anomaly.anomalousPrice);
              const isPriceDrop = anomaly.oldPrice ? anomaly.anomalousPrice < anomaly.oldPrice : false;

              return (
                <Card key={anomaly.anomaly_id} className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl">
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-2">{anomaly.productName}</CardTitle>
                        <CardDescription>Anomaly #{anomaly.anomaly_id}</CardDescription>
                      </div>
                      <Badge variant={isPriceDrop ? "destructive" : "default"}>
                         <AlertTriangle className="mr-1 h-3 w-3" />
                         {anomaly.anomaly_type?.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3">
                      {anomaly.oldPrice !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Old Price:</span>
                          <span className="font-mono line-through text-gray-500">LKR {anomaly.oldPrice.toLocaleString()}</span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Anomalous Price:</span>
                        <span className="font-mono font-bold text-lg">LKR {anomaly.anomalousPrice.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Difference:</span>
                        <span className={`font-medium ${isPriceDrop ? "text-green-600" : "text-red-600"}`}>
                          {priceDifference}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          size="sm"
                          className="flex-1 bg-gradient-to-r from-purple-500 to-blue-500 text-white hover:brightness-90 transition-all"
                          onClick={() => handleViewHistory(anomaly)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Price History
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" asChild>
                          <a href={anomaly.productUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" /> Vendor
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 bg-gray-50/50 p-2">
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 bg-white/50 backdrop-blur-sm border-green-500 text-green-600 transition-all",
                        "hover:shadow-lg hover:shadow-green-500/20 hover:text-green-700 hover:border-green-600",
                        "active:bg-green-500 active:text-white"
                      )}
                      onClick={() => openConfirmationModal(anomaly.anomaly_id, "CONFIRMED_SALE", anomaly.productName)}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Confirm Sale
                    </Button>
                    <Button
                      variant="outline"
                      className={cn(
                        "flex-1 bg-white/50 backdrop-blur-sm border-red-500 text-red-600 transition-all",
                        "hover:shadow-lg hover:shadow-red-500/20 hover:text-red-700 hover:border-red-600",
                        "active:bg-red-500 active:text-white"
                      )}
                      onClick={() => openConfirmationModal(anomaly.anomaly_id, "DATA_ERROR", anomaly.productName)}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Data Error
                    </Button>
                  </CardFooter>
                </Card>
              );
            })}
          </div>
        )}
        
        <div className="flex items-center justify-end space-x-2 pt-4">
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}>
                <ChevronLeft className="h-4 w-4 mr-1" /> Previous
            </Button>
            <span className="text-sm">Page {currentPage}</span>
            <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => p + 1)} disabled={!hasMore || loading}>
                Next <ChevronRight className="h-4 w-4 ml-1" />
            </Button>
        </div>
      </div>
      
      <PriceHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        productName={selectedAnomaly?.productName || ""}
        priceHistory={priceHistory}
      />
      {historyLoading && isHistoryModalOpen && (
         <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <Loader2 className="h-8 w-8 animate-spin text-white" />
         </div>
      )}
      
      {/* --- UPDATED: RENDER IMPROVED MODALS --- */}
      <ConfirmationModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleResolveAnomaly}
        title={anomalyToResolve?.resolution === "CONFIRMED_SALE" ? "Confirm Sale" : "Mark as Data Error"}
        message={`Are you sure you want to mark "${anomalyToResolve?.name || 'this anomaly'}" as a ${
          anomalyToResolve?.resolution === "CONFIRMED_SALE" ? "confirmed sale" : "data error"
        }?`}
        isLoading={isResolving}
      />
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={handleCloseSuccessModal}
        title="Success!"
        message={successMessage}
      />
    </ProtectedRoute>
  );
}

