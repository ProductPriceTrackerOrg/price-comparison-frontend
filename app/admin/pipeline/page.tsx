"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";

// Define types
interface PipelineStatus {
  lastRunStatus: string;
  lastRunTimestamp: string;
  durationSeconds: number;
  failedTasks: number;
  airflowUiUrl: string;
}

export default function PipelineMonitoringPage() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchPipelineStatus = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch("/api/admin/pipeline-status")
        // const data = await response.json()

        // For now, use mock data
        const mockData: PipelineStatus = {
          lastRunStatus: "Success",
          lastRunTimestamp: "2025-09-27T02:00:00Z",
          durationSeconds: 930,
          failedTasks: 0,
          airflowUiUrl: "http://localhost:8080",
        };

        setPipelineStatus(mockData);
      } catch (err) {
        setError("Failed to fetch pipeline status. Please try again later.");
        console.error("Failed to fetch pipeline status:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPipelineStatus();
  }, []);

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Format duration in seconds to minutes and seconds
  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Get status icon based on status string
  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case "success":
        return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      case "failed":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "running":
        return <Loader2 className="h-5 w-5 text-blue-500 animate-spin" />;
      default:
        return <Clock className="h-5 w-5 text-yellow-500" />;
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading pipeline status...
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="destructive" className="mt-4">
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">
          Pipeline Monitoring
        </h1>

        {/* Status Summary */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {pipelineStatus && getStatusIcon(pipelineStatus.lastRunStatus)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStatus?.lastRunStatus}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Last Run</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStatus &&
                  formatTimestamp(pipelineStatus.lastRunTimestamp)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Duration</CardTitle>
              <Clock className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStatus &&
                  formatDuration(pipelineStatus.durationSeconds)}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Failed Tasks
              </CardTitle>
              <XCircle className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStatus?.failedTasks}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Embedded Airflow UI */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Airflow Dashboard</h2>
          <Card className="overflow-hidden">
            <CardContent className="p-0">
              <div className="bg-muted/50 p-4 text-sm">
                <p className="mb-2">
                  Note: This iframe embeds the Airflow UI. For this to work
                  properly:
                </p>
                <ul className="list-disc list-inside space-y-1">
                  <li>
                    The Airflow server must have appropriate CORS headers
                    configured.
                  </li>
                  <li>
                    The Airflow server should be accessible from the user's
                    network.
                  </li>
                  <li>
                    For security, consider implementing a secure proxy or
                    authentication gateway.
                  </li>
                </ul>
              </div>
              <div className="h-[600px] w-full border-t">
                <iframe
                  src={pipelineStatus?.airflowUiUrl || "about:blank"}
                  className="w-full h-full"
                  title="Airflow Dashboard"
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}
