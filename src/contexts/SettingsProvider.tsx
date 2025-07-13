import React, { useState, useEffect } from 'react';
import { Ctx, Settings, defaultSettings } from './SettingsContext';

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