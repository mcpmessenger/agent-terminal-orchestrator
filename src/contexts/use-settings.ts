import { useContext } from "react";
import { Ctx } from "./SettingsContext";

export const useSettings = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error('useSettings must be used within SettingsProvider');
  return ctx;
};