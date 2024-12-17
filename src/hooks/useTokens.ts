import { useState, useCallback } from 'react';
import { useAuth } from './useAuth';
import { deductTokens } from '@/lib/token-service';
import { toast } from 'sonner';

export function useTokens() {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);

  const processAction = useCallback(async (
    chatId: string,
    actionType: string,
    content: string,
    metadata?: Record<string, any>
  ): Promise<number> => {
    if (!user) {
      throw new Error('User not authenticated');
    }

    setLoading(true);
    try {
      const tokenCost = await deductTokens(user, chatId, {
        actionType,
        contentLength: content.length,
        contextData: metadata,
      });

      return tokenCost;
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error('Failed to process tokens');
      }
      throw error;
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    loading,
    processAction,
  };
}