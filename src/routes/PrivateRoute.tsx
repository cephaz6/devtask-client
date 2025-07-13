import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/context/AuthContext"; // Adjust path as needed
import LoadingSpinner from "@/components/layout/LoadingSpinner";

interface PrivateRouteProps {
  children: React.ReactNode;
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children }) => {
  const { user, loading } = useAuth();

  // If the authentication status is still being determined, show a loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // If not loading and no user is found (meaning not authenticated), redirect to the login page
  if (!user) {
    // Using 'replace' prevents the user from navigating back to a protected page after logout
    return <Navigate to="/" replace />;
  }

  // If loading is false and a user is found, render the children (the protected component/layout)
  return <>{children}</>;
};

export default PrivateRoute;
