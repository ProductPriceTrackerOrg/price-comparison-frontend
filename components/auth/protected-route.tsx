"use client"

import type React from "react"

import { useAuth } from "@/contexts/auth-context"
import { useEffect } from "react"
import { redirect } from "next/navigation"

interface ProtectedRouteProps {
  children: React.ReactNode
  requireAdmin?: boolean
}

export function ProtectedRoute({ children, requireAdmin = false }: ProtectedRouteProps) {
  const { isLoggedIn, isAdmin } = useAuth()

  useEffect(() => {
    if (!isLoggedIn) {
      redirect("/")
    }

    if (requireAdmin && !isAdmin) {
      redirect("/")
    }
  }, [isLoggedIn, isAdmin, requireAdmin])

  if (!isLoggedIn || (requireAdmin && !isAdmin)) {
    return null
  }

  return <>{children}</>
}
