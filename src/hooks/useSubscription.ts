import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import {
  updateSubscription,
  getSubscriptionDetails,
  checkTokenAvailability,
  consumeTokens,
  logTokenUsage,
} from '@/lib/subscription';
import { toast } from 'sonner';

export function useSubscription() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const upgradePlan = useCallback(async (plan: 'single' | 'team' | 'pro') => {
    if (!user) return;

    setLoading(true);
    try {
      await updateSubscription(user.id, plan);
      toast.success(`Successfully upgraded to ${plan} plan`);
    } catch (error) {
      console.error('Failed to upgrade plan:', error);
      toast.error('Failed to upgrade plan');
    } finally {
      setLoading(false);
    }
  }, [user]);

  const checkTokens = useCallback(async (requiredTokens: number) => {
    if (!user) return false;

    try {
      return await checkTokenAvailability(user, requiredTokens);
    } catch (error) {
      console.error('Failed to check token availability:', error);
      return false;
    }
  }, [user]);

  const useTokens = useCallback(async (tokens: number, action: string) => {
    if (!user) return;

    try {
      const hasTokens = await checkTokens(tokens);
      if (!hasTokens) {
        toast.error('Insufficient tokens. Please upgrade your plan.');
        return false;
      }

      await Promise.all([
        consumeTokens(user.id, tokens),
        logTokenUsage(user.id, tokens, action),
      ]);
      return true;
    } catch (error) {
      console.error('Failed to consume tokens:', error);
      return false;
    }
  }, [user, checkTokens]);

  return {
    loading,
    upgradePlan,
    checkTokens,
    useTokens,
  };
}