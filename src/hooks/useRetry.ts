import { useState, useCallback } from 'react';
import { toast } from 'sonner';

interface UseRetryOptions {
  maxAttempts?: number;
  delay?: number;
}

export function useRetry<T>({
  maxAttempts = 3,
  delay = 1000,
}: UseRetryOptions = {}) {
  const [attempts, setAttempts] = useState(0);

  const executeWithRetry = useCallback(
    async (operation: () => Promise<T>): Promise<T> => {
      try {
        const result = await operation();
        setAttempts(0);
        return result;
      } catch (error) {
        setAttempts((prev) => prev + 1);
        
        if (attempts + 1 >= maxAttempts) {
          toast.error('Operation failed after multiple attempts');
          throw error;
        }

        toast.error('Operation failed, retrying...');
        await new Promise((resolve) => setTimeout(resolve, delay));
        return executeWithRetry(operation);
      }
    },
    [attempts, maxAttempts, delay]
  );

  return {
    executeWithRetry,
    attempts,
    hasMoreAttempts: attempts < maxAttempts,
    reset: () => setAttempts(0),
  };
}