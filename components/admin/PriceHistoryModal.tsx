"use client"

import { useEffect, useState } from "react"
import { X, ZoomOut } from "lucide-react"
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts"
import { Button } from "@/components/ui/button"

interface PriceHistoryModalProps {
  isOpen: boolean
  onClose: () => void
  productName: string
  priceHistory: { date: string; price: number }[]
}

export function PriceHistoryModal({ isOpen, onClose, productName, priceHistory }: PriceHistoryModalProps) {
  const [zoomState, setZoomState] = useState<{
    startIndex: number
    endIndex: number
  } | null>(null)

  const [isZoomed, setIsZoomed] = useState(false)

  // Disable scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = "unset"
    }

    return () => {
      document.body.style.overflow = "unset"
    }
  }, [isOpen])

  useEffect(() => {
    if (!isOpen) {
      setZoomState(null)
      setIsZoomed(false)
    }
  }, [isOpen])

  const handleChartClick = (data: any) => {
    if (!data || !data.activePayload) return

    const clickedIndex = priceHistory.findIndex((item) => item.date === data.activePayload[0].payload.date)

    if (clickedIndex === -1) return

    if (isZoomed) {
      // Zoom out - reset to full view
      setZoomState(null)
      setIsZoomed(false)
    } else {
      // Zoom in - show 5 data points around the clicked point
      const range = 2
      const startIndex = Math.max(0, clickedIndex - range)
      const endIndex = Math.min(priceHistory.length - 1, clickedIndex + range)
      setZoomState({ startIndex, endIndex })
      setIsZoomed(true)
    }
  }

  const handleZoomOut = () => {
    setZoomState(null)
    setIsZoomed(false)
  }

  if (!isOpen) return null

  const displayData = zoomState ? priceHistory.slice(zoomState.startIndex, zoomState.endIndex + 1) : priceHistory

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200"
      onClick={onClose}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/20 backdrop-blur-md" />

      {/* Modal Content */}
      <div
        className="relative w-full max-w-3xl bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-2xl shadow-2xl border border-white/20 dark:border-white/10 animate-in zoom-in-95 duration-200 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Gradient glow effect at the top */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-gradient-to-b from-cyan-400/10 to-transparent blur-2xl" />

        {/* Header */}
        <div className="relative flex items-center justify-between border-b border-white/10 dark:border-white/5 p-6 bg-gradient-to-b from-white/50 to-transparent dark:from-white/5 dark:to-transparent">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300 bg-clip-text text-transparent">
              Price History for {productName}
            </h2>
            {isZoomed && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleZoomOut}
                className="h-7 gap-1.5 text-xs bg-white/50 dark:bg-white/5 hover:bg-white/80 dark:hover:bg-white/10 border-white/20 transition-all"
              >
                <ZoomOut className="h-3 w-3" />
                Reset Zoom
              </Button>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="h-8 w-8 hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
          >
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>

        {/* Chart Content */}
        <div className="p-6 relative">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-50/50 via-transparent to-purple-50/50 dark:from-cyan-950/20 dark:via-transparent dark:to-purple-950/20" />
          <div className="relative mb-2 text-center">
            <p className="text-xs text-gray-600 dark:text-gray-400">
              {isZoomed ? "Click any point to zoom out" : "Click any point to zoom in"}
            </p>
          </div>
          <div className="relative">
            <ResponsiveContainer width="100%" height={400}>
              <LineChart
                data={displayData}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                onClick={handleChartClick}
              >
                <defs>
                  {/* Gradient for the line */}
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8} />
                  </linearGradient>
                  <linearGradient id="colorPriceArea" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="currentColor" className="opacity-10" />
                <XAxis
                  dataKey="date"
                  stroke="currentColor"
                  className="text-xs opacity-60"
                  tick={{ fill: "currentColor" }}
                />
                <YAxis stroke="currentColor" className="text-xs opacity-60" tick={{ fill: "currentColor" }} />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    backdropFilter: "blur(12px)",
                    border: "1px solid rgba(255, 255, 255, 0.2)",
                    borderRadius: "12px",
                    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.1)",
                  }}
                  labelStyle={{ color: "#1f2937", fontWeight: 600 }}
                  itemStyle={{ color: "#06b6d4" }}
                />
                <Legend
                  wrapperStyle={{
                    paddingTop: "20px",
                    color: "currentColor",
                  }}
                />
                <Line
                  type="monotone"
                  dataKey="price"
                  stroke="url(#colorPrice)"
                  strokeWidth={3}
                  dot={{ fill: "#06b6d4", r: 5, strokeWidth: 2, stroke: "#fff" }}
                  activeDot={{ r: 7, strokeWidth: 3, stroke: "#fff", fill: "#06b6d4" }}
                  fill="url(#colorPriceArea)"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  )
}
