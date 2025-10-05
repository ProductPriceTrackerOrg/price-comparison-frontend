"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Store,
  Star,
  Package,
  Shield,
  ArrowRight,
  Search,
  Globe,
  Phone,
  Mail,
  MapPin,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { CustomPagination } from "@/components/ui/custom-pagination";

// Define interfaces for API responses
interface ApiRetailer {
  id: number;
  name: string;
  logo?: string;
  website?: string;
  rating?: number;
  product_count?: number;
  description?: string;
  verified?: boolean;
  founded_year?: number;
  headquarters?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
}

interface Retailer {
  id: number;
  name: string;
  logo: string;
  rating: number;
  productCount: number;
  verified: boolean;
  description: string;
  website?: string;
  foundedYear?: number;
  headquarters?: string;
  contact?: {
    phone?: string;
    email?: string;
  };
}

export default function RetailersPage() {
  const [retailers, setRetailers] = useState<Retailer[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const limit = 6; // Retailers per page

  useEffect(() => {
    fetchRetailers();
  }, [currentPage, searchQuery]);

  const fetchRetailers = async () => {
    setLoading(true);
    setError(null);

    try {
      // Construct the query parameters
      const queryParams = new URLSearchParams({
        page: currentPage.toString(),
        limit: limit.toString(),
      });

      if (searchQuery) {
        queryParams.append("search", searchQuery);
      }

      // Fetch the retailers data from our API route
      const response = await fetch(`/api/v1/retailers?${queryParams}`);

      if (!response.ok) {
        throw new Error("Failed to fetch retailers");
      }

      const data = await response.json();

      // Map API response to our Retailer interface
      const mappedRetailers: Retailer[] = (data.retailers || []).map(
        (retailer: ApiRetailer) => ({
          id: retailer.id,
          name: retailer.name,
          logo: retailer.logo || "/placeholder.svg?height=60&width=120",
          rating: retailer.rating || 4.5,
          productCount: retailer.product_count || 0,
          verified: retailer.verified || false,
          description: retailer.description || "Quality products retailer",
          website: retailer.website,
          foundedYear: retailer.founded_year,
          headquarters: retailer.headquarters,
          contact: retailer.contact,
        })
      );

      setRetailers(mappedRetailers);
      setTotalPages(data.pagination?.total_pages || 1);
      setTotalCount(data.pagination?.total_items || 0);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching retailers:", error);
      setError("Failed to load retailers. Please try again.");
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1); // Reset to first page when searching
    fetchRetailers();
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="bg-gradient-to-b from-blue-900 to-indigo-900 text-white py-12">
        <div className="container mx-auto px-4">
          {/* Breadcrumb */}
          <div className="flex items-center text-sm text-blue-100 mb-6">
            <Link href="/" className="hover:text-white transition-colors">
              Home
            </Link>
            <span className="mx-2">&gt;</span>
            <span>Retailers</span>
          </div>

          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Our Trusted Partners
            </h1>
            <p className="text-lg text-blue-100 mb-8">
              Explore our network of verified retailers offering competitive
              prices on electronics and tech products
            </p>

            {/* Search Form */}
            <div className="max-w-xl mx-auto">
              <form
                onSubmit={handleSearch}
                className="flex rounded-lg overflow-hidden shadow-lg"
              >
                <Input
                  type="text"
                  placeholder="Search retailers..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="flex-grow h-14 px-6 bg-white/95 border-0 text-gray-900 text-lg focus-visible:ring-blue-500"
                />
                <Button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 h-14 px-6 rounded-none"
                >
                  <Search className="h-5 w-5" />
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
            <CardContent className="p-6 flex items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-blue-100 text-blue-700 mr-4">
                <Store className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Retailers</p>
                <p className="text-2xl font-bold">{totalCount}</p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-100">
            <CardContent className="p-6 flex items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-emerald-100 text-emerald-700 mr-4">
                <Shield className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Verified Partners</p>
                <p className="text-2xl font-bold">
                  {retailers.filter((r) => r.verified).length} of{" "}
                  {retailers.length}
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-100">
            <CardContent className="p-6 flex items-center">
              <div className="w-14 h-14 rounded-full flex items-center justify-center bg-amber-100 text-amber-700 mr-4">
                <Package className="h-7 w-7" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">
                  {retailers
                    .reduce((sum, retailer) => sum + retailer.productCount, 0)
                    .toLocaleString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search results summary */}
        <div className="flex justify-between items-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            {searchQuery
              ? `Search Results for "${searchQuery}"`
              : "All Retailers"}
          </h2>
          <p className="text-gray-600">
            Showing {retailers.length} of {totalCount} retailers
          </p>
        </div>

        {/* Retailers Grid */}
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Spinner size="lg" className="text-blue-600" />
          </div>
        ) : error ? (
          <div className="text-center py-16">
            <p className="text-red-500 mb-4">{error}</p>
            <Button variant="outline" onClick={() => fetchRetailers()}>
              Try Again
            </Button>
          </div>
        ) : retailers.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">
              No retailers found matching your search criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSearchQuery("");
                setCurrentPage(1);
              }}
            >
              Clear Search
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {retailers.map((retailer, index) => (
              <Card
                key={index}
                className="group hover:shadow-xl transition-all duration-300 border-slate-200/70 hover:border-blue-200 rounded-2xl overflow-hidden"
              >
                <CardContent className="p-0">
                  {/* Header */}
                  <div className="bg-gradient-to-r from-blue-500/10 to-indigo-500/10 p-6 border-b border-slate-200/70">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center shadow border border-slate-200">
                          <Store className="h-8 w-8 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-bold text-xl text-gray-900">
                            {retailer.name}
                          </h3>
                          <div className="flex items-center">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  className={`h-4 w-4 ${
                                    i < Math.floor(retailer.rating)
                                      ? "fill-yellow-400 text-yellow-400"
                                      : "fill-gray-200 text-gray-200"
                                  }`}
                                />
                              ))}
                            </div>
                            <span className="ml-2 text-sm text-gray-600">
                              {retailer.rating} / 5.0
                            </span>
                          </div>
                        </div>
                      </div>
                      {retailer.verified && (
                        <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1.5 h-auto">
                          <Shield className="h-3.5 w-3.5 mr-1.5" />
                          Verified
                        </Badge>
                      )}
                    </div>

                    <p className="text-gray-700">{retailer.description}</p>
                  </div>

                  {/* Details */}
                  <div className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                      {retailer.website && (
                        <div className="flex items-center text-gray-700">
                          <Globe className="h-4 w-4 mr-2 text-blue-600" />
                          <a
                            href={retailer.website}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline"
                          >
                            {retailer.website.replace(/^https?:\/\//, "")}
                          </a>
                        </div>
                      )}

                      {retailer.foundedYear && (
                        <div className="flex items-center text-gray-700">
                          <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                          <span>Founded in {retailer.foundedYear}</span>
                        </div>
                      )}

                      {retailer.contact?.phone && (
                        <div className="flex items-center text-gray-700">
                          <Phone className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{retailer.contact.phone}</span>
                        </div>
                      )}

                      {retailer.contact?.email && (
                        <div className="flex items-center text-gray-700">
                          <Mail className="h-4 w-4 mr-2 text-blue-600" />
                          <a
                            href={`mailto:${retailer.contact.email}`}
                            className="text-blue-600 hover:underline"
                          >
                            {retailer.contact.email}
                          </a>
                        </div>
                      )}

                      {retailer.headquarters && (
                        <div className="flex items-center text-gray-700">
                          <MapPin className="h-4 w-4 mr-2 text-blue-600" />
                          <span>{retailer.headquarters}</span>
                        </div>
                      )}

                      <div className="flex items-center text-gray-700">
                        <Package className="h-4 w-4 mr-2 text-blue-600" />
                        <span>
                          {retailer.productCount.toLocaleString()} Products
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        asChild
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700"
                      >
                        <Link href={`/retailers/${retailer.id}/products`}>
                          Browse Products
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </Link>
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="mt-12 flex justify-center">
            <CustomPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
}
