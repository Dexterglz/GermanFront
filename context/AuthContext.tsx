"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { User } from "@/types/user";
import { login as loginService } from "@/lib/auth";

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => User;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");

    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = (email: string, password: string) => {
    const loggedUser = loginService(email, password);

    localStorage.setItem("user", JSON.stringify(loggedUser));
    setUser(loggedUser);

    return loggedUser;
  };

  const logout = () => {
  setUser(null);
  localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}