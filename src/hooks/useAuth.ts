import { useState, useEffect } from "react";

export const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check for token in localStorage or validate with API
    const token = localStorage.getItem("token");

    if (token) {
      // You might want to validate the token with your FastAPI backend
      setIsAuthenticated(true);
    }

    setIsLoading(false);
  }, []);

  return { isAuthenticated, isLoading, setIsAuthenticated };
};
