import { ErrorBoundary } from "@/components/layout/ErrorBoundary";
import { GlobalLoadingIndicator } from "@/components/layout/GlobalLoadingIndicator";
import { Header } from "@/components/layout/Header";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/theme-provider";
import { Suspense, lazy, useState } from "react";
import { Route, BrowserRouter as Router, Routes } from "react-router-dom";
import AppContext from "./components/context/AppContext";
import Sidebar from "./components/ui/sidebar";
import CancelPayment from "./pages/Cancel-Payment/CancelPayment";
import SuccessPayment from "./pages/Payments/SuccessPayment";

// Lazy load all major components
const AuthWrapper = lazy(() => import("@/components/auth/AuthWrapper"));
const ProtectedRoute = lazy(() => import("@/components/auth/ProtectedRoute"));
const LoginPage = lazy(() => import("@/pages/auth/LoginPage"));
const NotFoundPage = lazy(() => import("@/pages/error/NotFoundPage"));
const WelcomePage = lazy(() => import("@/pages/home/WelcomePage"));
const PlansPage = lazy(() => import("@/pages/plans/PlansPage"));
const SettingsPage = lazy(() => import("@/pages/settings/SettingsPage"));
const Chat = lazy(() => import("./components/ChatNew/Chat"));
const RecentChat = lazy(() => import("./components/ChatNew/RecentChat"));
const Team = lazy(() => import("./components/Teams/Team"));
const InviteAcceptedPage = lazy(() => import("./pages/InviteAcceptedPage"));
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
                <div>
                  <Sidebar/>
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
                        <Route path="/cancel" element={<CancelPayment />} />
                        <Route path="/success" element={<SuccessPayment />} />
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
