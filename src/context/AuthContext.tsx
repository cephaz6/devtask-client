import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "@/lib/api";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const logout = useCallback(() => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    navigate("/");
  }, [navigate]);

  const refreshUser = useCallback(async () => {
    try {
      const res = await api.get("/dashboard/user");
      setUser(res.data);
    } catch {
      logout();
    }
  }, [logout]);

  const restoreUser = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (token) {
      setAuthToken(token);
      try {
        await refreshUser();
      } catch {
        logout();
      }
    }
    setLoading(false);
  }, [refreshUser, logout]);

  useEffect(() => {
    restoreUser();
  }, [restoreUser]);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const { access_token } = res.data;

    localStorage.setItem("token", access_token);
    setAuthToken(access_token);
    await refreshUser();
    navigate("/dashboard");
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
