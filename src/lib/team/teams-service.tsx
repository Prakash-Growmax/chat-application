import { Invitation, TeamData, TeamMember } from "@/types/team";
import { supabase } from "../supabase";

export const getTeamMembers = async (
  organizationId: string
): Promise<TeamMember[]> => {
  const { data: teamMembers, error } = await supabase
    .from("profiles")
    .select(
      `
      id,
      email,
      role,
      last_login,
      created_at,
      current_token_usage,
      tokens_remaining
    `
    )
    .eq("organization_id", organizationId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(`Failed to fetch team members: ${error.message}`);
  }

  return teamMembers as TeamMember[];
};

export async function getTeamData(organizationId: string): Promise<TeamData> {
  const [membersResponse, invitesResponse] = await Promise.all([
    supabase
      .from("profiles")
      .select("*")
      .eq("organization_id", organizationId)
      .order("created_at", { ascending: false }),

    supabase
      .from("invitations")
      .select("*")
      .eq("organization_id", organizationId)
      .eq("status", "pending")
      .order("created_at", { ascending: false }),
  ]);

  if (membersResponse.error) throw membersResponse.error;
  if (invitesResponse.error) throw invitesResponse.error;

  return {
    members: membersResponse.data || [],
    pendingInvites: invitesResponse.data || [],
  };
}

export async function inviteMember(
  organizationId: string,
  email: string,
  role: "admin" | "member"
): Promise<Invitation> {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + 7);
  const { data, error } = await supabase.from("invitations").insert({
    organization_id: organizationId,
    email: email,
    role: role,
    status: "pending",
    expires_at: expiresAt.toISOString(), // Add this line
  });

  if (error) throw error;
  return data;
}

export async function removeMember(
  organizationId: string,
  memberId: string
): Promise<void> {
  const { error } = await supabase
    .from("profiles")
    .delete()
    .eq("id", memberId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}

export async function cancelInvitation(
  organizationId: string,
  invitationId: string
): Promise<void> {
  const { error } = await supabase
    .from("invitations")
    .update({ status: "expired" })
    .eq("id", invitationId)
    .eq("organization_id", organizationId);

  if (error) throw error;
}
