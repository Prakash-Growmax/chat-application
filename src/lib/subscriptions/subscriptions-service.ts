import { supabase } from "../supabase";

export const getSubscriptionByUserId = async (userId: string) => {
  if (!userId) return null;

  const { data: subscriptionData, error: fetchError } = await supabase
    .from("subscriptions")
    .select("*")
    .eq("user_id", userId)
    .single();

  if (fetchError) throw new Error(fetchError.message);

  return subscriptionData;
};

export const updateSessionIdInSubscription = async (
  subscriptionId: string,
  sessionId: string
) => {
  if (!subscriptionId) return null;

  const { data: updatedSubscription, error: updateError } = await supabase
    .from("subscriptions")
    .update({
      stripe_session_id: sessionId, // Add the stripe session ID here
      updated_at: new Date(), // Update the timestamp
    })
    .eq("id", subscriptionId);

  if (updateError) throw new Error(updateError.message);

  return updatedSubscription;
};
