"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { AlertTriangle, Zap, BadgePercent, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export interface PriceAlert {
  id: string;
  productTitle: string;
  imageUrl: string;
  originalPrice: number;
  currentPrice: number;
  percentageChange: number;
  shopName: string;
  detectedDate: string;
  productUrl: string;
  type: "price_drop" | "flash_sale" | "back_in_stock" | "unusual_discount";
}

interface PriceAlertsProps {
  alerts: PriceAlert[];
  loading: boolean;
  onViewAll?: () => void;
}

export function PriceAlerts({ alerts, loading, onViewAll }: PriceAlertsProps) {
  if (loading) {
    return (
      <Card>
        <CardHeader>
          <Skeleton className="h-5 w-48" />
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="flex gap-4">
                <Skeleton className="h-16 w-16 rounded-md" />
                <div className="space-y-2 flex-1">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-2/3" />
                  <div className="flex gap-2">
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-3 w-16" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const formatPrice = (price: number) => {
    return `Rs. ${price.toLocaleString()}`;
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();

    // If it's today
    if (date.toDateString() === now.toDateString()) {
      return "Today";
    }

    // If it's yesterday
    const yesterday = new Date();
    yesterday.setDate(now.getDate() - 1);
    if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    }

    // Otherwise format as date
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const getAlertTypeInfo = (type: PriceAlert["type"]) => {
    switch (type) {
      case "price_drop":
        return {
          badge: "Price Drop",
          icon: <Zap className="h-3 w-3" />,
          variant: "default" as const,
        };
      case "flash_sale":
        return {
          badge: "Flash Sale",
          icon: <BadgePercent className="h-3 w-3" />,
          variant: "destructive" as const,
        };
      case "back_in_stock":
        return {
          badge: "Back in Stock",
          icon: <AlertTriangle className="h-3 w-3" />,
          variant: "secondary" as const,
        };
      case "unusual_discount":
        return {
          badge: "Unusual Discount",
          icon: <AlertTriangle className="h-3 w-3" />,
          variant: "outline" as const,
        };
      default:
        return {
          badge: "Alert",
          icon: <Zap className="h-3 w-3" />,
          variant: "default" as const,
        };
    }
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-lg">Price Alerts</CardTitle>
        <Badge variant="outline" className="flex items-center gap-1">
          <Zap className="h-3 w-3" />
          {alerts.length} Alerts
        </Badge>
      </CardHeader>
      <CardContent>
        <div className="space-y-5">
          {alerts.length === 0 ? (
            <div className="text-center py-6">
              <div className="text-muted-foreground">
                No price alerts at this time
              </div>
              <div className="text-sm text-muted-foreground mt-2">
                We'll notify you when we detect significant price changes
              </div>
            </div>
          ) : (
            <>
              {alerts.slice(0, 5).map((alert, idx) => {
                const alertInfo = getAlertTypeInfo(alert.type);

                return (
                  <div key={idx} className="flex gap-4 group">
                    <div className="shrink-0">
                      <img
                        src={alert.imageUrl}
                        alt={alert.productTitle}
                        className="h-16 w-16 object-contain rounded-md border"
                        onError={(e) => {
                          e.currentTarget.src = "/placeholder.jpg";
                        }}
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <a
                        href={alert.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-sm font-medium leading-tight line-clamp-2 group-hover:text-blue-600"
                      >
                        {alert.productTitle}
                      </a>
                      <div className="flex gap-2 items-center mt-1">
                        <div className="text-red-500 line-through text-xs">
                          {formatPrice(alert.originalPrice)}
                        </div>
                        <ArrowRight className="h-3 w-3 text-muted-foreground" />
                        <div className="text-sm font-medium text-green-600">
                          {formatPrice(alert.currentPrice)}
                        </div>
                        <Badge
                          variant={alertInfo.variant}
                          className="text-xs flex items-center gap-1"
                        >
                          {alertInfo.icon}
                          {Math.abs(alert.percentageChange).toFixed(0)}%{" "}
                          {alert.percentageChange < 0 ? "off" : "up"}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center mt-1">
                        <span className="text-xs text-muted-foreground">
                          {alert.shopName} • {formatDate(alert.detectedDate)}
                        </span>
                        <Badge variant={alertInfo.variant} className="text-xs">
                          {alertInfo.badge}
                        </Badge>
                      </div>
                    </div>
                  </div>
                );
              })}

              {alerts.length > 5 && (
                <div className="pt-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onViewAll}
                    className="w-full"
                  >
                    View all {alerts.length} alerts
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
