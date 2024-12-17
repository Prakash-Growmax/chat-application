import { Organization } from "@/types";
import { toast } from "sonner";
import { supabase } from "../supabase";

export async function createOrganization(
  name: string,
  userId: string
): Promise<Organization> {
  try {
    // First, get user's subscription
    const { data: subscription, error: subError } = await supabase
      .from("subscriptions")
      .select("plan")
      .eq("user_id", userId)
      .single();

    if (subError) throw new Error("Failed to fetch subscription");

    // Get existing organizations count
    const { data: existingOrgs, error: countError } = await supabase
      .from("organizations")
      .select("id")
      .eq("owner_id", userId);

    if (countError) throw new Error("Failed to check existing organizations");

    // Check plan limits
    const planLimits = {
      single: 1,
      team: 3,
      pro: Infinity,
    };

    const limit = planLimits[subscription.plan as keyof typeof planLimits];

    if (existingOrgs && existingOrgs.length >= limit) {
      throw new Error(
        `Your ${subscription.plan} plan allows only ${limit} organization${
          limit === 1 ? "" : "s"
        }`
      );
    }
    // Create organization
    const { data: org, error: createError } = await supabase
      .from("organizations")
      .insert({
        name,
        owner_id: userId,
        plan: subscription.plan,
        token_usage: 0,
      })
      .select()
      .single();

    if (createError) throw new Error("Failed to create organization");
    return {
      id: org.id,
      name: org.name,
      ownerId: org.owner_id,
      members: [userId],
      tokenUsage: 0,
      plan: subscription.plan,
    };
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to create organization");
    }
    throw error;
  }
}

export async function getUserOrganizations(
  userId: string
): Promise<Organization[]> {
  try {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("owner_id", userId);

    if (error) throw error;

    if (data?.length > 0) {
      return data.map((org) => ({
        id: org.id,
        name: org.name,
        ownerId: org.owner_id,
        tokenUsage: org.token_usage,
        plan: org.plan,
      }));
    } else {
      return [];
    }
  } catch (error) {
    console.error("Failed to fetch organizations:", error);
    return [];
  }
}

export async function deleteOrganization(
  organizationId: string
): Promise<void> {
  try {
    // Delete organization members first due to foreign key constraints
    const { error: membersError } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId);

    if (membersError) throw new Error("Failed to delete organization members");

    // Delete the organization
    const { error: orgError } = await supabase
      .from("organizations")
      .delete()
      .eq("id", organizationId);

    if (orgError) throw new Error("Failed to delete organization");

    toast.success("Organization deleted successfully");
  } catch (error) {
    console.error("Failed to delete organization:", error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to delete organization");
    }
    throw error;
  }
}

export async function addMemberToOrganization(
  organizationId: string,
  email: string,
  role: "admin" | "member" = "member"
): Promise<void> {
  try {
    // Get user ID from email
    const { data: userData, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !userData) {
      throw new Error("User not found");
    }

    // Check member limit
    const { data: org } = await supabase
      .from("organizations")
      .select("plan, organization_members(count)")
      .eq("id", organizationId)
      .single();

    const memberLimits = {
      single: 1,
      team: 10,
      pro: Infinity,
    };

    if (
      org.organization_members[0].count >=
      memberLimits[org.plan as keyof typeof memberLimits]
    ) {
      throw new Error(
        `Your ${org.plan} plan allows only ${memberLimits[org.plan]} members`
      );
    }

    // Add member
    const { error: memberError } = await supabase
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: userData.id,
        role,
      });

    if (memberError) throw new Error("Failed to add member");

    toast.success("Member added successfully");
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to add member");
    }
    throw error;
  }
}

export async function removeMemberFromOrganization(
  organizationId: string,
  userId: string
): Promise<void> {
  try {
    const { error } = await supabase
      .from("organization_members")
      .delete()
      .eq("organization_id", organizationId)
      .eq("user_id", userId);

    if (error) throw new Error("Failed to remove member");

    toast.success("Member removed successfully");
  } catch (error) {
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error("Failed to remove member");
    }
    throw error;
  }
}
