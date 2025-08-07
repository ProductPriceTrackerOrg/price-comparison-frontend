"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts"
import { TrendingDown, TrendingUp, Calendar, Star, Info } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface PriceHistoryProps {
  productId: string
}

interface PriceDataPoint {
  date: string
  price: number
}

interface PriceChange {
  date: string
  oldPrice: number
  newPrice: number
  change: number
  percentage: number
}

export function PriceHistory({ productId }: PriceHistoryProps) {
  const [timeRange, setTimeRange] = useState("30d")
  const [priceData, setPriceData] = useState<PriceDataPoint[]>([])
  const [priceChanges, setPriceChanges] = useState<PriceChange[]>([])

  // Mock price history data with more data points for better visualization
  const mockPriceData: PriceDataPoint[] = [
    { date: "2024-01-01", price: 1399.99 },
    { date: "2024-01-03", price: 1420.50 },
    { date: "2024-01-05", price: 1380.25 },
    { date: "2024-01-08", price: 1365.75 },
    { date: "2024-01-10", price: 1390.00 },
    { date: "2024-01-15", price: 1349.99 },
    { date: "2024-01-18", price: 1375.80 },
    { date: "2024-01-22", price: 1355.40 },
    { date: "2024-01-25", price: 1330.20 },
    { date: "2024-02-01", price: 1299.99 },
    { date: "2024-02-05", price: 1285.75 },
    { date: "2024-02-08", price: 1295.50 },
    { date: "2024-02-12", price: 1275.30 },
    { date: "2024-02-15", price: 1279.99 },
    { date: "2024-02-18", price: 1260.45 },
    { date: "2024-02-22", price: 1245.80 },
    { date: "2024-02-28", price: 1255.20 },
    { date: "2024-03-01", price: 1249.99 },
    { date: "2024-03-05", price: 1235.60 },
    { date: "2024-03-10", price: 1220.40 },
    { date: "2024-03-15", price: 1199.99 },
    { date: "2024-03-20", price: 1210.30 },
    { date: "2024-03-25", price: 1205.75 },
    { date: "2024-03-27", price: 1199.99 },
  ]

  const mockPriceChanges: PriceChange[] = [
    {
      date: "Mar 27, 2024",
      oldPrice: 1249.99,
      newPrice: 1199.99,
      change: -50.0,
      percentage: -4.0,
    },
    {
      date: "Mar 01, 2024",
      oldPrice: 1279.99,
      newPrice: 1249.99,
      change: -30.0,
      percentage: -2.34,
    },
    {
      date: "Feb 15, 2024",
      oldPrice: 1299.99,
      newPrice: 1279.99,
      change: -20.0,
      percentage: -1.54,
    },
    {
      date: "Feb 01, 2024",
      oldPrice: 1349.99,
      newPrice: 1299.99,
      change: -50.0,
      percentage: -3.7,
    },
  ]

  useEffect(() => {
    setPriceData(mockPriceData)
    setPriceChanges(mockPriceChanges)
  }, [productId, timeRange])

  // Calculate market stats
  const currentPrice = priceData[priceData.length - 1]?.price || 0
  const previousPrice = priceData[priceData.length - 2]?.price || 0
  const priceChange = currentPrice - previousPrice
  const priceChangePercentage = previousPrice ? ((priceChange / previousPrice) * 100) : 0
  const highestPrice = Math.max(...priceData.map(d => d.price))
  const lowestPrice = Math.min(...priceData.map(d => d.price))

  const formatCurrency = (value: number) => `$${value.toLocaleString()}`
  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  return (
    <div className="space-y-6">
      {/* Main Price Chart Card */}
      <Card className="overflow-hidden">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <CardTitle className="flex items-center space-x-2 text-lg">
                <Calendar className="h-5 w-5 text-blue-600" />
                <span>Price History</span>
                <Badge variant="secondary" className="ml-2">
                  {timeRange.toUpperCase()}
                </Badge>
              </CardTitle>
              <div className="flex items-center space-x-4">
                <div className="text-3xl font-bold">{formatCurrency(currentPrice)}</div>
                <div className={`flex items-center space-x-1 ${priceChange >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                  {priceChange >= 0 ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                  <span className="font-semibold">
                    {formatCurrency(Math.abs(priceChange))} ({priceChangePercentage >= 0 ? '+' : ''}{priceChangePercentage.toFixed(2)}%)
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7d">7 Days</SelectItem>
                  <SelectItem value="30d">30 Days</SelectItem>
                  <SelectItem value="90d">90 Days</SelectItem>
                  <SelectItem value="1y">1 Year</SelectItem>
                </SelectContent>
              </Select>
              <button className="p-2 hover:bg-gray-100 rounded-full">
                <Star className="h-4 w-4" />
              </button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="flex items-center justify-between mb-6">
            <div className="flex space-x-8 text-sm">
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">MARKET CAP</div>
                <div className="font-semibold">{formatCurrency(281.8 * 1000000)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">VOLUME (24H)</div>
                <div className="font-semibold">{formatCurrency(24.3 * 1000000)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">ALL TIME HIGH</div>
                <div className="font-semibold">{formatCurrency(highestPrice)}</div>
              </div>
              <div className="text-center">
                <div className="text-xs text-muted-foreground mb-1">ALL TIME LOW</div>
                <div className="font-semibold">{formatCurrency(lowestPrice)}</div>
              </div>
            </div>
          </div>
          
          <div className="h-80 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={priceData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="priceGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#3B82F6" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#3B82F6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" className="stroke-muted-foreground/20" />
                <XAxis
                  dataKey="date"
                  className="text-muted-foreground text-xs"
                  tickFormatter={formatDate}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis 
                  className="text-muted-foreground text-xs" 
                  tickFormatter={(value) => `$${value.toLocaleString()}`}
                  axisLine={false}
                  tickLine={false}
                  domain={['dataMin - 50', 'dataMax + 50']}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "white",
                    border: "1px solid hsl(var(--border))",
                    borderRadius: "12px",
                    boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)",
                    fontSize: "14px",
                  }}
                  formatter={(value: number) => [formatCurrency(value), "Price"]}
                  labelFormatter={(label) => new Date(label).toLocaleDateString('en-US', { 
                    weekday: 'long', 
                    year: 'numeric', 
                    month: 'long', 
                    day: 'numeric' 
                  })}
                />
                <Area
                  type="monotone"
                  dataKey="price"
                  stroke="#3B82F6"
                  strokeWidth={3}
                  fill="url(#priceGradient)"
                  dot={false}
                  activeDot={{ 
                    r: 6, 
                    fill: "#3B82F6", 
                    strokeWidth: 2, 
                    stroke: "white" 
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Market Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Market Cap</p>
                <p className="text-lg font-bold">{formatCurrency(281.8 * 1000000)}</p>
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Circulating Supply</p>
                <p className="text-lg font-bold">120.2M</p>
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Volume (24H)</p>
                <p className="text-lg font-bold">{formatCurrency(24.3 * 1000000)}</p>
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground uppercase tracking-wide">Total Supply</p>
                <p className="text-lg font-bold">120.2M</p>
              </div>
              <Info className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Price Changes Table */}
      <Card>
        <CardHeader>
          <CardTitle>Price Change History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-4">Date</th>
                  <th className="text-left py-3 px-4">Old Price</th>
                  <th className="text-left py-3 px-4">New Price</th>
                  <th className="text-left py-3 px-4">Change</th>
                  <th className="text-left py-3 px-4">Percentage</th>
                </tr>
              </thead>
              <tbody>
                {priceChanges.map((change, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="py-3 px-4 text-muted-foreground">{change.date}</td>
                    <td className="py-3 px-4">${change.oldPrice}</td>
                    <td className="py-3 px-4 font-semibold">${change.newPrice}</td>
                    <td className="py-3 px-4">
                      <div
                        className={`flex items-center space-x-1 ${change.change < 0 ? "text-green-600" : "text-red-600"}`}
                      >
                        {change.change < 0 ? <TrendingDown className="h-4 w-4" /> : <TrendingUp className="h-4 w-4" />}
                        <span>${Math.abs(change.change).toFixed(2)}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className={change.percentage < 0 ? "text-green-600" : "text-red-600"}>
                        {change.percentage > 0 ? "+" : ""}
                        {change.percentage.toFixed(2)}%
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
