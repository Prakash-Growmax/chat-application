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

export async function fetchProfile() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("No user found");

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  if (error) throw error;
  return data;
}
