import { Navigate, Outlet } from "react-router";
import { useAuth } from "@/contexts/Autetication";

type UserRole = "admin" | "funcionario" | "aluno";

interface PrivateRouteProps {
  requiredRole?: UserRole[];
}

export const PrivateRoute = ({ requiredRole }: PrivateRouteProps) => {
  const { loading } = useAuth();
  
  if (loading) return <p>Carregando...</p>;

  // if (!user) return <Navigate to="/auth/entrar" replace />;

  if (requiredRole && !requiredRole.includes("admin")) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};
