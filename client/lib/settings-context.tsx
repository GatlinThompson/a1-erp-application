"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { apiFetch } from "@/lib/api";

const STORAGE_KEY = "userSettings";

export type UserSettings = {
  navExpanded?: boolean;
  firstName?: string;
  lastName?: string;
} & Record<string, unknown>;

type SettingsContextValue = {
  settings: UserSettings;
  setSettings: (settings: UserSettings) => void;
  updateSettings: (partial: UserSettings) => void;
};

const SettingsContext = createContext<SettingsContextValue | null>(null);

function readStoredSettings(): UserSettings {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as UserSettings) : {};
  } catch {
    return {};
  }
}

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettingsState] = useState<UserSettings>({});

  useEffect(() => {
    setSettingsState(readStoredSettings());
  }, []);

  const setSettings = useCallback((next: UserSettings) => {
    setSettingsState(next);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  }, []);

  const updateSettings = useCallback((partial: UserSettings) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...partial };
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
    apiFetch("/users/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(partial),
    }).catch(() => {});
  }, []);

  return (
    <SettingsContext.Provider value={{ settings, setSettings, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
