import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { GlobalLoadingIndicator } from "@/components/layout/GlobalLoadingIndicator";
import { Header } from "@/components/layout/Header";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { LoginPage } from "@/pages/auth/LoginPage";
import { DashboardPage } from "@/pages/dashboard/DashboardPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { WelcomePage } from "@/pages/home/WelcomePage";
import { PlansPage } from "@/pages/plans/PlansPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { Suspense, lazy } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Team from "./components/Teams/Team";

const AuthWrapper = lazy(() => import("@/components/auth/AuthWrapper"));
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));

function App() {
  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <div className="min-h-screen bg-background">
              <Header />
              <Suspense fallback={<LoadingScreen />}>
                <main>
                  <Routes>
                    <Route
                      path="/login"
                      element={
                        <AuthWrapper>
                          <LoginPage />
                        </AuthWrapper>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <ProtectedRoute>
                          <DashboardPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/teams"
                      element={
                        <ProtectedRoute>
                          <Team />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/plans"
                      element={
                        <ProtectedRoute>
                          <PlansPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/settings"
                      element={
                        <ProtectedRoute>
                          <SettingsPage />
                        </ProtectedRoute>
                      }
                    />
                    <Route
                      path="/"
                      element={
                        <AuthWrapper>
                          <WelcomePage />
                        </AuthWrapper>
                      }
                    />
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </main>
              </Suspense>
              <Toaster />
              <GlobalLoadingIndicator />
            </div>
          </Router>
        </AuthProvider>
      </ErrorBoundary>
    </ThemeProvider>
  );
}

export default App;
