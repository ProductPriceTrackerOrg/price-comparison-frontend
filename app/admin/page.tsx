"use client"

import { useEffect } from "react"
import { Header } from "@/components/layout/header"
import { NavigationBar } from "@/components/layout/navigation-bar"
import { Footer } from "@/components/layout/footer"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/contexts/auth-context"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Shield, Users, Database, AlertTriangle, Activity, Settings, CheckCircle, XCircle, Clock } from "lucide-react"

export default function AdminDashboard() {
  const { user, isLoggedIn, isAdmin } = useAuth()

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      redirect("/")
    }
  }, [isLoggedIn, isAdmin])

  // Mock data for dashboard
  const dashboardStats = {
    totalUsers: 50234,
    activeUsers: 12456,
    totalProducts: 2500000,
    pendingAnomalies: 45,
    pipelineRuns: {
      success: 23,
      failed: 2,
      running: 1,
    },
  }

  const recentPipelineRuns = [
    {
      id: 1,
      dag_id: "product_scraping_pipeline",
      status: "SUCCESS",
      duration: 1245,
      run_date: "2024-01-08",
      tasks_failed: 0,
    },
    {
      id: 2,
      dag_id: "price_analysis_pipeline",
      status: "SUCCESS",
      duration: 892,
      run_date: "2024-01-08",
      tasks_failed: 0,
    },
    {
      id: 3,
      dag_id: "anomaly_detection_pipeline",
      status: "FAILED",
      duration: 234,
      run_date: "2024-01-08",
      tasks_failed: 3,
    },
  ]

  const pendingAnomalies = [
    {
      id: 1,
      product_name: "iPhone 15 Pro Max",
      anomaly_type: "FLASH_SALE",
      anomaly_score: 0.95,
      created_at: "2024-01-08T10:30:00Z",
    },
    {
      id: 2,
      product_name: "Samsung Galaxy S24",
      anomaly_type: "PRICE_ERROR",
      anomaly_score: 0.87,
      created_at: "2024-01-08T09:15:00Z",
    },
  ]

  if (!isLoggedIn || !isAdmin) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <NavigationBar />

      <main className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <Shield className="h-8 w-8 text-orange-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
          </div>
          <p className="text-gray-600">System monitoring and management tools</p>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.totalUsers.toLocaleString()}</p>
                </div>
                <Users className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Users</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.activeUsers.toLocaleString()}</p>
                </div>
                <Activity className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Products Tracked</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(dashboardStats.totalProducts / 1000000).toFixed(1)}M
                  </p>
                </div>
                <Database className="h-8 w-8 text-purple-600" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Anomalies</p>
                  <p className="text-2xl font-bold text-gray-900">{dashboardStats.pendingAnomalies}</p>
                </div>
                <AlertTriangle className="h-8 w-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Pipeline Status */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Settings className="h-5 w-5" />
                <span>Pipeline Status</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Last 24 hours</span>
                  <div className="flex space-x-4">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="h-4 w-4 text-green-500" />
                      <span className="text-sm">{dashboardStats.pipelineRuns.success} Success</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <XCircle className="h-4 w-4 text-red-500" />
                      <span className="text-sm">{dashboardStats.pipelineRuns.failed} Failed</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4 text-blue-500" />
                      <span className="text-sm">{dashboardStats.pipelineRuns.running} Running</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  {recentPipelineRuns.map((run) => (
                    <div key={run.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {run.status === "SUCCESS" ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )}
                        <div>
                          <p className="text-sm font-medium">{run.dag_id}</p>
                          <p className="text-xs text-gray-500">{run.run_date}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge variant={run.status === "SUCCESS" ? "default" : "destructive"}>{run.status}</Badge>
                        <p className="text-xs text-gray-500 mt-1">{run.duration}s</p>
                      </div>
                    </div>
                  ))}
                </div>

                <Button asChild className="w-full">
                  <Link href="/admin/pipeline-monitoring">View All Pipeline Runs</Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Pending Anomalies */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <AlertTriangle className="h-5 w-5" />
                <span>Pending Anomalies</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {pendingAnomalies.map((anomaly) => (
                  <div key={anomaly.id} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-sm font-medium">{anomaly.product_name}</p>
                      <Badge variant="outline">{anomaly.anomaly_type}</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">Score: {(anomaly.anomaly_score * 100).toFixed(0)}%</p>
                      <p className="text-xs text-gray-500">{new Date(anomaly.created_at).toLocaleDateString()}</p>
                    </div>
                  </div>
                ))}

                <Button asChild className="w-full">
                  <Link href="/admin/anomaly-review">Review All Anomalies</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Admin Tools */}
        <Card>
          <CardHeader>
            <CardTitle>Admin Tools</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/pipeline-monitoring">
                  <Settings className="h-6 w-6 mb-2" />
                  Pipeline Monitoring
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/data-curation">
                  <Database className="h-6 w-6 mb-2" />
                  Data Curation
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/anomaly-review">
                  <AlertTriangle className="h-6 w-6 mb-2" />
                  Anomaly Review
                </Link>
              </Button>

              <Button asChild variant="outline" className="h-20 flex-col bg-transparent">
                <Link href="/admin/user-management">
                  <Users className="h-6 w-6 mb-2" />
                  User Management
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>

      <Footer />
    </div>
  )
}
