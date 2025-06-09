import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext";
import type { ReactNode } from "react";

type PrivateRouteProps = {
  children: ReactNode;
};

const PrivateRoute = ({ children }: PrivateRouteProps) => {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default PrivateRoute;
