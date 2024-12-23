import * as AuthService from "@/lib/auth/auth-service";
import { buildUserProfile } from "@/lib/auth/subscription-service";
import { loadingState } from "@/lib/loading-state";
import { supabase } from "@/lib/supabase";
import { clearAllTokens } from "@/lib/token-storage";
import { User } from "@/types";
import { createContext, useEffect, useRef, useState } from "react";
import { toast } from "sonner";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: Error | null;
  signIn: (email: string) => Promise<void>;
  verifyOTP: (email: string, otp: string) => Promise<void>;
  signOut: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);
  const isInitialAuth = useRef(true);

  useEffect(() => {
    let mounted = true;

    const initAuth = async () => {
      try {
        loadingState.startLoading("Initializing authentication...");
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (!mounted) return;

        if (session?.user) {
          const userData = await buildUserProfile(session.user);
          if (mounted) {
            setUser(userData);
          }
        }
      } catch (error) {
        if (mounted) {
          if (error instanceof Error) {
            setError(error);
          }
          await clearAllTokens();
        }
      } finally {
        if (mounted) {
          setLoading(false);
          loadingState.stopLoading();
        }
      }
    };
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return;
      if (event === "SIGNED_IN" && session?.user && isInitialAuth.current) {
        try {
          loadingState.startLoading("Loading your profile...");
          const userData = await buildUserProfile(session.user);
          if (mounted) {
            setUser(userData);
          }
        } catch (error) {
          console.error("Failed to build user profile:", error);
        } finally {
          loadingState.stopLoading();
        }
      } else if (event === "SIGNED_OUT") {
        if (mounted) {
          setUser(null);
        }
      }
    });
    initAuth();

    return () => {
      isInitialAuth.current = false;
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

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

  const verifyOTP = async (email: string, otp: string) => {
    setLoading(true);
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
      loadingState.stopLoading();
    }
  };

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
        loading,
        error,
        signIn,
        verifyOTP,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
