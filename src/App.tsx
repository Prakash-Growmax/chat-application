import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppContext from "./components/context/AppContext";
import { DrawerOpen_LocalKey } from "./constants/storage.constant";

const queryClient = new QueryClient();

function App() {
  const drawerState = localStorage.getItem(DrawerOpen_LocalKey);
  const [sideDrawerOpen, setSideDrawerOpen] = useState(
    drawerState ? JSON.parse(drawerState) : true
  );

  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <QueryClientProvider client={queryClient}>
              <AppContext.Provider
                value={{
                  sideDrawerOpen,
                  setSideDrawerOpen,
                }}
              >
                <div className="flex flex-col min-h-screen">
                  <AppRoutes />
                  <Toaster />
                </div>
              </AppContext.Provider>
            </QueryClientProvider>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
