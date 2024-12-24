import { User } from "@/types";
import { Subscription } from "@/types/subscriptions";
import { buildUserProfile } from "./auth/subscription-service";
import { supabase } from "./supabase";

export async function updateSubscription(
  planName: string
): Promise<{ user: User | null }> {
  try {
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      throw new Error("Not authenticated");
    }

    const { data: plan, error: planError } = await supabase
      .from("plans")
      .select("id,monthly_token_limit")
      .eq("name", planName)
      .single();

    if (planError || !plan) {
      throw new Error(", Plan not found");
    }

    // Update subscription
    const { error } = await supabase
      .from("subscriptions")
      .update({
        plan_id: plan.id,
        status: "active",
        updated_at: new Date().toISOString(),
      })
      .eq("user_id", user.id);
    if (error) {
      throw error;
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();

    if (!authUser) {
      throw new Error("Not authenticated");
    }

    const userData = await buildUserProfile(authUser);

    return { user: userData };
  } catch (error) {
    console.error("Failed to create subscription:", error);
    throw new Error("Failed to update subscription");
  }
}

export async function getSubscriptionDetails(
  userId: string
): Promise<Subscription> {
  const { data, error } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (error) {
    throw new Error("Failed to fetch subscription details");
  }

  return data;
}

//subscribe
export function subscribeToChanges(userId: string, onUpdate: () => void) {
  return supabase
    .channel("subscription-changes")
    .on(
      "postgres_changes",
      {
        event: "UPDATE",
        schema: "public",
        table: "subscriptions",
        filter: `user_id=eq.${userId}`,
      },
      async (payload) => {
        await onUpdate();
      }
    )
    .subscribe();
}
