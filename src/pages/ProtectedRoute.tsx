import { useAuth } from "@/hooks/useAuth";
import { Navigate } from "react-router-dom";
import MainLayout from "./Mainlayout";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export default function ProtectedRoute({ children }: ProtectedRouteProps) {
  const {
    user,
    // loading
  } = useAuth();
  //   const navigate = useNavigate();
  //   const location = useLocation();

  //   useEffect(() => {
  //     if (!loading && !user) {
  //       navigate("/login", {
  //         replace: true,
  //         state: { from: location },
  //       });
  //     }
  //   }, [user, loading, navigate, location]);

  //   if (loading) {
  //     return <LoadingScreen />;
  //   }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return <MainLayout>{children}</MainLayout>;
}
