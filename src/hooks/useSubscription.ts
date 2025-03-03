import {
  getSubscriptionDetails,
  subscribeToChanges,
  updateSubscription,
} from "@/lib/subscription";
import { Subscription } from "@/types/subscriptions";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "./useAuth";

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const upgradePlan = useCallback(
    async (planName: "Single" | "Team" | "Free") => {
      if (!user) return;
      setLoading(true);
      try {
        await updateSubscription(planName);
        toast.success(`Successfully upgraded to ${planName} plan`);
        await loadSubscription(); // Add immediate refresh
      } catch (error) {
        console.error("Failed to upgrade plan:", error);
        toast.error("Failed to upgrade plan");
      } finally {
        setLoading(false);
      }
    },
  
    [user]
  );

  const loadSubscription = async () => {
    if (!user?.id) return;

    try {
      setLoading(true);
      const data = await getSubscriptionDetails(user.id);
      setSubscription(data);
    } catch (error) {
      console.error("Failed to load subscription:", error);
    } finally {
      setLoading(false);
    }
  };
  useEffect(() => {
    loadSubscription();
    if (!user?.id) return;
    const subscription = subscribeToChanges(user.id!, loadSubscription);
    return () => {
      subscription.unsubscribe();
    };
   
  }, [user?.id]);

  return {
    upgradePlan,
    loading,
    subscription,
    isActive: subscription?.status === "active",
    planId: subscription?.plan_id,
  };
}
