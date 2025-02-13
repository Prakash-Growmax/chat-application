import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import MainLayout from "./Mainlayout";
import ChatLayout from "./Chat/ChatWrapper/ChatLayout";
import LogoLoader from "@/components/Custom-UI/LogoLoader";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading, loadingSet } = useAuth();

  if (!user && !loading) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      {loadingSet ? (
        <>
         <div className="flex items-center justify-center min-h-screen">
  <LogoLoader className="w-20 h-20" />
</div>
        </>
      ) : (
        <ChatLayout>
          <MainLayout>{children}</MainLayout>
        </ChatLayout>
      )}
    </>
  );
}
