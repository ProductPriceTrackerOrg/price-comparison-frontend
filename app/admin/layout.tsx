"use client";

import { ReactNode, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Database,
  Users,
  AlertTriangle,
  BarChart3,
  Settings,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/contexts/auth-context";
import { redirect } from "next/navigation";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ProtectedRoute } from "@/components/auth/protected-route";

interface AdminLayoutProps {
  children: ReactNode;
}

interface SidebarLinkProps {
  href: string;
  icon: ReactNode;
  label: string;
  isActive: boolean;
}

const SidebarLink = ({ href, icon, label, isActive }: SidebarLinkProps) => {
  return (
    <Link href={href} className="w-full">
      <div
        className={cn(
          "flex items-center px-4 py-3 rounded-md transition-colors",
          isActive ? "bg-primary text-primary-foreground" : "hover:bg-muted"
        )}
      >
        <div className="mr-3">{icon}</div>
        <span className="font-medium">{label}</span>
      </div>
    </Link>
  );
};

export default function AdminLayout({ children }: AdminLayoutProps) {
  const { isLoggedIn, isAdmin, user } = useAuth();
  const [isMobileNavOpen, setIsMobileNavOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    console.log("Admin layout auth state:", {
      isLoggedIn,
      isAdmin,
      userId: user?.id,
    });
  }, [isLoggedIn, isAdmin, user]);

  const sidebarLinks = [
    {
      href: "/admin/dashboard",
      icon: <LayoutDashboard size={20} />,
      label: "Dashboard",
    },
    {
      href: "/admin/pipeline",
      icon: <Database size={20} />,
      label: "Pipeline Monitoring",
    },
    {
      href: "/admin/users",
      icon: <Users size={20} />,
      label: "User Management",
    },
    {
      href: "/admin/anomalies",
      icon: <AlertTriangle size={20} />,
      label: "Anomaly Review",
    },
    {
      href: "/admin/analytics",
      icon: <BarChart3 size={20} />,
      label: "Website Analytics",
    },
  ];

  const renderSidebarContent = () => (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b">
        <h1 className="text-xl font-bold">Admin Panel</h1>
      </div>

      <div className="flex-grow p-2 space-y-1">
        {sidebarLinks.map((link) => (
          <SidebarLink
            key={link.href}
            href={link.href}
            icon={link.icon}
            label={link.label}
            isActive={pathname === link.href}
          />
        ))}
      </div>

      <div className="p-4 border-t mt-auto">
        <Link
          href="/settings"
          className="flex items-center p-2 text-sm text-muted-foreground hover:text-foreground"
        >
          <Settings size={18} className="mr-2" />
          <span>Settings</span>
        </Link>
        <Button
          variant="ghost"
          className="flex w-full items-center justify-start p-2 text-sm text-muted-foreground hover:text-foreground"
          onClick={() => {
            // Handle logout logic here
            console.log("Logout clicked");
          }}
        >
          <LogOut size={18} className="mr-2" />
          <span>Logout</span>
        </Button>
      </div>
    </div>
  );

  return (
    <ProtectedRoute requireAdmin={false}>
      <div className="flex min-h-screen bg-background">
        {/* Desktop Sidebar */}
        <aside className="hidden md:block w-64 border-r bg-card">
          {renderSidebarContent()}
        </aside>

        {/* Mobile Sidebar */}
        <Sheet open={isMobileNavOpen} onOpenChange={setIsMobileNavOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40"
            >
              <Menu size={24} />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            {renderSidebarContent()}
          </SheetContent>
        </Sheet>

        {/* Main Content */}
        <main className="flex-1 overflow-auto">
          <div className="container mx-auto p-6">{children}</div>
        </main>
      </div>
    </ProtectedRoute>
  );
}
