"use client"

import { Loader2 } from "lucide-react"

export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div className="text-center">
        <Loader2 className="h-10 w-10 animate-spin mx-auto mb-4 text-primary" />
        <h2 className="text-xl font-medium">Loading admin panel...</h2>
        <p className="text-muted-foreground">Please wait while we prepare your dashboard</p>
      </div>
    </div>
  )
}