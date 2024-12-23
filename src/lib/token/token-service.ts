import { TokenUsageData } from "@/types/tokens";
import { supabase } from "../supabase";

export const fetchTokenUsage = async (userId: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("*, subscriptions(plans(monthly_token_limit))")
    .eq("id", userId)
    .single();

  if (error) throw error;

  return {
    email: data.email,
    current_token_usage: data.current_token_usage,
    tokens_remaining: data.tokens_remaining,
    monthly_token_limit: data.subscriptions?.[0]?.plan?.monthly_token_limit,
  } as TokenUsageData;
};

export const subscribeToTokenUpdates = (
  userId: string,
  callback: (payload: TokenUsageData) => void
) => {
  const channel = supabase.channel("subscription-updates");

  // Listen for profile changes
  channel.on(
    "postgres_changes",
    {
      event: "UPDATE",
      schema: "public",
      table: "profiles",
      filter: `id=eq.${userId}`,
    },
    handleUpdate
  );

  // Listen for subscription changes
  channel.on(
    "postgres_changes",
    {
      event: "*", // Listen for INSERT, UPDATE, and DELETE
      schema: "public",
      table: "subscriptions",
      filter: `user_id=eq.${userId}`, // Adjust this to match your schema
    },
    handleUpdate
  );

  async function handleUpdate() {
    // Fetch fresh data whenever either table changes
    const { data, error } = await supabase
      .from("profiles")
      .select("*, subscriptions(plan(monthly_token_limit))")
      .eq("id", userId)
      .single();

    if (!error && data) {
      const tokenData = {
        email: data.email,
        current_token_usage: data.current_token_usage,
        tokens_remaining: data.tokens_remaining,
        monthly_token_limit: data.subscriptions?.[0]?.plan?.monthly_token_limit,
      } as TokenUsageData;
      callback(tokenData);
    }
  }

  channel.subscribe();

  return channel;
};
