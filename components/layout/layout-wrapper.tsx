"use client";

import { ReactNode, useEffect, useState } from "react";
import { usePathname } from "next/navigation";

interface LayoutWrapperProps {
  children: ReactNode;
  header: ReactNode;
  footer: ReactNode;
}

export function LayoutWrapper({
  children,
  header,
  footer,
}: LayoutWrapperProps) {
  const pathname = usePathname();
  const [isAdminRoute, setIsAdminRoute] = useState(false);

  useEffect(() => {
    setIsAdminRoute(pathname?.startsWith("/admin") || false);
  }, [pathname]);

  return (
    <>
      {!isAdminRoute && header}
      <main className={`min-h-screen ${!isAdminRoute ? "pt-16" : ""}`}>
        {children}
      </main>
      {!isAdminRoute && footer}
    </>
  );
}
