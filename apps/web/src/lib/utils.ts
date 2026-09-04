import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number | string): string {
  const num = typeof amount === "string" ? parseFloat(amount) : amount;
  if (isNaN(num)) return "₹0";
  
  // Format as Lakhs if large, or standard Indian number format
  if (Math.abs(num) >= 100000) {
    const lakhs = num / 100000;
    return `₹${lakhs.toFixed(1)}L`;
  }
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(num);
}

export function formatPercent(value: number): string {
  return `${(value * 100).toFixed(1)}%`;
}
