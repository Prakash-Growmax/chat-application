import { TeamMember } from "@/types/team";
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

export async function inviteTeamMember(
  inviterUserId: string,
  organizationId: string,
  email: string,
  role: "admin" | "member"
) {
  // Verify inviter has permission
  const { data: inviter } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", inviterUserId)
    .eq("organization_id", organizationId)
    .single();

  if (!inviter || inviter.role !== "admin") {
    throw new Error("No permission to invite members");
  }

  // Check if user is already a member
  const { data: existingMember } = await supabase
    .from("profiles")
    .select("*")
    .eq("email", email)
    .eq("organization_id", organizationId)
    .single();

  if (existingMember) {
    throw new Error("User is already a member of this organization");
  }

  // Check for pending invitation
  const { data: existingInvite } = await supabase
    .from("invitations")
    .select("*")
    .eq("email", email)
    .eq("organization_id", organizationId)
    .eq("status", "pending")
    .single();

  if (existingInvite) {
    throw new Error("User already has a pending invitation");
  }

  // Create new invitation
  const token = crypto.randomUUID();
  const expires_at = new Date();
  expires_at.setDate(expires_at.getDate() + 7);

  const { data: invitation, error } = await supabase
    .from("invitations")
    .insert({
      organization_id: organizationId,
      inviter_id: inviterUserId,
      email,
      role,
      status: "pending",
      expires_at: expires_at.toISOString(),
      token,
    })
    .select()
    .single();

  if (error) throw error;

  return invitation;
}
