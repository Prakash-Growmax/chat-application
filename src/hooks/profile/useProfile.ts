// hooks/useProfile.ts
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { useCallback, useEffect, useState } from "react";

export function useProfile() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProfile = useCallback(async () => {
    try {
      setLoading(true);
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) throw new Error("No user found");

      const { data, error: profileError } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileError) throw profileError;
      setProfile(data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load profile");
    } finally {
      setLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [supabase]);

  const updateProfile = async (updates: Partial<Profile>) => {
    try {
      setLoading(true);
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile?.id);

      if (updateError) throw updateError;

      await fetchProfile(); // Refresh profile data
      return { success: true };
    } catch (err) {
      console.error("Error updating profile:", err);
      return {
        success: false,
        error: err instanceof Error ? err.message : "Failed to update profile",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  return {
    profile,
    loading,
    error,
    updateProfile,
    refreshProfile: fetchProfile,
  };
}
