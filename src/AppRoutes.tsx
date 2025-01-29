import { Route, Routes } from "react-router-dom";
import Chat from "./components/ChatNew/Chat";
import Team from "./components/Teams/Team";
import LoginPage from "./pages/auth/LoginPage";
import CancelPayment from "./pages/Cancel-Payment/CancelPayment";
import ChatLayout from "./pages/Chat/ChatWrapper/ChatLayout";
import NewChat from "./pages/Chat/NewChat/NewChat";
import NotFoundPage from "./pages/error/NotFoundPage";
import WelcomePage from "./pages/home/WelcomePage";
import InviteAcceptedPage from "./pages/InviteAcceptedPage";
import SuccessPayment from "./pages/Payments/SuccessPayment";
import PlansPage from "./pages/plans/PlansPage";
import ProtectedRoute from "./pages/ProtectedRoute";
import SettingsPage from "./pages/settings/SettingsPage";

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<WelcomePage />} />
      <Route
        path="/chat/new"
        element={
          <ProtectedRoute>
          
              <NewChat />
          
          </ProtectedRoute>
        }
      />

      <Route
        path="/chat/:id"
        element={
     
          <ProtectedRoute>
       
       <Chat />
       
          </ProtectedRoute>
       
        }
      />

      <Route path="/login" element={<LoginPage />} />

      {/* Protected Routes */}

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
  );
};

export default AppRoutes;
