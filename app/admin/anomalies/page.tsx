"use client"

import { useState, useEffect } from "react"
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
} from "lucide-react"
import { ProtectedRoute } from "@/components/auth/protected-route"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
// Import our new modal component
import { PriceHistoryModal } from "@/components/admin/PriceHistoryModal"

// Define types to match the backend API response
interface Anomaly {
  anomaly_id: string
  productName: string
  anomalousPrice: number
  oldPrice: number | null
  productUrl: string
  vendorUrl: string
  anomaly_type?: string
}

interface PriceHistoryData {
  date: string
  price: number
}

export default function AnomalyReviewPage() {
  const [anomalies, setAnomalies] = useState<Anomaly[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // State for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const perPage = 20

  // State management for the Price History Modal
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedAnomaly, setSelectedAnomaly] = useState<Anomaly | null>(null)
  const [priceHistory, setPriceHistory] = useState<PriceHistoryData[]>([])
  const [historyLoading, setHistoryLoading] = useState(false)

  // Fetches the main list of anomalies from the backend API
  useEffect(() => {
    const fetchAnomalies = async () => {
      setLoading(true)
      setError(null)
      try {
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies?page=${currentPage}&per_page=${perPage}`

        const response = await fetch(apiUrl, {
          // headers: { 'Authorization': `Bearer ${your_jwt_token}` } // Add real auth here in the future
        })

        if (!response.ok) {
          throw new Error("Failed to fetch anomalies from the API")
        }

        const data: Anomaly[] = await response.json()
        setAnomalies(data)

        // If the API returns fewer items than we asked for, we know there are no more pages.
        setHasMore(data.length === perPage)
      } catch (err: any) {
        console.error("Failed to fetch anomalies:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAnomalies()
  }, [currentPage]) // Re-fetch data whenever the page changes

  // Function to handle opening the modal and fetching price history data
  const handleViewHistory = async (anomaly: Anomaly) => {
    setSelectedAnomaly(anomaly)
    setIsModalOpen(true)
    setHistoryLoading(true)
    try {
      const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies/${anomaly.anomaly_id}/price-history`
      const response = await fetch(apiUrl)
      if (!response.ok) throw new Error("Failed to fetch price history")
      const data: PriceHistoryData[] = await response.json()
      setPriceHistory(data)
    } catch (err) {
      console.error("Failed to fetch price history:", err)
      // You could set a specific error state for the modal here if needed
    } finally {
      setHistoryLoading(false)
    }
  }

  // Function to resolve an anomaly by calling the backend API
  const handleResolveAnomaly = async (anomalyId: string, resolution: "CONFIRMED_SALE" | "DATA_ERROR") => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/anomalies/${anomalyId}/resolve`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // 'Authorization': `Bearer ${your_jwt_token}` // Add real auth here
        },
        body: JSON.stringify({ resolution }),
      })

      if (!response.ok) {
        throw new Error("Failed to resolve anomaly")
      }

      // If successful, remove the anomaly from the list in the UI for a smooth experience.
      setAnomalies((prevAnomalies) => prevAnomalies.filter((anomaly) => anomaly.anomaly_id !== anomalyId))
    } catch (error: any) {
      console.error(`Error resolving anomaly #${anomalyId}:`, error)
      // In a real app, you would show an error message to the user here (e.g., a toast notification).
    }
  }

  // Helper function to calculate the price difference percentage
  const calculatePriceDifference = (original: number | null, anomalous: number) => {
    if (original === null || original === 0) return "N/A"
    const difference = ((anomalous - original) / original) * 100
    return `${difference.toFixed(2)}%`
  }

  // Render loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        <span className="ml-2">Loading anomalies for review...</span>
      </div>
    )
  }

  // Render error state
  if (error) {
    return (
      <Alert variant="destructive">
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Anomaly Review</h1>
          {/* Filtering and sorting UI is kept but disabled for now as the backend doesn't support it yet */}
          <div className="flex flex-col sm:flex-row gap-2">
            <Select defaultValue="all" disabled>
              <SelectTrigger className="w-full sm:w-[180px]">
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
            </Select>
            <Button variant="outline" disabled>
              <ArrowUpDown className="h-4 w-4 mr-2" />
              Sort by Highest Difference
            </Button>
          </div>
        </div>

        {anomalies.length === 0 ? (
          <Alert>
            <AlertTitle>No anomalies to review</AlertTitle>
            <AlertDescription>All price anomalies have been reviewed. Good job!</AlertDescription>
          </Alert>
        ) : (
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {anomalies.map((anomaly) => {
              const priceDifference = calculatePriceDifference(anomaly.oldPrice, anomaly.anomalousPrice)
              const isPriceDrop = anomaly.oldPrice ? anomaly.anomalousPrice < anomaly.oldPrice : false

              return (
                <Card
                  key={anomaly.anomaly_id}
                  className="overflow-hidden flex flex-col transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="line-clamp-2">{anomaly.productName}</CardTitle>
                        <CardDescription>Anomaly #{anomaly.anomaly_id}</CardDescription>
                      </div>
                      <Badge variant={isPriceDrop ? "destructive" : "default"}>
                        <AlertTriangle className="mr-1 h-3 w-3" />
                        {anomaly.anomaly_type?.replace("_", " ")}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    <div className="space-y-3">
                      {anomaly.oldPrice !== null && (
                        <div className="flex justify-between items-center">
                          <span className="text-sm font-medium">Old Price:</span>
                          <span className="font-mono line-through text-gray-500">
                            LKR {anomaly.oldPrice.toLocaleString()}
                          </span>
                        </div>
                      )}
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Anomalous Price:</span>
                        <span className="font-mono font-bold text-lg">
                          LKR {anomaly.anomalousPrice.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Difference:</span>
                        <span
                          className={`font-medium ${isPriceDrop ? "bg-gradient-to-r from-green-500 to-green-700 bg-clip-text text-transparent" : "bg-gradient-to-r from-red-500 to-red-700 bg-clip-text text-transparent"}`}
                        >
                          {priceDifference}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-4">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1 bg-transparent"
                          onClick={() => handleViewHistory(anomaly)}
                        >
                          <Eye className="h-4 w-4 mr-1" /> View Price History
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1 bg-transparent" asChild>
                          <a href={anomaly.productUrl} target="_blank" rel="noopener noreferrer">
                            <ExternalLink className="h-4 w-4 mr-1" /> Go to
                          </a>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="flex gap-2 bg-gray-50/50 p-2">
                    <Button
                      className="flex-1 bg-gradient-to-r from-green-500 to-green-700 hover:from-green-600 hover:to-green-800 text-white"
                      onClick={() => handleResolveAnomaly(anomaly.anomaly_id, "CONFIRMED_SALE")}
                    >
                      <CheckCircle className="h-4 w-4 mr-1" /> Confirm Sale
                    </Button>
                    <Button
                      variant="destructive"
                      className="flex-1 bg-gradient-to-r from-red-500 to-red-700 hover:from-red-600 hover:to-red-800"
                      onClick={() => handleResolveAnomaly(anomaly.anomaly_id, "DATA_ERROR")}
                    >
                      <XCircle className="h-4 w-4 mr-1" /> Data Error
                    </Button>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}

        {/* Pagination Controls */}
        <div className="flex items-center justify-end space-x-2 pt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1 || loading}
          >
            <ChevronLeft className="h-4 w-4 mr-1" /> Previous
          </Button>
          <span className="text-sm">Page {currentPage}</span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setCurrentPage((p) => p + 1)}
            disabled={!hasMore || loading}
          >
            Next <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </div>

      {/* Render the Modal Component */}
      <PriceHistoryModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        productName={selectedAnomaly?.productName || ""}
        priceHistory={priceHistory}
      />
      {/* Show a loading spinner inside the modal while fetching history */}
      {historyLoading && isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <Loader2 className="h-8 w-8 animate-spin text-white" />
        </div>
      )}
    </ProtectedRoute>
  )
}
