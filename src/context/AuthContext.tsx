import * as AuthService from "@/lib/auth/auth-service";
import { buildUserProfile } from "@/lib/auth/subscription-service";
import { loadingState } from "@/lib/loading-state";
import { supabase } from "@/lib/supabase";
import { clearAllTokens } from "@/lib/token-storage";
import { User } from "@/types";
import { createContext, useEffect, useState } from "react";
import { toast } from "sonner";

/**
 * Interface representing the authentication context type.
 */
interface AuthContextType {
  user: User | null;
  loading: boolean;
  loadingSet:boolean;
  error: Error | null;
  signIn: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
}

/**
 * Authentication context to be used by the application.
 */
export const AuthContext = createContext<AuthContextType | null>(null);

/**
 * Authentication provider component that wraps the application and provides authentication state and methods.
 * @param children - The child components to be wrapped by the provider.
 */
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const [loadingSet,setLoadingSet] = useState(false);

  useEffect(() => {
    let mounted = true;
    let subscription: { unsubscribe: () => void } | null = null;

    const handleAuthStateChange = async (event: string, session: any) => {
      if (!mounted) return;

      try {
        switch (event) {
          case "SIGNED_IN":
            if (session?.user) {
              loadingState.startLoading("Loading your profile...");
              const userData = await buildUserProfile(session.user);
              setUser(userData);
            }
            break;
          case "SIGNED_OUT":
            setUser(null);
            break;
          case "TOKEN_REFRESHED":
            if (session?.user) {
              const userData = await buildUserProfile(session.user);
              setUser(userData);
            }
            break;
        }
      } catch (error) {
        console.error(`Authentication state change error (${event}):`, error);
        if (error instanceof Error) {
          setError(error);
        }
        await clearAllTokens();
      } finally {
        loadingState.stopLoading();
      }
    };

    const initAuth = async () => {
      try {
        loadingState.startLoading("Initializing authentication...");
        
        // First, check for an existing session
        const { data: { session } } = await supabase.auth.getSession();

        // If a session exists, build and set user profile
        if (session?.user) {
          const userData = await buildUserProfile(session.user);
          if (mounted) {
            setUser(userData);
          }
        }

        // Set up auth state change listener
        const authStateChangeResult = supabase.auth.onAuthStateChange(async (event, session) => {
          await handleAuthStateChange(event, session);
        });
        
        subscription = authStateChangeResult.data.subscription;
      } catch (error) {
        console.error("Authentication initialization error:", error);
        if (mounted) {
          if (error instanceof Error) {
            setError(error);
          }
          await clearAllTokens();
        }
      } finally {
        if (mounted) {
          setLoading(false);
          setInitialLoading(false);
          loadingState.stopLoading();
        }
      }
    };

    initAuth();

    return () => {
      mounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  /**
   * Signs in the user with the provided email.
   * @param email - The email address of the user.
   */
  const signIn = async (email: string) => {
    setLoading(true);
    loadingState.startLoading("Sending login code...");
    try {
      await AuthService.signInWithOTP(email);
      toast.success("Login code sent to your email");
    } catch (error) {
      console.error("Sign in error:", error);
      toast.error("Failed to send login code");
      if (error instanceof Error) {
        setError(error);
      }
      throw error;
    } finally {
      setLoading(false);
      loadingState.stopLoading();
    }
  };

  /**
   * Verifies the OTP code for the provided email.
   * @param email - The email address of the user.
   * @param otp - The OTP code sent to the user's email.
   */
  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
    setLoadingSet(true)
    loadingState.startLoading("Verifying login code...");
    try {
      const { session } = await AuthService.verifyOTP(email, otp);
      if (session?.user) {
        const userData = await buildUserProfile(session.user);
        setUser(userData);
        toast.success("Successfully verified");
        return;
      }

      throw new Error("Failed to verify login code");
    } catch (error) {
      console.error("OTP verification error:", error);
      toast.error("Invalid login code");
      if (error instanceof Error) {
        setError(error);
      }
      throw error;
    } finally {
      setLoading(false);
      setLoadingSet(false);
      loadingState.stopLoading();
    }
  };

  /**
   * Signs out the user.
   */
  const signOut = async () => {
    setLoading(true);
    loadingState.startLoading("Signing out...");
    try {
      await AuthService.signOut();
      await clearAllTokens();
      setUser(null);
      toast.success("Signed out successfully");
    } catch (error) {
      console.error("Sign out error:", error);
      toast.error("Failed to sign out");
      if (error instanceof Error) {
        setError(error);
      }
    } finally {
      setLoading(false);
      loadingState.stopLoading();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading: initialLoading || loading,
        loadingSet,
        error,
        signIn,
        verifyOTP,
        signOut,
      }}
    >
      {!initialLoading ? children : <div className="hidden">{children}</div>}
    </AuthContext.Provider>
  );
}