"use client";

import { useState, useEffect } from "react";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Calendar, ChevronDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { format } from "date-fns";

// Define types
interface UserSignup {
  date: string;
  count: number;
}

interface TrackedProduct {
  name: string;
  count: number;
}

interface CategoryDistribution {
  name: string;
  value: number;
}

interface AnalyticsData {
  userSignups: UserSignup[];
  topTrackedProducts: TrackedProduct[];
  categoryDistribution: CategoryDistribution[];
}

export default function WebsiteAnalyticsPage() {
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState<{
    from: Date | undefined;
    to: Date | undefined;
  }>({
    from: new Date(new Date().setDate(new Date().getDate() - 30)),
    to: new Date(),
  });
  const [timePeriod, setTimePeriod] = useState("30d");

  useEffect(() => {
    // Simulate API call
    const fetchAnalyticsData = async () => {
      try {
        // In a real implementation, this would be an API call with date range parameters
        // const response = await fetch(`/api/admin/analytics-data?from=${from}&to=${to}`)
        // const data = await response.json()

        // For now, use mock data
        const mockData: AnalyticsData = {
          userSignups: [
            { date: "2025-09-01", count: 10 },
            { date: "2025-09-02", count: 15 },
            { date: "2025-09-03", count: 12 },
            { date: "2025-09-04", count: 8 },
            { date: "2025-09-05", count: 20 },
            { date: "2025-09-06", count: 17 },
            { date: "2025-09-07", count: 16 },
            { date: "2025-09-08", count: 14 },
            { date: "2025-09-09", count: 22 },
            { date: "2025-09-10", count: 25 },
            { date: "2025-09-11", count: 19 },
            { date: "2025-09-12", count: 23 },
            { date: "2025-09-13", count: 21 },
            { date: "2025-09-14", count: 18 },
            { date: "2025-09-15", count: 24 },
            { date: "2025-09-16", count: 27 },
            { date: "2025-09-17", count: 30 },
            { date: "2025-09-18", count: 28 },
            { date: "2025-09-19", count: 32 },
            { date: "2025-09-20", count: 35 },
            { date: "2025-09-21", count: 34 },
            { date: "2025-09-22", count: 36 },
            { date: "2025-09-23", count: 38 },
            { date: "2025-09-24", count: 40 },
            { date: "2025-09-25", count: 45 },
            { date: "2025-09-26", count: 48 },
            { date: "2025-09-27", count: 50 },
          ],
          topTrackedProducts: [
            { name: "ASUS Zenbook", count: 150 },
            { name: "SuperGamer Mouse", count: 120 },
            { name: "Apple MacBook Pro", count: 200 },
            { name: "Sony WH-1000XM5", count: 180 },
            { name: "Samsung Galaxy S25", count: 165 },
            { name: "Dell XPS 15", count: 130 },
            { name: "iPhone 17 Pro", count: 210 },
            { name: "Logitech MX Master", count: 95 },
            { name: "Microsoft Surface Pro", count: 85 },
            { name: "LG OLED C3 TV", count: 110 },
          ],
          categoryDistribution: [
            { name: "Laptops", value: 400 },
            { name: "Peripherals", value: 300 },
            { name: "Smartphones", value: 350 },
            { name: "Audio", value: 250 },
            { name: "TVs & Displays", value: 200 },
            { name: "PC Components", value: 150 },
            { name: "Smart Home", value: 100 },
            { name: "Cameras", value: 75 },
          ],
        };

        setAnalyticsData(mockData);
      } catch (error) {
        console.error("Failed to fetch analytics data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [dateRange]);

  // Update date range based on time period selection
  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);

    const to = new Date();
    let from = new Date();

    switch (period) {
      case "7d":
        from.setDate(to.getDate() - 7);
        break;
      case "30d":
        from.setDate(to.getDate() - 30);
        break;
      case "90d":
        from.setDate(to.getDate() - 90);
        break;
      case "1y":
        from.setFullYear(to.getFullYear() - 1);
        break;
    }

    setDateRange({ from, to });
  };

  // Format date for display
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return format(date, "MMM d");
  };

  // Generate pie chart colors
  const COLORS = [
    "#8884d8",
    "#82ca9d",
    "#ffc658",
    "#ff8042",
    "#0088FE",
    "#00C49F",
    "#FFBB28",
    "#FF8042",
    "#a4de6c",
    "#d0ed57",
  ];

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading analytics data...
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">
            Website Analytics
          </h1>

          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Select time period" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="7d">Last 7 days</SelectItem>
                <SelectItem value="30d">Last 30 days</SelectItem>
                <SelectItem value="90d">Last 90 days</SelectItem>
                <SelectItem value="1y">Last year</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[240px] justify-start text-left font-normal"
                >
                  <Calendar className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM d, yyyy")} -{" "}
                        {format(dateRange.to, "MMM d, yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM d, yyyy")
                    )
                  ) : (
                    <span>Pick a date range</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={(range) => {
                    setDateRange(
                      range as { from: Date | undefined; to: Date | undefined }
                    );
                    setTimePeriod("custom");
                  }}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="user-signups">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-signups">User Sign-ups</TabsTrigger>
            <TabsTrigger value="tracked-products">
              Top Tracked Products
            </TabsTrigger>
            <TabsTrigger value="categories">Category Distribution</TabsTrigger>
          </TabsList>

          {/* User Sign-ups Line Chart */}
          <TabsContent value="user-signups">
            <Card>
              <CardHeader>
                <CardTitle>User Sign-ups Over Time</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                      data={analyticsData?.userSignups}
                      margin={{
                        top: 5,
                        right: 30,
                        left: 20,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis
                        dataKey="date"
                        tickFormatter={formatDate}
                        tick={{ fontSize: 12 }}
                      />
                      <YAxis />
                      <Tooltip
                        labelFormatter={(label) =>
                          format(new Date(label), "MMM d, yyyy")
                        }
                        formatter={(value: number) => [
                          `${value} sign-ups`,
                          "Count",
                        ]}
                      />
                      <Legend />
                      <Line
                        type="monotone"
                        dataKey="count"
                        name="Sign-ups"
                        stroke="#8884d8"
                        activeDot={{ r: 8 }}
                        strokeWidth={2}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Top Tracked Products Bar Chart */}
          <TabsContent value="tracked-products">
            <Card>
              <CardHeader>
                <CardTitle>Top 10 Most Tracked Products</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={analyticsData?.topTrackedProducts}
                      layout="vertical"
                      margin={{
                        top: 5,
                        right: 30,
                        left: 150,
                        bottom: 5,
                      }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis
                        dataKey="name"
                        type="category"
                        tick={{ fontSize: 12 }}
                        width={120}
                      />
                      <Tooltip
                        formatter={(value: number) => [
                          `${value} users`,
                          "Tracking",
                        ]}
                      />
                      <Legend />
                      <Bar dataKey="count" name="User Count" fill="#82ca9d" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Category Distribution Pie Chart */}
          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>Product Distribution by Category</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={analyticsData?.categoryDistribution}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) =>
                          `${name}: ${
                            percent ? (percent * 100).toFixed(0) : 0
                          }%`
                        }
                        outerRadius={150}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {analyticsData?.categoryDistribution.map(
                          (entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          )
                        )}
                      </Pie>
                      <Tooltip
                        formatter={(value: number, name: string) => [
                          `${value} products`,
                          name,
                        ]}
                      />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}
