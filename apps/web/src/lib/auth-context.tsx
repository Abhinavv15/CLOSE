"use client";

import React, { createContext, useContext } from "react";

export type Role = "CONTROLLER";

export interface CompanyProfile {
  id: string;
  name: string;
  email: string;
  role: Role;
  title: string;
  avatar: string;
  company: string;
  company_id: string;
  legalEntity: string;
  jurisdiction: string;
  fiscalYear: string;
  currency: string;
  tier: string;
  permissions: string[];
}

export type UserProfile = CompanyProfile;

export const COMPANY_WORKSPACE: CompanyProfile = {
  id: "org_enterprise_01",
  name: "Corporate Finance",
  email: "finance-team@democorp.internal",
  role: "CONTROLLER",
  title: "Enterprise Finance Workspace",
  avatar: "CO",
  company: "Demo Technologies Inc.",
  company_id: "cmp_demo_001",
  legalEntity: "Demo Technologies Inc. (Delaware C-Corp)",
  jurisdiction: "United States (SEC Regulated)",
  fiscalYear: "FY 2026",
  currency: "USD ($)",
  tier: "Institutional Enterprise",
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
    "audit:export",
    "evaluation:view",
    "system:configure",
    "data:seed",
  ],
};

export const PRESET_PERSONAS: Record<string, CompanyProfile> = {
  company: COMPANY_WORKSPACE,
};

export interface AuthContextType {
  user: CompanyProfile;
  company: CompanyProfile;
  personas: CompanyProfile[];
  hasPermission: (permission: string) => boolean;
  isAuditor: boolean;
  isController: boolean;
  isAdmin: boolean;
  login: () => Promise<void>;
  logout: () => Promise<void>;
  switchPersona: (key?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: COMPANY_WORKSPACE,
  company: COMPANY_WORKSPACE,
  personas: [COMPANY_WORKSPACE],
  hasPermission: () => true,
  isAuditor: false,
  isController: true,
  isAdmin: true,
  login: async () => {},
  logout: async () => {},
  switchPersona: async () => {},
  loading: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  return (
    <AuthContext.Provider
      value={{
        user: COMPANY_WORKSPACE,
        company: COMPANY_WORKSPACE,
        personas: [COMPANY_WORKSPACE],
        hasPermission: () => true,
        isAuditor: false,
        isController: true,
        isAdmin: true,
        login: async () => {},
        logout: async () => {},
        switchPersona: async () => {},
        loading: false,
        error: null,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}


