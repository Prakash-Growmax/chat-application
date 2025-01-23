import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppContext from "./components/context/AppContext";
import { drawerWidth } from "./constants/general.constant";
import { DrawerOpen_LocalKey } from "./constants/storage.constant";

const queryClient = new QueryClient();

const drawerState = localStorage.getItem(DrawerOpen_LocalKey);
function App() {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(
    drawerState ? JSON.parse(drawerState) : true
  );
  const [sideDrawerWidth, setSideDrawerWidth] = useState<number>(drawerWidth);
  const MainLayout_MarginLeft = sideDrawerWidth + 16;

  useEffect(() => {
    const updateWidth = () => {
      const width = window.innerWidth;
      setSideDrawerWidth(width * 0.175);
    };

    updateWidth();
    window.addEventListener("resize", updateWidth);
    return () => window.removeEventListener("resize", updateWidth);
  }, []);

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
                  sideDrawerWidth,
                  MainLayout_MarginLeft,
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
