import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import MainLayout from "./Mainlayout";
import ChatLayout from "./Chat/ChatWrapper/ChatLayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  return <ChatLayout><MainLayout>{children}</MainLayout></ChatLayout> ;
}
