"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { setAuthToken } from "@/lib/api";

interface AuthContextType {
  user: { userId: number; role: string } | null;
  isAuthenticated: boolean;
  login: (token: string, userId: number, role: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<{ userId: number; role: string } | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        setUser({ userId: payload.user_id, role: payload.role });
        setIsAuthenticated(true);
        setAuthToken(token);
      } catch (err) {
        console.error("Invalid token:", err);
        localStorage.removeItem("token");
        setIsAuthenticated(false);
        setUser(null);
      }
    }
  }, []);

  const login = (token: string, userId: number, role: string) => {
    localStorage.setItem("token", token);
    setAuthToken(token);
    setUser({ userId, role });
    setIsAuthenticated(true);
    toast.success("Logged in successfully!");
    router.push("/dashboard");
  };

  const logout = () => {
    localStorage.removeItem("token");
    setAuthToken(null);
    setUser(null);
    setIsAuthenticated(false);
    toast.success("Logged out successfully!");
    router.push("/");
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}