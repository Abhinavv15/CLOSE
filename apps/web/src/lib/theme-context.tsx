"use client";

import React, { createContext, useContext, useEffect, useState, useCallback } from "react";

type Theme = "dark" | "light";

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
  setTheme: () => {},
});

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<Theme>("dark");
  const [mounted, setMounted] = useState(false);

  const applyTheme = useCallback((t: Theme) => {
    const root = document.documentElement;
    if (t === "light") {
      root.classList.remove("dark");
      root.classList.add("light");
    } else {
      root.classList.remove("light");
      root.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    setMounted(true);
    
    // Check if user already established a session preference
    const hasInitialized = sessionStorage.getItem("close_theme_initialized");
    if (!hasInitialized) {
      // First link click / arrival: ALWAYS start in dark mode
      sessionStorage.setItem("close_theme_initialized", "true");
      setThemeState("dark");
      applyTheme("dark");
      localStorage.setItem("close_theme", "dark");
      return;
    }

    // Active session: respect saved preference
    const saved = localStorage.getItem("close_theme") as Theme | null;
    if (saved === "light" || saved === "dark") {
      setThemeState(saved);
      applyTheme(saved);
    } else {
      setThemeState("dark");
      applyTheme("dark");
    }
  }, [applyTheme]);

  const setTheme = useCallback((newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem("close_theme", newTheme);
    sessionStorage.setItem("close_theme_initialized", "true");
    applyTheme(newTheme);
  }, [applyTheme]);

  const toggleTheme = useCallback(() => {
    setThemeState((prev) => {
      const next = prev === "dark" ? "light" : "dark";
      localStorage.setItem("close_theme", next);
      sessionStorage.setItem("close_theme_initialized", "true");
      applyTheme(next);
      return next;
    });
  }, [applyTheme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

