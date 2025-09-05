"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { Session, User } from "@supabase/supabase-js";

// Define the shape of our context for type safety
interface AuthContextType {
  user: User | null;
  session: Session | null;
  isLoggedIn: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, fullName: string) => Promise<any>;
  logout: () => Promise<{ error: any | null }>;
  refreshSession: () => Promise<void>;
  // We remove updateUser as Supabase handles this differently
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [sessionExpiry, setSessionExpiry] = useState<Date | null>(null);

  // Function to refresh the session manually if needed
  const refreshSession = async () => {
    try {
      const { data, error } = await supabase.auth.refreshSession();
      if (error) throw error;

      if (data?.session) {
        setSession(data.session);
        setUser(data.session.user);

        // Store the new session expiry time
        if (data.session.expires_at) {
          const expiryDate = new Date(data.session.expires_at * 1000);
          setSessionExpiry(expiryDate);

          // Update last activity time to prevent immediate timeout
          localStorage.setItem("lastActivityTime", Date.now().toString());
        }

        console.log("Session refreshed successfully");
      }
    } catch (error) {
      console.error("Error refreshing session:", error);
    }
  };

  useEffect(() => {
    // 1. Check for an existing session on component mount
    const getActiveSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);

      // Set session expiry time if available
      if (data.session?.expires_at) {
        const expiryDate = new Date(data.session.expires_at * 1000);
        setSessionExpiry(expiryDate);
      }
    };
    getActiveSession();

    // 2. Listen for authentication state changes (login, logout, token refresh)
    // This is the core of Supabase session management
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);

        setSession(session);
        setUser(session?.user ?? null);

        // Update session expiry when session changes
        if (session?.expires_at) {
          const expiryDate = new Date(session.expires_at * 1000);
          setSessionExpiry(expiryDate);
        } else {
          setSessionExpiry(null);
        }

        // Handle email confirmation
        if (event === "SIGNED_IN" && session?.user) {
          if (
            session.user.email_confirmed_at &&
            !session.user.last_sign_in_at
          ) {
            // This is likely a new user who just confirmed their email
            console.log("New user confirmed email and is now signed in");
            // Initialize last activity time for new session
            localStorage.setItem("lastActivityTime", Date.now().toString());
          } else if (session.user.email_confirmed_at) {
            // Existing user signing in
            console.log("User signed in");
            // Initialize last activity time for new session
            localStorage.setItem("lastActivityTime", Date.now().toString());
          }
        }

        if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed");
          // Update last activity time when token is refreshed
          localStorage.setItem("lastActivityTime", Date.now().toString());
        }

        if (event === "SIGNED_OUT") {
          // Clean up when user signs out
          localStorage.removeItem("lastActivityTime");
        }
      }
    );

    // 3. Clean up the listener when the component unmounts
    return () => {
      authListener?.subscription.unsubscribe();
    };
  }, []);

  // 4. Check for the 'Admin' role whenever the user object changes
  useEffect(() => {
    if (user && user.app_metadata?.roles?.includes("Admin")) {
      setIsAdmin(true);
    } else {
      setIsAdmin(false);
    }
  }, [user]);

  // 5. Define the context value, mapping our functions to Supabase's functions
  // Define the logout function with cleanup
  const handleLogout = async () => {
    // Clear any stored activity timestamps
    localStorage.removeItem("lastActivityTime");
    // Sign out from Supabase
    return await supabase.auth.signOut();
  };

  const value = {
    session,
    user,
    isLoggedIn: !!user,
    isAdmin,
    refreshSession,
    login: (email: string, password: string) =>
      supabase.auth.signInWithPassword({ email, password }),
    signup: (email: string, password: string, fullName: string) =>
      supabase.auth.signUp({
        email,
        password,
        // We pass the full name here so our database trigger can use it
        options: {
          data: { full_name: fullName },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      }),
    logout: handleLogout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// Custom hook to easily consume the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
