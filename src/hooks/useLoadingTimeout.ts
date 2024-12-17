import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

interface UseLoadingTimeoutOptions {
  timeout?: number;
  onTimeout?: () => void;
  message?: string;
}

export function useLoadingTimeout({
  timeout = 30000,
  onTimeout,
  message = 'Operation is taking longer than expected',
}: UseLoadingTimeoutOptions = {}) {
  const [loading, setLoading] = useState(false);
  const [timeoutId, setTimeoutId] = useState<number>();

  const startLoading = useCallback(() => {
    setLoading(true);
    const id = window.setTimeout(() => {
      setLoading(false);
      toast.error(message);
      onTimeout?.();
    }, timeout);
    setTimeoutId(id);
  }, [timeout, message, onTimeout]);

  const stopLoading = useCallback(() => {
    setLoading(false);
    if (timeoutId) {
      window.clearTimeout(timeoutId);
    }
  }, [timeoutId]);

  useEffect(() => {
    return () => {
      if (timeoutId) {
        window.clearTimeout(timeoutId);
      }
    };
  }, [timeoutId]);

  return { loading, startLoading, stopLoading };
}