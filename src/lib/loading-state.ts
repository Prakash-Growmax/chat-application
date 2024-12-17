interface LoadingState {
  isLoading: boolean;
  message: string;
  progress: number;
  error: Error | null;
}

class LoadingStateManager {
  private static instance: LoadingStateManager;
  private state: LoadingState;
  private listeners: Set<(state: LoadingState) => void>;
  private progressInterval?: number;

  private constructor() {
    this.state = {
      isLoading: false,
      message: "",
      progress: 0,
      error: null,
    };
    this.listeners = new Set();
  }

  static getInstance(): LoadingStateManager {
    if (!LoadingStateManager.instance) {
      LoadingStateManager.instance = new LoadingStateManager();
    }
    return LoadingStateManager.instance;
  }

  private notify() {
    this.listeners.forEach((listener) => listener(this.state));
  }

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  startLoading(message: string) {
    this.cleanup();
    this.state = {
      isLoading: true,
      message,
      progress: 0,
      error: null,
    };
    this.startProgressSimulation();
    this.notify();
  }

  private startProgressSimulation() {
    let progress = 0;
    this.progressInterval = window.setInterval(() => {
      progress += Math.random() * 10;
      if (progress > 90) {
        window.clearInterval(this.progressInterval);
        progress = 90;
      }
      this.updateProgress(progress);
    }, 1000);
  }

  stopLoading() {
    this.cleanup();
    this.state = {
      isLoading: false,
      message: "",
      progress: 100,
      error: null,
    };
    this.notify();
  }

  setError(error: Error) {
    this.cleanup();
    this.state = {
      ...this.state,
      isLoading: false,
      error,
      progress: 0,
    };
    this.notify();
  }

  private updateProgress(progress: number) {
    this.state.progress = Math.min(progress, 100);
    this.notify();
  }

  private cleanup() {
    if (this.progressInterval) {
      window.clearInterval(this.progressInterval);
    }
  }
}

export const loadingState = LoadingStateManager.getInstance();
