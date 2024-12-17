import { useState, useCallback, useRef, useEffect } from 'react';
import { toast } from 'sonner';

interface UseLoadingStateOptions {
  timeout?: number;
  onTimeout?: () => void;
  minimumLoadingTime?: number;
  retryCount?: number;
}

export function useLoadingState({ 
  timeout = 30000,
  onTimeout,
  minimumLoadingTime = 300,
  retryCount = 3
}: UseLoadingStateOptions = {}) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);
  const [retries, setRetries] = useState(0);
  const loadingStartTime = useRef<number | null>(null);
  const timeoutRef = useRef<number>();

  const clearTimeouts = useCallback(() => {
    if (timeoutRef.current) {
      window.clearTimeout(timeoutRef.current);
    }
  }, []);

  useEffect(() => {
    return () => {
      clearTimeouts();
    };
  }, [clearTimeouts]);

  const retry = useCallback(async () => {
    if (retries < retryCount) {
      setRetries(prev => prev + 1);
      setError(null);
      return true;
    }
    return false;
  }, [retries, retryCount]);

  const startLoading = useCallback(() => {
    setIsLoading(true);
    setError(null);
    loadingStartTime.current = Date.now();

    if (timeout > 0) {
      clearTimeouts();
      
      timeoutRef.current = window.setTimeout(() => {
        setIsLoading(false);
        setError(new Error('Operation timed out'));
        toast.error('The operation is taking longer than expected. Retrying...');
        retry().then(canRetry => {
          if (!canRetry) {
            onTimeout?.();
          }
        });
      }, timeout);
    }

    return clearTimeouts;
  }, [timeout, onTimeout, clearTimeouts, retry]);

  const stopLoading = useCallback(async (error?: Error) => {
    if (error) {
      setError(error);
    }

    const elapsedTime = loadingStartTime.current 
      ? Date.now() - loadingStartTime.current 
      : 0;
    
    if (elapsedTime < minimumLoadingTime) {
      await new Promise(resolve => 
        setTimeout(resolve, minimumLoadingTime - elapsedTime)
      );
    }

    setIsLoading(false);
    loadingStartTime.current = null;
    clearTimeouts();
  }, [minimumLoadingTime, clearTimeouts]);

  return {
    isLoading,
    error,
    retries,
    startLoading,
    stopLoading,
    retry,
  };
}