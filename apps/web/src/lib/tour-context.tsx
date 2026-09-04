"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

export interface TourStep {
  id: string;
  stepNumber: number;
  badge: string;
  title: string;
  path: string;
  pageName: string;
  description: string;
  keyPoints: string[];
  proTip: string;
}

export const TOUR_STEPS: TourStep[] = [
  {
    id: "overview",
    stepNumber: 1,
    badge: "01 / 07 • ARCHITECTURE",
    pageName: "Landing Page & Philosophy",
    title: "Deterministic Core + AI Reasoning",
    path: "/",
    description:
      "LLMs fail at accounting arithmetic. CLOSE separates provable math (deterministic code) from qualitative investigation (autonomous AI).",
    keyPoints: [
      "0.0% math errors via Decimal(18, 4) arithmetic",
      "Sub-100ms deterministic speed across 4 sources",
      "Honest Failure: refuses to guess when unsure",
    ],
    proTip: "Click Next to view statement ingestion.",
  },
  {
    id: "batches",
    stepNumber: 2,
    badge: "02 / 07 • INGESTION DECK",
    pageName: "Statement Ingestion (/batches)",
    title: "Multi-Source Statement Ingestion",
    path: "/batches",
    description:
      "Connects Bank, Processor (Stripe/Razorpay), ERP Ledger, and Customer Invoices into a unified reconciliation graph.",
    keyPoints: [
      "127 canonical demo transactions with ground-truth links",
      "Drag-and-drop CSV upload with live schema checks",
      "Automatic reference & currency normalization",
    ],
    proTip: "Notice how processor net payouts align with bank deposits.",
  },
  {
    id: "reconciliation",
    stepNumber: 3,
    badge: "03 / 07 • MATCHING ENGINE",
    pageName: "Reconciliation Matrix (/reconciliation)",
    title: "5-Pass Deterministic Matching",
    path: "/reconciliation",
    description:
      "Executes 5 mathematical passes: Duplicate Guard, Exact Reference Hash, Fee Deduction, Timing Window, and Split Aggregation.",
    keyPoints: [
      "116 records matched in 0.08 seconds",
      "Strict Gross - Fee = Net settlement proof",
      "Filter by Pass 1 to 5 to inspect specific rules",
    ],
    proTip: "Filter by Pass 3 to inspect Stripe fee offsets.",
  },
  {
    id: "exceptions",
    stepNumber: 4,
    badge: "04 / 07 • AI TRIAGE",
    pageName: "Exception Triage (/exceptions)",
    title: "Autonomous AI Exception Triage",
    path: "/exceptions",
    description:
      "When math doesn't match, an autonomous AI investigator queries ledger history and fee contracts to determine root causes.",
    keyPoints: [
      "EX-102: Proves ₹50 Stripe interchange fee variance",
      "EX-108: Refuses to decide without evidence (Honest Failure)",
      "1-Click controller approval and audit sign-off",
    ],
    proTip: "Click on EX-102 to view the agent's tool-execution trace.",
  },
  {
    id: "cash-position",
    stepNumber: 5,
    badge: "05 / 07 • LIQUIDITY CURVE",
    pageName: "Forward Cash Forecast (/cash-position)",
    title: "30-Day Forward Cash Forecast",
    path: "/cash-position",
    description:
      "Reconciled entries build a 30-day liquidity curve, tracking invoice receivables against scheduled bills and payroll.",
    keyPoints: [
      "Real-time cash runway with safety floor alerts",
      "Automated ₹2.4M payroll dip buffer detection",
      "Interactive stress test: Toggle Scenario A",
    ],
    proTip: "Click Scenario A to simulate customer payment delays.",
  },
  {
    id: "evaluation",
    stepNumber: 6,
    badge: "06 / 07 • BENCHMARKS",
    pageName: "Ground-Truth Scorecard (/evaluation)",
    title: "Ground-Truth Benchmark Scorecard",
    path: "/evaluation",
    description:
      "Evaluates matching and AI resolution against hidden ground-truth labels for institutional safety and precision.",
    keyPoints: [
      "96.6% Precision & 96.5% Recall (F1: 96.55%)",
      "98.7% AI Auto-Resolution Precision (<1.5% Error)",
      "0.0% arithmetic hallucination rate",
    ],
    proTip: "Scroll down to view the Honest Breakdown of unresolved items.",
  },
  {
    id: "audit-log",
    stepNumber: 7,
    badge: "07 / 07 • COMPLIANCE",
    pageName: "Merkle Audit Trail (/audit-log)",
    title: "SHA-256 Merkle Audit Trail",
    path: "/audit-log",
    description:
      "Every match, triage decision, and approval is sealed in an append-only SHA-256 Merkle chain for external auditors.",
    keyPoints: [
      "Cryptographic block chain with parent hashes",
      "Institutional Immutable Audit Verification",
      "1-Click Statutory CSV download for regulators",
    ],
    proTip: "Export certified cryptographic audit reports directly to CSV.",
  },
];

