"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertTriangle, TrendingDown, TrendingUp, Zap, Clock } from "lucide-react"

interface AnomalyDetectionProps {
  productId: string
}

export function AnomalyDetection({ productId }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState([])

  // Mock anomaly data
  const mockAnomalies = [
    {
      id: 1,
      type: "FLASH_SALE",
      date: "2024-03-25",
      description: "Unusual price drop detected - 15% below normal range",
      severity: "high",
      priceChange: -15.2,
      confidence: 0.92,
      retailer: "TechStore",
    },
    {
      id: 2,
      type: "PRICE_ERROR",
      date: "2024-03-20",
      description: "Potential pricing error - price significantly higher than competitors",
      severity: "medium",
      priceChange: 8.5,
      confidence: 0.78,
      retailer: "ElectroMax",
    },
    {
      id: 3,
      type: "SEASONAL_PATTERN",
      date: "2024-03-15",
      description: "Price increase follows seasonal pattern",
      severity: "low",
      priceChange: 3.2,
      confidence: 0.65,
      retailer: "GadgetWorld",
    },
  ]

  useEffect(() => {
    setAnomalies(mockAnomalies)
  }, [productId])

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "FLASH_SALE":
        return <Zap className="h-4 w-4" />
      case "PRICE_ERROR":
        return <AlertTriangle className="h-4 w-4" />
      case "SEASONAL_PATTERN":
        return <Clock className="h-4 w-4" />
      default:
        return <AlertTriangle className="h-4 w-4" />
    }
  }

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case "high":
        return "destructive"
      case "medium":
        return "default"
      case "low":
        return "secondary"
      default:
        return "default"
    }
  }

  const getAnomalyTypeLabel = (type: string) => {
    switch (type) {
      case "FLASH_SALE":
        return "Flash Sale"
      case "PRICE_ERROR":
        return "Price Error"
      case "SEASONAL_PATTERN":
        return "Seasonal Pattern"
      default:
        return type
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Price Anomaly Detection</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {anomalies.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p>No price anomalies detected for this product.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {anomalies.map((anomaly) => (
              <Alert key={anomaly.id} className="border-l-4 border-l-primary">
                <div className="flex items-start space-x-3">
                  <div className="flex-shrink-0 mt-1">{getAnomalyIcon(anomaly.type)}</div>
                  <div className="flex-1 space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Badge variant={getSeverityColor(anomaly.severity)}>{getAnomalyTypeLabel(anomaly.type)}</Badge>
                        <span className="text-sm text-muted-foreground">
                          {new Date(anomaly.date).toLocaleDateString()}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`flex items-center space-x-1 ${anomaly.priceChange < 0 ? "text-green-600" : "text-red-600"}`}
                        >
                          {anomaly.priceChange < 0 ? (
                            <TrendingDown className="h-4 w-4" />
                          ) : (
                            <TrendingUp className="h-4 w-4" />
                          )}
                          <span className="text-sm font-medium">
                            {anomaly.priceChange > 0 ? "+" : ""}
                            {anomaly.priceChange}%
                          </span>
                        </div>
                      </div>
                    </div>
                    <AlertDescription className="text-sm">{anomaly.description}</AlertDescription>
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Retailer: {anomaly.retailer}</span>
                      <span>Confidence: {(anomaly.confidence * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                </div>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
