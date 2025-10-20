"use client";

import { ReactNode, useEffect, useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation"; // 1. Import useRouter
import {
  LayoutDashboard,
  Database,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { useAuth } from "@/contexts/auth-context";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { ConfirmationModal } from "@/components/ui/ConfirmationModal";

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
  isCollapsed: boolean;
}

const SidebarLink = ({ href, icon, label, isActive, isCollapsed }: SidebarLinkProps) => {
  return (
    <Link href={href} className="w-full" title={isCollapsed ? label : undefined}>
      <div
        className={cn(
          "flex items-center px-4 py-3 rounded-md transition-colors text-gray-300",
          isActive
            ? "bg-gray-700 text-white"
            : "hover:bg-gray-700 hover:text-white"
        )}
      >
        <div className={cn("transition-all", isCollapsed ? "" : "mr-3")}>{icon}</div>
        <span className={cn(
          "font-medium transition-all duration-200 whitespace-nowrap",
          isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
        )}>
          {label}
        </span>
      </div>
    </Link>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  // 2. Get the 'logout' function from useAuth
  const { isLoggedIn, isAdmin, logout } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const pathname = usePathname();
  const router = useRouter(); // Get router for redirection

  // Open the confirmation modal
  const openLogoutModal = () => {
    setIsLogoutModalOpen(true);
  };

  // 3. Optimized handler function to reduce perceived logout delay
  const handleLogout = async () => {
    setIsLoggingOut(true);
    
    // Immediately close the modal to give sense of action completion
    setIsLogoutModalOpen(false);
    
    // Redirect to login page immediately - don't wait for the logout API call
    router.push('/admin/login');
    
    // Process the actual logout in the background
    try {
      await logout();
    } catch (e) {
      console.error("Error during logout:", e);
      // Even if there's an error, we've already redirected the user
      // No need to reopen the modal or reset states
    }
  };

  useEffect(() => {
    // Your existing auth checks
  }, [isLoggedIn, isAdmin]);

  const sidebarLinks = [
    { href: "/admin/dashboard", icon: <LayoutDashboard size={20} />, label: "Dashboard" },
    { href: "/admin/pipeline", icon: <Database size={20} />, label: "Pipeline Monitoring" },
    { href: "/admin/users", icon: <Users size={20} />, label: "User Management" },
    { href: "/admin/anomalies", icon: <AlertTriangle size={20} />, label: "Anomaly Review" },
    { href: "/admin/analytics", icon: <BarChart3 size={20} />, label: "Website Analytics" },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full bg-[#202630] text-white overflow-hidden">
      <div className="p-4 border-b border-gray-700">
        <div className={cn("flex items-center gap-3 transition-all duration-300")}>
          <div className="relative bg-gradient-to-br from-blue-500 to-indigo-600 rounded-lg p-1.5 shadow-lg flex-shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 text-white">
              <path d="M3 3v16a2 2 0 0 0 2 2h16"></path><path d="M18 17V9"></path><path d="M13 17V5"></path><path d="M8 17v-3"></path>
            </svg>
          </div>
          <h1 className={cn(
            "text-xl font-bold text-white transition-all duration-200 whitespace-nowrap",
            isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto"
          )}>
            Price Pulse
          </h1>
        </div>
      </div>

      <div className="flex-grow p-2 space-y-1">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
            isCollapsed={isCollapsed}
          />
        ))}
      </div>

      <div className="p-4 border-t border-gray-700 mt-auto">
        <Link href="/settings" className={cn("flex items-center p-2 text-sm text-gray-400 hover:text-white")} title={isCollapsed ? "Settings" : undefined}>
          <Settings size={18} className={cn("transition-all", isCollapsed ? "" : "mr-2")} />
          <span className={cn("transition-all duration-200 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto")}>Settings</span>
        </Link>
        <button
          className={cn("flex w-full items-center p-2 text-sm text-gray-400 hover:text-white text-left")}
          // Connect to the openLogoutModal function instead of direct logout
          onClick={openLogoutModal}
          title={isCollapsed ? "Logout" : undefined}
        >
          <LogOut size={18} className={cn("transition-all", isCollapsed ? "" : "mr-2")} />
          <span className={cn("transition-all duration-200 whitespace-nowrap", isCollapsed ? "opacity-0 w-0 overflow-hidden" : "opacity-100 w-auto")}>Logout</span>
        </button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="flex h-screen overflow-hidden bg-gray-100 dark:bg-gray-800">
        <aside className={cn(
          "hidden md:block border-r relative transition-all duration-300 ease-in-out",
          isCollapsed ? "w-20" : "w-64"
        )}>
          {renderSidebarContent()}
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsCollapsed(!isCollapsed)}
            className="absolute -right-4 top-1/2 -translate-y-1/2 h-8 w-8 rounded-full bg-white border-2 hover:bg-gray-100"
          >
            {isCollapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          </Button>
        </aside>

        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40 bg-white/50 backdrop-blur-sm"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0 border-r-0">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        <main className="flex-1 overflow-y-auto">
          <div className="p-4 sm:p-6 md:p-8">{children}</div>
        </main>
        
        {/* Logout confirmation modal */}
        <ConfirmationModal
          isOpen={isLogoutModalOpen}
          onClose={() => setIsLogoutModalOpen(false)}
          onConfirm={handleLogout}
          title="Confirm Logout"
          message="Are you sure you want to log out? Any unsaved changes will be lost."
          isLoading={isLoggingOut}
        />
      </div>
    </ProtectedRoute>
  );
}