interface TourContextType {
  isTourActive: boolean;
  currentStepIndex: number;
  currentStep: TourStep;
  totalSteps: number;
  isMinimized: boolean;
  isCompleted: boolean;
  startTour: (stepIndex?: number) => void;
  nextStep: () => void;
  prevStep: () => void;
  goToStep: (index: number) => void;
  endTour: () => void;
  toggleMinimize: () => void;
  restartTour: () => void;
}

const TourContext = createContext<TourContextType | undefined>(undefined);

export function TourProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const [isTourActive, setIsTourActive] = useState<boolean>(false);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [isMinimized, setIsMinimized] = useState<boolean>(false);
  const [isCompleted, setIsCompleted] = useState<boolean>(false);

  // Restore tour state from sessionStorage if present
  useEffect(() => {
    try {
      const savedActive = sessionStorage.getItem("close_tour_active");
      const savedStep = sessionStorage.getItem("close_tour_step");
      if (savedActive === "true" && savedStep !== null) {
        const stepNum = parseInt(savedStep, 10);
        if (!isNaN(stepNum) && stepNum >= 0 && stepNum < TOUR_STEPS.length) {
          setIsTourActive(true);
          setCurrentStepIndex(stepNum);
        }
      }
    } catch {
      // Ignore sessionStorage issues
    }
  }, []);

  const currentStep = TOUR_STEPS[currentStepIndex] || TOUR_STEPS[0];

  const persistState = (active: boolean, step: number) => {
    try {
      sessionStorage.setItem("close_tour_active", active ? "true" : "false");
      sessionStorage.setItem("close_tour_step", step.toString());
    } catch {
      // Ignore storage errors
    }
  };

  const startTour = (stepIndex: number = 0) => {
    const validIndex = Math.max(0, Math.min(stepIndex, TOUR_STEPS.length - 1));
    setIsTourActive(true);
    setIsCompleted(false);
    setIsMinimized(false);
    setCurrentStepIndex(validIndex);
    persistState(true, validIndex);

    const targetPath = TOUR_STEPS[validIndex].path;
    if (pathname !== targetPath) {
      router.push(targetPath);
    }
  };

  const nextStep = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      const nextIndex = currentStepIndex + 1;
      setCurrentStepIndex(nextIndex);
      setIsMinimized(false);
      persistState(true, nextIndex);
      const targetPath = TOUR_STEPS[nextIndex].path;
      if (pathname !== targetPath) {
        router.push(targetPath);
      }
    } else {
      // Tour complete!
      setIsCompleted(true);
      persistState(false, currentStepIndex);
    }
  };

  const prevStep = () => {
    if (isCompleted) {
      setIsCompleted(false);
      return;
    }
    if (currentStepIndex > 0) {
      const prevIndex = currentStepIndex - 1;
      setCurrentStepIndex(prevIndex);
      setIsMinimized(false);
      persistState(true, prevIndex);
      const targetPath = TOUR_STEPS[prevIndex].path;
      if (pathname !== targetPath) {
        router.push(targetPath);
      }
    }
  };

  const goToStep = (index: number) => {
    if (index >= 0 && index < TOUR_STEPS.length) {
      setCurrentStepIndex(index);
      setIsCompleted(false);
      setIsMinimized(false);
      persistState(true, index);
      const targetPath = TOUR_STEPS[index].path;
      if (pathname !== targetPath) {
        router.push(targetPath);
      }
    }
  };

  const endTour = () => {
    setIsTourActive(false);
    setIsCompleted(false);
    persistState(false, 0);
  };

  const restartTour = () => {
    startTour(0);
  };

  const toggleMinimize = () => {
    setIsMinimized((prev) => !prev);
  };

  // Keyboard navigation when tour is active
  useEffect(() => {
    if (!isTourActive) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept if user is typing in an input or textarea
      const target = e.target as HTMLElement;
      if (target?.tagName === "INPUT" || target?.tagName === "TEXTAREA" || target?.isContentEditable) {
        return;
      }

      if (e.key === "ArrowRight") {
        e.preventDefault();
        nextStep();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prevStep();
      } else if (e.key === "Escape") {
        e.preventDefault();
        endTour();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isTourActive, currentStepIndex, isCompleted]);

  return (
    <TourContext.Provider
      value={{
        isTourActive,
        currentStepIndex,
        currentStep,
        totalSteps: TOUR_STEPS.length,
        isMinimized,
        isCompleted,
        startTour,
        nextStep,
        prevStep,
        goToStep,
        endTour,
        toggleMinimize,
        restartTour,
      }}
    >
      {children}
    </TourContext.Provider>
  );
}

export function useTour() {
  const context = useContext(TourContext);
  if (!context) {
    throw new Error("useTour must be used within a TourProvider");
  }
  return context;
}
