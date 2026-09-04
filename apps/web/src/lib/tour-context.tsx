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
    title: "Why Traditional AI Accounting Fails",
    path: "/",
    description:
      "Legacy accounting tools fail because they ask LLMs to calculate numbers, causing hallucinated balances and phantom entries. CLOSE separates deterministic 5-pass matching from autonomous AI qualitative reasoning with zero math hallucinations.",
    keyPoints: [
      "Strict Decimal(18, 4) arithmetic core with sub-100ms execution",
      "Autonomous AI agent only dispatched for qualitative exception triage",
      "Honest Failure Principle: refrains from guessing under 90% confidence",
    ],
    proTip: "Click Next to move into Step 2: Multi-Source Financial Statement Ingestion.",
  },
  {
    id: "batches",
    stepNumber: 2,
    badge: "02 / 07 • INGESTION DECK",
    pageName: "Multi-Source Ingestion (/batches)",
    title: "Multi-Source Statement Ingestion & Schemas",
    path: "/batches",
    description:
      "Modern finance operations receive fragmented data across 4 independent sources: Bank Statements, Payment Gateways (Stripe/Razorpay), ERP General Ledger, and Customer Invoices. CLOSE ingests and maps them into a unified graph.",
    keyPoints: [
      "127 canonical demo transactions with ground-truth linkage",
      "Interactive drag-and-drop CSV validation with downloadable templates",
      "Automatic reference normalization, currency alignment, and metadata tagging",
    ],
    proTip: "Notice how processor gross settlements are mapped to bank net deposits and invoice numbers.",
  },
  {
    id: "reconciliation",
    stepNumber: 3,
    badge: "03 / 07 • MATCHING ENGINE",
    pageName: "Reconciliation Matrix (/reconciliation)",
    title: "5-Pass Deterministic Matching Pipeline",
    path: "/reconciliation",
    description:
      "Transactions stream through 5 deterministic passes: Pass 1 Duplicate Guard, Pass 2 Exact Reference Hash, Pass 3 Gateway MDR Fee Adjustment, Pass 4 Multi-Day Timing Window (T+3), and Pass 5 Split Payment Aggregation.",
    keyPoints: [
      "116 of 127 records resolved deterministically in 0.08 seconds",
      "Enforces Gross Amount - MDR Fee = Net Bank Deposit without LLM hallucinations",
      "Filter by Pass 1 through 5 in the table to inspect individual matching rules",
    ],
    proTip: "Filter by Pass 3 to see how Stripe interchange fee deductions are proven and settled.",
  },
  {
    id: "exceptions",
    stepNumber: 4,
    badge: "04 / 07 • AI TRIAGE",
    pageName: "Exception Triage (/exceptions)",
    title: "Autonomous Tool-Calling Agent & Honest Failure",
    path: "/exceptions",
    description:
      "When deterministic matching flags discrepancies, CLOSE dispatches an autonomous AI investigator with bounded read tools (search_ledger, inspect_gateway_batch, verify_contract) to determine the root cause.",
    keyPoints: [
      "Inspect EX-102: AI proves the ₹50 variance was an unannounced 0.1% Stripe fee change",
      "Inspect EX-108: AI flags 38% confidence and explicitly refuses to decide (Honest Failure)",
      "Controller sign-off buttons provide human-in-the-loop compliance governance",
    ],
    proTip: "Click on EX-102 to view the agent's tool-execution timeline and evidence graph.",
  },
  {
    id: "cash-position",
    stepNumber: 5,
    badge: "05 / 07 • LIQUIDITY CURVE",
    pageName: "Forward Cash Forecast (/cash-position)",
    title: "30-Day Forward Cash Curve & Stress Testing",
    path: "/cash-position",
    description:
      "Reconciled entries feed directly into a 30-day forward liquidity forecast. The engine tracks expected customer invoice collections against scheduled vendor bills and a critical ₹2.4M payroll buffer.",
    keyPoints: [
      "Real-time cash runway projection with dynamic minimum safety floor",
      "Interactive stress testing: Toggle 'Scenario A (Delay Collections 7 Days)'",
      "AI-generated narrative explanation summarizing liquidity risks",
    ],
    proTip: "Click Scenario A to simulate a severe customer payment delay on your cash runway.",
  },
  {
    id: "evaluation",
    stepNumber: 6,
    badge: "06 / 07 • BENCHMARKS",
    pageName: "Ground-Truth Scorecard (/evaluation)",
    title: "Empirical Safety & Accuracy Scorecard",
    path: "/evaluation",
    description:
      "CLOSE includes an institutional evaluation framework measuring performance against hidden ground-truth labels. We demand provable benchmarks instead of marketing hype.",
    keyPoints: [
      "96.6% Reconciliation Precision & 96.5% Recall (F1 Score: 96.55%)",
      "98.7% AI Auto-Resolution Precision with <1.5% False Resolution Rate",
      "Honest breakdown revealing 'What CLOSE Could Not Resolve' with exact counts",
    ],
    proTip: "Scroll down to inspect the Honest Breakdown table showing unresolved orphan records.",
  },
  {
    id: "audit-log",
    stepNumber: 7,
    badge: "07 / 07 • COMPLIANCE",
    pageName: "Merkle Audit Trail (/audit-log)",
    title: "SHA-256 Merkle Chain & Auditor Mode",
    path: "/audit-log",
    description:
      "Every reconciliation match, AI triage recommendation, and controller approval is hashed into an append-only SHA-256 Merkle chain. Statutory auditors get mathematical proof of ledger integrity.",
    keyPoints: [
      "Immutable cryptographic block chain with parent hashes and root verification",
      "Switch persona in header to 'Sarah Jenkins (Auditor)' to activate Auditor Mode",
      "1-Click statutory CSV export for external audit committees and regulatory filing",
    ],
    proTip: "Switch to Sarah Jenkins in the header to observe Auditor Read-Only Mode in action.",
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
