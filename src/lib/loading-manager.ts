import { toast } from "sonner";

interface LoadingState {
  isLoading: boolean;
  error: Error | null;
  progress: number;
  message: string;
}

class LoadingManager {
  private static instance: LoadingManager;
  private listeners: Set<(state: LoadingState) => void>;
  private state: LoadingState;
  private timeoutId?: number;
  private retryCount: number;
  private maxRetries: number;

  private constructor() {
    this.listeners = new Set();
    this.state = {
      isLoading: false,
      error: null,
      progress: 0,
      message: "Loading...",
    };
    this.retryCount = 0;
    this.maxRetries = 3;
  }

  static getInstance(): LoadingManager {
    if (!LoadingManager.instance) {
      LoadingManager.instance = new LoadingManager();
    }
    return LoadingManager.instance;
  }

  subscribe(listener: (state: LoadingState) => void): () => void {
    this.listeners.add(listener);
    listener(this.state);
    return () => this.listeners.delete(listener);
  }

  private notify(): void {
    this.listeners.forEach((listener) => listener(this.state));
  }

  startLoading(message?: string): void {
    if (message) {
      this.state.message = message;
    }
    this.state.isLoading = true;
    this.state.error = null;
    this.state.progress = 0;
    this.notify();

    this.startProgressSimulation();
    this.setupTimeout();
  }

  private startProgressSimulation(): void {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) {
        clearInterval(interval);
        progress = 90;
      }
      this.updateProgress(progress);
    }, 500);
  }

  private setupTimeout(): void {
    this.clearTimeout();
    this.timeoutId = window.setTimeout(() => {
      if (this.retryCount < this.maxRetries) {
        this.retry();
      } else {
        this.handleTimeout();
      }
    }, 10000);
  }

  private retry(): void {
    this.retryCount++;
    toast.warning(
      `Loading taking longer than expected. Retrying... (${this.retryCount}/${this.maxRetries})`
    );
    this.setupTimeout();
  }

  private handleTimeout(): void {
    this.state.error = new Error("Loading timed out");
    toast.error("Loading timed out. Please refresh the page.");
    this.stopLoading();
  }

  stopLoading(): void {
    this.clearTimeout();
    this.state.isLoading = false;
    this.state.progress = 100;
    this.retryCount = 0;
    this.notify();
  }

  private clearTimeout(): void {
    if (this.timeoutId) {
      window.clearTimeout(this.timeoutId);
    }
  }

  updateProgress(progress: number): void {
    this.state.progress = Math.min(progress, 100);
    this.notify();
  }

  setError(error: Error): void {
    this.state.error = error;
    this.stopLoading();
    this.notify();
  }
}

export const loadingManager = LoadingManager.getInstance();
