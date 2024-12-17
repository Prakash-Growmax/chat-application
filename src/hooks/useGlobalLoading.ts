import { useState, useEffect } from 'react';
import { loadingState } from '@/lib/loading-state';

export function useGlobalLoading() {
  const [state, setState] = useState({
    isLoading: false,
    message: '',
    progress: 0,
    error: null
  });

  useEffect(() => {
    return loadingState.subscribe(setState);
  }, []);

  return {
    ...state,
    startLoading: (message: string) => loadingState.startLoading(message),
    stopLoading: () => loadingState.stopLoading(),
    setError: (error: Error) => loadingState.setError(error)
  };
}