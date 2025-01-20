import { PROFILE_QUERY_KEY } from "@/constants/reactQuery.constants";
import { fetchProfile } from "@/lib/profile/profile-service";
import { supabase } from "@/lib/supabase";
import { Profile } from "@/types/profile";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

export function useProfile() {
  const queryClient = useQueryClient();

  const {
    data: profile,
    isLoading: loading,
    error,
    refetch: refreshProfile,
  } = useQuery<Profile, Error>({
    queryKey: PROFILE_QUERY_KEY,
    queryFn: fetchProfile,
  });

  const { mutateAsync: updateProfile } = useMutation({
    mutationFn: async (updates: Partial<Profile>) => {
      const { error: updateError } = await supabase
        .from("profiles")
        .update(updates)
        .eq("id", profile?.id);

      if (updateError) throw updateError;
      return updates;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILE_QUERY_KEY });
    },
  });

  return {
    profile: profile ?? null,
    loading,
    error: error?.message ?? null,
    updateProfile: async (updates: Partial<Profile>) => {
      try {
        await updateProfile(updates);
        return { success: true };
      } catch (err) {
        console.error("Error updating profile:", err);
        return {
          success: false,
          error:
            err instanceof Error ? err.message : "Failed to update profile",
        };
      }
    },
    refreshProfile,
  };
}

// @Document
// useQuery manages fetching and caching of the profile data
// useMutation handles updating the profile
// When update succeeds, it invalidates the cache (via queryClient.invalidateQueries)
// profile: profile ?? null
// It means:
// If profile is null or undefined, use null
// If profile has any other value (including 0, empty string, false), use that value
