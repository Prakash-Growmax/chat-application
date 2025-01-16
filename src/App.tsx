import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { GlobalLoadingIndicator } from "@/components/layout/GlobalLoadingIndicator";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { useState } from "react";
import { BrowserRouter as Router } from "react-router-dom";
import AppRoutes from "./AppRoutes";
import AppContext from "./components/context/AppContext";

function App() {
  const [sideDrawerOpen, setSideDrawerOpen] = useState(false);
  const [openRight, setOpenRight] = useState(false);
  return (
    <ThemeProvider>
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppContext.Provider
              value={{
                sideDrawerOpen,
                setSideDrawerOpen,
                openRight,
                setOpenRight,
              }}
            >
              <div className="flex flex-col min-h-screen bg-gray-50">
                <AppRoutes />
                <Toaster />
                <GlobalLoadingIndicator />
              </div>
            </AppContext.Provider>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
