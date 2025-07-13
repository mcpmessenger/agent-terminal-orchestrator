import React, { createContext, useContext, useState, useEffect } from 'react';

interface Settings {
  defaultShell: 'bash' | 'powershell' | 'cmd';
  gatewayWsUrl?: string;
  repoManagerUrl?: string;
  mcpEndpoint?: string;
}

interface SettingsContextValue extends Settings {
  update: (changes: Partial<Settings>) => void;
}

const defaultSettings: Settings = {
  defaultShell: 'bash',
  gatewayWsUrl: undefined,
  repoManagerUrl: undefined,
  mcpEndpoint: undefined,
};

const Ctx = createContext<SettingsContextValue | undefined>(undefined);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<Settings>(() => {
    const stored = localStorage.getItem('app-settings');
    return stored ? { ...defaultSettings, ...(JSON.parse(stored) as Settings) } : defaultSettings;
  });

  useEffect(() => {
    localStorage.setItem('app-settings', JSON.stringify(settings));
  }, [settings]);

  const update = (changes: Partial<Settings>) => setSettings((prev) => ({ ...prev, ...changes }));

  return <Ctx.Provider value={{ ...settings, update }}>{children}</Ctx.Provider>;
}

export const useSettings = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
}; 