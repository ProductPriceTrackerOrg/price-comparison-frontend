"use client";

import { useState, useEffect } from "react";
import { Search, UserCheck, UserX, ChevronDown } from "lucide-react";
import { ProtectedRoute } from "@/components/auth/protected-route";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";

// Define types
interface User {
  id: number;
  email: string;
  fullName: string;
  status: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string | null>(null);

  useEffect(() => {
    // Simulate API call
    const fetchUsers = async () => {
      try {
        // In a real implementation, this would be an API call
        // const response = await fetch("/api/admin/users")
        // const data = await response.json()

        // For now, use mock data
        const mockData: User[] = [
          {
            id: 1,
            email: "user1@example.com",
            fullName: "John Doe",
            status: "Active",
          },
          {
            id: 2,
            email: "user2@example.com",
            fullName: "Jane Smith",
            status: "Inactive",
          },
          {
            id: 3,
            email: "admin@example.com",
            fullName: "Admin User",
            status: "Active",
          },
          {
            id: 4,
            email: "support@example.com",
            fullName: "Support Team",
            status: "Active",
          },
          {
            id: 5,
            email: "developer@example.com",
            fullName: "Dev Team",
            status: "Active",
          },
          {
            id: 6,
            email: "sales@example.com",
            fullName: "Sales Department",
            status: "Inactive",
          },
          {
            id: 7,
            email: "marketing@example.com",
            fullName: "Marketing Team",
            status: "Active",
          },
          {
            id: 8,
            email: "finance@example.com",
            fullName: "Finance Department",
            status: "Active",
          },
          {
            id: 9,
            email: "hr@example.com",
            fullName: "Human Resources",
            status: "Inactive",
          },
          {
            id: 10,
            email: "customer@example.com",
            fullName: "Customer Service",
            status: "Active",
          },
        ];

        setUsers(mockData);
        setFilteredUsers(mockData);
      } catch (error) {
        console.error("Failed to fetch users:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // Filter users based on search query and status filter
  useEffect(() => {
    let result = [...users];

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      result = result.filter(
        (user) =>
          user.email.toLowerCase().includes(query) ||
          user.fullName.toLowerCase().includes(query)
      );
    }

    // Apply status filter
    if (statusFilter) {
      result = result.filter((user) => user.status === statusFilter);
    }

    setFilteredUsers(result);
  }, [searchQuery, statusFilter, users]);

  // Toggle user status
  const toggleUserStatus = (userId: number) => {
    setUsers(
      users.map((user) => {
        if (user.id === userId) {
          const newStatus = user.status === "Active" ? "Inactive" : "Active";
          return { ...user, status: newStatus };
        }
        return user;
      })
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        Loading users...
      </div>
    );
  }

  return (
    <ProtectedRoute requireAdmin={true}>
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">User Management</h1>

        {/* Search and Filter Controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="relative flex-1">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search by name or email..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full md:w-auto">
                Status: {statusFilter || "All"}
                <ChevronDown className="ml-2 h-4 w-4 text-muted-foreground" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => setStatusFilter(null)}>
                All
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Active")}>
                Active
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setStatusFilter("Inactive")}>
                Inactive
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Users Table */}
        <Card>
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User ID</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Full Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.length === 0 ? (
                  <TableRow>
                    <TableCell
                      colSpan={5}
                      className="text-center text-muted-foreground py-8"
                    >
                      No users found matching the search criteria
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.id}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.fullName}</TableCell>
                      <TableCell>
                        <Badge
                          variant={
                            user.status === "Active" ? "default" : "secondary"
                          }
                        >
                          {user.status === "Active" ? (
                            <UserCheck className="mr-1 h-3 w-3" />
                          ) : (
                            <UserX className="mr-1 h-3 w-3" />
                          )}
                          {user.status}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Switch
                            checked={user.status === "Active"}
                            onCheckedChange={() => toggleUserStatus(user.id)}
                            aria-label={`Toggle ${user.fullName}'s status`}
                          />
                          <span className="ml-2 text-xs text-muted-foreground">
                            {user.status === "Active" ? "Active" : "Inactive"}
                          </span>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </ProtectedRoute>
  );
}
