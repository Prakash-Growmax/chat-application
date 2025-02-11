/**
 * @file App.tsx
 * @description Root component of the application that sets up the main providers,
 * routing, and layout configuration. Handles responsive drawer sizing and initial
 * app loading states.
 */

import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppContext from "./components/context/AppContext";
import { drawerWidth } from "./constants/general.constant";
import { DrawerOpen_LocalKey } from "./constants/storage.constant";

// Types for drawer configuration and context
interface DrawerConfig {
  sideDrawerOpen: boolean;
  setSideDrawerOpen: (open: boolean) => void;
  sideDrawerWidth: number;
  MainLayout_MarginLeft: number;
}

// Initialize query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

/**
 * Root Application Component
 * Manages the application's global state and provider hierarchy
 */
function App() {
  // Initialize drawer state from localStorage or default to true
  const [sideDrawerOpen, setSideDrawerOpen] = useState(() => {
    const savedState = localStorage.getItem(DrawerOpen_LocalKey);
    return savedState ? JSON.parse(savedState) : true;
  });

  // Manage responsive drawer width
  const [sideDrawerWidth, setSideDrawerWidth] = useState<number>(drawerWidth);

  // Calculate main layout margin based on drawer width
  const MainLayout_MarginLeft = useMemo(
    () => sideDrawerWidth + 16,
    [sideDrawerWidth]
  );

  /**
   * Remove initial loading skeleton
   */
  useEffect(() => {
    const skeleton = document.querySelector(".chat-skeleton");
    if (skeleton) {
      skeleton.classList.add("hidden");
      setTimeout(() => {
        skeleton.remove();
      }, 300);
    }
  }, []);

  /**
   * Handle responsive drawer width calculations
   */
  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      setSideDrawerWidth(Math.max(width * 0.175, 200)); // Minimum width of 200px
    };

    updateWidth(); // Initial calculation
    window.addEventListener("resize", updateWidth);

    // Cleanup listener on component unmount
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

  // Memoize drawer configuration to prevent unnecessary re-renders
  const drawerConfig = useMemo<DrawerConfig>(
    () => ({
      sideDrawerOpen,
      setSideDrawerOpen,
      sideDrawerWidth,
      MainLayout_MarginLeft,
    }),
    [sideDrawerOpen, sideDrawerWidth, MainLayout_MarginLeft]
  );

  // Memoize router configuration
  const router = useMemo(
    () =>
      createBrowserRouter([
        {
          path: "*",
          element: (
            <div className="flex flex-col min-h-screen">
              <AppRoutes />
              <Toaster />
            </div>
          ),
        },
      ]),
    []
  );

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <QueryClientProvider client={queryClient}>
            <AppContext.Provider value={drawerConfig}>
              <RouterProvider router={router} />
            </AppContext.Provider>
          </QueryClientProvider>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
