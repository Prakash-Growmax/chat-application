import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { GlobalLoadingIndicator } from "@/components/layout/GlobalLoadingIndicator";
import { Header } from "@/components/layout/Header";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { LoginPage } from "@/pages/auth/LoginPage";
import { NotFoundPage } from "@/pages/error/NotFoundPage";
import { WelcomePage } from "@/pages/home/WelcomePage";
import { PlansPage } from "@/pages/plans/PlansPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { Suspense, lazy, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import Chat from "./components/ChatNew/Chat";
import RecentChat from "./components/ChatNew/RecentChat";
import Team from "./components/Teams/Team";
import AppContext from "./components/context/AppContext";
import Sidebar from "./components/ui/sidebar";
import InviteAcceptedPage from "./pages/InviteAcceptedPage";

const AuthWrapper = lazy(() => import("@/components/auth/AuthWrapper"));
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));

function App() {
  const [open, setOpen] = useState(false);
  const [openRight, setOpenRight] = useState(false);

  return (
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <ErrorBoundary>
        <AuthProvider>
          <Router>
            <AppContext.Provider
              value={{
                open,
                setOpen,
                openRight,
                setOpenRight,
              }}
            >
              <div className="flex flex-col ">
                <div className="fixed h-18 top-0 left-0 w-full z-50">
                  <Header />
                </div>
                <div className="flex">
                  <Sidebar />
                </div>
                {/* Scrollable Content */}
                <div className="flex-1 min-h-screen">
                  <Suspense fallback={<LoadingScreen />}>
                    <main className="min-h-screen">
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
                          path="/chat"
                          element={
                            <ProtectedRoute>
                              <Chat />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/accept-invite"
                          element={
                            <ProtectedRoute>
                              <InviteAcceptedPage />
                            </ProtectedRoute>
                          }
                        />
                        <Route
                          path="/chat/:id"
                          element={
                            <ProtectedRoute>
                              <RecentChat />
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
                </div>

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
