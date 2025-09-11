"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/auth-context";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { User, Calendar, Shield, Save, RefreshCw } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { format } from "date-fns";

// Define the profile schema for form validation
const profileSchema = z.object({
  fullName: z.string().min(2, {
    message: "Full name must be at least 2 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
});

export default function ProfilePage() {
  const { user, isLoggedIn, isAdmin } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [profileData, setProfileData] = useState<any>(null);
  const { toast } = useToast();

  // Initialize form with default values
  const form = useForm<z.infer<typeof profileSchema>>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      fullName: "",
      email: "",
    },
  });

  // Fetch profile data from Supabase
  useEffect(() => {
    if (!isLoggedIn || !user) return;

    const fetchProfileData = async () => {
      setIsLoading(true);
      try {
        // Get profile data from the profiles table using user_id
        const { data, error } = await supabase
          .from("profiles")
          .select("*")
          .eq("user_id", user.id)
          .single();

        if (error) {
          throw error;
        }

        setProfileData(data);

        // Update form with the fetched data
        form.reset({
          fullName: data.full_name || user.user_metadata?.full_name || "",
          email: data.email || user.email || "",
        });

        console.log("Profile data loaded:", data);
      } catch (error: any) {
        console.error("Error fetching profile:", error);
        toast({
          title: "Error",
          description: "Failed to load profile data. Please try again later.",
          variant: "destructive",
        });

        // If we can't load from profiles table, fallback to auth user metadata
        if (user) {
          form.reset({
            fullName: user.user_metadata?.full_name || "",
            email: user.email || "",
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfileData();
  }, [isLoggedIn, user, toast, form]);

  // Handle form submission
  const onSubmit = async (values: z.infer<typeof profileSchema>) => {
    if (!user) return;

    setIsLoading(true);
    try {
      // Check if email is being changed
      const emailChanged = values.email !== user.email;

      // First update the profile in the profiles table
      const { error } = await supabase
        .from("profiles")
        .update({
          full_name: values.fullName,
          email: values.email,
        })
        .eq("user_id", user.id);

      if (error) {
        throw error;
      }

      // If email is being changed, we also need to update the auth user
      // Note: Email changes in Auth require email verification
      if (emailChanged) {
        const { error: updateUserError } = await supabase.auth.updateUser({
          email: values.email,
        });

        if (updateUserError) {
          // Show a warning but don't fail the profile update
          console.warn("Email update needs verification:", updateUserError);
          toast({
            title: "Email Change Pending",
            description: "Check your new email to confirm the change.",
          });
        }
      }

      // Update user metadata with the new full name
      const { error: metadataError } = await supabase.auth.updateUser({
        data: { full_name: values.fullName },
      });

      if (metadataError) {
        console.warn("Failed to update user metadata:", metadataError);
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully",
      });

      // Refresh profile data in the state
      setProfileData({
        ...profileData,
        full_name: values.fullName,
        email: values.email,
      });
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast({
        title: "Error",
        description: error.message || "Failed to update profile",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // If user is not logged in, show a message
  if (!isLoggedIn) {
    return (
      <div className="container max-w-5xl py-10">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <p>Please sign in to view your profile.</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-5xl py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">My Profile</h1>
        {isAdmin && (
          <div className="flex items-center space-x-1 bg-orange-100 rounded-full px-3 py-1">
            <Shield className="h-4 w-4 text-orange-600" />
            <span className="text-sm text-orange-700 font-bold">
              Administrator
            </span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card className="md:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-100">
          <CardContent className="p-6 flex flex-col items-center text-center">
            <div className="w-24 h-24 relative mb-4">
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 to-indigo-500 animate-pulse opacity-50"></div>
              <div className="absolute inset-0.5 rounded-full bg-white flex items-center justify-center">
                {user?.user_metadata?.avatar_url ? (
                  <img
                    src={user.user_metadata.avatar_url}
                    alt="Profile"
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-3xl font-bold">
                    {profileData?.full_name?.charAt(0) ||
                      user?.user_metadata?.full_name?.charAt(0) ||
                      user?.email?.charAt(0) ||
                      "U"}
                  </div>
                )}
              </div>
            </div>
            <h3 className="font-bold text-lg text-blue-900">
              {profileData?.full_name ||
                user?.user_metadata?.full_name ||
                "User"}
            </h3>
            <p className="text-sm text-blue-700 mb-3">{user?.email}</p>

            {isAdmin && (
              <div className="inline-flex items-center space-x-1 bg-orange-100 rounded-full px-3 py-1 my-2">
                <Shield className="h-3 w-3 text-orange-600" />
                <span className="text-xs text-orange-700 font-bold">
                  Administrator
                </span>
              </div>
            )}

            <div className="w-full mt-4 pt-4 border-t border-blue-100">
              <div className="flex justify-between text-sm mb-2">
                <span className="text-blue-700">Status:</span>
                <span className="font-medium text-blue-900">
                  {profileData?.is_active ? "Active" : "Inactive"}
                </span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-blue-700">Member since:</span>
                <span className="font-medium text-blue-900">
                  {profileData?.created_at
                    ? format(new Date(profileData.created_at), "MMM d, yyyy")
                    : "—"}
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="md:col-span-3">
          <Tabs defaultValue="personal" className="space-y-6">
            <TabsList>
              <TabsTrigger value="personal">Personal Information</TabsTrigger>
              <TabsTrigger value="account">Account Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="personal">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2 text-blue-600" />
                    Personal Information
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="flex items-center justify-center h-48">
                      <RefreshCw className="h-6 w-6 animate-spin text-blue-600" />
                    </div>
                  ) : (
                    <Form {...form}>
                      <form
                        onSubmit={form.handleSubmit(onSubmit)}
                        className="space-y-6"
                      >
                        <FormField
                          control={form.control}
                          name="fullName"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Full Name</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your full name"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                This is the name that will be displayed on your
                                profile.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <FormField
                          control={form.control}
                          name="email"
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Email</FormLabel>
                              <FormControl>
                                <Input
                                  placeholder="Enter your email"
                                  {...field}
                                />
                              </FormControl>
                              <FormDescription>
                                Your email address for notifications and account
                                recovery.
                              </FormDescription>
                              <FormMessage />
                            </FormItem>
                          )}
                        />

                        <Separator />

                        <div className="flex justify-between items-center">
                          <div className="flex items-center text-sm text-muted-foreground">
                            <Calendar className="h-4 w-4 mr-2" />
                            Account created:{" "}
                            {profileData?.created_at
                              ? format(new Date(profileData.created_at), "PPP")
                              : "Loading..."}
                          </div>
                          <Button
                            type="submit"
                            disabled={isLoading}
                            className="space-x-2"
                          >
                            <Save className="h-4 w-4" />
                            <span>Save Changes</span>
                          </Button>
                        </div>
                      </form>
                    </Form>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Shield className="h-5 w-5 mr-2 text-blue-600" />
                    Account Settings
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex justify-between items-start border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">Email Notifications</h3>
                        <p className="text-sm text-muted-foreground">
                          Configure your notification preferences
                        </p>
                      </div>
                      <Button variant="outline">Manage Notifications</Button>
                    </div>

                    <div className="flex justify-between items-start border p-4 rounded-md">
                      <div>
                        <h3 className="font-medium">Password</h3>
                        <p className="text-sm text-muted-foreground">
                          Change your password
                        </p>
                      </div>
                      <Button variant="outline">Reset Password</Button>
                    </div>

                    <div className="flex justify-between items-start border p-4 rounded-md bg-red-50 border-red-200">
                      <div>
                        <h3 className="font-medium text-red-700">
                          Delete Account
                        </h3>
                        <p className="text-sm text-red-600">
                          Permanently delete your account and all your data
                        </p>
                      </div>
                      <Button variant="destructive">Delete Account</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
