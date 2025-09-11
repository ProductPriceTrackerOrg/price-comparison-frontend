import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Home } from "lucide-react";
import Link from "next/link";

export default function FavoritesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <section>
      {" "}
      <div className="container max-w-5xl p-6 mx-1 md:mx-2 lg:mx-4 xl:mx-6">
        <Breadcrumb className="mb-6">
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink asChild>
                <Link
                  href="/"
                  className="flex items-center gap-1 text-gray-600 hover:text-blue-600 transition-colors"
                >
                  <Home className="h-4 w-4" />
                  Home
                </Link>
              </BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage className="text-blue-600 font-medium">
                Tracked Products
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      {children}
    </section>
  );
}
