"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
} from "react";

export type UserRole = "admin" | "staff";

export interface AuthUser {
  role: UserRole;
  name: string;
  pin: string;
  loginTime: number;
}

export const ADMIN_PIN = "111111";
export const STAFF_PIN = "888888";

const STORAGE_KEY = "snowking_pos_auth_user";

interface AuthContextType {
  user: AuthUser | null;
  isAdmin: boolean;
  isStaff: boolean;
  isLoading: boolean;
  login: (pin: string) => { success: boolean; user?: AuthUser; error?: string };
  logout: () => void;
  elevateToAdmin: (adminPin: string) => boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored) as AuthUser;
        if (parsed && (parsed.role === "admin" || parsed.role === "staff")) {
          return parsed;
        }
      }
    } catch {
      // Ignore JSON parse errors
    }
    return null;
  });
  const isLoading = false;

  const login = useCallback((pin: string) => {
    if (pin === ADMIN_PIN) {
      const adminUser: AuthUser = {
        role: "admin",
        name: "ແອດມິນ (Admin)",
        pin: ADMIN_PIN,
        loginTime: Date.now(),
      };
      setUser(adminUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      } catch { }
      return { success: true, user: adminUser };
    }

    if (pin === STAFF_PIN) {
      const staffUser: AuthUser = {
        role: "staff",
        name: "ພະນັກງານ (Staff)",
        pin: STAFF_PIN,
        loginTime: Date.now(),
      };
      setUser(staffUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(staffUser));
      } catch { }
      return { success: true, user: staffUser };
    }

    return {
      success: false,
      error: "ລະຫັດຜ່ານບໍ່ຖືກຕ້ອງ! ກະລຸນາລອງໃໝ່ອີກຄັ້ງ",
    };
  }, []);

  const elevateToAdmin = useCallback((adminPin: string) => {
    if (adminPin === ADMIN_PIN) {
      const adminUser: AuthUser = {
        role: "admin",
        name: "ແອດມິນ (Admin)",
        pin: ADMIN_PIN,
        loginTime: Date.now(),
      };
      setUser(adminUser);
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(adminUser));
      } catch { }
      return true;
    }
    return false;
  }, []);

  const logout = useCallback(() => {
    setUser(null);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch { }
  }, []);

  const isAdmin = user?.role === "admin";
  const isStaff = user?.role === "staff";

  return (
    <AuthContext.Provider
      value={{
        user,
        isAdmin,
        isStaff,
        isLoading,
        login,
        logout,
        elevateToAdmin,
      }}
    >
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
