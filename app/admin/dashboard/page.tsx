"use client";

import { useState, useEffect } from "react";
import {
  LayoutDashboard,
  Database,
  Users,
  AlertTriangle,
  BarChart3,
  Package2,
  Store,
  FolderTree,
} from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// Define types
interface Stats {
  totalProducts: number;
  totalRetailers: number;
  totalUsers: number;
  totalCategories: number;
}

interface Activity {
  id: number;
  admin: string;
  action: string;
  timestamp: string;
}

interface DashboardData {
  stats: Stats;
  recentActivity: Activity[];
}

export default function AdminDashboardPage() {
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch("/api/admin/stats")
        // const data = await response.json()

        // For now, use mock data
        const mockData: DashboardData = {
          stats: {
            totalProducts: 12530,
            totalRetailers: 15,
            totalUsers: 2850,
            totalCategories: 45,
          },
          recentActivity: [
            {
              id: 1,
              admin: "admin@example.com",
              action: "Changed status of user 'test@user.com' to inactive.",
              timestamp: "2025-09-27T10:30:00Z",
            },
            {
              id: 2,
              admin: "admin@example.com",
              action: "Confirmed anomaly #123 as 'Flash Sale'.",
              timestamp: "2025-09-27T09:15:00Z",
            },
            {
              id: 3,
              admin: "moderator@example.com",
              action: "Updated retailer information for 'TechStore'.",
              timestamp: "2025-09-26T16:45:00Z",
            },
            {
              id: 4,
              admin: "admin@example.com",
              action: "Marked anomaly #456 as 'Data Error'.",
              timestamp: "2025-09-26T14:20:00Z",
            },
            {
              id: 5,
              admin: "admin@example.com",
              action: "Added new category 'Smart Home'.",
              timestamp: "2025-09-25T11:10:00Z",
            },
          ],
        };

        setDashboardData(mockData);
      } catch (error) {
        console.error("Failed to fetch dashboard data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format timestamp to readable format
  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(date);
  };

  // Shortcut links for quick navigation
  const shortcuts = [
    {
      title: "Pipeline Monitoring",
      description: "Monitor data pipeline status",
      icon: <Database className="h-8 w-8 mb-2" />,
      href: "/admin/pipeline",
    },
    {
      title: "User Management",
      description: "Manage platform users",
      icon: <Users className="h-8 w-8 mb-2" />,
      href: "/admin/users",
    },
    {
      title: "Anomaly Review",
      description: "Review price anomalies",
      icon: <AlertTriangle className="h-8 w-8 mb-2" />,
      href: "/admin/anomalies",
    },
    {
      title: "Website Analytics",
      description: "View platform analytics",
      icon: <BarChart3 className="h-8 w-8 mb-2" />,
      href: "/admin/analytics",
    },
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading dashboard data...
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>

      {/* Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Products
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats.totalProducts.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Retailers
            </CardTitle>
            <Store className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats.totalRetailers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats.totalUsers.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Categories
            </CardTitle>
            <FolderTree className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {dashboardData?.stats.totalCategories.toLocaleString()}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shortcuts */}
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
                    <p className="text-sm text-muted-foreground mt-1">
                      {shortcut.description}
                    </p>
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </div>

      {/* Admin Activity History */}
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
                {dashboardData?.recentActivity.map((activity) => (
                  <TableRow key={activity.id}>
                    <TableCell className="font-medium">
                      {activity.admin}
                    </TableCell>
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
