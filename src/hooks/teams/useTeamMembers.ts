import { supabase } from "@/lib/supabase";
import {
  cancelInvitation,
  getTeamData,
  inviteMember,
  removeMember,
} from "@/lib/team/teams-service";
import { TeamData, TeamMember, UseTeamMembersReturn } from "@/types/team";
import { useCallback, useEffect, useState } from "react";

export const useTeamMembers = (): UseTeamMembersReturn => {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>();
  const [error, setError] = useState<string | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);

  const fetchTeamMembers = useCallback(async () => {
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

      // const members = await getTeamMembers(org_id?.organization_id);
      const data = await getTeamData(org_id?.organization_id);
      setTeamData(data);
      setOrganizationId(org_id?.organization_id);
      // setTeamMembers(members);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  }, []);

  const inviteMemberByEmail = useCallback(
    async (email: string, role: "admin" | "member") => {
      if (!organizationId) throw new Error("No organization ID found");

      await inviteMember(organizationId, email, role);
      await fetchTeamMembers();
    },
    [organizationId, fetchTeamMembers]
  );

  const removeMemberByEmail = useCallback(
    async (memberId: string) => {
      if (!organizationId) throw new Error("No organization ID found");

      await removeMember(organizationId, memberId);
      await fetchTeamMembers();
    },
    [organizationId, fetchTeamMembers]
  );

  const cancelInvitationByEmail = useCallback(
    async (invitationId: string) => {
      if (!organizationId) throw new Error("No organization ID found");

      await cancelInvitation(organizationId, invitationId);
      await fetchTeamMembers();
    },
    [organizationId, fetchTeamMembers]
  );

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Re-fetch when organizationId changes

  return {
    teamMembers,
    teamData,
    loading,
    error,
    refetch: fetchTeamMembers,
    inviteMemberByEmail,
    removeMemberByEmail,
    cancelInvitationByEmail,
  };
};
