import { Plan } from "@/types/plans";
import { supabase } from "../supabase";

export async function getAvailablePlans(): Promise<Plan[]> {
  try {
    const { data, error } = await supabase
      .from("plans")
      .select("*")
      .order("price_usd", { ascending: true });
    if (error) throw error;

    return data.map((plan) => ({
      id: plan.id,
      name: plan.name,
      monthlyTokenLimit: plan.monthly_token_limit,
      price: plan.price_usd,
      stripePriceId: plan.stripe_price_id,
      features: plan.features?.info || [],
      canInviteTeam: plan.can_invite_team,
    }));
  } catch (error) {
    console.error("Error fetching plans:", error);
    throw error;
  }
}
