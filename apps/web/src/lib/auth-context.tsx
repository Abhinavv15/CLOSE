"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export type Role = "CONTROLLER" | "AUDITOR" | "ADMIN";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatar: string;
  company: string;
  company_id: string;
  permissions: string[];
}

export const PRESET_PERSONAS: Record<string, UserProfile> = {
  controller: {
    id: "usr_controller_01",
    name: "Abhinav V",
    email: "abhinav@democorp.internal",
    role: "CONTROLLER",
    title: "Senior Financial Controller",
    avatar: "AV",
    company: "Demo Technologies Pvt Ltd",
    company_id: "cmp_demo_001",
    permissions: [
      "reconciliation:run",
      "reconciliation:view",
      "exceptions:triage",
      "exceptions:approve",
      "exceptions:reject",
      "exceptions:investigate",
      "cash:view",
      "cash:forecast",
      "audit:view",
      "evaluation:view",
    ],
  },
  auditor: {
    id: "usr_auditor_02",
    name: "Sarah Jenkins",
    email: "sarah.auditor@kpmg-audit.internal",
    role: "AUDITOR",
    title: "Lead Statutory Auditor",
    avatar: "SJ",
    company: "KPMG Statutory Audit LLP",
    company_id: "cmp_audit_001",
    permissions: [
      "reconciliation:view",
      "exceptions:view",
      "cash:view",
      "audit:view",
      "audit:export",
      "evaluation:view",
    ],
  },
  admin: {
    id: "usr_admin_03",
    name: "Vikram Malhotra",
    email: "vikram.admin@democorp.internal",
    role: "ADMIN",
    title: "VP Finance Operations",
    avatar: "VM",
    company: "Demo Technologies Pvt Ltd",
    company_id: "cmp_demo_001",
    permissions: [
      "reconciliation:run",
      "reconciliation:view",
      "exceptions:triage",
      "exceptions:approve",
      "exceptions:reject",
      "cash:view",
      "cash:forecast",
      "audit:view",
      "audit:export",
      "evaluation:view",
      "system:configure",
      "data:seed",
    ],
  },
};

import { api } from "@/lib/api";

export interface AuthContextType {
  user: UserProfile;
  personas: UserProfile[];
  switchPersona: (key: "controller" | "auditor" | "admin") => Promise<void>;
  hasPermission: (permission: string) => boolean;
  isAuditor: boolean;
  isController: boolean;
  isAdmin: boolean;
  login: (credentials?: { email?: string; password?: string; persona_key?: string } | string) => Promise<void>;
  logout: () => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "close_auth_persona";
const AUTH_TOKEN_KEY = "close_auth_token";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<UserProfile>(PRESET_PERSONAS.controller);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Restore authenticated session from PostgreSQL via JWT token
  useEffect(() => {
    async function restoreSession() {
      try {
        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (token) {
          const profile = await api.getMe(token);
          if (profile && profile.email) {
            setCurrentUser(profile);
            setLoading(false);
            return;
          }
        }
        
        // Fallback to saved persona
        const savedPersona = localStorage.getItem(AUTH_STORAGE_KEY);
        if (savedPersona && PRESET_PERSONAS[savedPersona]) {
          setCurrentUser(PRESET_PERSONAS[savedPersona]);
        }
      } catch {
        // Safe default
      } finally {
        setLoading(false);
      }
    }
    restoreSession();
  }, []);

  const login = async (credentials?: { email?: string; password?: string; persona_key?: string } | string) => {
    setError(null);
    setLoading(true);
    try {
      let payload: { email?: string; password?: string; persona_key?: string } = {};
      if (typeof credentials === "string") {
        payload = { persona_key: credentials };
      } else if (credentials) {
        payload = credentials;
      } else {
        payload = { persona_key: "controller" };
      }

      const res = await api.login(payload);
      if (res && res.token) {
        localStorage.setItem(AUTH_TOKEN_KEY, res.token);
        if (payload.persona_key) {
          localStorage.setItem(AUTH_STORAGE_KEY, payload.persona_key);
        }
        setCurrentUser(res.user);
      }
    } catch (err: any) {
      setError(err?.message || "Invalid corporate credentials");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const switchPersona = async (key: "controller" | "auditor" | "admin") => {
    try {
      await login({ persona_key: key });
    } catch {
      // Fallback
      if (PRESET_PERSONAS[key]) {
        setCurrentUser(PRESET_PERSONAS[key]);
        localStorage.setItem(AUTH_STORAGE_KEY, key);
      }
    }
  };

  const logout = async () => {
    try {
      await api.logout();
    } catch {}
    localStorage.removeItem(AUTH_TOKEN_KEY);
    localStorage.removeItem(AUTH_STORAGE_KEY);
    setCurrentUser(PRESET_PERSONAS.controller);
  };

  const hasPermission = (perm: string) => {
    return (currentUser.permissions || []).includes(perm);
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentUser,
        personas: Object.values(PRESET_PERSONAS),
        switchPersona,
        hasPermission,
        isAuditor: currentUser.role === "AUDITOR",
        isController: currentUser.role === "CONTROLLER",
        isAdmin: currentUser.role === "ADMIN",
        login,
        logout,
        loading,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    return {
      user: PRESET_PERSONAS.controller,
      personas: Object.values(PRESET_PERSONAS),
      switchPersona: () => {},
      hasPermission: () => true,
      isAuditor: false,
      isController: true,
      isAdmin: false,
      login: () => {},
      logout: () => {},
    };
  }
  return context;
}

