import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";
import api, { setAuthToken } from "@/lib/api";
import type { User } from "@/types";

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // ✅ Restore user on app load
  useEffect(() => {
    const restoreUser = async () => {
      const token = localStorage.getItem("token");

      if (token) {
        try {
          setAuthToken(token); // attach to axios
          const res = await api.get("/dashboard/user");
          setUser(res.data);
        } catch (err) {
          console.error("Session restoration failed", err);
          logout(false); // 👈 prevent redirect on load
        }
      }

      setLoading(false); // ✅ done checking
    };

    restoreUser();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const { access_token } = res.data;

      localStorage.setItem("token", access_token);
      setAuthToken(access_token);

      const userRes = await api.get("/dashboard/user");
      setUser(userRes.data);

      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed", err);
      throw err;
    }
  };

  const logout = (redirect: boolean = true) => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    if (redirect) navigate("/");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
