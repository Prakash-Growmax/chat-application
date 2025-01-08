import { supabase } from "../supabase";

export const updateProfile_stripeCustomerId = async (
  profileId: string,
  stripeCustomerId: string
) => {
  if (!profileId || !stripeCustomerId) return null;
  try {
    const { data, error } = await supabase
      .from("profiles")
      .update({ stripe_customer_id: stripeCustomerId })
      .eq("id", profileId)
      .select();

    if (error) {
      throw error;
    }

    console.log("Successfully updated stripe_customer_id:", data);
    return data;
  } catch (error: any) {
    console.error("Error updating stripe_customer_id:", error.message);
    throw error;
  }
};

export const getProfileById = async (profileId: string) => {
  try {
    const { data, error } = await supabase
      .from("profiles")
      .select("*") // Select all columns - you can specify specific columns if needed
      .eq("id", profileId)
      .single(); // Expects a single row result

    if (error) {
      throw error;
    }

    if (!data) {
      throw new Error("Profile not found");
    }
    return data;
  } catch (error: any) {
    throw error;
  }
};
