import React from "react";
import { LucideIcon } from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";

interface PageHeaderProps {
  title: string;
  icon: LucideIcon;
  breadcrumbItems?: { label: string; href?: string }[];
}

export function PageHeader({
  title,
  icon: Icon,
  breadcrumbItems = [],
}: PageHeaderProps) {
  return (
    <>
      {/* Breadcrumb */}
      <div className="mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/" className="flex items-center gap-1">
                <Home className="h-4 w-4" />
                Home
              </BreadcrumbLink>
            </BreadcrumbItem>

            {breadcrumbItems.map((item, index) => (
              <React.Fragment key={index}>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  {item.href ? (
                    <BreadcrumbLink href={item.href}>
                      {item.label}
                    </BreadcrumbLink>
                  ) : (
                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                  )}
                </BreadcrumbItem>
              </React.Fragment>
            ))}
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Beautiful Header with blue background */}
      <div className="mb-10 overflow-hidden relative">
        {/* Background with gradient and glass effect */}
        <div
          className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-700 rounded-2xl shadow-xl 
            border border-white/10 backdrop-filter overflow-hidden"
        >
          {/* Decorative patterns */}
          <div className="absolute inset-0 overflow-hidden">
            {/* Animated light streaks */}
            <div
              className="absolute top-0 left-0 w-full h-1/2 bg-gradient-to-r from-transparent via-white/10 to-transparent 
                transform -skew-y-12 -translate-x-full animate-shimmer"
            ></div>

            {/* Dots pattern */}
            <div className="absolute inset-0 opacity-15">
              <svg width="100%" height="100%" className="opacity-20">
                <defs>
                  <pattern
                    id="dotPattern"
                    x="0"
                    y="0"
                    width="20"
                    height="20"
                    patternUnits="userSpaceOnUse"
                  >
                    <circle cx="2" cy="2" r="1" fill="white" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#dotPattern)" />
              </svg>
            </div>

            {/* Circular decorations */}
            <div className="absolute -top-16 -right-16 w-40 h-40 rounded-full bg-gradient-to-br from-blue-400/30 to-indigo-500/30 blur-md"></div>
            <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-gradient-to-tr from-indigo-400/20 to-purple-500/20 blur-md"></div>
          </div>

          {/* Content section with enhanced styling */}
          <div className="relative z-10 py-6 px-8 flex items-center justify-center">
            <div className="flex items-center space-x-4">
              {/* Icon with glow effect */}
              <div className="relative">
                <div className="absolute -inset-1 bg-white/30 rounded-full blur-sm"></div>
                <div
                  className="relative bg-gradient-to-br from-blue-400 to-indigo-600 p-3 rounded-full 
                    shadow-[0_0_15px_rgba(59,130,246,0.5)] animate-pulse border border-white/30"
                >
                  <Icon className="h-8 w-8 text-white drop-shadow-md" />
                </div>
              </div>

              {/* Text with enhanced styling */}
              <div>
                <h1
                  className="text-3xl md:text-4xl font-extrabold text-white tracking-tight drop-shadow-md 
                    bg-gradient-to-r from-white to-blue-100 bg-clip-text"
                >
                  <span className="relative inline-block">
                    {title}
                    <span className="absolute bottom-0 left-0 w-full h-1 bg-white/40 rounded"></span>
                  </span>
                </h1>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
