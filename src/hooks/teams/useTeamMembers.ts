import { supabase } from "@/lib/supabase";
import { getTeamMembers } from "@/lib/team/teams-service";
import { TeamMember, UseTeamMembersReturn } from "@/types/team";
import { useEffect, useState } from "react";

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchTeamMembers = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data: user } = await supabase.auth.getUser();
      if (!user?.user) return;

      const { data: org_id } = await supabase
        .from("profiles")
        .select("organization_id")
        .eq("email", user.user.email)
        .single();

      const members = await getTeamMembers(org_id?.organization_id);
      setTeamMembers(members);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Re-fetch when organizationId changes

  return {
    teamMembers,
    loading,
    error,
    refetch: fetchTeamMembers, // Expose refetch function for manual updates
  };
};
