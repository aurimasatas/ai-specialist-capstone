import React, { createContext, useContext, useState } from "react";

export interface User {
  id: string;
  name: string;
  email: string;
  giftPoints: number;
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

// Demo credentials are read from env vars so no secrets are committed.
// Vite exposes variables prefixed with VITE_ at build time.
// Defaults match the .env.example values for local development.
const DEMO_PASS_1 = import.meta.env.VITE_DEMO_PASS_1 ?? "changeme1";
const DEMO_PASS_2 = import.meta.env.VITE_DEMO_PASS_2 ?? "changeme2";

const MOCK_USERS: (User & { password: string })[] = [
  { id: "u1", name: "Alex Johnson", email: "alex@bookstore.com", password: DEMO_PASS_1, giftPoints: 500 },
  { id: "u2", name: "Sam Lee", email: "sam@bookstore.com", password: DEMO_PASS_2, giftPoints: 250 },
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    try {
      const raw = localStorage.getItem("bookstore_user");
      if (raw) {
        const user = JSON.parse(raw);
        return { user, isAuthenticated: true };
      }
    } catch {
      // ignore
    }
    return { user: null, isAuthenticated: false };
  });

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate async API call
    await new Promise((r) => setTimeout(r, 600));
    const found = MOCK_USERS.find(
      (u) => u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );
    if (found) {
      const { password: _pw, ...user } = found;
      localStorage.setItem("bookstore_user", JSON.stringify(user));
      setState({ user, isAuthenticated: true });
      return true;
    }
    return false;
  };

  const logout = () => {
    localStorage.removeItem("bookstore_user");
    setState({ user: null, isAuthenticated: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
