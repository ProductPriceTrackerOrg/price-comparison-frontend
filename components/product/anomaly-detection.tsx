"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  AlertTriangle,
  TrendingDown,
  TrendingUp,
  Zap,
  Clock,
  Flame,
  Activity,
} from "lucide-react";
import { ProductAnomaly, ProductAnomalyResponse } from "@/lib/types/product";

interface AnomalyDetectionProps {
  productId: string;
}

type AnomalySeverity = "high" | "medium" | "low";

export function AnomalyDetection({ productId }: AnomalyDetectionProps) {
  const [anomalies, setAnomalies] = useState<ProductAnomaly[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();

    const fetchAnomalies = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(
          `/api/v1/products/${productId}/anomalies?days=30&minScore=0.7`,
          { signal: controller.signal }
        );

        if (!response.ok) {
          throw new Error(`Failed to fetch anomalies: ${response.status}`);
        }

        const data: ProductAnomalyResponse = await response.json();
        setAnomalies(data.anomalies || []);
      } catch (err) {
        if (err instanceof Error && err.name === "AbortError") {
          return;
        }
        console.error("Error loading anomalies", err);
        setError(
          "Unable to load anomaly data right now. Please try again later."
        );
        setAnomalies([]);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchAnomalies();
    }

    return () => {
      controller.abort();
    };
  }, [productId]);

  const getAnomalyIcon = (type: string) => {
    switch (type) {
      case "FLASH_SALE":
      case "PROMOTION":
        return <Zap className="h-4 w-4" />;
      case "PRICE_DROP":
        return <TrendingDown className="h-4 w-4" />;
      case "PRICE_ERROR":
      case "OUTLIER":
        return <AlertTriangle className="h-4 w-4" />;
      case "SEASONAL_PATTERN":
      case "SEASONALITY":
        return <Clock className="h-4 w-4" />;
      case "SPIKE":
      case "SURGE":
        return <TrendingUp className="h-4 w-4" />;
      case "VOLATILITY":
        return <Activity className="h-4 w-4" />;
      default:
        return <Flame className="h-4 w-4" />;
    }
  };

  const determineSeverity = (anomaly: ProductAnomaly): AnomalySeverity => {
    const score = anomaly.anomaly_score ?? 0;
    const impact = Math.abs(anomaly.change_percentage ?? 0);

    if (score >= 0.9 || impact >= 15) {
      return "high";
    }
    if (score >= 0.8 || impact >= 8) {
      return "medium";
    }
    return "low";
  };

  const getSeverityColor = (severity: AnomalySeverity) => {
    switch (severity) {
      case "high":
        return "destructive";
      case "medium":
        return "default";
      case "low":
      default:
        return "secondary";
    }
  };

  const getAnomalyTypeLabel = (type: string) => {
    if (!type) {
      return "Anomaly";
    }
    const formatted = type
      .toLowerCase()
      .split("_")
      .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
      .join(" ");
    return formatted;
  };

  const renderContent = () => {
    if (loading) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <span>Loading anomaly insights…</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>{error}</p>
        </div>
      );
    }

    if (anomalies.length === 0) {
      return (
        <div className="text-center py-8 text-muted-foreground">
          <AlertTriangle className="h-12 w-12 mx-auto mb-4 opacity-50" />
          <p>No price anomalies detected for this product.</p>
        </div>
      );
    }

    return (
      <div className="space-y-4">
        {anomalies.map((anomaly) => {
          const severity = determineSeverity(anomaly);
          const change = anomaly.change_percentage ?? 0;
          const score = Math.min(
            100,
            Math.max(0, (anomaly.anomaly_score ?? 0) * 100)
          );
          const priceChangePositive = change >= 0;

          return (
            <Alert
              key={anomaly.anomaly_id}
              className="border-l-4 border-l-primary"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-shrink-0 mt-1">
                  {getAnomalyIcon(anomaly.anomaly_type)}
                </div>
                <div className="flex-1 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={getSeverityColor(severity)}>
                        {getAnomalyTypeLabel(anomaly.anomaly_type)}
                      </Badge>
                      <span className="text-sm text-muted-foreground">
                        {new Date(anomaly.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div
                        className={`flex items-center space-x-1 ${
                          priceChangePositive
                            ? "text-red-600"
                            : "text-green-600"
                        }`}
                      >
                        {priceChangePositive ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        <span className="text-sm font-medium">
                          {priceChangePositive ? "+" : ""}
                          {change.toFixed(2)}%
                        </span>
                      </div>
                    </div>
                  </div>
                  <AlertDescription className="text-sm space-y-1">
                    {anomaly.previous_price !== null &&
                    anomaly.price !== null ? (
                      <p>
                        Price moved from{" "}
                        <strong>
                          Rs {anomaly.previous_price.toLocaleString()}
                        </strong>{" "}
                        to
                        <strong> Rs {anomaly.price.toLocaleString()}</strong>.
                      </p>
                    ) : (
                      <p>
                        Significant price movement detected for this product.
                      </p>
                    )}
                    {anomaly.model_name ? (
                      <p className="text-xs text-muted-foreground">
                        Model: {anomaly.model_name}
                        {anomaly.model_version
                          ? ` · v${anomaly.model_version}`
                          : ""}
                      </p>
                    ) : null}
                  </AlertDescription>
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>Score: {score.toFixed(0)}%</span>
                    {anomaly.last_trained ? (
                      <span>
                        Model updated:{" "}
                        {new Date(anomaly.last_trained).toLocaleDateString()}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </Alert>
          );
        })}
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <AlertTriangle className="h-5 w-5" />
          <span>Price Anomaly Detection</span>
        </CardTitle>
      </CardHeader>
      <CardContent>{renderContent()}</CardContent>
    </Card>
  );
}
