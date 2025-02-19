// hooks/useOrganization.ts
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";

interface Organization {
  id: string;
  name: string;
  created_at: string;
  updated_at: string;
}

export function useOrganization(organizationId?: string) {
  const location = useLocation();
  const [organization, setOrganization] = useState<Organization | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrganization = async () => {
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
  };

  const updateOrganizationName = async (name: string) => {
    if (!organization?.id) {
      return { success: false, error: "No organization found" };
    }
    await supabase
      .from("organizations")
      .select("*")
      .eq("id", organizationId)
      .single();

    try {
      setLoading(true);
      const { error: updateError } = await supabase
        .from("organizations")
        .update({
          name,
        })
        .eq("id", organizationId)
        .select();
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
  }, [location.pathname, organizationId]);

  return {
    organization,
    loading,
    error,
    updateOrganizationName,
    refreshOrganization: fetchOrganization,
  };
}
