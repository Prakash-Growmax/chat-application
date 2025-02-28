import { supabase } from "@/lib/supabase";
import {
  cancelInvitation,
  getTeamData,
  inviteMember,
  removeMember,
} from "@/lib/team/teams-service";
import { TeamData, UseTeamMembersReturn } from "@/types/team";
import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export const useTeamMembers = (): UseTeamMembersReturn => {
  const location = useLocation();
  const [loading, setLoading] = useState(true);
  const [organizationId, setOrganizationId] = useState<string | null>();
  const [error, setError] = useState<any | null>(null);
  const [teamData, setTeamData] = useState<TeamData | null>(null);

  const fetchTeamMembers = async () => {
    const cachedPlans = localStorage.getItem("teams");
    if(cachedPlans){
      setTeamData(cachedPlans);
    }

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
      localStorage.setItem("teams",JSON.stringify(data));
      setOrganizationId(org_id?.organization_id);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

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

  const isInitialMount = useRef(true);

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      fetchTeamMembers();
    }

    return () => {
      isInitialMount.current = true;
    };
  }, [location.pathname, organizationId]);

  useEffect(() => {
    fetchTeamMembers();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return {
    teamData,
    loading,
    error,
    refetch: fetchTeamMembers,
    inviteMemberByEmail,
    removeMemberByEmail,
    cancelInvitationByEmail,
  };
};
