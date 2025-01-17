import { Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ChatSection from "./components/layout/ChatSection/ChatSection";
import { LoadingScreen } from "./components/layout/LoadingScreen";
import Team from "./components/Teams/Team";
import LoginPage from "./pages/auth/LoginPage";
import CancelPayment from "./pages/Cancel-Payment/CancelPayment";
import NotFoundPage from "./pages/error/NotFoundPage";
import WelcomePage from "./pages/home/WelcomePage";
import InviteAcceptedPage from "./pages/InviteAcceptedPage";
import SuccessPayment from "./pages/Payments/SuccessPayment";
import PlansPage from "./pages/plans/PlansPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import PublicLayout from "./pages/PublicRoutes";
import SettingsPage from "./pages/settings/SettingsPage";

const AppRoutes = () => {
  return (
    <Suspense fallback={<LoadingScreen />}>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={
            <PublicLayout>
              <LoginPage />
            </PublicLayout>
          }
        />
        <Route path="/" element={<WelcomePage />} />

        {/* Protected Routes */}
        <Route
          path="/chat/:id?"
          element={
            <ProtectedRoute>
              <ChatSection />
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
          path="/accept-invite"
          element={
            <ProtectedRoute>
              <InviteAcceptedPage />
            </ProtectedRoute>
          }
        />

        {/* Payment Routes */}
        <Route path="/success" element={<SuccessPayment />} />
        <Route path="/cancel" element={<CancelPayment />} />

        {/* 404 Route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </Suspense>
  );
};

export default AppRoutes;
