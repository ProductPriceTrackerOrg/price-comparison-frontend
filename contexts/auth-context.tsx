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
  redirectUrl: string | null;
  setRedirectUrl: (url: string | null) => void;
  login: (email: string, password: string) => Promise<any>;
  signup: (email: string, password: string, fullName: string) => Promise<any>;
  logout: () => Promise<{ error: any | null }>;
  // We remove updateUser as Supabase handles this differently
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAdmin, setIsAdmin] = useState(false);
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);

  useEffect(() => {
    // 1. Check for an existing session on component mount
    const getActiveSession = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setUser(data.session?.user ?? null);
    };
    getActiveSession();

    // 2. Listen for authentication state changes (login, logout, token refresh)
    // This is the core of Supabase session management
    const { data: authListener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log("Auth state change:", event, session?.user?.email);

        setSession(session);
        setUser(session?.user ?? null);

        // Handle email confirmation
        if (event === "SIGNED_IN" && session?.user) {
          if (
            session.user.email_confirmed_at &&
            !session.user.last_sign_in_at
          ) {
            // This is likely a new user who just confirmed their email
            console.log("New user confirmed email and is now signed in");
          } else if (session.user.email_confirmed_at) {
            // Existing user signing in
            console.log("User signed in");
          }
        }

        if (event === "TOKEN_REFRESHED") {
          console.log("Token refreshed");
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
  const value = {
    session,
    user,
    isLoggedIn: !!user,
    isAdmin,
    redirectUrl,
    setRedirectUrl,
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
    logout: () => supabase.auth.signOut(),
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
