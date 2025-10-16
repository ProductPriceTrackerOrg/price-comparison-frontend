"use client";

import { useState, useEffect } from "react";
import { Database, Users, AlertTriangle, BarChart3, Package2, Store, FolderTree } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

// Define types to match our API responses
interface Stats {
  totalProducts: number;
  totalRetailers: number;
  totalUsers: number;
  totalCategories: number;
}

interface Activity {
  admin: string;
  action: string;
  timestamp: string;
}

interface DashboardData {
  stats: Stats;
  recentActivity: Activity[];
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // This useEffect hook fetches all necessary data from our backend when the page loads.
  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [statsResponse, activityResponse] = await Promise.all([
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/dashboard-stats`),
          fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/recent-activity`),
        ]);

        if (!statsResponse.ok || !activityResponse.ok) {
          throw new Error("Failed to fetch dashboard data from the API");
        }

        const statsData: Stats = await statsResponse.json();
        const activityData: Activity[] = await activityResponse.json();

        setDashboardData({
          stats: statsData,
          recentActivity: activityData,
        });
      } catch (error: any) {
        console.error("Failed to fetch dashboard data:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Helper function to format timestamps for the activity log
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Data for the "Quick Actions" shortcut links
  const shortcuts = [
    { title: "Pipeline Monitoring", description: "Monitor data pipeline status", icon: <Database className="h-8 w-8 mb-2" />, href: "/admin/pipeline" },
    { title: "User Management", description: "Manage platform users", icon: <Users className="h-8 w-8 mb-2" />, href: "/admin/users" },
    { title: "Anomaly Review", description: "Review price anomalies", icon: <AlertTriangle className="h-8 w-8 mb-2" />, href: "/admin/anomalies" },
    { title: "Website Analytics", description: "View platform analytics", icon: <BarChart3 className="h-8 w-8 mb-2" />, href: "/admin/analytics" },
  ];

  if (loading) {
    return <div className="flex items-center justify-center h-64">Loading dashboard data...</div>;
  }
  
  if (error) {
    return <div className="text-red-500 p-4">Error: {error}</div>;
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6 p-4 md:p-8">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

        {/* --- THIS IS THE NEW, STYLED CARD SECTION --- */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card className="border-0 bg-gradient-to-br from-indigo-500 to-purple-600 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Products</CardTitle>
              <Package2 className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.stats.totalProducts.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-cyan-400 to-blue-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Retailers</CardTitle>
              <Store className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.stats.totalRetailers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-amber-400 to-orange-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Users</CardTitle>
              <Users className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.stats.totalUsers.toLocaleString()}</div>
            </CardContent>
          </Card>
          <Card className="border-0 bg-gradient-to-br from-rose-400 to-pink-500 text-white">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-white/90">Total Categories</CardTitle>
              <FolderTree className="h-4 w-4 text-white/80" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{dashboardData?.stats.totalCategories.toLocaleString()}</div>
            </CardContent>
          </Card>
        </div>

        {/* Shortcuts Section */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {shortcuts.map((shortcut, index) => (
              <Link href={shortcut.href} key={index}>
                <Card className="hover:bg-muted transition-colors cursor-pointer h-full">
                  <CardContent className="pt-6 text-center">
                    <div className="flex flex-col items-center">
                      {shortcut.icon}
                      <h3 className="font-semibold">{shortcut.title}</h3>
                      <p className="text-sm text-muted-foreground mt-1">{shortcut.description}</p>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Admin Activity History Table */}
        <div className="mt-8">
          <h2 className="text-xl font-semibold mb-4">Recent Admin Activity</h2>
          <Card>
            <CardContent className="pt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Admin</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Timestamp</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {dashboardData?.recentActivity.map((activity, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{activity.admin}</TableCell>
                      <TableCell>{activity.action}</TableCell>
                      <TableCell>{formatTimestamp(activity.timestamp)}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>
    </ProtectedRoute>
  );
}

