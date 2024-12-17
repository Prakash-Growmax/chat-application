import { useState, useEffect } from 'react';
import { useAuth } from './useAuth';
import { getTokenUsage, getTokenUsageHistory } from '@/lib/token/token-service';
import { supabase } from '@/lib/supabase';
import { toast } from 'sonner';

export function useTokenUsage() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [usage, setUsage] = useState({ used: 0, limit: 0, percentage: 0 });
  const [history, setHistory] = useState<Array<{
    timestamp: Date;
    tokens: number;
    action: string;
  }>>([]);

  useEffect(() => {
    async function loadTokenData() {
      if (!user) return;

      try {
        setLoading(true);
        const [usageData, historyData] = await Promise.all([
          getTokenUsage(user.id),
          getTokenUsageHistory(user.id)
        ]);

        setUsage(usageData);
        setHistory(historyData);
      } catch (error) {
        console.error('Failed to load token data:', error);
        toast.error('Failed to load token usage data');
      } finally {
        setLoading(false);
      }
    }

    loadTokenData();

    // Subscribe to real-time updates
    const subscriptionChanges = supabase
      .channel('subscription-changes')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'subscriptions',
          filter: `user_id=eq.${user?.id}`
        },
        async () => {
          await loadTokenData();
        }
      )
      .subscribe();

    const tokenUsageChanges = supabase
      .channel('token-usage-changes')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'token_usage_logs',
          filter: `user_id=eq.${user?.id}`
        },
        async () => {
          await loadTokenData();
        }
      )
      .subscribe();

    return () => {
      subscriptionChanges.unsubscribe();
      tokenUsageChanges.unsubscribe();
    };
  }, [user]);

  return {
    loading,
    usage,
    history,
    isLow: usage.percentage > 80,
    hasTokens: usage.used < usage.limit
  };
}