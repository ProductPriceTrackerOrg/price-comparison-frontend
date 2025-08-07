"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Bell,
  TrendingDown,
  Package,
  Sparkles,
  Percent,
  Clock,
  AlertTriangle,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { BuyingAlert } from "@/lib/types/buyer-central";

interface SmartAlertsSectionProps {
  alerts: BuyingAlert[];
  loading: boolean;
}

export function SmartAlertsSection({
  alerts,
  loading,
}: SmartAlertsSectionProps) {
  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <Skeleton className="h-8 w-64 mx-auto mb-2" />
          <Skeleton className="h-4 w-96 mx-auto" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-10 w-full" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  const getAlertIcon = (type: string) => {
    switch (type) {
      case "price_drop":
        return <TrendingDown className="h-5 w-5" />;
      case "stock_alert":
        return <Package className="h-5 w-5" />;
      case "new_arrival":
        return <Sparkles className="h-5 w-5" />;
      case "deal_alert":
        return <Percent className="h-5 w-5" />;
      default:
        return <Bell className="h-5 w-5" />;
    }
  };

  const getAlertColor = (type: string, urgency: string) => {
    if (urgency === "high") {
      return "border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800";
    }
    switch (type) {
      case "price_drop":
        return "border-green-200 bg-green-50 dark:bg-green-900/20 dark:border-green-800";
      case "stock_alert":
        return "border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-800";
      case "new_arrival":
        return "border-blue-200 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-800";
      case "deal_alert":
        return "border-purple-200 bg-purple-50 dark:bg-purple-900/20 dark:border-purple-800";
      default:
        return "border-gray-200 bg-gray-50 dark:bg-gray-900/20 dark:border-gray-800";
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-100 dark:bg-red-900/20";
      case "medium":
        return "text-yellow-600 bg-yellow-100 dark:bg-yellow-900/20";
      case "low":
        return "text-green-600 bg-green-100 dark:bg-green-900/20";
      default:
        return "text-gray-600 bg-gray-100 dark:bg-gray-900/20";
    }
  };

  const formatAlertType = (type: string) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const isExpiringSoon = (validUntil?: string) => {
    if (!validUntil) return false;
    const expiry = new Date(validUntil);
    const now = new Date();
    const timeDiff = expiry.getTime() - now.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff <= 3;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-gray-900 mb-4">
          Smart Buying Alerts
        </h2>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Get notified about price drops, stock changes, new arrivals, and
          special deals across all your favorite product categories.
        </p>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="text-center">
          <CardContent className="p-4">
            <TrendingDown className="h-6 w-6 text-green-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-green-600">12</div>
            <div className="text-sm text-gray-600">Price Drops</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Package className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-yellow-600">5</div>
            <div className="text-sm text-gray-600">Stock Alerts</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Sparkles className="h-6 w-6 text-blue-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-blue-600">8</div>
            <div className="text-sm text-gray-600">New Arrivals</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="p-4">
            <Percent className="h-6 w-6 text-purple-600 mx-auto mb-2" />
            <div className="text-2xl font-bold text-purple-600">15</div>
            <div className="text-sm text-gray-600">Special Deals</div>
          </CardContent>
        </Card>
      </div>

      {/* Active Alerts */}
      <div className="space-y-4">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">
          Active Alerts
        </h3>

        {alerts.length === 0 ? (
          <Card>
            <CardContent className="text-center py-12">
              <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-semibold text-gray-600 mb-2">
                No Active Alerts
              </h4>
              <p className="text-gray-500 mb-6">
                Set up alerts to get notified about price drops and deals.
              </p>
              <Button>Create Alert</Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {alerts.map((alert) => (
              <Card
                key={alert.alertId}
                className={`hover:shadow-lg transition-shadow ${getAlertColor(
                  alert.alertType,
                  alert.urgency
                )}`}
              >
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      {getAlertIcon(alert.alertType)}
                      <div>
                        <Badge variant="outline" className="mb-1">
                          {formatAlertType(alert.alertType)}
                        </Badge>
                        <div className="text-sm text-gray-600">
                          {alert.categoryName}
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      <Badge className={getUrgencyColor(alert.urgency)}>
                        {alert.urgency.toUpperCase()}
                      </Badge>
                      {alert.validUntil && (
                        <div className="flex items-center gap-1 text-xs text-gray-500">
                          <Clock className="h-3 w-3" />
                          Expires{" "}
                          {new Date(alert.validUntil).toLocaleDateString()}
                          {isExpiringSoon(alert.validUntil) && (
                            <AlertTriangle className="h-3 w-3 text-orange-500 ml-1" />
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{alert.title}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">{alert.description}</p>

                  {alert.relatedProducts &&
                    alert.relatedProducts.length > 0 && (
                      <div className="p-3 bg-white dark:bg-gray-800/50 rounded-lg border">
                        <div className="text-sm font-medium text-gray-700 mb-2">
                          Affected Products: {alert.relatedProducts.length}{" "}
                          items
                        </div>
                        <div className="text-xs text-gray-500">
                          Product IDs:{" "}
                          {alert.relatedProducts.slice(0, 3).join(", ")}
                          {alert.relatedProducts.length > 3 &&
                            ` +${alert.relatedProducts.length - 3} more`}
                        </div>
                      </div>
                    )}

                  <div className="flex gap-2 pt-2">
                    {alert.actionRequired ? (
                      <Button size="sm" className="flex-1">
                        <CheckCircle className="h-4 w-4 mr-2" />
                        Take Action
                      </Button>
                    ) : (
                      <Button variant="outline" size="sm" className="flex-1">
                        View Details
                      </Button>
                    )}
                    <Button variant="outline" size="sm">
                      <XCircle className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Create New Alert */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-600" />
            Create Custom Alert
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <TrendingDown className="h-6 w-6 text-green-600 mb-2" />
              <span className="text-sm">Price Drop Alert</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Package className="h-6 w-6 text-yellow-600 mb-2" />
              <span className="text-sm">Stock Alert</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Sparkles className="h-6 w-6 text-blue-600 mb-2" />
              <span className="text-sm">New Arrival Alert</span>
            </Button>
            <Button
              variant="outline"
              className="h-20 flex flex-col items-center justify-center"
            >
              <Percent className="h-6 w-6 text-purple-600 mb-2" />
              <span className="text-sm">Deal Alert</span>
            </Button>
          </div>

          <div className="text-center">
            <p className="text-sm text-gray-600 mb-4">
              Stay ahead of the market with personalized alerts tailored to your
              interests.
            </p>
            <Button>
              <Bell className="h-4 w-4 mr-2" />
              Set Up Alerts
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
