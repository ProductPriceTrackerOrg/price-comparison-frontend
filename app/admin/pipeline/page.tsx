"use client";

import { useState, useEffect } from "react";
import { CheckCircle2, XCircle, Clock, Loader2 } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
// --- THIS IS THE FIX ---
// Import the Button component from your UI library
import { Button } from "@/components/ui/button";

// Define the shape of the data we expect from our API
interface PipelineStatus {
  status: string;
  run_date: string;
  duration_seconds: number;
  tasks_failed: number;
  // We'll keep airflowUiUrl for future use, but won't implement the iframe for now
  airflowUiUrl?: string; 
}

export default function PipelineMonitoringPage() {
  const [pipelineStatus, setPipelineStatus] = useState<PipelineStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect hook runs once when the page loads to fetch the pipeline status.
  useEffect(() => {
    const fetchPipelineStatus = async () => {
      try {
        // We now make a real API call to our backend endpoint.
        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/pipeline-status`;
        
        const response = await fetch(apiUrl, {
          // headers: { 'Authorization': `Bearer ${your_jwt_token}` } // Add real auth here
        });

        if (!response.ok) {
          throw new Error('Failed to fetch pipeline status from the API');
        }

        const data: PipelineStatus = await response.json();

        // If the API returns no data (e.g., the log table is empty), handle it gracefully.
        if (!data) {
          setPipelineStatus({
            status: "No Data",
            run_date: new Date().toISOString(),
            duration_seconds: 0,
            tasks_failed: 0,
          });
        } else {
          // Save the live data from the backend into our component's state.
          setPipelineStatus(data);
        }

      } catch (err: any) {
        setError("Failed to fetch pipeline status. Please try again later.");
        console.error("Failed to fetch pipeline status:", err);
      } finally {
        // This always runs, ensuring the "Loading..." message is hidden.
        setLoading(false);
      }
    };

    fetchPipelineStatus();
  }, []);

  // Helper function to format timestamp to a readable format
  const formatTimestamp = (timestamp: string | null) => {
    if (!timestamp) return "N/A";
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Helper function to format duration_seconds in seconds to minutes and seconds
  const formatduration_seconds = (seconds: number | null) => {
    if (seconds === null || seconds === undefined) return "N/A";
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  };

  // Helper function to get a status icon based on the status string
  const getStatusIcon = (status: string | null) => {
    if (!status) return <Clock className="h-5 w-5 text-gray-500" />;
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
      <div className="space-y-6 p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">
          Pipeline Monitoring
        </h1>

        {/* Status Summary Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Status</CardTitle>
              {getStatusIcon(pipelineStatus?.status || null)}
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {pipelineStatus?.status || "N/A"}
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
                {formatTimestamp(pipelineStatus?.run_date || null)}
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
                {formatduration_seconds(pipelineStatus?.duration_seconds || null)}
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
                {pipelineStatus?.tasks_failed ?? "N/A"}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Placeholder for Airflow link, as embedding is not recommended */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Airflow Dashboard</h2>
          <Card>
            <CardContent className="p-6 text-center">
              <p className="text-gray-600 mb-4">
                For detailed pipeline logs and execution history, please open the Airflow UI directly.
              </p>
              <Button asChild>
                <a href={pipelineStatus?.airflowUiUrl || "#"} target="_blank" rel="noopener noreferrer">
                  Open Airflow Dashboard
                </a>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

