// hooks/useOrganization.ts
import { supabase } from "@/lib/supabase";
import { useCallback, useEffect, useState } from "react";

interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useOrganization(organizationId?: string) {
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = useCallback(async () => {
    if (!organizationId) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const { data, error: orgError } = await supabase
        .from("organizations")
        .select("*")
        .eq("id", organizationId)
        .single();

      if (orgError) throw orgError;
      setOrganization(data);
    } catch (err) {
      console.error("Error fetching organization:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load organization"
      );
    } finally {
      setLoading(false);
    }
  }, [organizationId]);

  const updateOrganizationName = async (name: string) => {
    console.log("🚀 ~ updateOrganizationName ~ name:", name);
    console.log(
      "🚀 ~ updateOrganizationName ~ organizationId:",
      organizationId
    );

    if (!organization?.id) {
      return { success: false, error: "No organization found" };
    }
    const { data: res } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();
    console.log("🚀 ~ updateOrganizationName ~ res:", res);

    try {
      setLoading(true);
      const { data, error: updateError } = await supabase
        .from("organizations")
        .update({
          name,
        })
        .eq("id", organizationId)
        .select();
      console.log("🚀 ~ updateOrganizationName ~ data:", data);

      if (updateError) throw updateError;

      await fetchOrganization();
      return { success: true };
    } catch (err) {
      console.error("Error updating organization:", err);
      return {
        success: false,
        error:
          err instanceof Error ? err.message : "Failed to update organization",
      };
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrganization();
  }, [fetchOrganization]);

  return {
    organization,
    loading,
    error,
    updateOrganizationName,
    refreshOrganization: fetchOrganization,
  };
}
