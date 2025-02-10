import { useContext } from 'react';
import { AuthContext } from '@/context/AuthContext';
import { resetApplication, clearAllTokens } from '@/lib/token-storage';

export function useAuth() {
  const context = useContext(AuthContext);
 
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }

  return {
    ...context,
    resetAuth: async () => {
      await clearAllTokens();
      context.signOut();
    },
    resetApplication,
  };
}