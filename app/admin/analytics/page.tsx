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
import { Calendar as CalendarIcon } from "lucide-react";
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
import { format, subDays, subYears } from "date-fns";
import { DateRange } from "react-day-picker";

// --- UPDATED TYPES to match API response ---
interface UserSignup {
  date: string;
  signups: number;
}

interface TrackedProduct {
  productName: string;
  userCount: number;
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
  const [analyticsData, setAnalyticsData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const [date, setDate] = useState<DateRange | undefined>({
    from: subDays(new Date(), 29),
    to: new Date(),
  });
  const [timePeriod, setTimePeriod] = useState("30d");

  useEffect(() => {
    const fetchAnalyticsData = async () => {
      if (!date?.from || !date?.to) return;

      setLoading(true);
      setError(null);

      try {
        const startDate = format(date.from, "yyyy-MM-dd");
        const endDate = format(date.to, "yyyy-MM-dd");

        const signupsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics/user-signups?start_date=${startDate}&end_date=${endDate}`;
        const trackedProductsUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics/top-tracked-products?start_date=${startDate}&end_date=${endDate}`;
        const categoriesUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/analytics/category-distribution?start_date=${startDate}&end_date=${endDate}`;

        const [signupsResponse, trackedProductsResponse, categoriesResponse] = await Promise.all([
          fetch(signupsUrl),
          fetch(trackedProductsUrl),
          fetch(categoriesUrl),
        ]);

        if (!signupsResponse.ok || !trackedProductsResponse.ok || !categoriesResponse.ok) {
          throw new Error("Failed to fetch one or more analytics endpoints");
        }

        const userSignups: UserSignup[] = await signupsResponse.json();
        const topTrackedProducts: TrackedProduct[] = await trackedProductsResponse.json();
        const categoryDistribution: CategoryDistribution[] = await categoriesResponse.json();

        setAnalyticsData({
          userSignups,
          topTrackedProducts,
          categoryDistribution,
        });

      } catch (err: any) {
        console.error("Failed to fetch analytics data:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyticsData();
  }, [date]);

  const handleTimePeriodChange = (period: string) => {
    setTimePeriod(period);
    const to = new Date();
    let from = new Date();
    switch (period) {
      case "7d": from = subDays(to, 6); break;
      case "30d": from = subDays(to, 29); break;
      case "90d": from = subDays(to, 89); break;
      case "1y": from = subYears(to, 1); break;
    }
    setDate({ from, to });
  };
  
  const formatDate = (dateStr: string) => format(new Date(dateStr), "MMM d");
  const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#0088FE", "#00C49F", "#FFBB28"];

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6 p-4 md:p-8">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <h1 className="text-3xl font-bold tracking-tight">Website Analytics</h1>
          <div className="flex flex-col sm:flex-row items-center gap-2">
            <Select value={timePeriod} onValueChange={handleTimePeriodChange}>
              <SelectTrigger className="w-full sm:w-[180px]">
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
                <Button variant="outline" className="w-full sm:w-[280px] justify-start text-left font-normal">
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date?.from ? (date.to ? (
                    <>{format(date.from, "LLL dd, y")} - {format(date.to, "LLL dd, y")}</>
                  ) : format(date.from, "LLL dd, y")) : <span>Pick a date range</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <CalendarComponent
                  mode="range"
                  defaultMonth={date?.from}
                  selected={date}
                  onSelect={setDate}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </div>

        <Tabs defaultValue="user-signups">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="user-signups">User Sign-ups</TabsTrigger>
            <TabsTrigger value="tracked-products">Top Tracked Products</TabsTrigger>
            <TabsTrigger value="categories">Category Distribution</TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="text-center p-16">Loading analytics...</div>
          ) : error ? (
            <div className="text-center text-red-500 p-16">Error: {error}</div>
          ) : (
            <>
              <TabsContent value="user-signups">
                <Card>
                  <CardHeader><CardTitle>User Sign-ups Over Time</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={analyticsData?.userSignups}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="date" tickFormatter={formatDate} />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Line type="monotone" dataKey="signups" name="Sign-ups" stroke="#8884d8" />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="tracked-products">
                <Card>
                  <CardHeader><CardTitle>Top 10 Most Tracked Products</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={analyticsData?.topTrackedProducts} layout="vertical" margin={{ left: 150 }}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis type="number" />
                          <YAxis dataKey="productName" type="category" tick={{ fontSize: 12 }} width={120} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="userCount" name="User Count" fill="#82ca9d" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="categories">
                <Card>
                  <CardHeader><CardTitle>Product Distribution by Category</CardTitle></CardHeader>
                  <CardContent>
                    <div className="h-[400px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          {/* --- THIS IS THE CORRECTED PART --- */}
                          <Pie 
                            data={analyticsData?.categoryDistribution} 
                            dataKey="value" 
                            nameKey="name" 
                            cx="50%" 
                            cy="50%" 
                            outerRadius={150} 
                            labelLine={false} 
                            label={({ name, percent = 0 }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {analyticsData?.categoryDistribution.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                          <Legend />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>
    </ProtectedRoute>
  );
}

