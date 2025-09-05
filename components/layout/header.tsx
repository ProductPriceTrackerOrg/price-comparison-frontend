"use client";
//
import { useState, useEffect } from "react";
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
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const { user, isLoggedIn, isAdmin, logout } = useAuth();

  // Add scroll event listener to handle header visibility
  useEffect(() => {
    // Use a debounced scroll handler for better performance
    let scrollTimer: NodeJS.Timeout | null = null;
    const scrollThreshold = 50; // Amount of scroll required to trigger header change

    const controlHeader = () => {
      const currentScrollY = window.scrollY;

      // Set scrolled state for styling - add background when scrolled down
      if (currentScrollY > 80) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Determine if header should be visible based on scroll direction
      // Show header when scrolling up or at top (< 80px from top)
      // Hide header when scrolling down and past threshold
      if (currentScrollY < 80) {
        // Always show at top of page
        setVisible(true);
      } else if (currentScrollY < lastScrollY - scrollThreshold) {
        // Scrolling up significantly - show header
        setVisible(true);
      } else if (
        currentScrollY > lastScrollY + scrollThreshold &&
        currentScrollY > 120
      ) {
        // Scrolling down significantly and not at the top - hide header
        setVisible(false);
      }

      // Update the last scroll position
      setLastScrollY(currentScrollY);
    };

    // Improved scroll handler with throttling for better performance
    const handleScroll = () => {
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }

      scrollTimer = setTimeout(controlHeader, 10);
    };

    // Add event listener
    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (scrollTimer !== null) {
        clearTimeout(scrollTimer);
      }
    };
  }, [lastScrollY]);

  const handleSignIn = () => {
    setAuthMode("signin");
    setIsAuthOpen(true);
  };

  const handleSignUp = () => {
    setAuthMode("signup");
    setIsAuthOpen(true);
  };

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 border-b border-gray-200 shadow-md backdrop-blur-sm ${
        scrolled ? "bg-white/95 shadow-lg" : "bg-white"
      } ${visible ? "animate-header-slide-down" : "animate-header-slide-up"}`}
    >
      {/* Subtle background pattern */}
      <div className="absolute inset-0 opacity-5">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
          }}
        ></div>
      </div>
      <div className="container mx-auto px-4 relative">
        {/* Top bar */}
        <div className="flex items-center justify-between h-16 pb-0">
          {/* Logo with enhanced styling */}
          <Link href="/" className="group flex items-center space-x-3 relative">
            <div className="relative animate-logo-pulse">
              <div className="absolute -inset-1 bg-gradient-to-r from-blue-200 to-indigo-200 rounded-lg blur-md opacity-70 group-hover:opacity-100 transition duration-300"></div>
              <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-1.5 shadow-lg group-hover:shadow-blue-200 transition-all duration-300">
                <BarChart3 className="h-7 w-7 text-white" />
              </div>
            </div>
            <div>
              <span className="text-2xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-800 group-hover:from-indigo-600 group-hover:to-blue-700 transition-all duration-300">
                Price
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-700 to-blue-600">
                  Pulse
                </span>
              </span>
              <div className="text-xs font-medium text-gray-600 -mt-1 pl-0.5 tracking-wider">
                Retail Intelligence
              </div>
            </div>
          </Link>

          {/* Right side actions */}
          <div className="flex items-center space-x-4">
            {/* Language/Region */}
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600 bg-gray-50 py-1.5 px-3 rounded-full border border-gray-100 hover:bg-gray-100 transition-colors duration-200">
              <Globe className="h-4 w-4 text-blue-500" />
              <span className="font-medium">English-USD</span>
            </div>

            {isLoggedIn ? (
              <>
                {/* Notifications */}
                <Button
                  variant="ghost"
                  size="sm"
                  className="relative bg-gray-50 hover:bg-gray-100 rounded-full p-2"
                >
                  <Bell className="h-4 w-4 text-gray-700" />
                  <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-red-500 rounded-full border-2 border-white animate-pulse"></div>
                </Button>

                {/* User Menu */}
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-10 w-10 rounded-full p-0 overflow-hidden border-2 border-transparent hover:border-blue-500 transition-all duration-200"
                    >
                      <Avatar className="h-full w-full">
                        <AvatarImage
                          src="/placeholder.svg?height=40&width=40"
                          alt="User"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-medium">
                          {user?.user_metadata?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-64 p-2" align="end">
                    <div className="flex items-center justify-start gap-3 p-2 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg mb-1">
                      <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                        <AvatarImage
                          src="/placeholder.svg?height=48&width=48"
                          alt="User"
                        />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-indigo-600 text-white text-lg font-medium">
                          {user?.user_metadata?.full_name?.charAt(0) || "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex flex-col space-y-1 leading-none">
                        <p className="font-bold text-gray-800">
                          {user?.user_metadata?.full_name}
                        </p>
                        <p className="w-[200px] truncate text-sm text-gray-600">
                          {user?.email}
                        </p>
                        {isAdmin && (
                          <div className="flex items-center space-x-1 bg-orange-100 rounded-full px-2 py-0.5 w-fit">
                            <Shield className="h-3 w-3 text-orange-600" />
                            <span className="text-xs text-orange-700 font-bold">
                              Administrator
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      asChild
                      className="p-0 focus:bg-transparent"
                    >
                      <Link
                        href="/profile"
                        className="flex items-center w-full py-2 px-2 rounded-md hover:bg-blue-50 transition-colors duration-150"
                      >
                        <div className="p-1.5 bg-blue-100 rounded-md mr-2">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <span className="font-medium">Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="p-0 focus:bg-transparent"
                    >
                      <Link
                        href="/favorites"
                        className="flex items-center w-full py-2 px-2 rounded-md hover:bg-rose-50 transition-colors duration-150"
                      >
                        <div className="p-1.5 bg-rose-100 rounded-md mr-2">
                          <Heart className="h-4 w-4 text-rose-600" />
                        </div>
                        <span className="font-medium">Tracked Products</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      className="p-0 focus:bg-transparent"
                    >
                      <Link
                        href="/settings"
                        className="flex items-center w-full py-2 px-2 rounded-md hover:bg-gray-50 transition-colors duration-150"
                      >
                        <div className="p-1.5 bg-gray-100 rounded-md mr-2">
                          <Settings className="h-4 w-4 text-gray-600" />
                        </div>
                        <span className="font-medium">Settings</span>
                      </Link>
                    </DropdownMenuItem>

                    {/* Admin Panel - Only visible to admins */}
                    {isAdmin && (
                      <>
                        <DropdownMenuSeparator className="my-1" />
                        <DropdownMenuItem
                          asChild
                          className="p-0 focus:bg-transparent"
                        >
                          <Link
                            href="/admin"
                            className="flex items-center w-full py-2 px-2 rounded-md hover:bg-orange-50 transition-colors duration-150"
                          >
                            <div className="p-1.5 bg-orange-100 rounded-md mr-2">
                              <Users className="h-4 w-4 text-orange-600" />
                            </div>
                            <span className="font-medium text-orange-700">
                              Admin Panel
                            </span>
                          </Link>
                        </DropdownMenuItem>
                      </>
                    )}

                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={logout}
                      className="p-0 focus:bg-transparent"
                    >
                      <div className="flex items-center w-full py-2 px-2 rounded-md hover:bg-red-50 transition-colors duration-150 cursor-pointer">
                        <div className="p-1.5 bg-red-100 rounded-md mr-2">
                          <LogOut className="h-4 w-4 text-red-600" />
                        </div>
                        <span className="font-medium text-red-600">
                          Sign Out
                        </span>
                      </div>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={handleSignIn}
                  className="text-gray-800 border-gray-200 hover:bg-gray-50 hover:border-gray-300 font-medium transition-all duration-200 shadow-sm"
                >
                  <User className="mr-2 h-4 w-4 text-blue-600" />
                  Sign In
                </Button>
                <Button
                  onClick={handleSignUp}
                  className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
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
