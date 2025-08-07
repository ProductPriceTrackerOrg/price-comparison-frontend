"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

interface User {
  user_id: number
  email: string
  full_name: string
  role: "User" | "Admin"
  is_active: boolean
  created_at: string
}

interface AuthContextType {
  user: User | null
  isLoggedIn: boolean
  isAdmin: boolean
  login: (email: string, password: string) => Promise<void>
  logout: () => void
  signup: (email: string, password: string, fullName: string) => Promise<void>
  updateUser: (userData: Partial<User>) => void
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoggedIn, setIsLoggedIn] = useState(false)

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user")
    if (savedUser) {
      const userData = JSON.parse(savedUser)
      setUser(userData)
      setIsLoggedIn(true)
    }
  }, [])

  const login = async (email: string, password: string) => {
    // Mock login - replace with actual API call
    // In real implementation, the API would return user data including role
    const mockUser: User = {
      user_id: 1,
      email,
      full_name: "John Doe",
      role: email.includes("admin") ? "Admin" : "User", // Simple role assignment for demo
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setUser(mockUser)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const logout = () => {
    setUser(null)
    setIsLoggedIn(false)
    localStorage.removeItem("user")
  }

  const signup = async (email: string, password: string, fullName: string) => {
    // Mock signup - replace with actual API call
    const mockUser: User = {
      user_id: Date.now(), // Simple ID generation for demo
      email,
      full_name: fullName,
      role: "User",
      is_active: true,
      created_at: new Date().toISOString(),
    }

    setUser(mockUser)
    setIsLoggedIn(true)
    localStorage.setItem("user", JSON.stringify(mockUser))
  }

  const updateUser = (userData: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...userData }
      setUser(updatedUser)
      localStorage.setItem("user", JSON.stringify(updatedUser))
    }
  }

  const isAdmin = user?.role === "Admin"

  return (
    <AuthContext.Provider value={{ user, isLoggedIn, isAdmin, login, logout, signup, updateUser }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
