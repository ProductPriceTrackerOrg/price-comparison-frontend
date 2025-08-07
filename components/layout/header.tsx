"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  User,
  Settings,
  Heart,
  LogOut,
  BarChart3,
  Bell,
  Globe,
  Shield,
  Users,
} from "lucide-react";
import { AuthDialog } from "@/components/auth/auth-dialog";
import { useAuth } from "@/contexts/auth-context";

export function Header() {
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"signin" | "signup">("signin");
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  const handleSignIn = () => {
    setAuthMode("signin");
    setIsAuthOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto px-4">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <BarChart3 className="h-8 w-8 text-blue-600" />
            <div>
              <span className="text-2xl font-bold text-gray-900">
                PricePulse
              </span>
              <div className="text-xs text-gray-500 -mt-1">
                Retail Intelligence
              </div>
            </div>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language/Region */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Globe className="h-4 w-4" />
              <span>English-USD</span>
            </div>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-4 w-4" />
                  <div className="absolute -top-1 -right-1 w-2 h-2 bg-red-500 rounded-full"></div>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full"
                    >
                      <Avatar className="h-10 w-10">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="User"
                        />
                        <AvatarFallback>
                          {user?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56" align="end">
                    <div className="flex items-center justify-start gap-2 p-2">
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-medium">{user?.full_name}</p>
                        <p className="w-[200px] truncate text-sm text-muted-foreground">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <div className="flex items-center space-x-1">
                            <Shield className="h-3 w-3 text-orange-500" />
                            <span className="text-xs text-orange-600 font-medium">
                              Administrator
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem asChild>
                      <Link href="/profile">
                        <User className="mr-2 h-4 w-4" />
                        Profile
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/favorites">
                        <Heart className="mr-2 h-4 w-4" />
                        Tracked Products
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/settings">
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                      </Link>
                    </DropdownMenuItem>

                    {/* Admin Panel - Only visible to admins */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem asChild>
                          <Link href="/admin" className="text-orange-600">
                            <Users className="mr-2 h-4 w-4" />
                            Admin Panel
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} className="text-red-600">
                      <LogOut className="mr-2 h-4 w-4" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={handleSignIn}
                  className="text-gray-700"
                >
                  <User className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-orange-500 hover:bg-orange-600 text-white"
                >
                  Create Account
                </Button>
              </>
            )}
          </div>
        </div>
      </div>

      <AuthDialog
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </header>
  );
}
