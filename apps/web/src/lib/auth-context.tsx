"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

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

export const DEFAULT_COMPANY: CompanyProfile = {
  id: "org_enterprise_01",
  name: "Corporate Finance",
  email: "controller@demotechnologies.internal",
  role: "CONTROLLER",
  title: "Enterprise Autonomous Controller",
  avatar: "DT",
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
  company: DEFAULT_COMPANY,
};

export interface AuthContextType {
  user: CompanyProfile;
  company: CompanyProfile;
  personas: CompanyProfile[];
  isAuthenticated: boolean;
  hasPermission: (permission: string) => boolean;
  isAuditor: boolean;
  isController: boolean;
  isAdmin: boolean;
  login: (credentials?: { company?: string; email?: string; password?: string }) => Promise<void>;
  signup: (details: { company: string; email: string; legalEntity?: string; currency?: string; password?: string }) => Promise<void>;
  logout: () => Promise<void>;
  switchPersona: (key?: string) => Promise<void>;
  loading: boolean;
  error: string | null;
}

const AuthContext = createContext<AuthContextType>({
  user: DEFAULT_COMPANY,
  company: DEFAULT_COMPANY,
  personas: [DEFAULT_COMPANY],
  isAuthenticated: true,
  hasPermission: () => true,
  isAuditor: false,
  isController: true,
  isAdmin: true,
  login: async () => {},
  signup: async () => {},
  logout: async () => {},
  switchPersona: async () => {},
  loading: false,
  error: null,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [currentCompany, setCurrentCompany] = useState<CompanyProfile>(DEFAULT_COMPANY);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const savedAuth = localStorage.getItem("close_auth_status");
      if (savedAuth === "logged_out") {
        setIsAuthenticated(false);
      } else {
        setIsAuthenticated(true);
      }

      const savedCompany = localStorage.getItem("close_company_profile");
      if (savedCompany) {
        setCurrentCompany(JSON.parse(savedCompany));
      }
    } catch {}
  }, []);

  const login = async (credentials?: { company?: string; email?: string; password?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const companyName = credentials?.company?.trim() || "Demo Technologies Inc.";
      const updated: CompanyProfile = {
        ...DEFAULT_COMPANY,
        company: companyName,
        legalEntity: `${companyName} (Delaware C-Corp)`,
        email: credentials?.email?.trim() || "controller@demotechnologies.internal",
        avatar: companyName.slice(0, 2).toUpperCase(),
      };
      setCurrentCompany(updated);
      setIsAuthenticated(true);
      localStorage.setItem("close_auth_status", "logged_in");
      localStorage.setItem("close_company_profile", JSON.stringify(updated));
    } catch (err: any) {
      setError(err?.message || "Failed to authenticate workspace.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signup = async (details: { company: string; email: string; legalEntity?: string; currency?: string; password?: string }) => {
    setLoading(true);
    setError(null);
    try {
      const name = details.company.trim() || "New Company Inc.";
      const newProfile: CompanyProfile = {
        ...DEFAULT_COMPANY,
        id: `org_${Date.now()}`,
        company: name,
        legalEntity: details.legalEntity || `${name} (Institutional Entity)`,
        email: details.email.trim(),
        currency: details.currency || "USD ($)",
        avatar: name.slice(0, 2).toUpperCase(),
      };
      setCurrentCompany(newProfile);
      setIsAuthenticated(true);
      localStorage.setItem("close_auth_status", "logged_in");
      localStorage.setItem("close_company_profile", JSON.stringify(newProfile));
    } catch (err: any) {
      setError(err?.message || "Failed to create corporate workspace.");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setIsAuthenticated(false);
    localStorage.setItem("close_auth_status", "logged_out");
  };

  return (
    <AuthContext.Provider
      value={{
        user: currentCompany,
        company: currentCompany,
        personas: [currentCompany],
        isAuthenticated,
        hasPermission: () => true,
        isAuditor: false,
        isController: true,
        isAdmin: true,
        login,
        signup,
        logout,
        switchPersona: async () => {},
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
  return context;
}



