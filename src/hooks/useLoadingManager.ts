import { useState, useEffect } from 'react';
import { loadingManager } from '@/lib/loading-manager';

export function useLoadingManager() {
  const [state, setState] = useState({
    isLoading: false,
    error: null,
    progress: 0,
    message: '',
  });

  useEffect(() => {
    return loadingManager.subscribe(setState);
  }, []);

  return {
    ...state,
    startLoading: loadingManager.startLoading.bind(loadingManager),
    stopLoading: loadingManager.stopLoading.bind(loadingManager),
    setError: loadingManager.setError.bind(loadingManager),
  };
}