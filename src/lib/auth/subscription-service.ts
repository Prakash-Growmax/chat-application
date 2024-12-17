import { User } from "@/types";
import { toast } from "sonner";
import { supabase } from "../supabase";

export async function getUserSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .select("*")
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("Error fetching subscription:", error);
      return null;
    }

    return data;
  } catch (error) {
    console.error("Error fetching subscription:", error);
    return null;
  }
}

export async function createSubscription(userId: string) {
  try {
    const { data, error } = await supabase
      .from("subscriptions")
      .insert({
        user_id: userId,
        plan: "single",
        token_usage: 0,
        status: "active",
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating subscription:", error);
    throw error;
  }
}

export async function updateSubscription(userId: string, plan: string) {
  try {
    const { error } = await supabase
      .from("subscriptions")
      .update({ plan })
      .eq("user_id", userId);

    if (error) throw error;
  } catch (error) {
    console.error("Error updating subscription:", error);
    throw error;
  }
}

export async function getOrCreateSubscription(userId: string) {
  try {
    let subscription = await getUserSubscription(userId);

    if (!subscription) {
      subscription = await createSubscription(userId);
    }

    return subscription;
  } catch (error) {
    console.error("Error in getOrCreateSubscription:", error);
    return {
      plan: "single",
      token_usage: 0,
      status: "active",
    };
  }
}

export async function buildUserProfile(supabaseUser: any): Promise<User> {
  try {
    const subscription = await getOrCreateSubscription(supabaseUser.id);
    const userProfile = {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name:
        supabaseUser.user_metadata?.full_name ||
        supabaseUser.email?.split("@")[0] ||
        "User",
      plan: subscription.plan || "single",
      tokenUsage: subscription.token_usage || 0,
    };
    return userProfile;
  } catch (error) {
    toast.error("Error loading user profile");

    return {
      id: supabaseUser.id,
      email: supabaseUser.email!,
      name: supabaseUser.email?.split("@")[0] || "User",
      plan: "single",
      tokenUsage: 0,
    };
  }
}
