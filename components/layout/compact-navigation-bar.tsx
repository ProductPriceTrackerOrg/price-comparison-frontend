import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Percent, Home, ChevronRight } from "lucide-react";

export function CompactNavigationBar() {
  return (
    <div className="bg-white shadow-sm border-b border-gray-200">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-10">
          {/* Left side - breadcrumb-style navigation */}
          <div className="flex items-center space-x-1 text-sm">
            <Link href="/" className="flex items-center text-gray-600 hover:text-blue-600 transition-colors">
              <Home className="h-3.5 w-3.5 mr-1" />
              <span>Home</span>
            </Link>
            <ChevronRight className="h-3 w-3 text-gray-400" />
            <Link href="/deals" className="flex items-center font-medium text-blue-600">
              <Percent className="h-3.5 w-3.5 mr-1" />
              <span>Top Deals</span>
            </Link>
          </div>
          
          {/* Right side - action button */}
          <Button variant="ghost" size="sm" className="text-xs bg-blue-50 text-blue-600 hover:bg-blue-100">
            View All Categories
          </Button>
        </div>
      </div>
    </div>
  );
}
