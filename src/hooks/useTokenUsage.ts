import {
  fetchTokenUsage,
  subscribeToTokenUpdates,
} from "@/lib/token/token-service";
import { TokenUsageState } from "@/types/tokens";
import { useEffect, useState } from "react";
import { useAuth } from "./useAuth";

export function useTokenUsage() {
  const { user } = useAuth();
  const [state, setState] = useState<TokenUsageState>({
    data: null,
    loading: true,
    error: null,
  });
  useEffect(() => {
    let mounted = true;

    async function fetchData() {
      if (!user) {
        setState((prev) => ({ ...prev, loading: false }));
        return;
      }

      try {
        const data = await fetchTokenUsage(user.id);
        if (mounted) {
          setState({
            data,
            loading: false,
            error: null,
          });
        }
      } catch (err) {
        console.error(err)
        if (mounted) {
          setState({
            data: null,
            loading: false,
            error: "Failed to fetch token usage",
          });
        }
      }
    }

    fetchData();

    // Set up real-time subscription
    const channel = subscribeToTokenUpdates(user?.id || "", (newData) => {
      if (mounted) {
        setState((prev) => ({
          ...prev,
          data: newData, // Use the complete new data
        }));
      }
    });

    return () => {
      mounted = false;
      channel.unsubscribe();
    };
  }, [user]);

  return state;
}
