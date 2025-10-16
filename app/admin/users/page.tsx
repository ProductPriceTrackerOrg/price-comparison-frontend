"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { redirect } from "next/navigation";
import { Users, Search, ChevronLeft, ChevronRight } from "lucide-react";

// Import UI components - now including Table and Switch
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";

// Define the shape of a single user object from our API
interface User {
  user_id: string;
  email: string;
  full_name: string;
  is_active: boolean;
  role?: string;
}

export default function UserManagementPage() {
  const { isLoggedIn, isAdmin } = useAuth();
  
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // State for server-side search, filter, and pagination
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const perPage = 20;

  useEffect(() => {
    if (!isLoggedIn || !isAdmin) {
      redirect("/");
    }
  }, [isLoggedIn, isAdmin]);

  // Fetches users from the backend whenever pagination, search, or filter changes.
  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError(null);
      try {
        const params = new URLSearchParams({
          page: String(currentPage),
          per_page: String(perPage),
        });
        if (searchQuery) {
          params.append('search', searchQuery);
        }
        if (statusFilter !== 'all') {
          params.append('status', statusFilter);
        }

        const apiUrl = `${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users?${params.toString()}`;

        const response = await fetch(apiUrl, {
          // headers: { 'Authorization': `Bearer ${your_jwt_token}` }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch user data');
        }

        const data = await response.json();
        
        setUsers(data.users);
        setTotalUsers(data.total);
        setTotalPages(Math.ceil(data.total / perPage));

      } catch (err: any) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [currentPage, searchQuery, statusFilter]);

  // Handles the API call to toggle a user's active status.
  const handleToggleUserStatus = async (userId: string, currentStatus: boolean) => {
    const newStatus = !currentStatus;
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/v1/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          // 'Authorization': `Bearer ${your_jwt_token}`
        },
        body: JSON.stringify({ is_active: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update user status');
      }

      // Optimistically update the UI for a smoother experience
      setUsers(prevUsers => 
        prevUsers.map(user => 
          user.user_id === userId ? { ...user, is_active: newStatus } : user
        )
      );

    } catch (error: any) {
      console.error('Error toggling user status:', error);
    }
  };

  if (!isLoggedIn || !isAdmin) {
    return null;
  }

  // --- THIS IS THE UPDATED PART ---
  // The JSX below has been modified to render a Table instead of cards,
  // matching your desired UI.
  return (
    <div className="space-y-6 p-4 md:p-8">
      <div className="flex items-center space-x-3">
        <Users className="h-8 w-8 text-gray-800" />
        <h1 className="text-3xl font-bold text-gray-900">User Management</h1>
      </div>
      <p className="text-gray-600">View, search, and manage user accounts and their status.</p>

      <Card className="shadow-sm">
        <CardHeader>
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <CardTitle>All Users ({totalUsers})</CardTitle>
            <div className="flex items-center space-x-2 w-full md:w-auto">
              <div className="relative flex-grow">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by name or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-full bg-white"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Status: All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center p-8 text-gray-500">Loading users...</div>
          ) : error ? (
            <div className="text-center text-red-500 p-8">Error: {error}</div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[100px]">User ID</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user, index) => (
                  <TableRow key={user.user_id}>
                    <TableCell className="font-medium">{(currentPage - 1) * perPage + index + 1}</TableCell>
                    <TableCell>{user.full_name || 'N/A'}</TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.is_active ? "default" : "secondary"}>
                        {user.is_active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Switch
                        checked={user.is_active}
                        onCheckedChange={() => handleToggleUserStatus(user.user_id, user.is_active)}
                        aria-label="Toggle user status"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        {/* Pagination Controls */}
        <div className="flex items-center justify-end space-x-2 p-4 border-t">
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1 || loading}>
            <ChevronLeft className="h-4 w-4 mr-1" />
            Previous
          </Button>
          <span className="text-sm text-gray-600">Page {currentPage} of {totalPages}</span>
          <Button variant="outline" size="sm" onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages || loading}>
            Next
            <ChevronRight className="h-4 w-4 ml-1" />
          </Button>
        </div>
      </Card>
    </div>
  );
}

