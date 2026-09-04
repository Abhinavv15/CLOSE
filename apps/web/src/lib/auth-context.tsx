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
    name: "Abhinav Verma",
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

interface AuthContextType {
  user: UserProfile;
  personas: UserProfile[];
  switchPersona: (key: "controller" | "auditor" | "admin") => void;
  hasPermission: (permission: string) => boolean;
  isAuditor: boolean;
  isController: boolean;
  isAdmin: boolean;
  login: (key?: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = "close_auth_persona";

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [activePersonaKey, setActivePersonaKey] = useState<string>("controller");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      if (stored && PRESET_PERSONAS[stored]) {
        setActivePersonaKey(stored);
      }
    } catch {
      // localStorage may not be accessible in all contexts
    }
  }, []);

  const switchPersona = (key: "controller" | "auditor" | "admin") => {
    setActivePersonaKey(key);
    try {
      localStorage.setItem(AUTH_STORAGE_KEY, key);
    } catch {
      // ignore
    }
  };

  const login = (key: string = "controller") => {
    switchPersona(key as "controller" | "auditor" | "admin");
  };

  const logout = () => {
    switchPersona("controller");
  };

  const user = PRESET_PERSONAS[activePersonaKey] || PRESET_PERSONAS.controller;

  const hasPermission = (perm: string) => {
    return user.permissions.includes(perm);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        personas: Object.values(PRESET_PERSONAS),
        switchPersona,
        hasPermission,
        isAuditor: user.role === "AUDITOR",
        isController: user.role === "CONTROLLER",
        isAdmin: user.role === "ADMIN",
        login,
        logout,
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
