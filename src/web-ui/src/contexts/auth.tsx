"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";
import { apiClient, User } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, kennitala: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const checkAuth = async () => {
      if (apiClient.isAuthenticated()) {
        try {
          const userData = await apiClient.getCurrentUser();
          setUser(userData);
        } catch {
          apiClient.clearTokens();
        }
      }
      setIsLoading(false);
    };

    checkAuth();

    // Listen for logout events (e.g., 401 responses)
    const handleLogout = () => {
      setUser(null);
    };

    window.addEventListener("auth:logout", handleLogout);
    return () => window.removeEventListener("auth:logout", handleLogout);
  }, []);

  const login = async (email: string, password: string) => {
    await apiClient.login(email, password);
    const userData = await apiClient.getCurrentUser();
    setUser(userData);
  };

  const register = async (email: string, password: string, kennitala: string) => {
    await apiClient.register({ email, password, kennitala });
    // Auto-login after registration
    await login(email, password);
  };

  const logout = () => {
    apiClient.clearTokens();
    setUser(null);
  };

  const getToken = (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem("access_token");
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        getToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
