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

  // 1. Create invitation record
  const { data: invitation, error: inviteError } = await supabase
    .from("invitations")
    .insert({
      organization_id: organizationId,
      email,
      role,
      status: "pending",
      expires_at: expiresAt.toISOString(),
    })
    .select()
    .single();

  if (inviteError) throw inviteError;

  // 2. Use Supabase's built-in invite functionality
  const { error: emailError } = await supabase.auth.signInWithOtp({
    email: email,
    options: {
      data: {
        invitation_id: invitation.id,
        organization_id: organizationId,
        role: role,
      },
      emailRedirectTo: `${window.location.origin}/accept-invite`,
    },
  });

  if (emailError) {
    // Rollback invitation if email fails
    await supabase.from("invitations").delete().eq("id", invitation.id);
    throw emailError;
  }

  return invitation;
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

export async function acceptInvitation() {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user?.id)
    .single();
  if (profileError) throw profileError;

  const invitationId = profile?.invitation_id;
  const organizationId = profile?.organization_id;
  const role = profile?.role;

  if (!invitationId || !organizationId || !role) {
    throw new Error("Invalid invitation data");
  }

  // Start a transaction using RPC
  const { error } = await supabase.rpc("accept_invitation", {
    user_id: user?.id,
    invitation_id: invitationId,
    p_organization_id: organizationId,
    p_role: role,
  });

  if (error) throw error;
}
