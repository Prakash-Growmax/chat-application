import { lazy, Suspense } from "react";
import { Route, Routes } from "react-router-dom";
import ProtectedRoute from "./pages/ProtectedRoute"; // ✅ Keep it simple

const Chat = lazy(() => import("./components/ChatNew/Chat"));
const Team = lazy(() => import("./components/Teams/Team"));
const LoginPage = lazy(() => import("./pages/auth/LoginPage"));
const CancelPayment = lazy(() => import("./pages/Cancel-Payment/CancelPayment"));
const ChatLayout = lazy(() => import("./pages/Chat/ChatWrapper/ChatLayout"));
const NewChat = lazy(() => import("./pages/Chat/NewChat/NewChat"));
const NotFoundPage = lazy(() => import("./pages/error/NotFoundPage"));
const WelcomePage = lazy(() => import("./pages/home/WelcomePage"));
const InviteAcceptedPage = lazy(() => import("./pages/InviteAcceptedPage"));
const SuccessPayment = lazy(() => import("./pages/Payments/SuccessPayment"));
const PlansPage = lazy(() => import("./pages/plans/PlansPage"));
const SettingsPage = lazy(() => import("./pages/settings/SettingsPage"));

const AppRoutes = () => {
  return (
    <Suspense>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<WelcomePage />} />
        <Route path="/login" element={<LoginPage />} />

        {/* Protected Routes */}
        <Route
          path="/chat/new"
          element={
            <ProtectedRoute>
              <ChatLayout>
              <NewChat />
              </ChatLayout>
          
            </ProtectedRoute>
          }
        />
        <Route
          path="/chat/:id"
          element={
            <ProtectedRoute>
              <ChatLayout>
              <Chat /> 
              </ChatLayout>
           
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
