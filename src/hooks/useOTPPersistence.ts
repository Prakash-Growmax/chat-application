import { useState, useEffect } from 'react';
import {
  getOTPState,
  saveOTPState,
  updateOTPAttempts,
  clearOTPState,
} from '@/lib/storage/auth-storage';
import { useLoadingState } from './useLoadingState';

export function useOTPPersistence() {
  const [email, setEmail] = useState<string>('');
  const [isVerifying, setIsVerifying] = useState(false);
  const { isLoading, startLoading, stopLoading } = useLoadingState();

  // Restore OTP state when component mounts or tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = async () => {
      if (document.visibilityState === 'visible') {
        const cleanup = startLoading();
        try {
          const state = await getOTPState();
          if (state) {
            setEmail(state.email);
            setIsVerifying(true);
          }
        } finally {
          stopLoading();
          cleanup?.();
        }
      }
    };

    // Initial check
    handleVisibilityChange();

    // Listen for visibility changes
    document.addEventListener('visibilitychange', handleVisibilityChange);
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [startLoading, stopLoading]);

  const persistOTPState = async (newEmail: string) => {
    await saveOTPState(newEmail);
    setEmail(newEmail);
    setIsVerifying(true);
  };

  const clearPersistedState = async () => {
    await clearOTPState();
    setEmail('');
    setIsVerifying(false);
  };

  const incrementAttempts = async () => {
    await updateOTPAttempts();
  };

  return {
    email,
    setEmail,
    isVerifying,
    setIsVerifying,
    isLoading,
    persistOTPState,
    clearPersistedState,
    incrementAttempts,
  };
}