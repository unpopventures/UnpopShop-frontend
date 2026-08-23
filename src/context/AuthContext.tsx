import { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { api } from "../api/client";
import { User } from "../types";

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  registerBuyer: (data: any) => Promise<User>;
  registerManufacturer: (data: any) => Promise<User>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  async function refreshUser() {
    const token = localStorage.getItem("unpop_token");
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const res = await api.me();
      setUser(res.data.user);
    } catch {
      localStorage.removeItem("unpop_token");
      localStorage.removeItem("unpop_user");
      setUser(null);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    refreshUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function persist(token: string, u: User) {
    localStorage.setItem("unpop_token", token);
    localStorage.setItem("unpop_user", JSON.stringify(u));
    setUser(u);
  }

  async function login(email: string, password: string) {
    const res = await api.login({ email, password });
    persist(res.data.token, res.data.user);
    return res.data.user as User;
  }

  async function registerBuyer(data: any) {
    const res = await api.registerBuyer(data);
    persist(res.data.token, res.data.user);
    return res.data.user as User;
  }

  async function registerManufacturer(data: any) {
    const res = await api.registerManufacturer(data);
    persist(res.data.token, res.data.user);
    return res.data.user as User;
  }

  function logout() {
    localStorage.removeItem("unpop_token");
    localStorage.removeItem("unpop_user");
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, registerBuyer, registerManufacturer, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}
