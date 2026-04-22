"use client";

import { createContext, useContext, useEffect, useState } from "react";

type Theme = "light" | "dark";
type Ctx = { theme: Theme; toggle: () => void };

const ThemeCtx = createContext<Ctx | null>(null);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme>("light");

  useEffect(() => {
    const stored = localStorage.getItem("theme") as Theme | null;
    const prefers = window.matchMedia("(prefers-color-scheme: dark)").matches
      ? "dark"
      : "light";
    const initial = stored ?? prefers;
    setTheme(initial);
    document.documentElement.setAttribute("data-theme", initial);
  }, []);

  const toggle = () => {
    setTheme((t) => {
      const next = t === "light" ? "dark" : "light";
      document.documentElement.setAttribute("data-theme", next);
      localStorage.setItem("theme", next);
      return next;
    });
  };

  return <ThemeCtx.Provider value={{ theme, toggle }}>{children}</ThemeCtx.Provider>;
}

export const useTheme = () => {
  const v = useContext(ThemeCtx);
  if (!v) throw new Error("useTheme outside ThemeProvider");
  return v;
};
