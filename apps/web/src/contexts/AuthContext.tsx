import { createContext, useContext, useState, ReactNode } from "react";

interface User {
  id: string;
  name: string;
  email: string;
  roleCodes: string[];
  permissions: string[];
}

interface AuthContextType {
  token: string | null;
  user: User | null;
  login: (token: string, user: User) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [token, setToken] = useState<string | null>(localStorage.getItem("sd_token"));
  const [user, setUser] = useState<User | null>(() => {
    const raw = localStorage.getItem("sd_user");
    return raw ? JSON.parse(raw) : null;
  });

  const login = (t: string, u: User) => {
    setToken(t);
    setUser(u);
    localStorage.setItem("sd_token", t);
    localStorage.setItem("sd_user", JSON.stringify(u));
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("sd_token");
    localStorage.removeItem("sd_user");
  };

  return <AuthContext.Provider value={{ token, user, login, logout }}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
